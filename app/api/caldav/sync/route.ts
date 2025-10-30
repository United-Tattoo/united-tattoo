import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { pullCalendarEventsToDatabase, logSync } from '@/lib/calendar-sync'
import { z } from 'zod'

export const dynamic = "force-dynamic"

const syncSchema = z.object({
  artistId: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

/**
 * POST /api/caldav/sync
 * 
 * Manually trigger calendar sync from Nextcloud to database
 * Admin only endpoint
 * 
 * Body:
 * - artistId?: string (if omitted, syncs all artists)
 * - startDate?: ISO datetime (defaults to 30 days ago)
 * - endDate?: ISO datetime (defaults to 90 days from now)
 */
export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    // Check authentication and authorization
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
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = syncSchema.parse(body)

    // Set default date range
    const startDate = validatedData.startDate 
      ? new Date(validatedData.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now

    // Get artists to sync
    let artistsToSync: any[] = []
    
    if (validatedData.artistId) {
      const artist = await db
        .prepare('SELECT id FROM artists WHERE id = ?')
        .bind(validatedData.artistId)
        .first()
      
      if (artist) {
        artistsToSync = [artist]
      }
    } else {
      // Get all artists with calendar configurations
      const artists = await db
        .prepare(`
          SELECT DISTINCT a.id 
          FROM artists a 
          INNER JOIN artist_calendars ac ON a.id = ac.artist_id
          WHERE a.is_active = TRUE
        `)
        .all()
      
      artistsToSync = artists.results
    }

    if (artistsToSync.length === 0) {
      return NextResponse.json({
        message: 'No artists with calendar configurations found',
        synced: 0,
      })
    }

    // Perform sync for each artist
    const syncResults = []
    const startTime = Date.now()

    for (const artist of artistsToSync) {
      const artistStartTime = Date.now()
      
      const result = await pullCalendarEventsToDatabase(
        artist.id,
        startDate,
        endDate,
        context
      )

      const duration = Date.now() - artistStartTime

      // Log the sync operation
      await logSync({
        artistId: artist.id,
        syncType: 'PULL',
        status: result.success ? 'SUCCESS' : 'FAILED',
        errorMessage: result.error,
        eventsProcessed: result.eventsProcessed,
        eventsCreated: result.eventsCreated,
        eventsUpdated: result.eventsUpdated,
        eventsDeleted: result.eventsDeleted,
        durationMs: duration,
      }, context)

      syncResults.push({
        artistId: artist.id,
        ...result,
        durationMs: duration,
      })
    }

    const totalDuration = Date.now() - startTime

    return NextResponse.json({
      message: 'Sync completed',
      totalArtists: artistsToSync.length,
      totalDurationMs: totalDuration,
      results: syncResults,
      summary: {
        totalEventsProcessed: syncResults.reduce((sum, r) => sum + r.eventsProcessed, 0),
        totalEventsCreated: syncResults.reduce((sum, r) => sum + r.eventsCreated, 0),
        totalEventsUpdated: syncResults.reduce((sum, r) => sum + r.eventsUpdated, 0),
        totalEventsDeleted: syncResults.reduce((sum, r) => sum + r.eventsDeleted, 0),
        successCount: syncResults.filter(r => r.success).length,
        failureCount: syncResults.filter(r => !r.success).length,
      },
    })
  } catch (error) {
    console.error('Error during sync:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

