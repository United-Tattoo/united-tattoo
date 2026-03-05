import { DAVClient } from 'tsdav';
import ICAL from 'ical.js';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  status: string;
}

export function parseCalendarEvent(iCalData: string): CalendarEvent | null {
  try {
    const jcalData = ICAL.parse(iCalData);
    const comp = new ICAL.Component(jcalData);
    const event = comp.getFirstSubcomponent('vevent');
    
    if (!event) return null;
    
    const summary = event.getFirstPropertyValue('summary');
    const dtstart = event.getFirstPropertyValue('dtstart');
    const dtend = event.getFirstPropertyValue('dtend');
    
    if (!dtstart || !dtend) return null;

    const startTime = new ICAL.Time(dtstart);
    const endTime = new ICAL.Time(dtend);
    
    return {
      title: summary as string,
      start: startTime.toJSDate(),
      end: endTime.toJSDate(),
      status: 'busy',
    };
  } catch (e) {
    console.error('Error parsing iCal data', e);
    return null;
  }
}

export async function fetchCalendarEvents(calendarId: string, start: Date, end: Date): Promise<CalendarEvent[]> {
  const serverUrl = import.meta.env.NEXTCLOUD_CALDAV_URL;
  const username = import.meta.env.NEXTCLOUD_USERNAME;
  const password = import.meta.env.NEXTCLOUD_PASSWORD;
  
  if (!serverUrl || !username || !password) {
    console.warn('CalDAV credentials not configured');
    return [];
  }

  const client = new DAVClient({
    serverUrl,
    credentials: {
      username,
      password,
    },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  });

  try {
    await client.login();
    
    const calendars = await client.fetchCalendars();
    
    // Match calendar by display name or URL containing the ID
    const targetCalendar = calendars.find(c => 
      c.displayName === calendarId || 
      c.url.endsWith(calendarId) || 
      c.url.endsWith(calendarId + '/')
    );
    
    if (!targetCalendar) {
      console.error(`Calendar ${calendarId} not found`);
      return [];
    }
    
    const objects = await client.fetchCalendarObjects({
      calendar: targetCalendar,
      timeRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

    return objects.map(obj => {
      if (!obj.data) return null;
      return parseCalendarEvent(obj.data);
    }).filter((e): e is CalendarEvent => e !== null);

  } catch (error) {
    console.error('CalDAV fetch error:', error);
    return [];
  }
}
