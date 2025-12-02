/**
 * CalDAV Sync Hooks for Payload CMS
 *
 * Provides hooks for syncing Payload appointments with Nextcloud CalDAV calendars.
 * These hooks call the existing calendar-sync functions from lib/calendar-sync.ts
 */

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Type for appointment document from Payload
interface PayloadAppointment {
  id: string
  artist: string | { id: string }
  client: string | { id: string }
  title: string
  description?: string
  startTime: string | Date
  endTime: string | Date
  status: string
  depositAmount?: number
  totalAmount?: number
  notes?: string
  caldavUid?: string
  caldavEtag?: string
}

// Convert Payload appointment to legacy Appointment format
function toAppointmentFormat(doc: PayloadAppointment) {
  return {
    id: doc.id,
    artistId: typeof doc.artist === 'string' ? doc.artist : doc.artist?.id,
    clientId: typeof doc.client === 'string' ? doc.client : doc.client?.id,
    title: doc.title,
    description: doc.description,
    startTime: typeof doc.startTime === 'string' ? doc.startTime : doc.startTime?.toISOString(),
    endTime: typeof doc.endTime === 'string' ? doc.endTime : doc.endTime?.toISOString(),
    status: doc.status,
    depositAmount: doc.depositAmount,
    totalAmount: doc.totalAmount,
    notes: doc.notes,
    caldav_uid: doc.caldavUid,
    caldav_etag: doc.caldavEtag,
  }
}

/**
 * After change hook - syncs appointment to CalDAV calendar
 * Called when appointment is created or updated
 */
export const syncToCalendarAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only sync on create or update
  if (operation !== 'create' && operation !== 'update') {
    return doc
  }

  try {
    // Dynamically import to avoid circular dependencies
    const { syncAppointmentToCalendar } = await import('@/lib/calendar-sync')

    const appointment = toAppointmentFormat(doc as PayloadAppointment)

    console.log(`[CalDAV Sync] Syncing appointment ${doc.id} to calendar (${operation})`)

    const result = await syncAppointmentToCalendar(appointment as any, req.context)

    if (result) {
      console.log(`[CalDAV Sync] Successfully synced appointment ${doc.id}, UID: ${result.uid}`)

      // Update the document with CalDAV sync info
      // Note: We need to be careful not to trigger an infinite loop
      // The calendar-sync function already updates the database directly
      // So we just update the Payload document's local state
      doc.caldavUid = result.uid
      doc.caldavEtag = result.etag
    } else {
      console.log(`[CalDAV Sync] Skipped syncing appointment ${doc.id} (no calendar configured)`)
    }
  } catch (error) {
    // Log error but don't fail the operation
    console.error(`[CalDAV Sync] Error syncing appointment ${doc.id}:`, error)
  }

  return doc
}

/**
 * After delete hook - removes appointment from CalDAV calendar
 * Called when appointment is deleted
 */
export const deleteFromCalendarAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    // Dynamically import to avoid circular dependencies
    const { deleteAppointmentFromCalendar } = await import('@/lib/calendar-sync')

    const appointment = toAppointmentFormat(doc as PayloadAppointment)

    console.log(`[CalDAV Sync] Deleting appointment ${doc.id} from calendar`)

    const success = await deleteAppointmentFromCalendar(appointment as any, req.context)

    if (success) {
      console.log(`[CalDAV Sync] Successfully deleted appointment ${doc.id} from calendar`)
    } else {
      console.log(`[CalDAV Sync] Skipped deleting appointment ${doc.id} (no calendar configured or no UID)`)
    }
  } catch (error) {
    // Log error but don't fail the operation
    console.error(`[CalDAV Sync] Error deleting appointment ${doc.id} from calendar:`, error)
  }

  return doc
}

/**
 * Hook to check availability before creating/updating appointment
 * Can be used as a beforeChange hook to prevent double-booking
 */
export const checkAvailabilityBeforeChange = async ({
  data,
  req,
  operation,
  originalDoc,
}: {
  data: any
  req: any
  operation: 'create' | 'update'
  originalDoc?: any
}) => {
  // Skip check if we're just updating status or notes
  if (operation === 'update') {
    const timeChanged =
      data.startTime !== originalDoc?.startTime ||
      data.endTime !== originalDoc?.endTime ||
      data.artist !== originalDoc?.artist

    if (!timeChanged) {
      return data
    }
  }

  try {
    const { checkArtistAvailability } = await import('@/lib/calendar-sync')

    const artistId = typeof data.artist === 'string' ? data.artist : data.artist?.id
    const startTime = new Date(data.startTime)
    const endTime = new Date(data.endTime)

    const availability = await checkArtistAvailability(
      artistId,
      startTime,
      endTime,
      req.context
    )

    if (!availability.available) {
      throw new Error(availability.reason || 'Time slot is not available')
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('not available')) {
      throw error
    }
    // Log other errors but don't fail the operation
    console.error('[CalDAV Sync] Error checking availability:', error)
  }

  return data
}

