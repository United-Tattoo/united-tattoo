# API Reference

The site exposes three server-side API endpoints, all under `/api/`. These run as Cloudflare Workers functions.

---

## POST /api/booking

Processes a booking request form submission. Sends notification emails to shop admins and a confirmation to the client.

### Request

`Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `artist` | string | yes | Artist slug (e.g. `christy-lumberg`) or `no-preference` |
| `name` | string | yes | Client's full name |
| `email` | string | yes | Client's email address |
| `phone` | string | yes | Client's phone number |
| `preferredContact` | string | no | `email`, `phone`, or `text` |
| `style` | string | yes | Tattoo style (e.g. `fine-line`, `traditional`) |
| `placement` | string | yes | Body placement description |
| `size` | string | yes | Size description |
| `budget` | string | no | Budget range |
| `availability` | string | no | Free-text availability (used if no slots selected) |
| `selected_slots` | string | no | JSON array of slot objects: `[{ date: "YYYY-MM-DD", startTime: "HH:mm" }]` |
| `description` | string | yes | Tattoo description |
| `acceptTerms` | any | yes | Must be present (checkbox) |
| `acceptAge` | any | yes | Must be present (checkbox, confirms 18+) |
| `acceptDeposit` | any | no | Deposit understanding checkbox |
| `subscribeToNewsletter` | any | no | Newsletter opt-in |
| `references` | File[] | no | Up to 5 images, 10MB each, JPEG/PNG/WebP/GIF |

### Validation Rules

- All "required" fields must be non-empty strings
- `acceptTerms` and `acceptAge` must be present
- `email` must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Max 5 reference files; each must be JPEG, PNG, WebP, or GIF; max 10MB per file

### Responses

**200 OK**
```json
{ "success": true, "message": "Booking request submitted successfully" }
```

**400 Bad Request**
```json
{ "success": false, "error": "Missing required fields" }
// or
{ "success": false, "error": "You must accept the terms and confirm your age" }
// or
{ "success": false, "error": "Invalid email address" }
// or
{ "success": false, "error": "Maximum 5 files allowed" }
// or
{ "success": false, "error": "Invalid file type: filename.bmp. Only JPG, PNG, WebP, and GIF are allowed." }
// or
{ "success": false, "error": "File too large: filename.jpg. Maximum size is 10MB." }
```

**500 Internal Server Error**
```json
{ "success": false, "error": "Failed to send booking request. Please try again later." }
// or
{ "success": false, "error": "An unexpected error occurred. Please try again." }
```

### Email Behavior

Two emails are sent on success:

1. **Admin notification** — sent to the configured admin recipients, plus the selected artist's `bookingEmailCc` if set. Includes all form data, selected time slots formatted as human-readable choices, and reference images as attachments. `Reply-To` is set to the client's email.

2. **Client confirmation** — sent to the client's email with a summary of their request and a 24-48 hour response time expectation.

If `RESEND_AUDIENCE_ID` is configured and the client checked `subscribeToNewsletter`, they are added to the Resend audience via `resend.contacts.create()`. A failure here does not fail the booking.

If `RESEND_API_KEY` is not configured, all email activity is logged to the console and the endpoint still returns 200.

---

## GET /api/availability

Returns pre-computed available time slots for a specific artist, derived from their CalDAV calendar and schedule config.

### Request

Query parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `artist` | string | yes | Artist slug (e.g. `christy-lumberg`) |

### Response

**200 OK**
```json
{
  "slots": [
    {
      "date": "2026-03-10",
      "startTime": "10:00",
      "endTime": "10:30",
      "available": true
    }
  ],
  "alternatives": [
    {
      "id": "heather-santistevan",
      "name": "Heather Santistevan",
      "portrait": "/artists/Heather-Santistevan/portrait.avif",
      "slotCount": 42,
      "styles": ["Black and Grey", "Realism"]
    }
  ]
}
```

`slots` contains all available 30-minute windows for the next 3 months, in Mountain Time (America/Denver).

`alternatives` is populated only when the requested artist has fewer than 5 available slots. It returns up to 3 other artists who share at least one specialty with the requested artist and have 5+ available slots, sorted by most availability.

**400 Bad Request**
```json
{ "error": "Artist required" }
```

**404 Not Found**
```json
{ "error": "Artist not found" }
```

**500 Internal Server Error**
```json
{ "error": "Failed to fetch availability" }
```

### Caching

Results are cached in `.calendar-cache/availability.json` for 15 minutes per artist. On cache miss, the service fetches from Nextcloud CalDAV and computes fresh slots. If CalDAV credentials are not configured, this endpoint returns `{ slots: [], alternatives: [] }`.

---

## POST /api/validate-slot

Validates a specific time slot against live CalDAV data. Intended to be called immediately before final booking submission to catch slots that became booked since the page loaded.

### Request

`Content-Type: application/json`

```json
{
  "artistId": "christy-lumberg",
  "date": "2026-03-10",
  "startTime": "10:00",
  "endTime": "10:30"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `artistId` | string | yes | Artist slug |
| `date` | string | yes | Date in `YYYY-MM-DD` format |
| `startTime` | string | yes | Start time in `HH:mm` (24h), Mountain Time |
| `endTime` | string | no | End time in `HH:mm`; defaults to 30 minutes after start |

### Response

**200 OK**
```json
{ "available": true }
// or
{ "available": false }
```

**400 Bad Request**
```json
{ "error": "Missing parameters" }
```

**404 Not Found**
```json
{ "error": "Artist calendar not found" }
```

**500 Internal Server Error**
```json
{ "error": "Validation failed" }
```

### Availability Logic

A slot is considered unavailable if any CalDAV event on that day either:
- Overlaps the slot (event start < slot end AND event end > slot start), OR
- Ends within `bufferMinutes` before the slot starts

This mirrors the same logic used in the availability cache computation.
