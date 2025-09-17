import { getR2Bucket } from '@/lib/db'

export interface R2UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface BulkUploadResult {
  successful: FileUploadResult[]
  failed: { filename: string; error: string }[]
  total: number
}

export interface FileUploadResult {
  filename: string
  url: string
  key: string
  size: number
  mimeType: string
}

export interface FileUploadProgress {
  id: string
  filename: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  url?: string
  error?: string
}

/**
 * File Upload Manager for Cloudflare R2
 */
export class FileUploadManager {
  private bucket: R2Bucket
  private baseUrl: string

  constructor(env?: any) {
    this.bucket = getR2Bucket(env)
    // R2 public URL format: https://<account-id>.r2.cloudflarestorage.com/<bucket-name>
    this.baseUrl = process.env.R2_PUBLIC_URL || ''
  }

  /**
   * Upload a single file to R2
   */
  async uploadFile(
    file: File | Buffer,
    key: string,
    options?: {
      contentType?: string
      metadata?: Record<string, string>
    }
  ): Promise<R2UploadResponse> {
    try {
      const fileBuffer = file instanceof File ? await file.arrayBuffer() : file.buffer as ArrayBuffer
      const contentType = options?.contentType || (file instanceof File ? file.type : 'application/octet-stream')

      // Upload to R2
      await this.bucket.put(key, fileBuffer, {
        httpMetadata: {
          contentType,
        },
        customMetadata: options?.metadata || {},
      })

      const url = `${this.baseUrl}/${key}`

      return {
        success: true,
        url,
        key,
      }
    } catch (error) {
      console.error('R2 upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  /**
   * Upload multiple files to R2
   */
  async bulkUpload(
    files: File[],
    keyPrefix: string = 'uploads'
  ): Promise<BulkUploadResult> {
    const successful: FileUploadResult[] = []
    const failed: { filename: string; error: string }[] = []

    for (const file of files) {
      try {
        const key = `${keyPrefix}/${Date.now()}-${file.name}`
        const result = await this.uploadFile(file, key, {
          contentType: file.type,
          metadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
          },
        })

        if (result.success && result.url && result.key) {
          successful.push({
            filename: file.name,
            url: result.url,
            key: result.key,
            size: file.size,
            mimeType: file.type,
          })
        } else {
          failed.push({
            filename: file.name,
            error: result.error || 'Upload failed',
          })
        }
      } catch (error) {
        failed.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Upload failed',
        })
      }
    }

    return {
      successful,
      failed,
      total: files.length,
    }
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.bucket.delete(key)
      return true
    } catch (error) {
      console.error('R2 delete error:', error)
      return false
    }
  }

  /**
   * Get file metadata from R2
   */
  async getFileMetadata(key: string): Promise<R2Object | null> {
    try {
      return await this.bucket.get(key)
    } catch (error) {
      console.error('R2 metadata error:', error)
      return null
    }
  }

  /**
   * Generate a presigned URL for direct upload
   */
  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      // Note: R2 presigned URLs require additional setup
      // For now, we'll use direct upload through our API
      return null
    } catch (error) {
      console.error('Presigned URL error:', error)
      return null
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, options?: {
    maxSize?: number
    allowedTypes?: string[]
  }): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 10 * 1024 * 1024 // 10MB default
    const allowedTypes = options?.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed`,
      }
    }

    return { valid: true }
  }

  /**
   * Generate a unique key for file upload
   */
  generateFileKey(filename: string, prefix: string = 'uploads'): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = filename.split('.').pop()
    const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-')
    
    return `${prefix}/${timestamp}-${randomString}-${baseName}.${extension}`
  }
}

/**
 * Convenience functions for common upload operations
 */

export async function uploadToR2(
  file: File,
  key?: string,
  options?: {
    contentType?: string
    metadata?: Record<string, string>
  },
  env?: any
): Promise<R2UploadResponse> {
  const manager = new FileUploadManager(env)
  const uploadKey = key || manager.generateFileKey(file.name)
  
  return await manager.uploadFile(file, uploadKey, options)
}

export async function bulkUploadToR2(
  files: File[],
  keyPrefix?: string,
  env?: any
): Promise<BulkUploadResult> {
  const manager = new FileUploadManager(env)
  return await manager.bulkUpload(files, keyPrefix)
}

export async function deleteFromR2(key: string, env?: any): Promise<boolean> {
  const manager = new FileUploadManager(env)
  return await manager.deleteFile(key)
}

export function validateUploadFile(
  file: File,
  options?: {
    maxSize?: number
    allowedTypes?: string[]
  },
  env?: any
): { valid: boolean; error?: string } {
  const manager = new FileUploadManager(env)
  return manager.validateFile(file, options)
}

/**
 * Portfolio image specific upload functions
 */

export async function uploadPortfolioImage(
  file: File,
  artistId: string,
  options?: {
    caption?: string
    tags?: string[]
  },
  env?: any
): Promise<R2UploadResponse & { portfolioData?: any }> {
  const manager = new FileUploadManager(env)
  
  // Validate image file
  const validation = manager.validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB for portfolio images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    }
  }

  // Generate key for portfolio image
  const key = manager.generateFileKey(file.name, `portfolio/${artistId}`)
  
  // Upload to R2
  const uploadResult = await manager.uploadFile(file, key, {
    contentType: file.type,
    metadata: {
      artistId,
      originalName: file.name,
      caption: options?.caption || '',
      tags: JSON.stringify(options?.tags || []),
      uploadedAt: new Date().toISOString(),
    },
  })

  if (uploadResult.success) {
    return {
      ...uploadResult,
      portfolioData: {
        artistId,
        url: uploadResult.url,
        caption: options?.caption,
        tags: options?.tags || [],
      },
    }
  }

  return uploadResult
}

/**
 * Artist profile image upload
 */
export async function uploadArtistProfileImage(
  file: File,
  artistId: string,
  env?: any
): Promise<R2UploadResponse> {
  const manager = new FileUploadManager(env)
  
  // Validate image file
  const validation = manager.validateFile(file, {
    maxSize: 2 * 1024 * 1024, // 2MB for profile images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    }
  }

  // Generate key for profile image
  const key = `profiles/${artistId}/profile-${Date.now()}.${file.name.split('.').pop()}`
  
  return await manager.uploadFile(file, key, {
    contentType: file.type,
    metadata: {
      artistId,
      type: 'profile',
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  })
}
