import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { artistId: string } }) {
  try {
    const db = getDB()
    const result = await db.prepare(`
      SELECT * FROM flash_items 
      WHERE artist_id = ? AND is_available = 1
      ORDER BY order_index ASC, created_at DESC
    `).bind(params.artistId).all()

    return new Response(JSON.stringify({ items: result.results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to fetch flash items' }), { status: 500 })
  }
}


