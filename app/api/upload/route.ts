import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToR2, validateUploadFile } from '@/lib/r2-upload'
import { addPortfolioImage } from '@/lib/db'

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const key = formData.get('key') as string | undefined
    const artistId = formData.get('artistId') as string | undefined
    const caption = formData.get('caption') as string | undefined
    const tags = formData.get('tags') as string | undefined
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file with environment context
    const validation = validateUploadFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    }, context?.env)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload to R2 with environment context
    const uploadResult = await uploadToR2(file, key, {
      contentType: file.type,
      metadata: {
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        artistId: artistId || '',
        caption: caption || '',
        tags: tags || '',
      }
    }, context?.env)

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    // If this is a portfolio image, save to database
    if (artistId && uploadResult.url) {
      try {
        const parsedTags = tags ? JSON.parse(tags) : []
        await addPortfolioImage(artistId, {
          url: uploadResult.url,
          caption: caption || undefined,
          tags: parsedTags,
          orderIndex: 0,
          isPublic: true
        }, context?.env)
      } catch (dbError) {
        console.error('Failed to save portfolio image to database:', dbError)
        // Continue anyway - the file was uploaded successfully
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      )
    }

    // TODO: Check if user has permission to delete this file
    // For now, allow any authenticated user to delete

    const { deleteFromR2 } = await import('@/lib/r2-upload')
    const success = await deleteFromR2(key, context?.env)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}

// GET /api/upload/presigned - Generate presigned upload URL (placeholder for future implementation)
export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For now, return a message that presigned URLs are not implemented
    return NextResponse.json({
      error: 'Presigned URLs not implemented yet. Use direct upload via POST.'
    }, { status: 501 })
  } catch (error) {
    console.error('Presigned URL error:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
