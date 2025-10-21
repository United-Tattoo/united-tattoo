import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDB()
    const result = await db.prepare(`
      SELECT * FROM flash_items WHERE id = ?
    `).bind(params.id).first()

    if (!result) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    return new Response(JSON.stringify({ item: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to fetch flash item' }), { status: 500 })
  }
}


