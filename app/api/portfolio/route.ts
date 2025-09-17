import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { z } from 'zod'

export const dynamic = "force-dynamic";

const portfolioQuerySchema = z.object({
  artistId: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
})

export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = portfolioQuerySchema.parse({
      artistId: searchParams.get('artistId'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    const db = getDB(context?.env)
    
    let sql = `
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
      WHERE 1=1
    `
    
    const params: any[] = []
    
    if (query.artistId) {
      sql += ' AND pi.artist_id = ?'
      params.push(query.artistId)
    }
    
    sql += ' ORDER BY pi.created_at DESC'
    
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

    const portfolioImages = result.results.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      isPublic: Boolean(row.isPublic),
      createdAt: new Date(row.createdAt),
    }))

    return NextResponse.json(portfolioImages)
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio images' },
      { status: 500 }
    )
  }
}

const createPortfolioSchema = z.object({
  artistId: z.string(),
  imageUrl: z.string().url(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
})

export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createPortfolioSchema.parse(body)

    const db = getDB(context?.env)
    
    // Get the next order index for this artist
    const orderStmt = db.prepare(`
      SELECT COALESCE(MAX(order_index), 0) + 1 as nextOrder
      FROM portfolio_images 
      WHERE artist_id = ?
    `)
    const orderResult = await orderStmt.bind(data.artistId).first()
    const orderIndex = orderResult?.nextOrder || 1

    const id = `portfolio_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const stmt = db.prepare(`
      INSERT INTO portfolio_images (
        id, artist_id, image_url, caption, tags, order_index, is_public, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    await stmt.bind(
      id,
      data.artistId,
      data.imageUrl,
      data.caption || null,
      JSON.stringify(data.tags),
      orderIndex,
      data.isPublic ? 1 : 0
    ).run()

    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Portfolio image created successfully' 
    })
  } catch (error) {
    console.error('Portfolio creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create portfolio image' },
      { status: 500 }
    )
  }
}
