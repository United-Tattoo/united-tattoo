export const prerender = false;

import type { APIContext } from "astro";
import { getArtistRecord } from "../../lib/nextcloud-cms";
import { createCalDavClient, makeRequestEventICS } from "../../lib/caldav";

function isIsoDate(value: string): boolean {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export async function POST(context: APIContext): Promise<Response> {
  const env = (context.locals as any)?.runtime?.env ?? process.env;

  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const artistSlug = String(body?.artistSlug || "");
  const startTime = String(body?.startTime || "");
  const endTime = String(body?.endTime || "");
  const notes = String(body?.notes || "");

  if (!artistSlug || !startTime || !endTime) {
    return Response.json({ error: "Missing required fields: artistSlug, startTime, endTime" }, { status: 400 });
  }
  if (!isIsoDate(startTime) || !isIsoDate(endTime)) {
    return Response.json({ error: "Invalid startTime/endTime. Must be ISO timestamps." }, { status: 400 });
  }

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

    const uid = `ut-request-${crypto.randomUUID()}`;
    const summary = `REQUEST: ${artistSlug} - Tattoo Appointment`;
    const description = [
      "United Tattoo booking request",
      `Artist: ${artistSlug}`,
      `Requested start: ${start.toISOString()}`,
      `Requested end: ${end.toISOString()}`,
      notes ? "" : "",
      notes ? `Notes:\n${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const ics = makeRequestEventICS({
      uid,
      summary,
      description,
      startTime: start,
      endTime: end,
    });

    const client = createCalDavClient(env);
    await client.login();

    await client.createCalendarObject({
      calendar: { url: calendarUrlNormalized },
      filename: `${uid}.ics`,
      iCalString: ics,
    });

    return Response.json({ success: true, uid });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Booking request failed" },
      { status: 500 }
    );
  }
}


