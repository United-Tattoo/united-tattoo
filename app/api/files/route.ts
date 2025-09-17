import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { z } from 'zod'

const filesQuerySchema = z.object({
  path: z.string().default('/'),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
})

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = filesQuerySchema.parse({
      path: searchParams.get('path'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    const db = getDB(context?.env)
    
    // For now, we'll return files from the file_uploads table
    // In a real implementation, you might have a more complex file system structure
    let sql = `
      SELECT 
        fu.id,
        fu.filename as name,
        'file' as type,
        fu.size,
        fu.mime_type as mimeType,
        fu.url,
        fu.created_at as createdAt,
        '/' || fu.filename as path
      FROM file_uploads fu
      WHERE 1=1
    `
    
    const params: any[] = []
    
    // Simple path filtering - in a real app you'd have proper folder structure
    if (query.path !== '/') {
      sql += ' AND fu.filename LIKE ?'
      params.push(`${query.path.replace('/', '')}%`)
    }
    
    sql += ' ORDER BY fu.created_at DESC'
    
    if (query.limit) {
      sql += ' LIMIT ?'
      params.push(query.limit)
      
      if (query.offset) {
        sql += ' OFFSET ?'
        params.push(query.offset)
      }
    }

    const stmt = db.prepare(sql)
    const result = await stmt.bind(...params).all()

    const files = result.results.map((row: any) => ({
      ...row,
      createdAt: new Date(row.createdAt),
    }))

    return NextResponse.json(files)
  } catch (error) {
    console.error('Files fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}
