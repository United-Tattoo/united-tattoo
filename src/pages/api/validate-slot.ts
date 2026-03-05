import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { fetchCalendarEvents } from '../../services/caldav';
import { fromZonedTime } from 'date-fns-tz';
import { addMinutes } from 'date-fns';

const TIMEZONE = 'America/Denver';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { artistId, date, startTime, endTime } = await request.json();
    
    if (!artistId || !date || !startTime) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const artists = await getCollection('artists');
    const artist = artists.find(a => a.id === artistId);

    if (!artist || !artist.data.calendarId) {
        return new Response(JSON.stringify({ error: 'Artist calendar not found' }), { status: 404 });
    }

    // Verify against live CalDAV
    const slotStart = fromZonedTime(`${date} ${startTime}`, TIMEZONE);
    
    const slotEnd = endTime 
        ? fromZonedTime(`${date} ${endTime}`, TIMEZONE)
        : addMinutes(slotStart, 30);

    // Fetch events for this day
    const dayStart = fromZonedTime(`${date} 00:00`, TIMEZONE);
    const dayEnd = fromZonedTime(`${date} 23:59`, TIMEZONE);

    const busyEvents = await fetchCalendarEvents(artist.data.calendarId, dayStart, dayEnd);
    
    const bufferMinutes = artist.data.bufferMinutes || 30;

    const isBusy = busyEvents.some(event => {
        const overlap = event.start < slotEnd && event.end > slotStart;
        const bufferBlocked = slotStart >= event.end && slotStart < addMinutes(event.end, bufferMinutes);
        return overlap || bufferBlocked;
    });

    return new Response(JSON.stringify({ available: !isBusy }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 500 });
  }
}
