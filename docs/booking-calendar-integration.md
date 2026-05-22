# Booking and Calendar Integration

This document explains how the booking form, availability calendar, CalDAV integration, and regression tests fit together.

## What This System Does

The site supports booking requests, not confirmed appointment creation.

A client can:

- Pick an artist on `/booking`
- See available calendar slots for artists with a configured schedule and calendar
- Select up to 3 preferred slots
- Submit a booking request with project details and reference images

The system then:

- Re-formats selected slots into readable availability text
- Sends or logs an admin booking notification
- Sends or logs a client confirmation
- Optionally adds the client to a Resend audience

The system does not currently create, reserve, or update events in Nextcloud.

## Source of Truth

Artist calendar configuration lives in `src/content/artists/*.mdx`.

Relevant frontmatter fields:

```yaml
calendarId: "christy-lumberg"
acceptingBookings: true
schedule:
  monday: "10:00-18:00"
  tuesday: "10:00-18:00"
  wednesday: "10:00-18:00"
  thursday: "10:00-20:00"
  friday: "10:00-20:00"
  saturday: "10:00-20:00"
  sunday: "closed"
bufferMinutes: 30
bookingEmailCc: artist@example.com
```

`calendarId` must match either the Nextcloud calendar display name or the final calendar URL segment.

## Runtime Flow

### 1. Client chooses an artist

`src/pages/booking.astro` listens for artist selection changes. When the selected value is not `no-preference`, it shows `CalendarPicker` and dispatches an `artist-changed` event.

### 2. CalendarPicker loads availability

`src/components/CalendarPicker.astro` calls:

```text
GET /api/availability?artist={artistSlug}
```

The response shape is:

```json
{
  "slots": [
    {
      "date": "2026-05-22",
      "startTime": "10:00",
      "endTime": "10:30",
      "available": true
    }
  ],
  "alternatives": []
}
```

### 3. Availability endpoint computes slots

`src/pages/api/availability.ts` loads the artist content entry and calls `getArtistAvailability()`.

`src/services/calendar-cache.ts` then:

- Returns cached availability when the `.calendar-cache/availability.json` entry is still fresh
- Fetches live busy events from CalDAV on cache miss or expiry
- Generates 30-minute slots for the next 3 months
- Uses `America/Denver` as the artist timezone
- Removes slots that overlap busy events
- Removes slots that start inside the configured post-event buffer
- Stores the result for 15 minutes

### 4. CalDAV fetches busy events

`src/services/caldav.ts` reads:

```bash
NEXTCLOUD_CALDAV_URL=
NEXTCLOUD_USERNAME=
NEXTCLOUD_PASSWORD=
```

It logs into Nextcloud with Basic auth, finds the matching calendar, fetches iCal objects for the requested time range, and parses `VEVENT` entries into:

```ts
{
  title: string;
  start: Date;
  end: Date;
  status: 'busy';
}
```

If credentials are missing, the calendar cannot be found, or CalDAV fails, the function returns an empty event list.

### 5. Slot selection validates live availability

Before a slot is added to the form, `CalendarPicker` calls:

```text
POST /api/validate-slot
```

Payload:

```json
{
  "artistId": "christy-lumberg",
  "date": "2026-05-22",
  "startTime": "10:00",
  "endTime": "10:30"
}
```

The endpoint fetches that day from live CalDAV and checks the same overlap and buffer rules.

### 6. Booking request submits

`src/pages/booking.astro` posts form data to:

```text
POST /api/booking
```

If `selected_slots` is present, `src/services/booking-format.ts` formats the JSON into email-friendly text:

```text
Choice #1: Fri, May 22 at 10:00 AM MT
```

`src/pages/api/booking.ts` validates required fields, validates image uploads, looks up the artist's `bookingEmailCc`, then sends email through Resend when `RESEND_API_KEY` is configured.

In local dev without `RESEND_API_KEY`, the endpoint logs the admin and client email payloads instead of sending them.

## Failure Behavior

The calendar side currently fails open.

If CalDAV cannot be reached, the availability layer sees no busy events. That means generated availability may look more open than reality, and slot validation may return `available: true`.

This is intentional in the current implementation, but it is important to understand during testing. If we want to fail closed later, the tests should be updated before changing the implementation.

## Automated Regression Tests

Run the behavior test suite with:

```bash
pnpm test
```

Run it in watch mode with:

```bash
pnpm test:watch
```

The tests cover behavior that affects booking:

- CalDAV returns an empty event list when credentials are missing
- CalDAV matches a calendar and parses iCal busy events
- Availability generates 30-minute slots in Mountain Time
- Availability removes slots that overlap busy events
- Availability removes slots blocked by the post-event buffer
- Selected slots are formatted into booking email availability text
- `/api/booking` rejects incomplete booking requests
- `/api/booking` includes selected calendar slots in dev-mode email output

These tests intentionally avoid real Nextcloud and Resend calls. They are meant to catch regressions quickly and deterministically.

## Manual Dev Validation Against Real CalDAV

Use this when changing the calendar flow or checking a new artist calendar.

1. Add local CalDAV credentials to `.env.local`.

2. Start the dev server:

   ```bash
   pnpm dev
   ```

3. Fetch availability for an artist:

   ```bash
   curl "http://localhost:4321/api/availability?artist=christy-lumberg" | jq '{slotCount:(.slots|length), firstSlot:.slots[0]}'
   ```

4. Validate one returned slot:

   ```bash
   curl -X POST "http://localhost:4321/api/validate-slot" \
     -H "content-type: application/json" \
     -d '{"artistId":"christy-lumberg","date":"2026-05-22","startTime":"10:00","endTime":"10:30"}'
   ```

5. Submit a dev-mode booking request:

   ```bash
   curl -X POST "http://localhost:4321/api/booking" \
     -F artist=christy-lumberg \
     -F name="Dev Test" \
     -F email="dev@example.com" \
     -F phone="555-555-5555" \
     -F preferredContact=email \
     -F style=fine-line \
     -F placement=arm \
     -F size=small \
     -F description="Dev validation test" \
     -F selected_slots='[{"date":"2026-05-22","startTime":"10:00","endTime":"10:30","available":true}]' \
     -F acceptTerms=on \
     -F acceptAge=on
   ```

6. Confirm the server log includes the formatted availability choice.

For a stronger real-world check, create a temporary event in the artist's Nextcloud calendar, clear `.calendar-cache/availability.json`, then confirm the overlapping slot is absent from `/api/availability` and returns `available: false` from `/api/validate-slot`.

## When to Add Tests

Add or update tests when changing:

- Artist schedule parsing
- Timezone handling
- Buffer behavior
- CalDAV calendar matching
- iCal parsing
- Availability cache behavior
- Booking form validation
- Selected slot formatting
- Resend/dev-mode booking email behavior
