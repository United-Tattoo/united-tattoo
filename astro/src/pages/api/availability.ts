export const prerender = false;

import type { APIContext } from "astro";
import { getArtistRecord } from "../../lib/nextcloud-cms";
import { createCalDavClient, fetchCalendarEvents } from "../../lib/caldav";

function isIsoDate(value: string): boolean {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export async function GET(context: APIContext): Promise<Response> {
  const url = new URL(context.request.url);
  const artistSlug = url.searchParams.get("artistSlug") || "";
  const startTime = url.searchParams.get("startTime") || "";
  const endTime = url.searchParams.get("endTime") || "";
  const debug = url.searchParams.get("debug") === "1";

  if (!artistSlug || !startTime || !endTime) {
    return Response.json({ error: "Missing required query params: artistSlug, startTime, endTime" }, { status: 400 });
  }
  if (!isIsoDate(startTime) || !isIsoDate(endTime)) {
    return Response.json({ error: "Invalid startTime/endTime. Must be ISO timestamps." }, { status: 400 });
  }

  const env = (context.locals as any)?.runtime?.env ?? process.env;

  try {
    const record = await getArtistRecord(env, artistSlug);
    const calendarUrl =
      (record.info as any).calendarUrl ||
      (record.info as any).calendar_url ||
      (record.info as any).caldavUrl ||
      (record.info as any).caldav_url;

    if (!calendarUrl || typeof calendarUrl !== "string") {
      return Response.json(
        { error: `Missing calendarUrl for artist '${artistSlug}' in Nextcloud info.json.` },
        { status: 400 }
      );
    }

    const calendarUrlNormalized = ensureTrailingSlash(calendarUrl);

    const start = new Date(startTime);
    const end = new Date(endTime);

    // IMPORTANT:
    // Some CalDAV servers/clients only return events whose DTSTART falls within the timeRange,
    // which can miss events that start earlier but overlap the requested slot (e.g. 11–2 vs request 1–3).
    // So we query a wider window around the requested slot (±24h) and do precise overlap checks ourselves.
    const checkStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    const checkEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000);

    const client = createCalDavClient(env);
    const events = await fetchCalendarEvents(client, calendarUrlNormalized, checkStart, checkEnd);

    for (const event of events) {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const overlaps =
        (start >= eventStart && start < eventEnd) ||
        (end > eventStart && end <= eventEnd) ||
        (start <= eventStart && end >= eventEnd);

      if (overlaps) {
        return Response.json({
          available: false,
          reason: event.summary ? `Conflicts with: ${event.summary}` : "Conflicts with an existing calendar event",
          ...(debug
            ? {
                debug: {
                  calendarUrl: calendarUrlNormalized,
                  requested: { startTime, endTime },
                  queried: { startTime: checkStart.toISOString(), endTime: checkEnd.toISOString() },
                  eventsFetched: events.length,
                  conflict: {
                    summary: event.summary,
                    startTime: eventStart.toISOString(),
                    endTime: eventEnd.toISOString(),
                  },
                },
              }
            : {}),
        });
      }
    }

    return Response.json({
      available: true,
      ...(debug
        ? {
            debug: {
              calendarUrl: calendarUrlNormalized,
              requested: { startTime, endTime },
              queried: { startTime: checkStart.toISOString(), endTime: checkEnd.toISOString() },
              eventsFetched: events.length,
            },
          }
        : {}),
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Availability check failed" },
      { status: 500 }
    );
  }
}


