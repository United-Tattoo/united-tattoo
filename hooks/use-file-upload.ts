import { useState, useCallback } from 'react'
import type { FileUploadProgress, R2UploadResponse, BulkUploadResult } from '@/lib/r2-upload'

export interface UseFileUploadOptions {
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  onProgress?: (progress: FileUploadProgress[]) => void
  onComplete?: (results: BulkUploadResult) => void
  onError?: (error: string) => void
}

export interface FileUploadHook {
  uploadFiles: (files: File[], options?: { keyPrefix?: string }) => Promise<void>
  uploadSingleFile: (file: File, key?: string) => Promise<R2UploadResponse>
  progress: FileUploadProgress[]
  isUploading: boolean
  error: string | null
  clearProgress: () => void
  removeFile: (id: string) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}): FileUploadHook {
  const [progress, setProgress] = useState<FileUploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    onProgress,
    onComplete,
    onError,
  } = options

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return { valid, errors }
    }

    for (const file of files) {
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
        continue
      }

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type ${file.type} not allowed`)
        continue
      }

      valid.push(file)
    }

    return { valid, errors }
  }, [maxFiles, maxSize, allowedTypes])

  const uploadSingleFile = useCallback(async (
    file: File,
    key?: string
  ): Promise<R2UploadResponse> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    
    // Add to progress tracking
    const initialProgress: FileUploadProgress = {
      id: fileId,
      filename: file.name,
      progress: 0,
      status: 'uploading',
    }

    setProgress(prev => [...prev, initialProgress])
    setError(null)

    try {
      // Simulate progress updates (since we can't track actual upload progress with R2)
      const progressInterval = setInterval(() => {
        setProgress(prev => prev.map(p => 
          p.id === fileId && p.progress < 90
            ? { ...p, progress: Math.min(90, p.progress + Math.random() * 20) }
            : p
        ))
      }, 200)

      // Upload to API endpoint
      const formData = new FormData()
      formData.append('file', file)
      if (key) formData.append('key', key)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      const result = await response.json()

      if (result.success) {
        setProgress(prev => prev.map(p => 
          p.id === fileId
            ? { ...p, progress: 100, status: 'complete', url: result.url }
            : p
        ))

        return result
      } else {
        setProgress(prev => prev.map(p => 
          p.id === fileId
            ? { ...p, status: 'error', error: result.error }
            : p
        ))

        return {
          success: false,
          error: result.error || 'Upload failed',
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setProgress(prev => prev.map(p => 
        p.id === fileId
          ? { ...p, status: 'error', error: errorMessage }
          : p
      ))

      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [])

  const uploadFiles = useCallback(async (
    files: File[],
    uploadOptions?: { keyPrefix?: string }
  ): Promise<void> => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate files
      const { valid, errors } = validateFiles(files)
      
      if (errors.length > 0) {
        const errorMessage = errors.join(', ')
        setError(errorMessage)
        onError?.(errorMessage)
        return
      }

      if (valid.length === 0) {
        setError('No valid files to upload')
        onError?.('No valid files to upload')
        return
      }

      // Upload files sequentially to avoid overwhelming the server
      const results: R2UploadResponse[] = []
      
      for (const file of valid) {
        const key = uploadOptions?.keyPrefix 
          ? `${uploadOptions.keyPrefix}/${Date.now()}-${file.name}`
          : undefined
        
        const result = await uploadSingleFile(file, key)
        results.push(result)
      }

      // Process results
      const successful = results.filter(r => r.success).map(r => ({
        filename: valid.find(f => results.indexOf(r) === valid.indexOf(f))?.name || '',
        url: r.url || '',
        key: r.key || '',
        size: valid.find(f => results.indexOf(r) === valid.indexOf(f))?.size || 0,
        mimeType: valid.find(f => results.indexOf(r) === valid.indexOf(f))?.type || '',
      }))

      const failed = results
        .map((r, index) => ({ result: r, file: valid[index] }))
        .filter(({ result }) => !result.success)
        .map(({ result, file }) => ({
          filename: file.name,
          error: result.error || 'Upload failed',
        }))

      const bulkResult: BulkUploadResult = {
        successful,
        failed,
        total: valid.length,
      }

      onComplete?.(bulkResult)

      // Update progress with final results
      const currentProgress = [...progress]
      onProgress?.(currentProgress)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }, [progress, validateFiles, uploadSingleFile, onProgress, onComplete, onError])

  const clearProgress = useCallback(() => {
    setProgress([])
    setError(null)
  }, [])

  const removeFile = useCallback((id: string) => {
    setProgress(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    uploadFiles,
    uploadSingleFile,
    progress,
    isUploading,
    error,
    clearProgress,
    removeFile,
  }
}

/**
 * Hook specifically for portfolio image uploads
 */
export function usePortfolioUpload(artistId: string) {
  const baseHook = useFileUpload({
    maxFiles: 20,
    maxSize: 5 * 1024 * 1024, // 5MB for portfolio images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  const uploadPortfolioImages = useCallback(async (
    files: File[],
    options?: {
      caption?: string
      tags?: string[]
    }
  ) => {
    return baseHook.uploadFiles(files, {
      keyPrefix: `portfolio/${artistId}`,
    })
  }, [artistId, baseHook])

  return {
    ...baseHook,
    uploadPortfolioImages,
  }
}

/**
 * Hook for artist profile image upload
 */
export function useProfileImageUpload(artistId: string) {
  const baseHook = useFileUpload({
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB for profile images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  const uploadProfileImage = useCallback(async (file: File) => {
    const key = `profiles/${artistId}/profile-${Date.now()}.${file.name.split('.').pop()}`
    return baseHook.uploadSingleFile(file, key)
  }, [artistId, baseHook])

  return {
    ...baseHook,
    uploadProfileImage,
  }
}
