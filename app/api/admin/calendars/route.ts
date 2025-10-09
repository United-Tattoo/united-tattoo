import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { createCalDAVClient } from '@/lib/caldav-client'
import { z } from 'zod'

export const dynamic = "force-dynamic"

const createCalendarSchema = z.object({
  artistId: z.string().min(1),
  calendarUrl: z.string().url(),
  calendarId: z.string().min(1),
})

const updateCalendarSchema = createCalendarSchema.partial().extend({
  id: z.string().min(1),
})

/**
 * GET /api/admin/calendars
 * 
 * Get all artist calendar configurations
 * Admin only
 */
export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB(context?.env)
    
    // Check if user is admin
    const user = await db
      .prepare('SELECT role FROM users WHERE email = ?')
      .bind(session.user.email)
      .first()

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SHOP_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all calendar configurations with artist info and last sync log
    const calendars = await db
      .prepare(`
        SELECT 
          ac.*,
          a.name as artist_name,
          a.slug as artist_slug,
          (
            SELECT created_at 
            FROM calendar_sync_logs 
            WHERE artist_id = ac.artist_id 
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_sync_log_time,
          (
            SELECT status 
            FROM calendar_sync_logs 
            WHERE artist_id = ac.artist_id 
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_sync_status
        FROM artist_calendars ac
        INNER JOIN artists a ON ac.artist_id = a.id
        ORDER BY a.name
      `)
      .all()

    return NextResponse.json({ calendars: calendars.results })
  } catch (error) {
    console.error('Error fetching calendars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendars' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/calendars
 * 
 * Create a new artist calendar configuration
 * Admin only
 */
export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB(context?.env)
    
    // Check if user is admin
    const user = await db
      .prepare('SELECT role FROM users WHERE email = ?')
      .bind(session.user.email)
      .first()

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SHOP_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createCalendarSchema.parse(body)

    // Check if artist exists
    const artist = await db
      .prepare('SELECT id FROM artists WHERE id = ?')
      .bind(validatedData.artistId)
      .first()

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Check if calendar config already exists for this artist
    const existing = await db
      .prepare('SELECT id FROM artist_calendars WHERE artist_id = ?')
      .bind(validatedData.artistId)
      .first()

    if (existing) {
      return NextResponse.json(
        { error: 'Calendar configuration already exists for this artist' },
        { status: 409 }
      )
    }

    // Test calendar connection
    const client = createCalDAVClient()
    if (client) {
      try {
        await client.login()
        // Try to fetch calendars to verify connection
        await client.fetchCalendars()
      } catch (testError) {
        return NextResponse.json(
          { error: 'Failed to connect to CalDAV server. Please check your credentials and calendar URL.' },
          { status: 400 }
        )
      }
    }

    // Create calendar configuration
    const calendarId = crypto.randomUUID()
    await db
      .prepare(`
        INSERT INTO artist_calendars (
          id, artist_id, calendar_url, calendar_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      .bind(
        calendarId,
        validatedData.artistId,
        validatedData.calendarUrl,
        validatedData.calendarId
      )
      .run()

    // Fetch the created configuration
    const calendar = await db
      .prepare('SELECT * FROM artist_calendars WHERE id = ?')
      .bind(calendarId)
      .first()

    return NextResponse.json({ calendar }, { status: 201 })
  } catch (error) {
    console.error('Error creating calendar:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid calendar data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create calendar configuration' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/calendars
 * 
 * Update an artist calendar configuration
 * Admin only
 */
export async function PUT(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB(context?.env)
    
    // Check if user is admin
    const user = await db
      .prepare('SELECT role FROM users WHERE email = ?')
      .bind(session.user.email)
      .first()

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SHOP_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateCalendarSchema.parse(body)

    // Check if calendar exists
    const existing = await db
      .prepare('SELECT * FROM artist_calendars WHERE id = ?')
      .bind(validatedData.id)
      .first()

    if (!existing) {
      return NextResponse.json(
        { error: 'Calendar configuration not found' },
        { status: 404 }
      )
    }

    // Build update query
    const updateFields = []
    const updateValues = []

    if (validatedData.calendarUrl) {
      updateFields.push('calendar_url = ?')
      updateValues.push(validatedData.calendarUrl)
    }
    if (validatedData.calendarId) {
      updateFields.push('calendar_id = ?')
      updateValues.push(validatedData.calendarId)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(validatedData.id)

    await db
      .prepare(`
        UPDATE artist_calendars 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `)
      .bind(...updateValues)
      .run()

    // Fetch updated configuration
    const calendar = await db
      .prepare('SELECT * FROM artist_calendars WHERE id = ?')
      .bind(validatedData.id)
      .first()

    return NextResponse.json({ calendar })
  } catch (error) {
    console.error('Error updating calendar:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid calendar data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update calendar configuration' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/calendars
 * 
 * Delete an artist calendar configuration
 * Admin only
 */
export async function DELETE(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB(context?.env)
    
    // Check if user is admin
    const user = await db
      .prepare('SELECT role FROM users WHERE email = ?')
      .bind(session.user.email)
      .first()

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'SHOP_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Calendar ID is required' },
        { status: 400 }
      )
    }

    const deleteStmt = db.prepare('DELETE FROM artist_calendars WHERE id = ?')
    const result = await deleteStmt.bind(id).run()

    const written = (result as any)?.meta?.changes ?? (result as any)?.meta?.rows_written ?? 0
    if (written === 0) {
      return NextResponse.json(
        { error: 'Calendar configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calendar:', error)
    return NextResponse.json(
      { error: 'Failed to delete calendar configuration' },
      { status: 500 }
    )
  }
}

