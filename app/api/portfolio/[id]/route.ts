import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const db = getDB(context?.env)
    
    // First, get the image URL for R2 cleanup (optional)
    const imageStmt = db.prepare(`
      SELECT image_url FROM portfolio_images WHERE id = ?
    `)
    const imageResult = await imageStmt.bind(id).first()
    
    if (!imageResult) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // Delete the image from the database
    const deleteStmt = db.prepare(`
      DELETE FROM portfolio_images WHERE id = ?
    `)
    const result = await deleteStmt.bind(id).run()
    const written = (result as any)?.meta?.changes ?? (result as any)?.meta?.rows_written ?? 0
    if (written === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // TODO: In a real implementation, you would also delete the file from R2
    // const r2Bucket = getR2Bucket()
    // const key = extractKeyFromUrl(imageResult.image_url)
    // await r2Bucket.delete(key)

    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const db = getDB(context?.env)
    
    const stmt = db.prepare(`
      SELECT 
        pi.id,
        pi.artist_id as artistId,
        pi.image_url as url,
        pi.caption,
        pi.tags,
        pi.order_index as orderIndex,
        pi.is_public as isPublic,
        pi.created_at as createdAt,
        a.name as artistName
      FROM portfolio_images pi
      LEFT JOIN artists a ON pi.artist_id = a.id
      WHERE pi.id = ?
    `)
    
    const result = await stmt.bind(id).first()
    
    if (!result) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    const portfolioImage = {
      ...result,
      tags: (result as any).tags ? JSON.parse((result as any).tags) : [],
      isPublic: Boolean((result as any).isPublic),
      createdAt: new Date((result as any).createdAt),
    }

    return NextResponse.json(portfolioImage)
  } catch (error) {
    console.error('Get portfolio image error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio image' },
      { status: 500 }
    )
  }
}
