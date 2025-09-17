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
    
    // Get total files count
    const totalFilesResult = await db.prepare(`
      SELECT COUNT(*) as count FROM file_uploads
    `).first()
    
    // Get recent uploads (last 7 days)
    const recentUploadsResult = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM file_uploads 
      WHERE created_at >= datetime('now', '-7 days')
    `).first()
    
    // Get total storage usage
    const storageResult = await db.prepare(`
      SELECT SUM(size) as totalBytes FROM file_uploads
    `).first()
    
    // Get file type breakdown
    const fileTypesResult = await db.prepare(`
      SELECT 
        CASE 
          WHEN mime_type LIKE 'image/%' THEN 'image'
          WHEN mime_type LIKE 'video/%' THEN 'video'
          WHEN mime_type LIKE 'audio/%' THEN 'audio'
          WHEN mime_type LIKE 'application/pdf' OR mime_type LIKE 'text/%' THEN 'document'
          ELSE 'other'
        END as fileType,
        COUNT(*) as count
      FROM file_uploads
      GROUP BY fileType
    `).all()
    
    const totalBytes = (storageResult as any)?.totalBytes || 0
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 GB'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    const fileTypes: { [key: string]: number } = {}
    for (const row of (fileTypesResult as any).results) {
      fileTypes[row.fileType] = row.count
    }

    const stats = {
      totalFiles: (totalFilesResult as any)?.count || 0,
      totalSize: formatBytes(totalBytes),
      recentUploads: (recentUploadsResult as any)?.count || 0,
      storageUsed: formatBytes(totalBytes),
      fileTypes,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('File stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file statistics' },
      { status: 500 }
    )
  }
}
