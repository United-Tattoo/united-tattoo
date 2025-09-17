import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { z } from 'zod'

export const dynamic = "force-dynamic";

const bulkDeleteSchema = z.object({
  imageIds: z.array(z.string()).min(1, 'At least one image ID is required'),
})

export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageIds } = bulkDeleteSchema.parse(body)

    const db = getDB(context?.env)
    
    // First, get the image URLs for R2 cleanup (optional)
    const imageUrlsStmt = db.prepare(`
      SELECT image_url FROM portfolio_images 
      WHERE id IN (${imageIds.map(() => '?').join(',')})
    `)
    const imageUrlsResult = await imageUrlsStmt.bind(...imageIds).all()
    
    // Delete the images from the database
    const deleteStmt = db.prepare(`
      DELETE FROM portfolio_images 
      WHERE id IN (${imageIds.map(() => '?').join(',')})
    `)
    const deleteResult = await deleteStmt.bind(...imageIds).run()
    
    // TODO: In a real implementation, you would also delete the files from R2
    // const r2Bucket = getR2Bucket()
    // for (const row of imageUrlsResult.results) {
    //   const key = extractKeyFromUrl(row.image_url)
    //   await r2Bucket.delete(key)
    // }

    return NextResponse.json({ 
      success: true,
      deletedCount: deleteResult.meta?.rows_written || 0,
      message: `Successfully deleted ${deleteResult.meta?.rows_written || 0} images`
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    )
  }
}
