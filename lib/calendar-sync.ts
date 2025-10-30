/**
 * Calendar Sync Service
 * 
 * Handles bidirectional synchronization between database appointments
 * and Nextcloud CalDAV calendars.
 */

import type { DAVClient } from 'tsdav'
import { getDB } from './db'
import {
  createCalDAVClient,
  createOrUpdateCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvents,
} from './caldav-client'
import type { Appointment, CalendarSyncLog } from '@/types/database'

interface SyncResult {
  success: boolean
  error?: string
  eventsProcessed: number
  eventsCreated: number
  eventsUpdated: number
  eventsDeleted: number
}

/**
 * Sync a single appointment to CalDAV calendar
 * Called when appointment is created/updated via web app
 */
export async function syncAppointmentToCalendar(
  appointment: Appointment,
  context?: any
): Promise<{ uid: string; etag?: string } | null> {
  const client = createCalDAVClient()
  if (!client) {
    console.warn('CalDAV not configured, skipping sync')
    return null
  }

  try {
    const db = getDB(context?.env)

    // Get artist calendar configuration
    const calendarConfig = await db
      .prepare('SELECT * FROM artist_calendars WHERE artist_id = ?')
      .bind(appointment.artistId)
      .first()

    if (!calendarConfig) {
      console.warn(`No calendar configured for artist ${appointment.artistId}`)
      return null
    }

    // Get artist and client names
    const artist = await db
      .prepare('SELECT name FROM artists WHERE id = ?')
      .bind(appointment.artistId)
      .first()

    const client_user = await db
      .prepare('SELECT name FROM users WHERE id = ?')
      .bind(appointment.clientId)
      .first()

    const artistName = artist?.name || 'Unknown Artist'
    const clientName = client_user?.name || 'Unknown Client'

    // Create or update event in CalDAV
    const result = await createOrUpdateCalendarEvent(
      client,
      calendarConfig.calendar_url,
      appointment,
      artistName,
      clientName,
      appointment.caldav_etag || undefined
    )

    if (result) {
      // Update appointment with CalDAV UID and ETag
      await db
        .prepare('UPDATE appointments SET caldav_uid = ?, caldav_etag = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(result.uid, result.etag || null, appointment.id)
        .run()

      return { uid: result.uid, etag: result.etag }
    }

    return null
  } catch (error) {
    console.error('Error syncing appointment to calendar:', error)
    throw error
  }
}

/**
 * Delete appointment from CalDAV calendar
 * Called when appointment is cancelled or deleted
 */
export async function deleteAppointmentFromCalendar(
  appointment: Appointment,
  context?: any
): Promise<boolean> {
  const client = createCalDAVClient()
  if (!client) {
    console.warn('CalDAV not configured, skipping delete')
    return false
  }

  try {
    const db = getDB(context?.env)

    // Get artist calendar configuration
    const calendarConfig = await db
      .prepare('SELECT * FROM artist_calendars WHERE artist_id = ?')
      .bind(appointment.artistId)
      .first()

    if (!calendarConfig || !appointment.caldav_uid) {
      return false
    }

    // Construct event URL
    const eventUrl = `${calendarConfig.calendar_url}${appointment.caldav_uid}.ics`

    // Delete from CalDAV
    const success = await deleteCalendarEvent(client, eventUrl, appointment.caldav_etag || undefined)

    if (success) {
      // Clear CalDAV fields in database
      await db
        .prepare('UPDATE appointments SET caldav_uid = NULL, caldav_etag = NULL WHERE id = ?')
        .bind(appointment.id)
        .run()
    }

    return success
  } catch (error) {
    console.error('Error deleting appointment from calendar:', error)
    return false
  }
}

/**
 * Pull calendar events from Nextcloud and sync to database
 * This is called by background worker or manual sync
 */
export async function pullCalendarEventsToDatabase(
  artistId: string,
  startDate: Date,
  endDate: Date,
  context?: any
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    eventsProcessed: 0,
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
  }

  const client = createCalDAVClient()
  if (!client) {
    result.error = 'CalDAV not configured'
    return result
  }

  try {
    const db = getDB(context?.env)

    // Get artist calendar configuration
    const calendarConfig = await db
      .prepare('SELECT * FROM artist_calendars WHERE artist_id = ?')
      .bind(artistId)
      .first()

    if (!calendarConfig) {
      result.error = `No calendar configured for artist ${artistId}`
      return result
    }

    // Fetch events from CalDAV
    const calendarEvents = await fetchCalendarEvents(
      client,
      calendarConfig.calendar_url,
      startDate,
      endDate
    )

    result.eventsProcessed = calendarEvents.length

    // Get existing appointments for this artist in the date range
    const existingAppointments = await db
      .prepare(`
        SELECT * FROM appointments 
        WHERE artist_id = ? 
        AND start_time >= ? 
        AND end_time <= ?
        AND caldav_uid IS NOT NULL
      `)
      .bind(artistId, startDate.toISOString(), endDate.toISOString())
      .all()

    const existingUids = new Set(
      existingAppointments.results.map((a: any) => a.caldav_uid)
    )

    // Process each calendar event
    for (const event of calendarEvents) {
      // Check if this event exists in our database
      const existing = await db
        .prepare('SELECT * FROM appointments WHERE caldav_uid = ? AND artist_id = ?')
        .bind(event.uid, artistId)
        .first()

      if (existing) {
        // Update existing appointment if needed
        // Only update if the calendar event is different
        const eventChanged = 
          new Date(existing.start_time).getTime() !== event.startTime.getTime() ||
          new Date(existing.end_time).getTime() !== event.endTime.getTime() ||
          existing.title !== event.summary

        if (eventChanged) {
          await db
            .prepare(`
              UPDATE appointments 
              SET title = ?, description = ?, start_time = ?, end_time = ?, caldav_etag = ?, updated_at = CURRENT_TIMESTAMP
              WHERE caldav_uid = ? AND artist_id = ?
            `)
            .bind(
              event.summary,
              event.description || existing.description,
              event.startTime.toISOString(),
              event.endTime.toISOString(),
              event.etag || null,
              event.uid,
              artistId
            )
            .run()

          result.eventsUpdated++
        }

        existingUids.delete(event.uid)
      } else {
        // This is a new event from calendar - create appointment
        // We'll create it as CONFIRMED since it came from the calendar
        const appointmentId = crypto.randomUUID()
        
        // Get or create a system user for calendar-sourced appointments
        let systemUser = await db
          .prepare('SELECT id FROM users WHERE email = ?')
          .bind('calendar@system.local')
          .first()

        if (!systemUser) {
          const userId = crypto.randomUUID()
          await db
            .prepare('INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)')
            .bind(userId, 'calendar@system.local', 'Calendar System', 'CLIENT')
            .run()
          systemUser = { id: userId }
        }

        await db
          .prepare(`
            INSERT INTO appointments (
              id, artist_id, client_id, title, description, start_time, end_time,
              status, caldav_uid, caldav_etag, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `)
          .bind(
            appointmentId,
            artistId,
            systemUser.id,
            event.summary,
            event.description || '',
            event.startTime.toISOString(),
            event.endTime.toISOString(),
            event.uid,
            event.etag || null
          )
          .run()

        result.eventsCreated++
      }
    }

    // Delete appointments that no longer exist in calendar
    for (const uid of existingUids) {
      await db
        .prepare('DELETE FROM appointments WHERE caldav_uid = ? AND artist_id = ?')
        .bind(uid, artistId)
        .run()

      result.eventsDeleted++
    }

    // Update sync timestamp
    await db
      .prepare('UPDATE artist_calendars SET last_sync_at = CURRENT_TIMESTAMP WHERE artist_id = ?')
      .bind(artistId)
      .run()

    result.success = true
    return result
  } catch (error) {
    console.error('Error pulling calendar events:', error)
    result.error = error instanceof Error ? error.message : 'Unknown error'
    return result
  }
}

/**
 * Check availability for a specific artist and time slot
 */
export async function checkArtistAvailability(
  artistId: string,
  startTime: Date,
  endTime: Date,
  context?: any
): Promise<{ available: boolean; reason?: string }> {
  const client = createCalDAVClient()
  if (!client) {
    // If CalDAV is not configured, fall back to database-only check
    return checkDatabaseAvailability(artistId, startTime, endTime, context)
  }

  try {
    const db = getDB(context?.env)

    // Get artist calendar configuration
    const calendarConfig = await db
      .prepare('SELECT * FROM artist_calendars WHERE artist_id = ?')
      .bind(artistId)
      .first()

    if (!calendarConfig) {
      // Fall back to database check
      return checkDatabaseAvailability(artistId, startTime, endTime, context)
    }

    // Check calendar for conflicts (extend range slightly for buffer)
    const bufferMinutes = 15
    const checkStart = new Date(startTime.getTime() - bufferMinutes * 60 * 1000)
    const checkEnd = new Date(endTime.getTime() + bufferMinutes * 60 * 1000)

    const events = await fetchCalendarEvents(
      client,
      calendarConfig.calendar_url,
      checkStart,
      checkEnd
    )

    // Check for overlapping events
    for (const event of events) {
      const eventStart = new Date(event.startTime)
      const eventEnd = new Date(event.endTime)

      if (
        (startTime >= eventStart && startTime < eventEnd) ||
        (endTime > eventStart && endTime <= eventEnd) ||
        (startTime <= eventStart && endTime >= eventEnd)
      ) {
        return {
          available: false,
          reason: `Time slot conflicts with: ${event.summary}`,
        }
      }
    }

    return { available: true }
  } catch (error) {
    console.error('Error checking artist availability:', error)
    // Fall back to database check on error
    return checkDatabaseAvailability(artistId, startTime, endTime, context)
  }
}

/**
 * Database-only availability check (fallback when CalDAV unavailable)
 */
async function checkDatabaseAvailability(
  artistId: string,
  startTime: Date,
  endTime: Date,
  context?: any
): Promise<{ available: boolean; reason?: string }> {
  const db = getDB(context?.env)

  const conflicts = await db
    .prepare(`
      SELECT id, title FROM appointments 
      WHERE artist_id = ? 
      AND status NOT IN ('CANCELLED', 'COMPLETED')
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `)
    .bind(
      artistId,
      startTime.toISOString(), startTime.toISOString(),
      endTime.toISOString(), endTime.toISOString(),
      startTime.toISOString(), endTime.toISOString()
    )
    .all()

  if (conflicts.results.length > 0) {
    const conflict = conflicts.results[0] as any
    return {
      available: false,
      reason: `Time slot conflicts with existing appointment: ${conflict.title}`,
    }
  }

  return { available: true }
}

/**
 * Log sync operation to database
 */
export async function logSync(
  log: Omit<CalendarSyncLog, 'id' | 'createdAt'>,
  context?: any
): Promise<void> {
  try {
    const db = getDB(context?.env)
    const logId = crypto.randomUUID()

    await db
      .prepare(`
        INSERT INTO calendar_sync_logs (
          id, artist_id, sync_type, status, error_message,
          events_processed, events_created, events_updated, events_deleted,
          duration_ms, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)
      .bind(
        logId,
        log.artistId || null,
        log.syncType,
        log.status,
        log.errorMessage || null,
        log.eventsProcessed,
        log.eventsCreated,
        log.eventsUpdated,
        log.eventsDeleted,
        log.durationMs || null
      )
      .run()
  } catch (error) {
    console.error('Error logging sync:', error)
  }
}

