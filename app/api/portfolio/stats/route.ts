import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB(context?.env)
    
    // Get total images count
    const totalImagesResult = await db.prepare(`
      SELECT COUNT(*) as count FROM portfolio_images
    `).first()
    
    // Get recent uploads (last 7 days)
    const recentUploadsResult = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM portfolio_images 
      WHERE created_at >= datetime('now', '-7 days')
    `).first()
    
    // Get storage usage (approximate based on image count)
    const storageResult = await db.prepare(`
      SELECT COUNT(*) * 2.5 as totalMB FROM portfolio_images
    `).first()
    
    // Mock data for views and ratings (would come from analytics in real app)
    const totalViews = Math.floor(Math.random() * 50000) + 10000
    const totalLikes = Math.floor(Math.random() * 5000) + 1000
    const averageRating = 4.2 + Math.random() * 0.6 // 4.2-4.8 range
    
    const stats = {
      totalImages: (totalImagesResult as any)?.count || 0,
      totalViews,
      totalLikes,
      averageRating: Math.round(averageRating * 10) / 10,
      storageUsed: `${Math.round(((storageResult as any)?.totalMB || 0) / 1024 * 100) / 100} GB`,
      recentUploads: (recentUploadsResult as any)?.count || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Portfolio stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio statistics' },
      { status: 500 }
    )
  }
}
