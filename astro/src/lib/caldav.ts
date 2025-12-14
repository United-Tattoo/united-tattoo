import { DAVClient } from "tsdav";
import ICAL from "ical.js";

export type NextcloudCalDavEnv = {
  NEXTCLOUD_BASE_URL: string;
  NEXTCLOUD_USERNAME: string;
  NEXTCLOUD_PASSWORD: string;
};

export type CalendarEvent = {
  uid: string;
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  etag?: string;
  url?: string;
};

function requireEnv(env: Partial<NextcloudCalDavEnv>): NextcloudCalDavEnv {
  const base = env.NEXTCLOUD_BASE_URL;
  const user = env.NEXTCLOUD_USERNAME;
  const pass = env.NEXTCLOUD_PASSWORD;
  if (!base || !user || !pass) {
    throw new Error("Missing NEXTCLOUD_* env vars required for CalDAV access");
  }
  return { NEXTCLOUD_BASE_URL: base, NEXTCLOUD_USERNAME: user, NEXTCLOUD_PASSWORD: pass };
}

export function createCalDavClient(rawEnv: Partial<NextcloudCalDavEnv>): DAVClient {
  const env = requireEnv(rawEnv);
  return new DAVClient({
    serverUrl: env.NEXTCLOUD_BASE_URL,
    credentials: {
      username: env.NEXTCLOUD_USERNAME,
      password: env.NEXTCLOUD_PASSWORD,
    },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });
}

export function parseICalendarEvent(icsData: string): CalendarEvent | null {
  try {
    const jCalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jCalData);
    const vevent = comp.getFirstSubcomponent("vevent");
    if (!vevent) return null;
    const event = new ICAL.Event(vevent);

    return {
      uid: event.uid,
      summary: event.summary || "",
      description: event.description || "",
      startTime: event.startDate.toJSDate(),
      endTime: event.endDate.toJSDate(),
    };
  } catch {
    return null;
  }
}

export async function fetchCalendarEvents(
  client: DAVClient,
  calendarUrl: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  await client.login();

  const objects = await client.fetchCalendarObjects({
    calendar: { url: calendarUrl },
    timeRange: { start: startDate.toISOString(), end: endDate.toISOString() },
  });

  const events: CalendarEvent[] = [];
  for (const obj of objects) {
    if (!obj.data) continue;
    const parsed = parseICalendarEvent(obj.data);
    if (!parsed) continue;
    events.push({ ...parsed, etag: obj.etag, url: obj.url });
  }
  return events;
}

export function makeRequestEventICS(params: {
  uid: string;
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
}): string {
  const comp = new ICAL.Component(["vcalendar", [], []]);
  comp.updatePropertyWithValue("prodid", "-//United Tattoo//Booking//EN");
  comp.updatePropertyWithValue("version", "2.0");

  const vevent = new ICAL.Component("vevent");
  const event = new ICAL.Event(vevent);

  event.uid = params.uid;
  event.summary = params.summary;
  event.description = params.description;
  event.startDate = ICAL.Time.fromJSDate(params.startTime, true);
  event.endDate = ICAL.Time.fromJSDate(params.endTime, true);

  // Mark as tentative so it reads like a request.
  vevent.addPropertyWithValue("status", "TENTATIVE");

  comp.addSubcomponent(vevent);
  return comp.toString();
}


