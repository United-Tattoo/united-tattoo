# Product Requirements Document: CalDAV Calendar Integration

**Feature**: Real-time Artist Availability Calendar
**Project**: United Tattoo Booking System
**Created**: 2026-01-02
**Status**: Draft for Implementation
**Version**: 1.0

---

## Executive Summary

This feature integrates Nextcloud CalDAV calendars into the United Tattoo booking form, enabling clients to view real-time artist availability and select preferred appointment time slots during the booking submission process. This replaces the current free-text "Preferred Dates/Times" field with an interactive calendar experience while maintaining the existing approval workflow.

**Business Value:**
- Reduces back-and-forth communication by showing real availability upfront
- Increases booking conversion by letting clients self-select viable time slots
- Improves receptionist efficiency by pre-filtering unrealistic scheduling requests
- Enhances client experience with transparency and modern UX

---

## Problem Statement

**Current State:**
Clients enter preferred dates/times as free-form text (e.g., "Weekends in March", "Tuesdays after 4pm"). This creates several issues:
- Clients don't know if their preferred times are actually available
- Receptionists must manually cross-reference artist calendars
- High rejection rate when preferences don't align with availability
- Wasted time in multiple email exchanges to find suitable times

**Desired State:**
Clients see artist availability in real-time, select 1-3 ranked time slot preferences from available options, and submit bookings with realistic expectations. Receptionists receive pre-qualified scheduling requests that align with actual availability.

---

## Goals & Success Metrics

### Primary Goals
1. **Reduce scheduling friction** - Decrease time from inquiry to appointment confirmation
2. **Increase booking success rate** - Higher percentage of bookings approved on first submission
3. **Improve client satisfaction** - Better transparency and control over scheduling

### Success Metrics
- **Booking approval rate**: Target >70% of submissions approved without reschedule request (vs. current unknown baseline)
- **Receptionist time savings**: Reduce calendar coordination time by ~50%
- **Client engagement**: Measure calendar interaction rate (% of bookings with slots selected vs. fallback text field)
- **System reliability**: <5% fallback to text field due to CalDAV errors

---

## User Stories

### Client (Primary User)
- **As a client**, I want to see when my preferred artist is available so I can pick times that work for both of us
- **As a client**, I want to select multiple time preferences so I have backup options if my first choice doesn't work
- **As a client**, I want to see alternative artists with availability if my first choice is fully booked

### Receptionist
- **As a receptionist**, I want booking submissions to include realistic time slot preferences so I spend less time coordinating schedules
- **As a receptionist**, I want to see which of the client's 3 time preferences is most viable so I can make quick approval decisions

### Artist
- **As an artist**, I want my calendar blocks and working hours respected so I don't get double-booked or receive requests outside my schedule
- **As an artist**, I want buffer time between appointments so I have adequate setup/cleanup time

---

## Functional Requirements

### FR-1: Calendar Display Integration

**Location**: Step 3 (Project Details) of the booking form (`/src/pages/booking.astro`)

**Trigger**: When client selects an artist from the dropdown in Step 1, the calendar loads in Step 3 alongside existing project detail fields.

**Calendar UI Specifications**:
- **View Type**: Month view showing current month + next 2 months (3-month rolling window)
- **Visual Indicators**:
  - Green highlighted days = slots available
  - Gray days = fully booked or outside working hours
  - Hover tooltip = "X slots available" or "Fully booked"
- **Initial State**: Shows current month by default
- **Navigation**: Previous/Next month arrows to browse the 3-month window
- **Timezone Notice**: Prominent "All times shown in Mountain Time (MT)" label above calendar

**Special Case - "No Preference" Artist Selection**:
- If client selects "No preference" in Step 1, show a generic message: "Calendar will be available once an artist is assigned to your booking"
- Do NOT attempt to aggregate all artists' calendars

### FR-2: Time Slot Selection

**Day Click Interaction**:
1. Client clicks a green (available) day in month view
2. Modal/expansion panel opens showing available time slots for that day
3. Slots displayed in 30-minute increments during artist's working hours
4. Each slot shows: `[Time] - [Duration estimate]` (e.g., "10:00 AM - 2hr session")

**Slot Selection Mechanism**:
- Client can select **up to 3 slots** across any days in the calendar
- Each selection is numbered: "1st Choice", "2nd Choice", "3rd Choice"
- Selected slots display with badges indicating ranking
- Client can reorder rankings by clicking numbered badges
- Client can deselect a slot by clicking the 'X' on the badge

**Validation**:
- At least 1 slot must be selected to proceed to Step 4 (unless fallback mode)
- Cannot select slots in the past (grayed out automatically)
- Cannot select slots outside artist's working hours

### FR-3: Alternative Artist Suggestions

**Display Location**: Below the calendar widget, always visible

**Trigger Conditions**:
- Shown when selected artist has <5 available slots in the next 30 days
- Shows 2-3 artists matching:
  1. Same primary tattoo style (from MDX frontmatter `styles` field)
  2. Has ≥5 available slots in next 30 days
  3. Currently accepting bookings

**Suggestion Card Contents**:
- Artist thumbnail image
- Artist name
- "Available: X slots in next 30 days"
- Matching tattoo styles (e.g., "Also specializes in Traditional, Japanese")
- "Switch to [Artist Name]" button

**Interaction**:
- Clicking "Switch" button updates the artist selection in Step 1
- Calendar reloads with new artist's availability
- Previously selected slots are cleared

### FR-4: Availability Calculation Logic

The system determines "available" slots by combining multiple criteria:

**Criteria 1: Working Hours** (from artist MDX frontmatter)
```yaml
schedule:
  monday: "10:00-18:00"
  tuesday: "10:00-18:00"
  wednesday: "closed"
  thursday: "10:00-20:00"
  friday: "10:00-18:00"
  saturday: "12:00-17:00"
  sunday: "closed"
```

**Criteria 2: CalDAV Free/Busy Status**
- Fetch existing events from artist's Nextcloud calendar via CalDAV
- Any time block marked as "busy" is unavailable
- Only show slots during "free" periods

**Criteria 3: Buffer Time** (30 minutes)
- Automatically add 30-minute padding after each existing calendar event
- Example: If event ends at 2:00 PM, don't show slots until 2:30 PM

**Criteria 4: Minimum Session Duration** (role-based)
- **For client view**: Show all slots as "available" regardless of contiguous time
- **For receptionist/artist approval**: They assess if the selected slot has enough duration based on the project details and reference images
- Session duration is NOT calculated or enforced at booking time - this is intentionally left to the approval stage

**Combined Logic**:
```
Available Slot =
  Time within working hours AND
  CalDAV status = "free" AND
  Not within 30 min after an existing event AND
  Time is ≥ current date/time
```

### FR-5: Data Caching & Real-Time Validation

**Hybrid Approach**:

**Background Cache (15-minute refresh)**:
- Cron job or serverless function fetches all artist calendars every 15 minutes
- Stores free/busy data in a cache file/memory (e.g., Redis, JSON file, Astro's Data Store)
- Calendar UI loads from cache for fast initial display

**Real-Time Validation (on slot selection)**:
- When client selects a slot, make a real-time CalDAV request to verify it's still available
- If slot is now occupied:
  - Show error: "This slot was just booked. Please select another time."
  - Remove the slot from UI immediately
  - Force client to choose a different slot
- If slot is still available:
  - Lock it in the UI (show checkmark)
  - Store selection in component state

**Cache Invalidation**:
- Whenever a booking is approved (future feature), invalidate cache for that artist
- Force immediate re-fetch of that artist's calendar

### FR-6: Data Storage & Email Formatting

**No Database Required (v1)**:
Selected time slots are stored temporarily in the booking form state and sent via email only.

**Email Template Updates**:

**Admin/Receptionist Email**:
```
PREFERRED TIME SLOTS (Ranked):
1st Choice: Tuesday, March 15, 2026 at 2:00 PM MT
2nd Choice: Thursday, March 17, 2026 at 10:00 AM MT
3rd Choice: Friday, March 18, 2026 at 3:30 PM MT

(Client selected these from available slots in [Artist Name]'s calendar)
```

**Client Confirmation Email**:
```
YOUR PREFERRED APPOINTMENTS:
You selected the following times - we'll confirm the best option for your project:
• Tuesday, March 15 at 2:00 PM (1st choice)
• Thursday, March 17 at 10:00 AM (2nd choice)
• Friday, March 18 at 3:30 PM (3rd choice)

All times are in Mountain Time (MT).
```

**Fallback Field Data** (if CalDAV error occurred):
```
PREFERRED DATES/TIMES (Text Entry):
[Client's free-form text input]

Note: Calendar was unavailable - client entered preferences manually.
```

### FR-7: Error Handling & Fallback

**CalDAV Connection Failure Scenarios**:
- Nextcloud server unreachable
- Authentication failure (expired credentials)
- Calendar not found (misconfigured artist MDX)
- Timeout (response > 5 seconds)

**Fallback Behavior**:
1. Display error message in place of calendar:
   ```
   ⚠️ Calendar Unavailable
   We're having trouble loading appointment times. Please enter your preferred dates and times below, and we'll coordinate with [Artist Name]'s schedule.
   ```
2. Show the original text field: "Preferred Dates / Times" (from before calendar integration)
3. Allow form submission to proceed normally
4. Log error to server logs for monitoring

**User Experience**:
- Error should feel natural, not broken
- Client can still complete booking without delay
- Receptionist sees fallback note in email to know calendar wasn't used

### FR-8: Alternative Artists Algorithm

**Artist Matching Logic**:
```javascript
function findAlternativeArtists(primaryArtist) {
  const allArtists = getArtists(); // From MDX collection

  return allArtists
    .filter(artist => {
      // Must share at least 1 style with primary artist
      const sharedStyles = artist.styles.some(style =>
        primaryArtist.styles.includes(style)
      );

      // Must have ≥5 available slots in next 30 days
      const slotCount = getAvailableSlots(artist.calendarId, 30);

      // Must be accepting bookings (from MDX frontmatter)
      const isAcceptingBookings = artist.acceptingBookings !== false;

      return sharedStyles && slotCount >= 5 && isAcceptingBookings;
    })
    .sort((a, b) => {
      // Sort by number of matching styles, then by slot count
      const aMatches = countMatchingStyles(a, primaryArtist);
      const bMatches = countMatchingStyles(b, primaryArtist);
      if (aMatches !== bMatches) return bMatches - aMatches;

      return getAvailableSlots(b.calendarId, 30) - getAvailableSlots(a.calendarId, 30);
    })
    .slice(0, 3); // Return top 3 matches
}
```

**Display Priority**:
1. Artists with most matching styles
2. Artists with most available slots
3. Limit to 3 suggestions to avoid overwhelming choice

---

## Technical Architecture

### CalDAV Integration

**Protocol**: CalDAV (Calendaring Extensions to WebDAV)
**Server**: Nextcloud (self-hosted instance - credentials already configured)
**Authentication**: Basic Auth or OAuth2 (depending on Nextcloud setup)

**Required NPM Packages**:
```json
{
  "tsdav": "^2.0.5",  // TypeScript CalDAV library
  "ical.js": "^2.0.1"  // iCalendar parsing
}
```

**Environment Variables**:
```env
# Nextcloud CalDAV Configuration
NEXTCLOUD_CALDAV_URL=https://cloud.example.com/remote.php/dav/calendars/
NEXTCLOUD_USERNAME=admin
NEXTCLOUD_PASSWORD=secure_password_here
NEXTCLOUD_CALENDAR_PREFIX=artist-  // e.g., "artist-alice", "artist-bob"
```

**Artist MDX Frontmatter** (example):
```yaml
---
name: "Alice Mercer"
slug: "alice-mercer"
calendarId: "artist-alice"  # Maps to Nextcloud calendar name
styles: ["Traditional", "Japanese", "Illustrative"]
acceptingBookings: true

schedule:
  monday: "10:00-18:00"
  tuesday: "10:00-18:00"
  wednesday: "closed"
  thursday: "10:00-20:00"
  friday: "10:00-18:00"
  saturday: "12:00-17:00"
  sunday: "closed"

bufferMinutes: 30  # Time padding between appointments
---
```

### Data Flow Diagram

```
┌─────────────────┐
│  Client Browser │
└────────┬────────┘
         │ 1. Loads booking form
         ▼
┌─────────────────────────────────┐
│  Astro Page: /booking.astro     │
│  - Renders calendar component   │
│  - Fetches cached availability  │
└────────┬────────────────────────┘
         │ 2. Requests availability for artist
         ▼
┌─────────────────────────────────┐
│  API Route: /api/availability   │
│  - Checks cache age             │
│  - Returns cached data (if <15m)│
│  - Triggers background refresh  │
└────────┬────────────────────────┘
         │ 3. Cache miss or stale
         ▼
┌─────────────────────────────────┐
│  CalDAV Service                 │
│  - tsdav.fetchCalendarObjects() │
│  - Parse iCal VFREEBUSY data    │
│  - Apply working hours filter   │
│  - Apply buffer time padding    │
│  - Return available slots       │
└────────┬────────────────────────┘
         │ 4. Update cache
         ▼
┌─────────────────────────────────┐
│  Cache Layer (JSON/Redis)       │
│  - Store: { artistId, slots,    │
│    timestamp, expiresAt }       │
└─────────────────────────────────┘
         │ 5. Client selects slot
         ▼
┌─────────────────────────────────┐
│  Real-time Validation           │
│  - Fetch live CalDAV status     │
│  - Confirm slot still available │
│  - Return success/error         │
└────────┬────────────────────────┘
         │ 6. Submit booking
         ▼
┌─────────────────────────────────┐
│  API Route: /api/booking.ts     │
│  - Existing email send logic    │
│  - Include selected slots       │
└─────────────────────────────────┘
```

### Caching Strategy

**Cache Structure** (JSON file for v1 - can upgrade to Redis later):
```json
{
  "artist-alice": {
    "slots": [
      {
        "date": "2026-03-15",
        "startTime": "14:00",
        "endTime": "18:00",
        "available": true
      },
      {
        "date": "2026-03-17",
        "startTime": "10:00",
        "endTime": "18:00",
        "available": true
      }
    ],
    "lastFetched": "2026-01-02T14:30:00Z",
    "expiresAt": "2026-01-02T14:45:00Z"
  }
}
```

**Cache Refresh Logic**:
```javascript
// Background function (runs every 15 minutes via cron or serverless)
async function refreshAllCalendars() {
  const artists = await getArtists(); // From MDX collection

  for (const artist of artists) {
    if (!artist.calendarId) continue;

    const slots = await fetchCalDAVAvailability(artist.calendarId);

    cache.set(artist.calendarId, {
      slots,
      lastFetched: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min TTL
    });
  }
}
```

---

## UI/UX Specifications

### Calendar Component Wireframe

```
┌───────────────────────────────────────────────────────────────┐
│  📅 Select Your Preferred Appointment Times                   │
│  Choose up to 3 times that work for you. We'll confirm the    │
│  best option based on [Artist Name]'s schedule.               │
│                                                                │
│  ⏰ All times shown in Mountain Time (MT)                      │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│         ◀  March 2026  ▶                                       │
│                                                                │
│   Sun   Mon   Tue   Wed   Thu   Fri   Sat                     │
│                                                                │
│                  1     2     3     4     5                     │
│                      (gray) (gray) (green) (green)            │
│                                                                │
│    6     7     8     9    10    11    12                      │
│  (gray)(green)(green)(gray)(green)(green)(gray)               │
│                                                                │
│   13    14   [15]   16    17    18    19                      │
│  (gray)(green) 1️⃣  (gray)(green)(green)(gray)                │
│                                                                │
│   ... (continues for full month)                              │
│                                                                │
│   [Hover on green day: tooltip shows "5 slots available"]     │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│  YOUR SELECTIONS:                                              │
│  1️⃣ Tue, Mar 15 at 2:00 PM                              ❌   │
│  2️⃣ Thu, Mar 17 at 10:00 AM                             ❌   │
│  3️⃣ (Select another date)                                     │
├───────────────────────────────────────────────────────────────┤
│  CAN'T FIND A GOOD TIME?                                       │
│  These artists with similar styles have availability:          │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ [Artist Img] │  │ [Artist Img] │  │ [Artist Img] │        │
│  │ Bob Johnson  │  │ Carol Davis  │  │ Dave Miller  │        │
│  │ Traditional  │  │ Japanese     │  │ Traditional  │        │
│  │ 12 slots     │  │ 8 slots      │  │ 15 slots     │        │
│  │ [Switch]     │  │ [Switch]     │  │ [Switch]     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

### Time Slot Modal (when day is clicked)

```
┌────────────────────────────────────────┐
│  Tuesday, March 15, 2026               │
│  ───────────────────────────────────   │
│                                        │
│  Available Appointments:               │
│                                        │
│  ○ 10:00 AM - 12:00 PM                │
│  ○ 2:00 PM - 6:00 PM                  │
│  ○ 3:30 PM - 6:00 PM                  │
│                                        │
│  [Click a time to select it]           │
│                                        │
│            [Close]                     │
└────────────────────────────────────────┘
```

### Visual Design Requirements

**Brand Alignment**:
- Must match existing booking form aesthetic (warm palette: burnt orange, terracotta, moss)
- Use same typography and spacing as current form sections
- Calendar should feel integrated, not like a plugin

**Accessibility**:
- Keyboard navigation: Arrow keys to navigate days, Enter to select
- Screen reader: Announce day availability status and slot counts
- Color contrast: Ensure green/gray distinction works for colorblind users
- Focus indicators: Visible outline on focused day cells

**Mobile Responsiveness**:
- Calendar should collapse to single-week view on mobile (<768px)
- Time slot modal becomes bottom sheet on mobile
- Alternative artist cards stack vertically on mobile

**Loading States**:
- Skeleton calendar while fetching cached data
- Spinner overlay during real-time validation
- Subtle pulse animation on selected slots during validation

---

## Artist Configuration Guide

### Adding Calendar Support to an Artist

**Step 1: Create Nextcloud Calendar**
1. Log into Nextcloud admin panel
2. Go to Calendar app
3. Create new calendar named `artist-{slug}` (e.g., `artist-alice-mercer`)
4. Set calendar permissions to private (only admin can edit)

**Step 2: Update Artist MDX Frontmatter**
```yaml
---
# ... existing frontmatter ...

# Calendar Integration (add these fields)
calendarId: "artist-alice-mercer"  # Must match Nextcloud calendar name
acceptingBookings: true             # Set to false to hide from booking form

schedule:
  monday: "10:00-18:00"
  tuesday: "10:00-18:00"
  wednesday: "closed"
  thursday: "10:00-20:00"
  friday: "10:00-18:00"
  saturday: "12:00-17:00"
  sunday: "closed"

bufferMinutes: 30  # Padding between appointments (default: 30)
---
```

**Step 3: Verify Integration**
1. Restart Astro dev server
2. Navigate to booking form
3. Select the artist from dropdown
4. Verify calendar loads in Step 3
5. Check browser console for any CalDAV errors

### Schedule Format Reference

**Time Format**: 24-hour format `"HH:MM-HH:MM"` (e.g., `"09:00-17:00"`)
**Closed Days**: Use `"closed"` (lowercase)
**Multiple Shifts**: Not supported in v1 - use single continuous block

**Example Schedules**:
```yaml
# Full-time artist
schedule:
  monday: "09:00-17:00"
  tuesday: "09:00-17:00"
  wednesday: "09:00-17:00"
  thursday: "09:00-17:00"
  friday: "09:00-17:00"
  saturday: "10:00-14:00"
  sunday: "closed"

# Part-time artist (3 days/week)
schedule:
  monday: "closed"
  tuesday: "12:00-20:00"
  wednesday: "closed"
  thursday: "12:00-20:00"
  friday: "closed"
  saturday: "10:00-18:00"
  sunday: "closed"
```

---

## Dependencies & Prerequisites

### Required Before Implementation

✅ **Nextcloud Instance**: Fully configured with CalDAV access
✅ **Artist Calendars**: One calendar created per artist in Nextcloud
✅ **Credentials**: Admin username/password for CalDAV authentication

### New Dependencies to Add

```json
{
  "dependencies": {
    "tsdav": "^2.0.5",      // CalDAV client library
    "ical.js": "^2.0.1"     // iCalendar format parsing
  }
}
```

### Environment Variables

Add to `.env`:
```env
# Nextcloud CalDAV Integration
NEXTCLOUD_CALDAV_URL=https://your-nextcloud.com/remote.php/dav/calendars/
NEXTCLOUD_USERNAME=admin_or_service_account
NEXTCLOUD_PASSWORD=secure_password_here
NEXTCLOUD_CALENDAR_PREFIX=artist-

# Cache Configuration
CALENDAR_CACHE_TTL_MINUTES=15
```

Add to `.env.example` (for documentation):
```env
NEXTCLOUD_CALDAV_URL=https://cloud.example.com/remote.php/dav/calendars/
NEXTCLOUD_USERNAME=your_username
NEXTCLOUD_PASSWORD=your_password
NEXTCLOUD_CALENDAR_PREFIX=artist-
CALENDAR_CACHE_TTL_MINUTES=15
```

---

## Implementation Phases

### Phase 1: Core CalDAV Integration (Week 1-2)
- [ ] Install dependencies (`tsdav`, `ical.js`)
- [ ] Create CalDAV service module (`src/services/caldav.ts`)
- [ ] Implement fetchCalendarEvents function
- [ ] Test connection to Nextcloud with sample artist calendar
- [ ] Parse iCal events into available/busy slots
- [ ] Apply working hours filter from MDX frontmatter

### Phase 2: Caching Layer (Week 2)
- [ ] Create cache service (`src/services/calendar-cache.ts`)
- [ ] Implement 15-minute TTL cache with JSON file storage
- [ ] Create background refresh API endpoint (`/api/refresh-calendars`)
- [ ] Add real-time validation on slot selection
- [ ] Test cache invalidation and refresh cycles

### Phase 3: Calendar UI Component (Week 3)
- [ ] Create `CalendarPicker.astro` component
- [ ] Build month view with day cells
- [ ] Implement hover tooltips for slot counts
- [ ] Add time slot selection modal/panel
- [ ] Support up to 3 ranked selections
- [ ] Add keyboard navigation and accessibility

### Phase 4: Integration with Booking Form (Week 3-4)
- [ ] Update `booking.astro` Step 3 to include calendar
- [ ] Replace/supplement text field with calendar
- [ ] Wire calendar to existing form submission
- [ ] Update email templates to include selected slots
- [ ] Test end-to-end booking flow

### Phase 5: Alternative Artists Feature (Week 4)
- [ ] Implement artist matching algorithm
- [ ] Create alternative artist suggestion cards
- [ ] Add "switch artist" functionality
- [ ] Test with various style combinations

### Phase 6: Error Handling & Fallback (Week 4)
- [ ] Implement CalDAV error detection
- [ ] Create fallback UI to text field
- [ ] Add error logging and monitoring
- [ ] Test various failure scenarios

### Phase 7: Polish & Testing (Week 5)
- [ ] Mobile responsive testing
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Cross-browser testing
- [ ] Performance optimization (reduce CalDAV calls)
- [ ] Update `dev/continuity.md` with implementation notes

---

## Out of Scope (v1)

The following features are **explicitly excluded** from the initial implementation:

❌ **Automated Booking Confirmation**
   - Selected slots do NOT create confirmed appointments
   - Still requires receptionist/artist approval (existing workflow)

❌ **Slot Blocking/Holds**
   - Selecting a slot does NOT reserve it temporarily
   - Multiple clients can select the same slot (first approved wins)

❌ **Artist Dashboard**
   - No artist-facing UI to view pending bookings or manage calendar
   - Artists still manage calendars directly in Nextcloud

❌ **Database Persistence**
   - No database for storing bookings (still email-only)
   - Calendar data cached temporarily only

❌ **Multi-Artist Calendars**
   - Cannot show availability across multiple artists simultaneously
   - "No preference" selection shows generic message, not aggregated calendar

❌ **SMS Notifications**
   - No text message reminders for selected slots
   - Email notifications only (existing functionality)

❌ **Client Timezone Conversion**
   - All times shown in Mountain Time (MT) only
   - No automatic conversion to client's local timezone

❌ **Recurring Appointments**
   - No support for multi-session bookings
   - Single appointment selection only (matches existing scope)

❌ **Admin Calendar Management UI**
   - No web interface to edit artist schedules
   - Must edit MDX frontmatter manually for schedule changes

---

## Open Questions & Future Considerations

### Questions for Stakeholders

1. **Calendar Ownership**: Should receptionists have permission to edit artist calendars in Nextcloud, or only artists themselves?

2. **Slot Duration Display**: Should we show estimated session durations in the time slot picker (e.g., "2:00 PM - 2 hour session") even though duration isn't enforced?

3. **Holiday Closures**: How should studio-wide closures (holidays, events) be handled? Separate "shop calendar" that blocks all artists?

4. **Waiting List**: If an artist is fully booked, should we offer a "notify me when slots open" feature?

5. **Calendar Sync Direction**: Should approved bookings (from future approval workflow) automatically create events in Nextcloud, or remain manual entry?

### Future Enhancements (v2+)

- **Database Integration**: Migrate from email-only to persistent booking storage
- **Approval Workflow Integration**: Auto-update CalDAV when receptionist approves a booking
- **Client Portal**: Let clients view/reschedule their confirmed appointments
- **Multi-timezone Support**: Auto-detect and convert to client's timezone
- **Artist Dashboard**: Web UI for artists to view pending requests and manage availability
- **Advanced Matching**: Factor in artist specialization scores when suggesting alternatives
- **Booking Analytics**: Track which time slots are most popular, conversion rates by artist

---

## Appendices

### A. CalDAV Response Example

```xml
<C:calendar-data xmlns:C="urn:ietf:params:xml:ns:caldav">
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nextcloud//CalDAV//EN
BEGIN:VEVENT
UID:abc123@nextcloud
DTSTART:20260315T140000Z
DTEND:20260315T180000Z
SUMMARY:Client Session - John Doe
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
</C:calendar-data>
```

### B. Artist MDX Schema Reference

```typescript
// src/content/config.ts (extend existing artist schema)
const artistCollection = defineCollection({
  schema: z.object({
    // ... existing fields ...

    // Calendar Integration Fields
    calendarId: z.string().optional(), // Nextcloud calendar identifier
    acceptingBookings: z.boolean().default(true),
    schedule: z.object({
      monday: z.union([z.string(), z.literal("closed")]),
      tuesday: z.union([z.string(), z.literal("closed")]),
      wednesday: z.union([z.string(), z.literal("closed")]),
      thursday: z.union([z.string(), z.literal("closed")]),
      friday: z.union([z.string(), z.literal("closed")]),
      saturday: z.union([z.string(), z.literal("closed")]),
      sunday: z.union([z.string(), z.literal("closed")]),
    }).optional(),
    bufferMinutes: z.number().default(30),
  }),
});
```

### C. Email Template Variables

Add to existing booking email templates:

```typescript
interface BookingEmailData {
  // ... existing fields ...

  // New calendar fields
  selectedSlots?: Array<{
    rank: 1 | 2 | 3;
    date: string;        // "2026-03-15"
    startTime: string;   // "14:00"
    displayDate: string; // "Tuesday, March 15, 2026"
    displayTime: string; // "2:00 PM MT"
  }>;
  usedFallback?: boolean; // true if calendar failed and text field was used
}
```

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | Requirements Interview | Initial PRD creation based on stakeholder interview |

---

## Approval & Sign-off

**Product Owner**: _[Pending]_
**Technical Lead**: _[Pending]_
**Estimated Effort**: 4-5 weeks (1 developer)
**Priority**: High (improves booking conversion and reduces manual work)

---

_This PRD serves as the source of truth for CalDAV calendar integration. All implementation decisions should reference this document. For questions or change requests, update this PRD and increment the version number._
