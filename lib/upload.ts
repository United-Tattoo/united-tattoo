import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner"
import { env } from "./env"
import { createFileUploadSchema } from "./validations"

// Initialize S3 client (works with both AWS S3 and Cloudflare R2)
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  // For Cloudflare R2, use custom endpoint
  ...(env.AWS_ENDPOINT_URL && {
    endpoint: env.AWS_ENDPOINT_URL,
    forcePathStyle: true,
  }),
})

/**
 * Upload a file to S3/R2 storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'artists/portfolio/image.jpg')
 * @param uploadedBy - User ID of the uploader
 * @returns Promise with file upload metadata
 */
export async function uploadFile(
  file: File,
  path: string,
  uploadedBy: string
): Promise<{
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
}> {
  // Validate file data
  const fileData = createFileUploadSchema.parse({
    filename: path,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    uploadedBy,
  })

  // Generate unique filename to prevent conflicts
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  const uniqueFilename = `${timestamp}-${randomString}.${extension}`
  const fullPath = `${path}/${uniqueFilename}`

  try {
    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to S3/R2
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: fullPath,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ContentLength: file.size,
      // Set cache control for images
      CacheControl: 'public, max-age=31536000', // 1 year
      // Add metadata
      Metadata: {
        originalName: file.name,
        uploadedBy: uploadedBy,
        uploadedAt: new Date().toISOString(),
      },
    })

    await s3Client.send(command)

    // Generate public URL
    const url = env.AWS_ENDPOINT_URL
      ? `${env.AWS_ENDPOINT_URL}/${env.AWS_BUCKET_NAME}/${fullPath}`
      : `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fullPath}`

    return {
      id: `${timestamp}-${randomString}`, // Generate ID from timestamp and random string
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      uploadedBy,
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw new Error('Failed to upload file')
  }
}

/**
 * Delete a file from S3/R2 storage
 * @param fileUrl - Full URL of the file to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract the key from the URL
    const url = new URL(fileUrl)
    const key = url.pathname.substring(1) // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('File deletion error:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Generate a signed URL for private file access
 * @param key - File key in storage
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getS3SignedUrl(s3Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error('Signed URL generation error:', error)
    throw new Error('Failed to generate signed URL')
  }
}

/**
 * Generate a presigned URL for direct client uploads
 * @param key - File key in storage
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 15 minutes)
 * @returns Presigned URL for PUT operation
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 900
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const presignedUrl = await getS3SignedUrl(s3Client, command, { expiresIn })
    return presignedUrl
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    throw new Error('Failed to generate presigned upload URL')
  }
}

/**
 * Validate file type for uploads
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Boolean indicating if file type is allowed
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeBytes - Maximum file size in bytes
 * @returns Boolean indicating if file size is acceptable
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes
}

/**
 * Generate optimized file path for different file types
 * @param type - File type ('portfolio', 'avatar', 'hero', etc.)
 * @param artistId - Artist ID (optional)
 * @returns Optimized storage path
 */
export function generateFilePath(type: 'portfolio' | 'avatar' | 'hero' | 'logo', artistId?: string): string {
  const basePaths = {
    portfolio: artistId ? `artists/${artistId}/portfolio` : 'portfolio',
    avatar: artistId ? `artists/${artistId}/avatar` : 'avatars',
    hero: 'site/hero',
    logo: 'site/logo',
  }

  return basePaths[type]
}

/**
 * Image processing utilities
 */
export const imageUtils = {
  // Allowed image types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  
  // Maximum file sizes (in bytes)
  MAX_PORTFOLIO_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_AVATAR_SIZE: 5 * 1024 * 1024,     // 5MB
  MAX_HERO_SIZE: 15 * 1024 * 1024,      // 15MB
  
  // Image dimensions (for client-side validation)
  PORTFOLIO_DIMENSIONS: { minWidth: 800, minHeight: 600 },
  AVATAR_DIMENSIONS: { minWidth: 200, minHeight: 200 },
  HERO_DIMENSIONS: { minWidth: 1920, minHeight: 1080 },
}

/**
 * Error types for file upload operations
 */
export class FileUploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED' | 'DELETE_FAILED'
  ) {
    super(message)
    this.name = 'FileUploadError'
  }
}

/**
 * Utility to handle file upload with validation
 * @param file - File to upload
 * @param type - Upload type
 * @param artistId - Artist ID (optional)
 * @param uploadedBy - User ID of uploader
 * @returns Upload result
 */
export async function handleFileUpload(
  file: File,
  type: 'portfolio' | 'avatar' | 'hero' | 'logo',
  uploadedBy: string,
  artistId?: string
) {
  // Validate file type
  if (!validateFileType(file, imageUtils.ALLOWED_IMAGE_TYPES)) {
    throw new FileUploadError('Invalid file type. Only images are allowed.', 'INVALID_TYPE')
  }

  // Validate file size based on type
  const maxSizes = {
    portfolio: imageUtils.MAX_PORTFOLIO_SIZE,
    avatar: imageUtils.MAX_AVATAR_SIZE,
    hero: imageUtils.MAX_HERO_SIZE,
    logo: imageUtils.MAX_AVATAR_SIZE, // Same as avatar
  }

  if (!validateFileSize(file, maxSizes[type])) {
    throw new FileUploadError(`File too large. Maximum size is ${maxSizes[type] / (1024 * 1024)}MB.`, 'FILE_TOO_LARGE')
  }

  // Generate file path
  const path = generateFilePath(type, artistId)

  try {
    // Upload file
    const result = await uploadFile(file, path, uploadedBy)
    return result
  } catch (error) {
    throw new FileUploadError('Failed to upload file.', 'UPLOAD_FAILED')
  }
}
