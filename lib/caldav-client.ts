/**
 * CalDAV Client for Nextcloud Integration
 * 
 * This module provides functions to interact with Nextcloud CalDAV server,
 * handling event creation, updates, deletions, and availability checks.
 */

import { DAVClient } from 'tsdav'
import ICAL from 'ical.js'
import type { Appointment, AppointmentStatus, CalendarEvent } from '@/types/database'

// Initialize CalDAV client with Nextcloud credentials
export function createCalDAVClient(): DAVClient | null {
  const baseUrl = process.env.NEXTCLOUD_BASE_URL
  const username = process.env.NEXTCLOUD_USERNAME
  const password = process.env.NEXTCLOUD_PASSWORD

  if (!baseUrl || !username || !password) {
    console.warn('CalDAV credentials not configured. Calendar sync will be disabled.')
    return null
  }

  return new DAVClient({
    serverUrl: baseUrl,
    credentials: {
      username,
      password,
    },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  })
}

/**
 * Convert appointment to iCalendar format
 */
export function appointmentToICalendar(appointment: Appointment, artistName: string, clientName: string): string {
  const comp = new ICAL.Component(['vcalendar', [], []])
  comp.updatePropertyWithValue('prodid', '-//United Tattoo//Booking System//EN')
  comp.updatePropertyWithValue('version', '2.0')

  const vevent = new ICAL.Component('vevent')
  const event = new ICAL.Event(vevent)

  // Set UID - use existing caldav_uid if available
  event.uid = appointment.caldav_uid || `united-tattoo-${appointment.id}`

  // Set summary based on appointment status
  const summaryPrefix = appointment.status === 'PENDING' ? 'REQUEST: ' : ''
  event.summary = `${summaryPrefix}${clientName} - ${appointment.title || 'Tattoo Session'}`

  // Set description
  const description = [
    `Client: ${clientName}`,
    `Artist: ${artistName}`,
    appointment.description ? `Description: ${appointment.description}` : '',
    appointment.placement ? `Placement: ${appointment.placement}` : '',
    appointment.notes ? `Notes: ${appointment.notes}` : '',
    `Status: ${appointment.status}`,
    appointment.depositAmount ? `Deposit: $${appointment.depositAmount}` : '',
  ].filter(Boolean).join('\n')

  event.description = description

  // Set start and end times
  const startTime = ICAL.Time.fromJSDate(new Date(appointment.startTime), true)
  const endTime = ICAL.Time.fromJSDate(new Date(appointment.endTime), true)
  
  event.startDate = startTime
  event.endDate = endTime

  // Add custom properties
  vevent.addPropertyWithValue('x-appointment-id', appointment.id)
  vevent.addPropertyWithValue('x-artist-id', appointment.artistId)
  vevent.addPropertyWithValue('x-client-id', appointment.clientId)
  vevent.addPropertyWithValue('x-appointment-status', appointment.status)

  // Set status based on appointment status
  if (appointment.status === 'CONFIRMED') {
    vevent.addPropertyWithValue('status', 'CONFIRMED')
  } else if (appointment.status === 'CANCELLED') {
    vevent.addPropertyWithValue('status', 'CANCELLED')
  } else {
    vevent.addPropertyWithValue('status', 'TENTATIVE')
  }

  comp.addSubcomponent(vevent)

  return comp.toString()
}

/**
 * Parse iCalendar event to CalendarEvent
 */
export function parseICalendarEvent(icsData: string): CalendarEvent | null {
  try {
    const jCalData = ICAL.parse(icsData)
    const comp = new ICAL.Component(jCalData)
    const vevent = comp.getFirstSubcomponent('vevent')
    
    if (!vevent) {
      return null
    }

    const event = new ICAL.Event(vevent)

    return {
      uid: event.uid,
      summary: event.summary || '',
      description: event.description || '',
      startTime: event.startDate.toJSDate(),
      endTime: event.endDate.toJSDate(),
    }
  } catch (error) {
    console.error('Error parsing iCalendar event:', error)
    return null
  }
}

/**
 * Create or update an event in CalDAV server
 */
export async function createOrUpdateCalendarEvent(
  client: DAVClient,
  calendarUrl: string,
  appointment: Appointment,
  artistName: string,
  clientName: string,
  existingEtag?: string
): Promise<{ uid: string; etag?: string; url: string } | null> {
  try {
    await client.login()

    const icsData = appointmentToICalendar(appointment, artistName, clientName)
    const uid = appointment.caldav_uid || `united-tattoo-${appointment.id}`
    
    // Construct the event URL
    const eventUrl = `${calendarUrl}${uid}.ics`

    // If we have an etag, this is an update
    if (existingEtag) {
      const response = await client.updateCalendarObject({
        calendarObject: {
          url: eventUrl,
          data: icsData,
          etag: existingEtag,
        },
      })

      return {
        uid,
        etag: response.headers?.get('etag') || undefined,
        url: eventUrl,
      }
    } else {
      // This is a new event
      const response = await client.createCalendarObject({
        calendar: {
          url: calendarUrl,
        },
        filename: `${uid}.ics`,
        iCalString: icsData,
      })

      return {
        uid,
        etag: response.headers?.get('etag') || undefined,
        url: eventUrl,
      }
    }
  } catch (error) {
    console.error('Error creating/updating calendar event:', error)
    throw error
  }
}

/**
 * Delete an event from CalDAV server
 */
export async function deleteCalendarEvent(
  client: DAVClient,
  eventUrl: string,
  etag?: string
): Promise<boolean> {
  try {
    await client.login()

    await client.deleteCalendarObject({
      calendarObject: {
        url: eventUrl,
        etag: etag || '',
      },
    })

    return true
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return false
  }
}

/**
 * Fetch all events from a calendar within a date range
 */
export async function fetchCalendarEvents(
  client: DAVClient,
  calendarUrl: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    await client.login()

    const objects = await client.fetchCalendarObjects({
      calendar: {
        url: calendarUrl,
      },
      timeRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    })

    const events: CalendarEvent[] = []

    for (const obj of objects) {
      if (obj.data) {
        const event = parseICalendarEvent(obj.data)
        if (event) {
          events.push({
            ...event,
            etag: obj.etag,
            url: obj.url,
          })
        }
      }
    }

    return events
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}

/**
 * Check if a time slot is available (no conflicts)
 */
export async function checkTimeSlotAvailability(
  client: DAVClient,
  calendarUrl: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  try {
    const events = await fetchCalendarEvents(client, calendarUrl, startTime, endTime)
    
    // Check for any overlapping events
    for (const event of events) {
      const eventStart = new Date(event.startTime)
      const eventEnd = new Date(event.endTime)
      
      // Check for overlap
      if (
        (startTime >= eventStart && startTime < eventEnd) ||
        (endTime > eventStart && endTime <= eventEnd) ||
        (startTime <= eventStart && endTime >= eventEnd)
      ) {
        return false // Slot is not available
      }
    }

    return true // Slot is available
  } catch (error) {
    console.error('Error checking time slot availability:', error)
    // In case of error, assume slot is unavailable for safety
    return false
  }
}

/**
 * Get all blocked time slots for a calendar within a date range
 */
export async function getBlockedTimeSlots(
  client: DAVClient,
  calendarUrl: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ start: Date; end: Date; summary: string }>> {
  try {
    const events = await fetchCalendarEvents(client, calendarUrl, startDate, endDate)
    
    return events.map(event => ({
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      summary: event.summary,
    }))
  } catch (error) {
    console.error('Error getting blocked time slots:', error)
    return []
  }
}

