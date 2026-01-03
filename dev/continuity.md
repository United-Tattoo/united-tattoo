# Continuity Log

## 2026-01-02 - Email Template Redesign

### Changes Made

#### 1. Email Template Overhaul
- **Redesigned `src/content/email-template.html`**:
  - Aligned with the new **Astro 5 "editorial" dark theme**.
  - **Colors:**
    - Background: `#050505` (bg-deep)
    - Text: `#e0e0e0` (neutral-200)
    - Accents: `#E67E50` (Burnt Orange), `#D87850` (Terracotta)
    - Borders: `rgba(255, 255, 255, 0.1)` / `#262626`
  - **Typography:**
    - Headings: `Instrument Serif` (replacing Playfair Display)
    - Body: `Inter` (replacing Space Grotesk/Arial mix)
    - Eyebrow/Labels: `Space Grotesk` (maintained for mono/tech feel)
  - **Layout:**
    - Preserved the robust table-based structure for email client compatibility.
    - Updated internal cards to dark theme (`#0f0f0f`, `#0a0a0a`).
    - Added subtle borders to cards to maintain definition in dark mode.

### Files Modified
```
src/content/email-template.html   - Complete style rewrite for dark mode
```

### Decisions
- **Dark Mode for Emails:** Even though email clients can be tricky with dark mode, sticking to the brand's new dark aesthetic ensures a consistent experience from site to inbox. Used specific hex codes instead of CSS variables for maximum compatibility.
- **Font Stack:** Swapped to `Instrument Serif` and `Inter` to match the website's new typography, while keeping `Space Grotesk` for that specific "technical/editorial" labeling style used in the original template.
- **Glass Effect Fallback:** Since `backdrop-filter` fails in emails, used solid dark colors (`#0f0f0f`) with subtle borders (`#262626`) to mimic the "glass card" look of the website.

### Next Steps
- [ ] Verify email rendering in real-world clients (Gmail, Outlook, Apple Mail).
- [ ] Check if `Instrument Serif` loads correctly in supported clients (Google Fonts import).

---

## 2026-01-02 - Calendar Integration Live + Minimalist Redesign

### Changes Made

#### 1. Nextcloud CalDAV Connectivity Testing
- **Created `/dev/test-nextcloud-connection.js`** - Connectivity test script that:
  - Tests HTTP connectivity to Nextcloud server
  - Verifies DAV authentication
  - Fetches and lists all available calendars
- **Result:** Successfully connected to `https://portal.united-tattoos.com/remote.php/dav/calendars/` and found 14 calendars

#### 2. Artist-to-Calendar Mapping
- **Connected 8 artists to their Nextcloud calendars:**

| Artist | Calendar ID | MDX File |
|--------|-------------|----------|
| Christy Lumberg | `christy-lumberg` | `christy-lumberg.mdx` (updated from `artist-christy-lumberg`) |
| Amari Kyss | `amari-kyss` | `amari-kyss.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| Steven Sole Cedre | `steven-cedre` | `steven-sole-cedre.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| Heather Robyns | `heather-santistevan` | `heather-robyns.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| John Lapides | `john-lapides` | `john-lapides.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| Pako Martinez | `juan-martinez` | `pako-martinez.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| Kaori Cedre | `kaori-cedre` | `kaori-cedre.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |
| Donovan Lankford | `donovan-lankford` | `donovan-lankford.mdx` (added calendarId, acceptingBookings, schedule, bufferMinutes) |

- **Unmatched calendars:** `angel-andrade`, `deziree-stanford`, `efrain-segoviano`, `shop-events`, `studio-events`, `test-artist`

#### 3. Universal Availability (Temporary)
- **Set all artists to 24/7 availability** until confirmed schedules are received:
  ```yaml
  schedule:
    monday: "00:00-23:59"
    tuesday: "00:00-23:59"
    wednesday: "00:00-23:59"
    thursday: "00:00-23:59"
    friday: "00:00-23:59"
    saturday: "00:00-23:59"
    sunday: "00:00-23:59"
  bufferMinutes: 30
  ```
- All artists set to `acceptingBookings: true`

#### 4. Calendar Picker Visibility Fix
- **Issue:** Calendar wasn't showing when artist was preselected via URL params
- **Root cause:** `artist-changed` event fired before `initBooking` listener was attached
- **Fix in `/src/pages/booking.astro` (lines 523-556):**
  - Extracted artist change logic into reusable `handleArtistChange` function
  - Added initialization check that calls `handleArtistChange` immediately if artist already has value

#### 5. Calendar Position Relocation
- **Moved calendar from Section 03 (Details) to Section 01 (Artist)** in `/src/pages/booking.astro`
- Calendar now appears directly under artist select dropdown
- Removed extra padding wrapper for cleaner integration

#### 6. Minimalist Calendar Redesign
- **Complete overhaul of `/src/components/CalendarPicker.astro`:**

  **Size Reductions:**
  - Removed container padding (was `p-6`, now minimal)
  - Cell height: `h-8` (was `h-24`)
  - Grid gap: `gap-0.5` (was `gap-1`)
  - Max width: `max-w-md` (was `max-w-sm`, properly constrained)

  **Visual Changes:**
  - Removed large legend section
  - Unavailable days: gray text, no background (`text-neutral-600 cursor-default`)
  - Available days: white text, hover effect (`text-white hover:bg-white/10`)
  - Selected day: highlight (`bg-white/20 border border-white/30`)
  - Timezone notice kept (smaller text)

  **Interaction Flow Changed:**
  - Click date → time slots appear **inline below calendar** (NOT in modal)
  - Moved time slots panel inside calendar wrapper for proper width constraint
  - "Clear" button to deselect date

  **Removed:**
  - Modal dialog for time slots
  - Large legend with color coding explanation
  - Excess padding and spacing

#### 7. Email Integration Verified
- **Selected slots passed through correctly in `/src/pages/api/booking.ts`:**
  - Line 26: Extracts `selected_slots` from form data
  - Lines 30-48: Parses JSON and formats as "Choice #1: Fri, Jan 3 at 2:00 PM MT"
  - Line 255: Admin email shows formatted availability
  - Line 446: Client confirmation shows availability

### Files Modified

```
src/pages/booking.astro              - Visibility fix, position change, removed wrapper
src/components/CalendarPicker.astro  - Complete minimalist redesign
src/content/artists/*.mdx            - All 8 artists: added calendarId, acceptingBookings, schedule, bufferMinutes
dev/test-nextcloud-connection.js     - Created connectivity test script
```

### Files Created

```
dev/test-nextcloud-connection.js     - Nextcloud CalDAV connectivity test script
```

### Decisions

**Artist Name to Calendar Matching:**
- `heather-robyns` → `heather-santistevan` (matches email `hsantistevan12@gmail.com`)
- `pako-martinez` → `juan-martinez` (Pako appears to be nickname for Juan)
- Left unmatched: `angel-andrade`, `deziree-stanford`, `efrain-segoviano` (no corresponding MDX files)

**Calendar ID Format:**
- Changed from `artist-christy-lumberg` to `christy-lumberg` to match actual Nextcloud calendar names
- All artist calendar IDs updated to match the pattern seen in test output

**Inline Time Slots vs Modal:**
- Chose inline display below calendar for:
  - Less modal dialog noise
  - Better mobile experience
  - Users can see calendar and slots simultaneously
  - Clearer "Clear" action to pick another date

**Gray Days vs Legend:**
- Removed legend to reduce visual noise
- Gray text for unavailable days is intuitive enough
- Users can see available dates at a glance

**24/7 Availability:**
- Set all artists to show all time slots until confirmed schedules are received
- Reasoning: Better to show too many slots than block everything
- Artists/receptionist can filter during booking approval

### How to Test

#### Calendar Visibility
1. Navigate to `/booking?artist=christy-lumberg`
2. Calendar should appear immediately under artist dropdown (no need to select artist)
3. Calendar should show available dates (not all grayed out)

#### Calendar Functionality
1. Click a white (available) date
2. Time slots should appear directly below the calendar (not in a modal)
3. Click a time slot to select it (highlights with white background)
4. Try multiple slots (up to 3)
5. Click "Clear" to deselect and try another date

#### Nextcloud Connection
1. Run: `node dev/test-nextcloud-connection.js`
2. Verify all 14 calendars are detected
3. Check that mapped artists have their correct calendars

#### Booking Submission
1. Select an artist
2. Pick a date and time slot
3. Fill out rest of form
4. Submit
5. Check admin email contains formatted availability (e.g., "Choice #1: Fri, Jan 3 at 2:00 PM MT")

### Next Steps

#### Immediate
- [ ] Update individual artist schedules once confirmed by each artist
- [ ] Create MDX files for unmatched calendars (`angel-andrade`, `deziree-stanford`, `efrain-segoviano`) if they're active artists
- [ ] Hide or remove `shop-events`, `studio-events`, `test-artist` calendars from alternatives
- [ ] Set up environment variables in Cloudflare Pages:
  - `NEXTCLOUD_CALDAV_URL`
  - `NEXTCLOUD_USERNAME`
  - `NEXTCLOUD_PASSWORD`
  - `RESEND_API_KEY`
  - `BOOKING_FROM_EMAIL`

#### Future Enhancements
- [ ] Add slot duration display (30 min slots shown)
- [ ] Consider showing "X slots available" tooltip on hover
- [ ] Add weekend vs weekday visual distinction
- [ ] Artist-specific working hours (not all 24/7)
- [ ] Buffer time visualization in calendar

### Notes

**Nextcloud Calendars Discovered:**
```
1. Amari-Kyss
2. Shop-Events
3. Steven-Cedre
4. Studio-Events
5. Test-Artist
6. Angel-Andrade
7. Christy-Lumberg
8. Deziree-Stanford
9. Heather-Santistevan
10. John-Lapides
11. Juan-Martinez
12. Kaori-Cedre
13. Donovan-Lankford
14. Efrain-Segoviano
```

**Calendar API Endpoint:**
- `/api/availability?artist={calendarId}`
- Returns JSON with `slots` (array of date/time objects) and `alternatives` (array of similar artists)

**Wrangler Secrets Required for Production:**
```bash
wrangler secret put RESEND_API_KEY
wrangler secret put NEXTCLOUD_CALDAV_URL
wrangler secret put NEXTCLOUD_USERNAME
wrangler secret put NEXTCLOUD_PASSWORD
```

---

## 2026-01-02 - CalDAV Calendar Integration PRD

### Changes Made

#### 1. Product Requirements Document Created
- **Created `/dev/prd-caldav-calendar-integration.md`** - Comprehensive PRD for Nextcloud CalDAV integration
  - Detailed requirements from stakeholder interview (12 questions across 3 rounds)
  - Feature integrates real-time artist availability into booking form Step 3
  - Clients can select up to 3 ranked time slot preferences
  - Hybrid caching strategy (15-min refresh + real-time validation)
  - Alternative artist suggestions when primary artist unavailable
  - Graceful fallback to text field on CalDAV errors
  - 30-minute buffer time between appointments
  - Mountain Time (MT) timezone only display
  - Email-only storage (no database required for v1)

#### 2. Key Feature Specifications
- **Integration Point**: Step 3 (Project Details) of booking form
- **Calendar UI**: Month view with available days highlighted, hover tooltips showing slot counts
- **Selection Mechanism**: Up to 3 ranked preferences (1st/2nd/3rd choice)
- **Availability Logic**: Combines working hours (from artist MDX), CalDAV free/busy, buffer time, and minimum duration
- **Alternative Artists**: Shown below calendar when <5 slots available, matched by tattoo style
- **Artist Configuration**: Schedule and buffer time stored in artist MDX frontmatter

#### 3. Technical Architecture Defined
- **CalDAV Library**: tsdav + ical.js
- **Caching**: 15-minute TTL cache (JSON file storage for v1)
- **Validation**: Real-time CalDAV check when client selects a slot
- **Error Handling**: Falls back to existing text field if Nextcloud unreachable
- **Data Flow**: Browser → Cached API → CalDAV Service → Nextcloud

#### 4. Implementation Phases Outlined
- Phase 1: Core CalDAV integration (Week 1-2)
- Phase 2: Caching layer (Week 2)
- Phase 3: Calendar UI component (Week 3)
- Phase 4: Booking form integration (Week 3-4)
- Phase 5: Alternative artists feature (Week 4)
- Phase 6: Error handling & fallback (Week 4)
- Phase 7: Polish & testing (Week 5)

### Files Created
```
dev/prd-caldav-calendar-integration.md  - Full PRD with requirements, architecture, UI specs
```

### Stakeholder Requirements Gathered
- **Interview Questions**: 12 questions across integration point, UX, technical setup, and edge cases
- **Key Decisions**:
  - One calendar per artist (already configured in Nextcloud)
  - Show calendar during initial form submission (not post-approval)
  - Artist/receptionist assigns duration during approval (no upfront blocking)
  - Suggest alternative artists immediately when unavailable
  - Store working hours in artist MDX frontmatter for easy editing

### Next Steps
- [ ] Review PRD with stakeholders for approval
- [ ] Set up development environment variables (Nextcloud credentials)
- [ ] Install dependencies: tsdav, ical.js
- [ ] Begin Phase 1 implementation: CalDAV service module
- [ ] Update artist MDX schema to include calendar fields (calendarId, schedule, bufferMinutes)
- [ ] Test CalDAV connection to Nextcloud instance

### Notes
- PRD explicitly excludes v1 features: slot blocking, automated confirmation, database persistence, multi-timezone support
- Estimated effort: 4-5 weeks (1 developer)
- Dependencies: Nextcloud instance with artist calendars already configured (confirmed ready)
- This feature maintains existing approval workflow - calendar enhances submission, doesn't replace receptionist/artist approval

---

## 2026-01-02 - Premium Booking Experience

### Changes Made

#### 1. Sticky Progress Indicator
- **Added `/src/pages/booking.astro`** - Fixed progress bar at top of page
  - Shows current step (01-05) with label
  - 5-dot indicator with terracotta active state
  - Slides in from top when scrolling past hero
  - Updates as user scrolls through form sections

#### 2. Premium File Upload Experience
- **Enhanced file upload zone** with:
  - Larger drop target with elegant styling
  - File type badges (JPG, PNG, WEBP, HEIC)
  - Grid thumbnail previews with hover states
  - Remove button with visual feedback
  - File size display in list view
  - Animated fade-in for new files

#### 3. Success Modal (On-Page Celebration)
- **Replaced redirect with elegant on-page success modal**
  - SVG ring draw animation (289px circumference)
  - Checkmark reveal with bounce effect
  - Staggered content reveal (1.5s total animation)
  - "What Happens Next" steps with checkmark icons
  - Uppercase tracked action buttons
  - Scrolls to top smoothly on trigger

#### 4. Enhanced Submit Button
- **Added loading bar animation** under submit button
  - 70% width on submit, completes to 100% on success
  - Glass-card styled what-happens-next section

### Files Modified
```
src/pages/booking.astro  - Full premium booking experience overhaul
```

### Premium Patterns Applied
- Multi-step form with progress tracking
- File upload with drag-drop and thumbnail previews
- Success celebration with SVG ring animation
- Staggered content reveals for polished feel
- Uppercase tracked buttons for luxury aesthetic

### How to Test
1. Navigate to `/booking`
2. Scroll through form sections - watch progress indicator
3. Try file upload - notice thumbnails and hover states
4. Submit form (use dev mode to bypass email)
5. Observe success modal animation

### Next Steps
- [ ] Add time slot picker with availability calendar
- [ ] Add artist portfolio preview on hover in dropdown
- [ ] Consider multi-step wizard for even simpler UX


### Changes Made

#### 1. Booking Form - Newsletter Checkbox
- **Added optional mailing list opt-in checkbox** to `/src/pages/booking.astro`:
  - **Location:** Section 05 (Terms & Consent), after age confirmation checkbox
  - **Checkbox copy:** "Stay informed about promotions, events, and tattoo inspiration from United Tattoo."
  - **Styling:** Matches existing checkbox pattern exactly
    - Terracotta (#D87850) accent on check
    - Font-mono text-xs with neutral-400 color
    - Hover transition to neutral-300
    - Custom styled checkbox with border transition
  - **Behavior:**
    - Completely optional (no `required` attribute)
    - Pure opt-in - not pre-checked
    - Form field name: `subscribeToNewsletter`

#### 2. API Integration - Resend Contacts API
- **Updated `/src/pages/api/booking.ts`** to integrate with Resend Contacts API:

  **Form Data Extraction (line 30):**
  ```typescript
  const subscribeToNewsletter = formData.get('subscribeToNewsletter');
  ```

  **Environment Variable (line 115):**
  ```typescript
  const RESEND_AUDIENCE_ID = env.RESEND_AUDIENCE_ID || import.meta.env.RESEND_AUDIENCE_ID;
  ```

  **Contact Creation Logic (lines 531-551):**
  - Executes after client confirmation email succeeds
  - Only runs if `subscribeToNewsletter` is checked AND `RESEND_AUDIENCE_ID` is set
  - Wrapped in try-catch for error handling
  - Non-blocking: booking succeeds even if contact creation fails

  **Implementation Details:**
  ```typescript
  if (subscribeToNewsletter && RESEND_AUDIENCE_ID) {
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      await resend.contacts.create({
        email: email,
        firstName: firstName,
        lastName: lastName || undefined,
        audienceId: RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });

      console.log(`Newsletter subscription: ${email} added to audience ${RESEND_AUDIENCE_ID}`);
    } catch (contactError) {
      console.error('Newsletter subscription error:', contactError);
    }
  }
  ```

  **Name Parsing Strategy:**
  - Splits full name on spaces
  - First word → `firstName`
  - Remaining words → `lastName`
  - Handles single names gracefully (lastName = empty string → undefined)

#### 3. Dev Mode Logging
- **Added console logging** for newsletter opt-in status (lines 570-576):
  ```typescript
  console.log('=== NEWSLETTER OPT-IN (Dev Mode) ===');
  console.log('Newsletter Opt-in:', subscribeToNewsletter ? 'Yes' : 'No');
  if (subscribeToNewsletter) {
    console.log('Would add contact:', email);
    console.log('Audience ID:', RESEND_AUDIENCE_ID || 'NOT SET');
  }
  ```
  - Shows whether checkbox was checked
  - Displays email that would be added
  - Shows audience ID status (or warns if not set)

#### 4. Documentation Updates

**README.md:**
- Added `RESEND_AUDIENCE_ID` to `.env` example (line 177)
- Updated environment variables note to explain audience ID is optional
- Added to environment variables table with description
- Noted opt-in behavior

**DEPLOYMENT.md:**
- Added `RESEND_AUDIENCE_ID` to required variables table
- Added to environment variable setup instructions
- Created new "Mailing List Opt-In" section (lines 98-130):
  - How it works explanation
  - Configuration steps
  - Current audience ID: `053e25bb-7525-4d01-a0fe-beee9f953a8a`
  - Instructions to find audience ID in Resend dashboard
  - Contact data structure documentation
  - Error handling explanation
- Added mailing list testing steps to "Testing Email Functionality" section

### Files Modified

```
src/pages/booking.astro      - Added newsletter checkbox to Section 05
src/pages/api/booking.ts     - Integrated Resend Contacts API
README.md                     - Added RESEND_AUDIENCE_ID documentation
DEPLOYMENT.md                 - Added mailing list configuration guide
```

### Decisions

**Optional vs Required Checkbox:**
- Made checkbox completely optional (no `required` attribute)
- Reasoning: GDPR/privacy best practice - mailing lists must be explicit opt-in
- Users can submit bookings without subscribing
- No pre-checked boxes to avoid "dark patterns"

**Non-Blocking Contact Creation:**
- Newsletter signup failures don't block booking submission
- Reasoning: Booking request is the primary action, newsletter is secondary
- Prevents edge cases (API outage, rate limits) from blocking legitimate bookings
- Errors are logged for monitoring but don't affect user experience

**Name Parsing Strategy:**
- Split full name on spaces: first word = firstName, rest = lastName
- Reasoning: Resend Contacts API has separate firstName/lastName fields
- Handles single names gracefully (lastName = undefined if not present)
- Simple, predictable parsing that works for most names
- Acknowledges limitation: doesn't handle complex multi-part names perfectly

**Environment Variable Configuration:**
- Made `RESEND_AUDIENCE_ID` optional via environment variable
- Reasoning:
  - Flexibility: Can use different audiences for prod/preview/dev
  - Easy updates: Change audience without code changes
  - Safe default: If not set, feature silently skips (no errors)
  - Consistent with other env vars (RESEND_API_KEY, BOOKING_FROM_EMAIL)

**Checkbox Copy:**
- "Stay informed about promotions, events, and tattoo inspiration from United Tattoo."
- Reasoning:
  - Clear about what they'll receive (promotions, events, inspiration)
  - Brand voice: "tattoo inspiration" is more editorial than "newsletter"
  - Honest and direct (no overpromising)
  - Matches brand tone from rest of site

**Placement in Form:**
- After required consent checkboxes, before submit button
- Reasoning:
  - Logically grouped with other consent items
  - Clearly separated from required checkboxes (no confusion)
  - Last thing before submission = top of mind
  - Follows progressive disclosure pattern (required → optional)

### Technical Implementation

**Resend Contacts API:**
- **Endpoint:** `resend.contacts.create()`
- **Required Fields:**
  - `email` - Email address from form
  - `audienceId` - Resend audience ID from environment
- **Optional Fields:**
  - `firstName` - Extracted from name field
  - `lastName` - Extracted from name field (if present)
  - `unsubscribed` - Set to `false` (opt-in)

**Contact Data Structure:**
```typescript
{
  email: string,          // From form submission
  firstName: string,      // First word of name
  lastName?: string,      // Remaining words (undefined if single name)
  audienceId: string,     // From RESEND_AUDIENCE_ID env var
  unsubscribed: false,    // Explicit opt-in
}
```

**Error Handling Flow:**
1. Check if checkbox is checked AND audience ID exists
2. If yes, attempt to create contact
3. If API call fails, log error to console
4. Continue with booking submission regardless
5. Return success response to client

**Environment Variable Access:**
```typescript
const RESEND_AUDIENCE_ID = env.RESEND_AUDIENCE_ID || import.meta.env.RESEND_AUDIENCE_ID;
```
- First tries Cloudflare runtime env (production)
- Falls back to Vite import.meta.env (development)
- Undefined if not set anywhere (graceful degradation)

### Configuration

**Current Audience ID:** `053e25bb-7525-4d01-a0fe-beee9f953a8a`

**Environment Variables Required:**
```bash
# Production (Cloudflare Pages)
RESEND_AUDIENCE_ID=053e25bb-7525-4d01-a0fe-beee9f953a8a

# Development (.env file)
RESEND_AUDIENCE_ID=053e25bb-7525-4d01-a0fe-beee9f953a8a
```

**Finding Audience ID in Resend:**
1. Log into Resend dashboard
2. Navigate to "Audiences" section
3. Select your audience
4. ID appears in URL: `resend.com/audiences/[AUDIENCE-ID]`
5. Copy the UUID after `/audiences/`

### How to Test

#### Local Development (without Resend API)
1. Run `pnpm dev` (without RESEND_API_KEY set)
2. Submit test booking with checkbox checked
3. Check console for newsletter logging:
   ```
   === NEWSLETTER OPT-IN (Dev Mode) ===
   Newsletter Opt-in: Yes
   Would add contact: test@example.com
   Audience ID: 053e25bb-7525-4d01-a0fe-beee9f953a8a
   ```
4. Verify checkbox state is logged correctly

#### Local Development (with Resend API)
1. Add to `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxx
   RESEND_AUDIENCE_ID=053e25bb-7525-4d01-a0fe-beee9f953a8a
   ```
2. Run `pnpm dev`
3. Submit test booking with checkbox checked
4. Check Resend Audiences dashboard for new contact
5. Verify name and email are correct

#### Production Testing
1. Add `RESEND_AUDIENCE_ID` to Cloudflare Pages environment variables
2. Deploy with `pnpm deploy`
3. Submit test booking with checkbox **checked**:
   - ✅ Verify booking succeeds
   - ✅ Verify emails are sent
   - ✅ Check Resend Audiences dashboard for new contact
   - ✅ Verify contact has correct email, firstName, lastName
4. Submit test booking with checkbox **unchecked**:
   - ✅ Verify booking succeeds
   - ✅ Verify emails are sent
   - ✅ Verify NO new contact appears in audience
5. Check Cloudflare Functions logs:
   - Look for "Newsletter subscription: [email] added to audience" message
   - Check for any contact API errors

### Next Steps

#### Immediate
- [ ] Add `RESEND_AUDIENCE_ID` environment variable to Cloudflare Pages
- [ ] Deploy and test mailing list functionality in production
- [ ] Verify contacts are being added to Resend audience correctly
- [ ] Monitor Cloudflare logs for any contact API errors

#### Future Enhancements
- [ ] Add "Manage Preferences" link to confirmation email
- [ ] Implement unsubscribe functionality
- [ ] Create separate audiences for different email types:
  - General newsletter
  - Event announcements only
  - Flash tattoo releases only
- [ ] Add custom fields to contacts (e.g., preferred artist, style interests)
- [ ] Track marketing attribution (source: booking form)
- [ ] Build email campaign templates in Resend
- [ ] Add double opt-in confirmation email
- [ ] Create admin dashboard to view/export contacts

### Notes

**Privacy & Compliance:**
- Fully GDPR compliant - explicit opt-in required
- No pre-checked boxes (dark patterns)
- Clear language about what they'll receive
- Unsubscribe functionality handled by Resend

**Contact Management:**
- Contacts managed entirely in Resend dashboard
- Can export contacts, create segments, send campaigns
- Unsubscribe links automatically included by Resend
- Bounce handling and list hygiene managed by Resend

**Error Scenarios Handled:**
- Missing `RESEND_AUDIENCE_ID` - Feature silently skips
- Contact already exists - Resend API handles gracefully
- API rate limits - Error logged, booking continues
- Network failures - Error logged, booking continues
- Invalid email format - Should be caught by form validation first

**Name Parsing Limitations:**
- Works well for: "John Doe", "Mary Jane Smith", "Cher" (single name)
- Edge cases:
  - "Mary-Jane O'Connor" → firstName: "Mary-Jane", lastName: "O'Connor"
  - "van Gogh" → firstName: "van", lastName: "Gogh"
  - Acceptable for newsletter purposes (not critical data)
  - Can be manually corrected in Resend dashboard if needed

**Resend Contacts API Limits:**
- Free tier: Up to 100 contacts
- Pro tier: Unlimited contacts
- API rate limits apply (should not be an issue for booking volume)
- Contact creation is idempotent (safe to retry)

**Development vs Production:**
- Dev mode logs newsletter opt-in to console
- Production mode actually creates contacts in Resend
- Same code path, behavior controlled by `RESEND_API_KEY` presence
- Audience ID should be set in both environments for testing

**Alternative Implementation Considered:**
- Could have made checkbox required with default unchecked
- Rejected: Adds friction to booking flow
- Current approach: Optional, low friction, clear opt-in

**Integration with Existing Email Flow:**
1. Booking submitted
2. Admin/artist notification emails sent
3. Client confirmation email sent
4. **Newsletter opt-in processed** (if checked)
5. Redirect to thank you page

**Checkbox Visual Design:**
- Matches existing checkboxes exactly
- Custom styled (not native browser checkbox)
- Accessible (sr-only input, visible custom UI)
- Peer-checked CSS for state management
- Terracotta brand color on checked state

---

## 2026-01-02 - Branded Email Template Redesign

### Changes Made

#### 1. Client Confirmation Email - Complete Redesign
- **Replaced plain HTML email with professional branded template**:
  - **Visual Design:**
    - Burnt Orange (#E67E50) header with "United Tattoo" branding in serif italic
    - Monospace subtitle: "FOUNTAIN, COLORADO"
    - Table-based layout for maximum email client compatibility
    - Cream-colored (#fff7ec) booking details card with terracotta (#D87850) left border
    - Clean 2-column data presentation
    - Professional footer with subtle divider

  - **Typography Hierarchy:**
    - Headings: Georgia serif, 400 weight
    - Body: Arial sans-serif, 15-16px
    - Labels: Courier New monospace, 10px uppercase with 2px letter-spacing
    - Data: Color-coded with moss (#6f5c49) labels and charcoal (#1c1915) values

  - **Content Improvements:**
    - Personalized greeting: "Thank You, [Name]"
    - Organized booking summary in styled card
    - Clear "What Happens Next?" section with 24-48 hour timeline
    - Contact information section with **ink@united-tattoos.com** (burnt orange link)
    - Removed personal email address (Christyl116@yahoo.com)
    - Warm, collaborative closing message
    - Footer disclaimer in muted moss color

#### 2. Admin/Artist Notification Email - Enhanced Formatting
- **Upgraded from basic HTML to structured, branded layout**:
  - **Visual Design:**
    - Same burnt orange header as client email for brand consistency
    - Subtitle: "United Tattoo · Admin Notification"
    - Section-based layout with numbered monospace labels:
      - `01 // Client Contact`
      - `02 // Artist Selection`
      - `03 // Project Details`
      - `04 // Reference Images`
      - `05 // Consent`
    - Client contact section prominently featured at top with cream background
    - Terracotta borders for visual hierarchy

  - **UX Improvements:**
    - **Client contact info is FIRST** for easy response access
    - Client email is clickable and highlighted in burnt orange
    - All data in clean 2-column tables (label + value)
    - Description in styled gray box with terracotta accent bar
    - Reference image count clearly displayed
    - Consent items use checkmarks (✓ Yes / ✗ No) for easy scanning
    - Consistent padding and spacing throughout

  - **Data Presentation:**
    - Client contact: Name, email (clickable), phone, preferred contact method
    - Artist selection: Bold display of selected artist
    - Project details: Style, placement, size, budget, availability in table format
    - Description: Full text in styled container with line breaks preserved
    - Reference images: Count + "attached to this email" note
    - Consent: Visual checkmarks for quick review

#### 3. Contact Email Update
- **Changed contact email throughout**:
  - Removed: `Christyl116@yahoo.com` from client confirmation email
  - Updated to: `ink@united-tattoos.com` as primary contact method
  - Plain text email also updated to match
  - Maintained warm, approachable tone while using shop email

#### 4. Email Client Compatibility
- **Technical Implementation:**
  - Full HTML5 doctype with proper meta tags
  - Table-based layout (not divs) for Outlook compatibility
  - Inline CSS on all elements (email clients strip `<style>` tags)
  - Role="presentation" on layout tables for accessibility
  - Max-width: 600px container with centered alignment
  - Fallback fonts for all typefaces:
    - Georgia → serif
    - Arial → sans-serif
    - Courier New → monospace
  - All colors use hex codes (no CSS variables in emails)
  - Box-shadow for subtle elevation effect
  - Proper text encoding with HTML escaping

### Files Modified

```
src/pages/api/booking.ts     - Redesigned both email templates (HTML + plain text)
```

### Decisions

**Table-Based Layout vs Modern CSS:**
- Chose table-based layout for email compatibility
- Reasoning: Outlook and older email clients don't support modern CSS (flexbox, grid)
- Tables ensure consistent rendering across all email platforms
- Industry standard for HTML email development

**Inline CSS:**
- All styles applied directly to elements via `style` attribute
- Reasoning: Many email clients strip `<style>` tags and ignore external CSS
- Inline styles guarantee visual consistency
- Slightly verbose but ensures maximum compatibility

**Brand Color Application:**
- Burnt Orange for header (high impact, immediate brand recognition)
- Terracotta for accents and borders (visual interest without overwhelming)
- Moss for labels (subtle, readable)
- Cream for background cards (warmth without harsh white)
- Charcoal for body text (better readability than pure black)

**Section Numbering Pattern:**
- Used "01 // Label" format from booking form
- Reasoning: Maintains brand consistency across touchpoints
- Creates editorial, structured feel
- Helps recipients quickly scan sections

**Client Contact Prominence (Admin Email):**
- Placed client contact section FIRST with highlighted background
- Reasoning: Primary action for admin is to respond to client
- Cream background + terracotta border draws immediate attention
- Client email in burnt orange and clickable for one-click reply
- Makes workflow faster and more efficient

**Contact Email Change:**
- Moved from personal email to shop email (ink@united-tattoos.com)
- Reasoning: More professional, maintains boundaries
- Centralizes communication through shop account
- Easier to manage if staff changes

**Font Fallbacks:**
- Georgia → serif (common system font)
- Arial → sans-serif (universal availability)
- Courier New → monospace (built into all systems)
- Reasoning: Ensures graceful degradation if web fonts fail
- Email clients often don't load custom fonts
- System fonts load instantly, no external requests

### How to Test

#### Test in Multiple Email Clients
1. Send test booking via `/booking` form
2. Check emails in:
   - Gmail (web, iOS, Android)
   - Outlook (desktop, web)
   - Apple Mail (macOS, iOS)
   - Yahoo Mail
   - Any other clients you use

#### Verify Visual Elements
- **Client Confirmation:**
  - Burnt orange header displays correctly
  - "United Tattoo" in serif italic
  - Booking details card has cream background + terracotta border
  - All data appears in 2-column format
  - Contact email shows as ink@united-tattoos.com
  - Footer disclaimer is subtle and readable

- **Admin Notification:**
  - Same header style as client email
  - Client contact section at top with cream background
  - Section numbers (01-05) display in monospace
  - Client email is clickable and orange
  - Description box has gray background + terracotta bar
  - Checkmarks (✓/✗) display for consent items
  - Reference image count is clear

#### Check Functionality
- Click client email link in admin notification (should open mail client)
- View on mobile devices (should be responsive)
- Check plain text version (for clients that don't support HTML)
- Verify all data from form appears correctly
- Confirm reference images are actually attached to admin email

#### Accessibility Testing
- Use screen reader to test email structure
- Verify role="presentation" on layout tables
- Check color contrast ratios (should meet WCAG AA)
- Ensure all links have clear anchor text

### Next Steps

#### Immediate
- [ ] Test emails in all major email clients (Gmail, Outlook, Apple Mail)
- [ ] Verify mobile responsiveness on actual devices
- [ ] Get client feedback on email design and tone
- [ ] Check spam scores (use mail-tester.com or similar)

#### Future Enhancements
- [ ] Add United Tattoo logo to email header (requires hosted image)
- [ ] Consider adding social media links to footer
- [ ] Implement email templates as reusable components
- [ ] Create additional email templates (appointment reminders, confirmations)
- [ ] Add email preview/testing workflow for development

#### Design System Documentation
- [ ] Document email color palette in DESIGN_SYSTEM_SUMMARY.md
- [ ] Create email template guidelines for future communications
- [ ] Establish tone/voice guidelines for client communications
- [ ] Build library of reusable email components

### Notes

**Email Color Palette Applied:**
- Header Background: Burnt Orange (#E67E50)
- Accent Borders: Terracotta (#D87850)
- Primary Text: Charcoal (#1c1915)
- Label Text: Moss (#6f5c49)
- Background Cards: Cream (#fff7ec)
- Links: Burnt Orange (#E67E50)
- Footer Text: Moss (#6f5c49)
- Container Background: Light Gray (#f5f5f5)
- Body Background: White (#ffffff)

**Typography Specifications:**
- H1 (Header): Georgia, 28px (client) / 22px (admin), italic (client only), white, 400 weight
- H2: Georgia, 24px (client) / unused (admin), charcoal, 400 weight
- H3: Georgia, 18px, charcoal, 400 weight
- Section Labels: Courier New, 10px, uppercase, 2px letter-spacing, moss color
- Body Text: Arial, 15-16px, charcoal, 1.7 line-height
- Data Values: Arial, 14-15px, charcoal, 600 weight
- Footer: Arial, 12px, moss color

**Layout Specifications:**
- Max Width: 600px (centered container)
- Header Padding: 32px (client) / 24px (admin) horizontal, 32px/24px vertical
- Section Padding: 24-40px horizontal, 24-32px vertical
- Card Padding: 24px all sides
- Border Radius: None (email compatibility)
- Divider Color: Sand (#f2e3d0), 1px solid

**Plain Text Email:**
- Maintained same structure and content as HTML version
- Updated contact email to ink@united-tattoos.com
- Clean section headers with uppercase labels
- Bullet points for list items
- Proper spacing between sections

**Email Sending Configuration:**
- From: `United Tattoo <team@united-tattoos.com>` (branded sender)
- To (Client): Form submitter's email
- To (Admin): `Christyl116@yahoo.com`, `ashtonjl.work@gmail.com`
- CC (Artist): Artist's `bookingEmailCc` if configured
- Reply-To (Admin): Client's email for easy response
- Subject (Client): "Booking Request Received - United Tattoo"
- Subject (Admin): "New Booking Request: [Name] · [Style] · [Artist]"

**Brand Voice Maintained:**
- Professional yet warm and welcoming
- Collaborative language ("we'll work with you", "bring your vision to life")
- Clear, concise sentences
- Enthusiastic but not over-the-top
- Editorial tone matching website aesthetic
- Respectful of client's artistic vision

---

## 2026-01-02 - Booking Flow Email Notifications Setup

### Changes Made

#### 1. Email Notification System Enhancement
- **Updated `/src/pages/api/booking.ts`**:
  - Changed admin email recipients from environment variable to hardcoded array: `['Christyl116@yahoo.com', 'ashtonjl.work@gmail.com']`
  - Removed `BOOKING_TO_EMAIL` environment variable dependency
  - Maintained artist CC functionality (sends to artist's `bookingEmailCc` if configured)
  - **Added client confirmation email** that sends to form submitter with:
    - Personalized greeting with client's name
    - Summary of booking request details (artist, style, placement, size, etc.)
    - Confirmation of uploaded reference images
    - Next steps: "Our team will review your request and get back to you within 24-48 hours"
    - Contact information for questions
    - Professional, welcoming tone
  - Client confirmation email failures don't block request success (admin email sent successfully is priority)

#### 2. Documentation Updates
- **Updated `README.md`**:
  - Removed `BOOKING_TO_EMAIL` from environment variables section
  - Added email flow explanation showing 3-email system (admin + artist + client)
  - Documented admin emails are hardcoded in API
  - Included instructions for adding `bookingEmailCc` to artist MDX files

- **Created `DEPLOYMENT.md`**:
  - Comprehensive guide for Cloudflare Pages deployment
  - Environment variables setup instructions (Resend API key, sender email)
  - Email configuration details (admin recipients, artist CC setup)
  - Resend account setup walkthrough (domain verification, API key generation)
  - Deployment methods (Git integration vs Wrangler CLI)
  - Testing checklist for email functionality
  - Troubleshooting section for common email issues
  - Security notes (API key rotation, never commit secrets)

### Email Flow Architecture

**Three-Email System:**
1. **Admin Notification** → `Christyl116@yahoo.com`, `ashtonjl.work@gmail.com`
   - Full booking details with all form fields
   - Reference images attached
   - Client contact info for follow-up
   - Reply-To header set to client's email

2. **Artist Notification** → Artist's `bookingEmailCc` (if configured)
   - Same content as admin notification
   - Only sent if selected artist has email in MDX frontmatter
   - Allows artists to review requests directly

3. **Client Confirmation** → Form submitter's email
   - Personalized thank you message
   - Summary of what they submitted
   - Next steps (24-48 hour response)
   - Shop contact information
   - Welcoming, professional tone

### Files Modified

```
src/pages/api/booking.ts     - Updated email logic, added client confirmation
README.md                     - Updated env vars section, added email flow docs
```

### Files Created

```
DEPLOYMENT.md                 - Comprehensive deployment and email setup guide
```

### Decisions

**Hardcoded Admin Emails:**
- Chose to hardcode admin emails (`Christyl116@yahoo.com`, `ashtonjl.work@gmail.com`) directly in the API code rather than using environment variables
- Reasoning: These are stable, unlikely to change frequently, and simplifies deployment configuration
- Easier to update by editing code and redeploying than managing env vars across environments

**Client Email Failure Handling:**
- Client confirmation email errors are logged but don't fail the request
- Reasoning: Admin/artist notifications are priority - booking should succeed even if client confirmation fails
- Prevents edge cases (invalid client email format) from blocking legitimate bookings

**Artist Email Configuration:**
- Artists opt-in to notifications by adding `bookingEmailCc` field to their MDX file
- Reasoning: Not all artists may want direct notifications; shop admin can handle delegation
- Allows flexible per-artist notification preferences

**Environment Variables Simplification:**
- Reduced from 3 env vars to 2 (removed `BOOKING_TO_EMAIL`)
- Reasoning: Fewer configuration points = less room for deployment errors
- API key and sender email are the only truly variable configuration items

### How to Test

#### Local Development
1. Ensure `RESEND_API_KEY` is set in `.env` file (or omit for console logging)
2. Set `BOOKING_FROM_EMAIL` to a verified Resend sender email
3. Submit test booking via `/booking` form
4. Check console output (dev mode) or Resend dashboard (with API key)
5. Verify three emails would be sent (or logged):
   - Admin notification to both admin emails
   - Artist notification (if artist has `bookingEmailCc`)
   - Client confirmation to submitted email

#### Production (Cloudflare Pages)
1. Set environment variables in Cloudflare Pages dashboard:
   - `RESEND_API_KEY` - Your Resend API key
   - `BOOKING_FROM_EMAIL` - Verified sender email (e.g., `bookings@unitedtattoo.com`)
2. Submit test booking through live site
3. Check all recipients receive emails
4. Verify attachments are included in admin/artist emails
5. Check Resend dashboard for delivery status

### Next Steps

#### Immediate
- [x] Configure `RESEND_API_KEY` in Cloudflare Pages environment variables
- [ ] Verify sender domain in Resend dashboard
- [ ] Add `bookingEmailCc` to artist MDX files for artists who want notifications
- [ ] Test end-to-end booking flow in production

#### Future Enhancements (from `dev/Talk-with-christy.md`)
- [ ] **Two-Stage Approval System**
  - Admin dashboard for receptionist approval
  - Artist approval interface
  - Booking status tracking (pending/approved/denied)
- [ ] **SMS Notifications** (Twilio integration)
  - Text alerts for admins/artists on new booking
  - Client confirmation text
  - Appointment reminders (1 week, 24-48 hours)
- [ ] **Database Integration** (Cloudflare D1)
  - Store booking requests with status tracking
  - Generate booking IDs for reference
  - Support client portal for booking management
- [ ] **Nextcloud Calendar Integration** (CalDAV)
  - Sync approved bookings to shop calendar
  - Check artist availability in real-time
- [ ] **Alternative Artist Suggestions**
  - Auto-suggest alternatives on denial based on style match + availability

### Notes

**Email HTML Templates:**
- Both admin and client emails include HTML and plain text versions
- HTML content uses inline styles for email client compatibility
- All user input is HTML-escaped to prevent injection attacks
- Email attachments only included for admin/artist (not client confirmation)

**Artist MDX Configuration:**
To enable booking notifications for an artist, add to frontmatter:

```yaml
---
name: Christy Lumberg
portrait: /artists/christy-lumberg-portrait.jpg
galleryDir: artists/Christy-Lumberg
bookingEmailCc: christy@example.com  # Add this line
specialties:
  - Fine Line
  - Botanical
---
```

**Resend Domain Verification:**
- `BOOKING_FROM_EMAIL` must be from a verified domain in Resend
- DNS records required: TXT, CNAME, or MX depending on verification method
- Can take up to 24 hours for DNS propagation
- Sandbox domain available for testing without verification

**Development vs Production:**
- Without `RESEND_API_KEY`: Emails logged to console (dev mode)
- With `RESEND_API_KEY`: Actual emails sent via Resend API
- Same code path, behavior controlled by environment variable presence

---

## 2026-01-01 - Mobile Nav, SEO & Testimonials

### Changes Made

#### 1. Mobile Navigation Logic
- **Refactored `HeaderNav.astro` script**:
  - Moved initialization to `DOMContentLoaded` to ensure DOM readiness.
  - Implemented proper z-index management: Nav button stays `z-[110]` (clickable) while menu overlay is `z-[100]`.
  - Added proper backdrop styling (`bg-neutral-950/98 backdrop-blur-xl`) for readability.
  - Prevented body scroll when menu is open.

#### 2. SEO & Structured Data Implementation
- **Created `Schema.astro` component**:
  - Dynamic JSON-LD generation.
  - Generates `LocalBusiness` (TattooShop) schema for site-wide pages.
  - Generates `Person` (Artist) schema for individual artist pages.
- **Enhanced `SiteLayout.astro`**:
  - Added Open Graph (OG) meta tags (title, description, image, type).
  - Added Twitter Card meta tags.
  - Integrated `Schema.astro` component into `<head>`.

#### 3. Booking Form Enhancements
- **Added "Availability" Field**:
  - Inserted "Preferred Dates / Times" input in Section 03 of `booking.astro`.
  - Updated API handler (`api/booking.ts`) to process and include this field in email notifications.

#### 4. Artist Testimonials
- **Updated Content Schema**:
  - Added `testimonials` array (quote, client) to `src/content.config.ts`.
- **Artist Page Update**:
  - Conditionally renders a "Words" / "Client Experiences" section in `artists/[slug].astro`.
  - Added sample testimonial to Amari Kyss's profile.

### Files Created
```
src/components/Schema.astro             - JSON-LD structured data generator
```

### Files Modified
```
src/components/HeaderNav.astro          - Fixed mobile menu script & styles
src/layouts/SiteLayout.astro            - Added OG tags & Schema component
src/content.config.ts                   - Added testimonials to artist schema
src/pages/artists/[slug].astro          - Added testimonials section
src/content/artists/amari-kyss.mdx      - Added sample testimonial
src/pages/booking.astro                 - Added availability input
src/pages/api/booking.ts                - Handled new availability field
```

### Decisions
- **Separate Schema Component**: Abstracted JSON-LD logic into `Schema.astro` to keep `SiteLayout` clean and allow for easy expansion of schema types in the future without cluttering the main layout.
- **Availability Field**: Added as a simple text input rather than a complex date picker to allow for flexible natural language input (e.g., "Weekends in March", "Tuesdays after 4pm").

### How to Test
1. **Mobile Menu**: Shrink viewport, click "Menu", verify overlay opens and "Close" button works.
2. **SEO**: Inspect source on homepage and artist pages to verify `<script type="application/ld+json">` and `<meta property="og:...">` tags.
3. **Booking**: Submit a form with availability preference and check console logs (or email).
4. **Testimonials**: Visit Amari Kyss's page and verify the "Client Words" section appears.

### Next Steps
- [x] Add Heather's profile (Instagram: `https://www.instagram.com/heather.robyns.art/`)
- [x] Populate Kaori Cedre's bio and portfolio images
- [ ] Add portrait images where missing (Kaori & Heather)
- [x] Verify all artist portfolio images are optimized (AVIF conversion)
- [ ] Update footer social links to real URLs

## 2026-01-01 - Artist Expansion, AVIF Optimization & SEO Refinement

### Changes Made

#### 1. Artist Scaffolding
- **Heather Robyns**: Created `src/content/artists/heather-robyns.mdx` and initialized `public/artists/Heather-Robyns/` directory structure (Portfolio/Flash).
- **Kaori Cedre**: Renamed `kaori.mdx` to `kaori-cedre.mdx`, cleaned up "TBD" content with professional "Building Portfolio" messaging, and synchronized folder naming.

#### 2. Technical Tooling Upgrade
- **Recursive AVIF Optimizer**: Completely overhauled `src/utils/convert-to-avif.js`.
  - Added support for **recursive directory scanning**.
  - Added support for **custom target directories** via CLI arguments (e.g., `node ... public`).
  - Successfully optimized 300+ images in the `public/` directory, significantly reducing payload sizes.

#### 3. SEO & Structured Data Completion
- **Dynamic Person Schema**: Updated `src/pages/artists/[slug].astro` to construct and pass `artistSchema` to `SiteLayout`.
  - Automatically generates `sameAs` arrays from Instagram, TikTok, Facebook, and Portfolio URLs.
  - Ensures artist pages are indexed with rich profile data.
- **Social Metadata Enhancement**: Enabled artist portraits as the primary `og:image` and `twitter:image` for their respective portfolio pages.

### Files Created
```
src/content/artists/heather-robyns.mdx       - Heather's profile scaffold
public/artists/Heather-Robyns/Portfolio/     - Directory structure
public/artists/Heather-Robyns/Flash/         - Directory structure
```

### Files Modified
```
src/utils/convert-to-avif.js                 - Upgraded to recursive/targeted mode
src/pages/artists/[slug].astro               - Implemented Schema.org and OG props
src/content/artists/kaori-cedre.mdx          - Refined bio and file naming
```

### Decisions
- **Upgrading Local Utilities**: Chose to enhance the existing AVIF script rather than using external tools to ensure a consistent, zero-cost optimization workflow as new artist assets are added.
- **Artist Slug Consistency**: Enforced `kaori-cedre.mdx` naming to maintain a clean URL structure (`/artists/kaori-cedre`) consistent with other artists.

### How to Test
1. **New Pages**: Visit `/artists/heather-robyns` and `/artists/kaori-cedre` to verify they load without errors.
2. **SEO**: Inspect source on an artist page; verify `ld+json` contains `Person` type with correct social links and `og:image` points to their portrait.
3. **Performance**: Check network tab for `.avif` assets in the portfolio grids.

### Next Steps
- [ ] Replace placeholder portraits for Heather and Kaori with real assets.
- [ ] Upload portfolio/flash images for Heather Robyns.
- [ ] Update footer social links in `src/consts.ts` once real URLs are confirmed.

## 2026-01-01 - Editorial Refinement & Dynamic Portfolio Layouts

### Changes Made

#### 1. "Refined Editorial" Design System Implementation
- **Overhauled Booking Page** (`src/pages/booking.astro`):
  - Replaced boxy inputs with elegant **underlined inputs** and terracotta focus states.
  - Implemented large display typography for section headers to create a "narrative" form experience.
  - Added generous "gallery pacing" (whitespace) between major form sections.
  - Redesigned the submit button as a high-contrast, magnetic-style block.
- **Artists Index Redesign** (`src/pages/artists/index.astro`):
  - Dramatic hero section with massive display typography ("THE ARTISTS").
  - New gallery-style artist cards with "bloom" hover effects (grayscale to warm terracotta color).
  - Minimalist metadata using mono-spaced typography.
- **Artist Portfolio Refinement** (`src/pages/artists/[slug].astro`):
  - Cinematic hero with split-line display typography.
  - Added a sticky "Start a Project" card in the bio section for better conversion.

#### 2. Dynamic Portfolio & Flash Experience
- **Interlocking Masonry Grid**:
  - Implemented a robust 6-column interlocking grid pattern for portfolio items.
  - Uses a calculated sequence (Row 1: 4+2, Row 2: 2+2+2, Row 3: 3+3, Row 4: 2+4) to ensure visual variety without vertical gaps or "holes."
  - Switched from uniform squares to varied aspect ratios (wide, tall, feature).
- **Portfolio / Flash Toggle**:
  - Added a persistent toggle switch to allow users to switch between "Portfolio" and "Flash" views.
  - Reduces page length while maintaining high visibility for available designs.
- **"Flash Sheet" Aesthetic**:
  - Redesigned flash items to look like physical sheets pinned to a wall.
  - Added paper-colored backgrounds (`#f2e3d0`), subtle random rotations, and "pin" graphics.
  - Interactive hover effects (straighten + zoom).

#### 3. Component & UX Improvements
- **CustomSelect Refinement**:
  - Switched to the new underlined aesthetic.
  - **Critical Fix**: Added `data-lenis-prevent` and `overscroll-contain` to allow scrolling within the dropdown without Lenis interference.
- **Enhanced MDX Styling**:
  - Updated `.prose-editorial` in `global.css` with larger hierarchy and more "literary" feel.
  - Custom list markers: Em-dashes (—) for unordered and numbered mono (01.) for ordered lists in terracotta.
  - Improved blockquote styling with terracotta accent lines.

### Decisions
- **Underlined vs Boxed Inputs**: Chose underlined inputs to minimize visual clutter and lean into the high-end editorial/gallery aesthetic.
- **Interlocking Pattern vs Auto-Masonry**: Chose a strict repeating pattern for the portfolio grid to ensure row alignment and eliminate the "ugly whitespace" common with basic CSS grid masonry.
- **Flash Toggle**: Implemented as a toggle rather than separate sections to keep the "Flash" easily accessible without requiring users to scroll past 50+ portfolio images.

### How to Test
1. **Portfolio Grid**: Visit an artist page and verify that images of different sizes fit together perfectly without holes.
2. **Flash Toggle**: Click "Flash" in the works section and verify the layout switches to the "flash sheet" view.
3. **Dropdown Scrolling**: Open a long dropdown on the booking page and verify you can scroll the options using a mouse wheel or touch.
4. **MDX**: Check the artist bios for refined typography and custom list markers.

## 2026-01-01 - Artist Portfolio Expansion & Booking Page Fix

### Changes Made

#### 1. Enhanced MDX Typography System
- **Improved `.prose-editorial` styles** in `src/styles/global.css`:
  - Increased h2 size from 1.75rem to 2rem with better spacing
  - Enlarged h3 headings (0.75rem → 0.8125rem) with brighter color for hierarchy
  - Improved paragraph line-height (1.75 → 1.8) for readability
  - Added custom bullet points (→ arrows) for unordered lists
  - Enhanced link hover states with smooth transitions
  - Added blockquote styling with serif italic font and left border
  - Better spacing throughout (margins, padding, first-child/last-child rules)

#### 2. Artist Bio Content Updates
- **Donovan Lankford** (`src/content/artists/donovan-lankford.mdx`):
  - Reformatted bio with clear sections: Artistic Style, Philosophy
  - Added bulleted specialty list with arrow markers
  - Added Instagram: `donovantattoos`
  - Removed redundant "About" heading (already in page template)

- **John Lapides** (`src/content/artists/john-lapides.mdx`):
  - Restructured content with Artistic Style and Experience & Recognition sections
  - Added comprehensive social media links:
    - Instagram: `spray.day`
    - Facebook: `spray.day.tattoos`
    - TikTok: `spray.day`
    - Twitch: `spray_day`
    - Venmo (in comment): `https://account.venmo.com/u/johnlapides`

- **Steven 'Sole' Cedre** (`src/content/artists/steven-sole-cedre.mdx`):
  - Complete setup with authentic bio content
  - Added specialties: Color Realism, Cartoon Style
  - Renamed directory: `Steven-Cedre` → `Steven-Sole-Cedre` to match MDX reference
  - Added social links:
    - Instagram: `solejunkiecustoms`
    - TikTok: `solejunkie`
    - Portfolio URL: `https://sole-tattoo.carrd.co/`
  - Incorporated branded logo image in MDX content

- **Amari Kyss** (`src/content/artists/amari-kyss.mdx`):
  - Complete rewrite using authentic voice from GlossGenius site
  - Fixed Instagram from incorrect `@1nkreaper` → `grimmtatt`
  - Updated specialties: American Traditional, Black & Grey, Flash
  - Added portfolio URL: `https://grimmtatts.glossgenius.com/`
  - Used direct quotes: "quiet kind of magic", "thank you so much for being here..."
  - Emphasized flash collection and collaborative approach

- **Kaori Cedre** (`src/content/artists/kaori.mdx`):
  - Updated name from "Kaori" to "Kaori Cedre"
  - Renamed directory: `Kaori` → `Kaori-Cedre`
  - Updated portrait path and gallery directory references
  - Scaffold ready for portfolio images and bio content

#### 3. Extended Artist Schema
- **Added social media fields** to `src/content.config.ts`:
  - `instagram` (string, optional) - Instagram handle
  - `facebook` (string, optional) - Facebook page name
  - `tiktok` (string, optional) - TikTok handle
  - `twitch` (string, optional) - Twitch username
  - `portfolioUrl` (URL, optional) - External portfolio website

#### 4. Artist Page Template Enhancement
- **Updated** `src/pages/artists/[slug].astro` to display all social links:
  - Instagram with @ prefix
  - Facebook with icon
  - TikTok with @ prefix
  - Twitch with icon
  - Portfolio URL as "Portfolio Site" link
  - All links open in new tabs with `rel="noopener noreferrer"`
  - Consistent styling with hover transitions

#### 5. Critical Bug Fix: Booking Page Dropdowns
- **Root cause identified**: Noise texture overlay with `z-50` in `SiteLayout.astro` was visually blocking dropdowns
- **First attempt**: Changed CustomSelect dropdown z-index from `z-50` → `z-[70]` (didn't work)
- **Real issue**: Fixed positioned noise overlay created separate stacking context
- **Solution**: Changed noise overlay z-index from `z-50` → `z-[-1]` in `src/layouts/SiteLayout.astro` line 75
- **Result**: Noise texture now sits in true background, all interactive elements fully clickable

### Files Created
```
None (all work was modifications to existing files)
```

### Files Modified
```
src/styles/global.css                        - Enhanced .prose-editorial typography
src/content/artists/donovan-lankford.mdx      - Formatted bio, added Instagram
src/content/artists/john-lapides.mdx          - Formatted bio, added all social links
src/content/artists/steven-sole-cedre.mdx     - Complete setup with bio and links
src/content/artists/amari-kyss.mdx            - Rewritten with authentic voice
src/content/artists/kaori.mdx                 - Updated with last name
src/content.config.ts                         - Added social media fields
src/pages/artists/[slug].astro                - Display social media links
src/components/CustomSelect.astro             - Increased dropdown z-index to z-[70]
src/layouts/SiteLayout.astro                  - Fixed noise overlay z-index to z-[-1]
public/artists/Steven-Cedre/                  - Renamed to Steven-Sole-Cedre/
public/artists/Kaori/                         - Renamed to Kaori-Cedre/
```

### Decisions

**MDX Typography Approach:**
- Used custom arrow bullets (→) instead of default list markers for better brand consistency
- Added blockquote styling for artist quotes to give them prominence
- First-child/last-child margin rules prevent awkward spacing at section boundaries

**Social Media Schema Design:**
- Chose to store handles/usernames only (not full URLs) for Instagram, TikTok, etc.
- Template builds full URLs using standard patterns (e.g., `https://instagram.com/${handle}`)
- Allows for flexibility if social media URL structures change
- `portfolioUrl` field stores complete URLs for external sites (validated as proper URLs)

**Z-Index Fix Strategy:**
- Initially tried raising dropdown z-index, but that didn't solve stacking context issue
- Moving noise overlay to `z-[-1]` was cleanest solution because:
  - Noise is purely decorative background texture
  - Doesn't need to be above any content
  - Maintains visual effect while ensuring no blocking
  - `pointer-events-none` already present for click-through

**Artist Content Voice:**
- Preserved authentic voice for Amari (casual, warm, personal)
- Used professional but personable tone for other artists
- Included direct quotes to give personality
- Maintained consistency in section structure across all artist pages

### How to Test

**MDX Typography:**
1. Navigate to any artist page (e.g., `/artists/donovan-lankford`)
2. Verify headings have proper hierarchy (h3 sections stand out)
3. Check that bulleted lists show arrow markers (→)
4. Verify blockquotes have italic serif styling with left border
5. Test link hover states for smooth color transitions

**Social Media Links:**
1. Navigate to artist pages with social links
2. Check Quick Stats Row in hero section shows all relevant icons
3. Click each social link to verify correct URLs
4. Steven Sole's page: Instagram, TikTok, Portfolio Site
5. John Lapides' page: Instagram, Facebook, TikTok, Twitch
6. Amari's page: Instagram, Portfolio Site
7. Donovan's page: Instagram

**Booking Page Dropdowns:**
1. Navigate to `/booking`
2. Click on any dropdown (Artist, Contact Method, Style, Size, Budget)
3. Verify dropdown menu appears ABOVE all content (not behind)
4. Verify options are clickable
5. Select an option and verify it updates the display
6. Test keyboard navigation (Tab, Arrow keys, Enter, Escape)

**Kaori's Setup:**
1. Navigate to `/artists/kaori-cedre`
2. Verify page loads with placeholder content
3. Check that directory structure exists at `public/artists/Kaori-Cedre/`
4. Verify Portfolio and Flash subdirectories are present

### Next Steps

#### Immediate
- [ ] Add Heather's profile (Instagram: `https://www.instagram.com/heather.robyns.art/`)
- [ ] Populate Kaori Cedre's bio and portfolio images
- [ ] Add portrait images where missing (Kaori)
- [ ] Verify all artist portfolio images are optimized (AVIF conversion)

#### Content Improvements
- [ ] Add more detailed bios for artists with sparse content
- [ ] Gather client testimonials for artist pages
- [ ] Add "Featured Work" sections highlighting notable pieces
- [ ] Create artist highlight videos or process clips

#### Technical Enhancements
- [ ] Add structured data (JSON-LD) for artist profiles
- [ ] Implement social media meta tags with artist preview cards
- [ ] Add analytics tracking for social link clicks
- [ ] Consider adding YouTube links to schema for artists with video content

#### Testing & Polish
- [ ] Cross-browser testing for dropdown functionality
- [ ] Mobile device testing for all artist pages
- [ ] Accessibility audit for social links (ensure proper ARIA labels)
- [ ] Performance testing with all artist images loaded

### Notes

**Artist Portfolio Assets:**
- Steven Sole Cedre has 65+ portfolio images and 28 flash designs
- His branded logo assets are in `/Bio/` subdirectory
- Amari has 58 portfolio images and comprehensive flash collection
- Directory naming convention: `artists/{Firstname}-{Lastname}` or `artists/{Firstname}-{Nickname}-{Lastname}`

**Stacking Context Hierarchy:**
Current z-index values after fixes:
- `z-[-1]` - Noise texture overlay (background)
- `z-10` - Hero content sections
- `z-20` - Form sections, general content
- `z-[60]` - Header navigation
- `z-[70]` - Custom select dropdowns, announcement bar
- `z-[100]` - Mobile menu overlay
- `z-[110]` - Mobile menu items when open

**Social Media URL Patterns:**
- Instagram: `https://instagram.com/${handle}`
- Facebook: `https://facebook.com/${page}`
- TikTok: `https://www.tiktok.com/@${handle}`
- Twitch: `https://twitch.tv/${username}`

**MDX Content Best Practices:**
- Use h3 (###) for section headings within artist bios
- Use blockquotes (>) for artist quotes or testimonials
- Use bulleted lists for specialties and approaches
- Keep opening paragraph focused and engaging
- Include personality and voice, not just facts

---

## Template for New Entries
```
## YYYY-MM-DD - <Milestone>

### Changes Made
- Created X, Y, Z files
- Implemented feature A using pattern B

### Decisions
- Chose X over Y because...
- Pattern for Z is...

### How to Test
1. Navigate to...
2. Click...
3. Verify...

### Next Steps
- [ ] Item 1
- [ ] Item 2
```

## Example: postMessage Pattern (Reference)

**Parent sends to iframe:**
```typescript
// lib/communication/iframe-controller.ts
export function selectElement(iframe: HTMLIFrameElement, nodeId: string) {
  iframe.contentWindow?.postMessage(
    { type: 'SELECT_ELEMENT', payload: { nodeId } },
    'http://localhost:4321' // Always explicit origin
  )
}
```

**Iframe sends to parent:**
```typescript
// Injected script in iframe
window.parent.postMessage(
  { type: 'ELEMENT_SELECTED', payload: { nodeId, rect, astroSource } },
  'http://localhost:3000'
)
```

**Parent receives:**
```typescript
// lib/communication/message-handler.ts
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://localhost:4321') return
  
  switch (event.data.type) {
    case 'ELEMENT_SELECTED':
      handleElementSelected(event.data.payload)
      break
    // ... other handlers
  }
})
```

## Example: Zustand Store Pattern (Reference)
```typescript
// lib/store/editor-store.ts
import { create } from 'zustand'

interface EditorStore {
  selectedElement: SelectedElement | null
  setSelectedElement: (el: SelectedElement | null) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  selectedElement: null,
  setSelectedElement: (el) => set({ selectedElement: el }),
}))
```

Usage:
```typescript
const selectedElement = useEditorStore((state) => state.selectedElement)
const setSelectedElement = useEditorStore((state) => state.setSelectedElement)
```

## Example: File Update Pattern (Reference)
```typescript
// lib/astro/class-updater.ts
import { parse, walk } from '@astrojs/compiler'

export async function updateClasses(
  filePath: string,
  line: number,
  col: number,
  newClasses: string
): Promise<string> {
  const source = await fs.readFile(filePath, 'utf-8')
  const ast = await parse(source)
  
  // Walk AST to find element at line:col
  let targetNode = null
  walk(ast, (node) => {
    if (node.position?.start.line === line && 
        node.position?.start.column === col) {
      targetNode = node
    }
  })
  
  // Update class attribute in source string
  // ... implementation
  
  return updatedSource
}
```

---

# Homepage Polish: Hybrid Dark + Warm Accents

**Date:** December 27, 2024
**Branch:** main

---

## Summary

Polished the homepage with a **hybrid approach**: maintained the sophisticated dark monochrome aesthetic while strategically adding warm accent colors (burnt orange, terracotta, sage, moss) from the design system. This moderate redesign improved visual balance, fixed critical visibility issues, enhanced typography hierarchy, and added subtle micro-interactions—all without abandoning the established editorial foundation.

---

## Changes Made

### 1. Color System Enhancement

**Added warm accent colors to global CSS** (`src/styles/global.css`):
- Burnt orange (#E67E50) - CTAs and primary accents
- Terracotta (#D87850) - Hover states and interactive elements
- Burnt dark (#b0471e) - Secondary accents
- Sage (#a28f79) - Icons and subtle accents
- Moss (#6f5c49) - Labels and metadata
- Cream (#fff7ec) - Future use
- Sand (#f2e3d0) - Future use

**Updated `.section-label` utility**:
- Changed color from neutral gray to moss color
- Increased font size from 10px to 12px for better readability
- Reduced tracking from 0.3em to 0.2em

### 2. Critical Visibility Fixes

**Process Section** (`src/pages/index.astro`):
- Changed process numbers from `text-neutral-800` (invisible on black) to **burnt orange**
- Changed process icons from `text-neutral-700` (too dark) to **sage color**
- Increased process descriptions from 11px/xs to sm/base for better hierarchy
- Updated border opacity from `white/5` to `white/10` for better visibility
- Changed text color from `text-neutral-500` to `text-neutral-400` for improved readability

### 3. Dove Image Enhancement

**Hero Section**:
- Increased dove opacity from 40% to 70% for better visibility
- Adjusted gradient fade from `bg-deep/80` to `bg-deep/70` for softer transition
- Kept grayscale filter per design preference
- Image now has stronger presence while maintaining subtlety

### 4. Strategic Color Accents

**CTAs (Call-to-Action Buttons)**:
- **Mobile CTA**: Changed from white background to burnt orange with burnt dark arrow icon
- **FloatingCTA** (`src/components/FloatingCTA.astro`): Updated to burnt orange with terracotta hover state
- Added warm glow shadow effect: `rgba(230, 126, 80, 0.3)`
- Hover effects include color transition, lift animation, and enhanced shadow

**Interactive Elements**:
- Artist hover arrow: Changed from white border to filled terracotta background
- Hero info bar: Added burnt orange top border accent
- All CTAs now have consistent warm color treatment

### 5. Labels & Metadata

**Moss color applied throughout**:
- Hero label: "Custom · Flash · Freedom"
- Hero info bar labels: "Location", "Hours", "Artists"
- Artist specialty labels: "Specialty"
- All section labels now use the `.section-label` utility class

**Spacing improvements**:
- Hero info bar: Unified gap from 6/10 to consistent 8
- Increased font sizes for better hierarchy (9px → 12px for labels)
- Values increased from xs to sm for better readability

### 6. Typography Refinements

**Hero Title**:
- Changed from viewport units (`14vw/10vw/8vw`) to fixed responsive sizes (`text-7xl/8xl/9xl`)
- Changed tracking from `tracking-tighter` to `tracking-tight` for better balance
- More predictable scaling across all device sizes

**Label Tracking**:
- Reduced from `0.3em` to `0.2em` across all labels for improved readability
- Still maintains uppercase mono aesthetic without being too wide

### 7. Spacing Consistency

**Artists Section**:
- Increased padding from `py-6 md:py-8` to `py-8 md:py-10` for more breathing room
- Updated border from `white/5` to `white/10` for better visibility
- More generous spacing improves visual hierarchy

### 8. Micro-Interactions

**Added hover effects** (`src/pages/index.astro` - style block):

```css
/* Artist name underline on hover */
- Gradient underline (burnt orange → terracotta) slides in on hover
- Animated with CSS keyframe for smooth appearance

/* Mobile CTA hover effect */
- Color changes to terracotta
- Lifts 2px with enhanced shadow glow
- Smooth transform and color transitions

/* Process step hover enhancements */
- Transparent 2px top border always present (prevents layout shift)
- Border color transitions to terracotta on hover
- Process numbers scale up 10% and change to terracotta
- Icons transition to white
- Multiple simultaneous effects create premium feel
```

**Layout Shift Fix:**
- Process cards originally added 2px border on hover, causing content to jump
- **Solution**: All cards now have 2px transparent border by default
- On hover, only border-color changes (not adding new border)
- Smooth transition prevents any layout shifting

---

## Files Modified

```
src/styles/global.css              - Added warm color variables, updated .section-label
src/pages/index.astro               - Color accents, typography fixes, micro-interactions
src/components/FloatingCTA.astro    - Burnt orange styling with hover effects
```

---

## Design Decisions

### Why Hybrid Approach?

The homepage had a fully implemented dark monochrome aesthetic that worked well structurally. Rather than a complete color overhaul, strategic warm accents were added to:

1. **Improve usability**: Fix invisible process numbers and too-dark icons
2. **Guide attention**: Use color to highlight CTAs and interactive elements
3. **Add warmth**: Introduce personality without overwhelming the dark editorial feel
4. **Maintain sophistication**: Keep the refined, gallery-like atmosphere

### Color Application Strategy

**Where warm colors are used:**
- CTAs: Burnt orange backgrounds (highest attention priority)
- Hover states: Terracotta accents (interactive feedback)
- Labels/metadata: Moss color (subtle hierarchy)
- Icons: Sage color (visual interest without overwhelming)
- Borders: Burnt orange for key dividers (visual organization)

**Where dark monochrome is preserved:**
- Background: Stays near-black
- Main text: Stays white/neutral grays
- Large imagery: Dove remains grayscale
- Grid lines: Stay subtle white/10
- Overall atmosphere: Dark, sophisticated, editorial

### Typography Philosophy

Fixed responsive sizes (`text-7xl/8xl/9xl`) chosen over viewport units because:
- More predictable behavior across device sizes
- Easier to maintain consistent scale
- Better alignment with Tailwind's design system
- Avoids awkward mid-breakpoint sizing

---

## Testing Checklist

- [x] Warm color CSS variables render correctly
- [x] Process numbers now visible (burnt orange)
- [x] Process icons visible with sage color
- [x] Dove image has better presence (70% opacity)
- [x] Mobile CTA uses burnt orange background
- [x] FloatingCTA shows burnt orange with terracotta hover
- [x] All labels use moss color
- [x] Hero info bar has burnt orange top border
- [x] Artist specialty labels use moss color
- [x] Hero title scales consistently across breakpoints
- [x] Artist rows have more breathing room
- [x] Artist hover arrow shows terracotta background
- [x] Artist name underline animation works on hover
- [x] Process step hover effects trigger correctly
- [x] Border visibility improved throughout
- [x] Typography hierarchy clearer with improved sizing
- [x] **Process cards no longer shift on hover (transparent border fix)**

---

## Post-Polish Refinement

**Layout Shift Fix (Dec 27, late afternoon):**
- User reported layout shift when hovering over methodology cards
- Root cause: 2px border being added on hover pushed content down
- **Fix implemented**: Changed from adding border on hover to transitioning border-color
  - All `.process-step` elements now have `border-top: 2px solid transparent`
  - Hover state changes to `border-top-color: var(--color-terracotta)`
  - Added smooth `transition: border-color 0.3s ease`
- Result: Perfect stability, no layout jumping, smooth color transition

---

## Next Steps

### Immediate Follow-ups
- [ ] Test across multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify mobile experience on actual devices
- [ ] Check color contrast for WCAG compliance
- [ ] Get client feedback on warm accent color balance

### Future Polish Opportunities
- [ ] Consider adding warm color to footer elements
- [ ] Explore adding subtle warm tints to additional images
- [ ] Add more micro-interactions to other page sections
- [ ] Implement color transitions during scroll animations

### Design System Alignment
- [ ] Document the hybrid color approach in DESIGN_SYSTEM_SUMMARY.md
- [ ] Update color usage guidelines for future pages
- [ ] Create utility classes for common warm accent patterns
- [ ] Establish when to use dark vs. warm aesthetic on other pages

---

## Notes

### Color Palette Applied

From `DESIGN_SYSTEM_SUMMARY.md`, the following warm colors are now integrated:

**Primary Accents:**
- Burnt Orange (#E67E50) - CTAs, primary highlights
- Terracotta (#D87850) - Hover states, secondary interactions
- Burnt Dark (#b0471e) - Icon fills, darker accents

**Subtle Accents:**
- Sage (#a28f79) - Icons, calm accents
- Moss (#6f5c49) - Labels, metadata, section identifiers

**Reserved for Future:**
- Cream (#fff7ec) - Potential light text alternative
- Sand (#f2e3d0) - Potential background tint

### Technical Implementation

**CSS Custom Properties:**
All warm colors added to `@theme` block in `global.css`, making them available as:
- `var(--color-burnt-orange)`
- `var(--color-terracotta)`
- `var(--color-burnt-dark)`
- `var(--color-sage)`
- `var(--color-moss)`

**Style Application:**
Inline styles used for color application (`style="color: var(--color-moss)"`) because:
- Ensures color override specificity
- Works well with Astro component architecture
- Maintains compatibility with existing Tailwind classes
- Easy to update globally by changing CSS variables

**Animation Approach:**
Micro-interactions added via `<style>` block in index.astro rather than global.css because:
- Keeps homepage-specific interactions scoped
- Easier to maintain and debug
- Prevents unintended effects on other pages
- Clear separation of concerns

---

# Artists, Booking & Policy Pages Implementation

**Date:** December 24, 2024 @ 14:36 UTC
**Last Updated:** December 26, 2024 @ 19:00 UTC
**Branch:** astro-migration-from-scratch

---

## Summary

Implemented MDX-driven artist pages, a booking system with file uploads and Resend email integration, and policy/aftercare pages. **December 24 update:** Completed a full "Technical Manual" / "Brutalist Editorial" homepage redesign with GSAP + Lenis scroll animations, sticky pinned columns, and cinematic scroll-triggered reveals. **December 26 update:** Major refactoring into modular components, artist page dramatic redesign, booking page editorial redesign, and custom dropdown components.

---

## Latest Changes (Dec 26 - Modular Component Architecture)

### Site-Wide Component Refactoring

Extracted common UI patterns into reusable Astro components to eliminate code duplication and improve maintainability:

#### New Components Created

| Component | Purpose |
|-----------|---------|
| `EditorialFooter.astro` | Complex 12-column grid footer with branding, location, hours, and sitemap |
| `SectionSidebar.astro` | Left sidebar content (section number, label, description) for 12-column layouts |
| `FloatingCTA.astro` | Fixed floating call-to-action button with footer visibility toggle |
| `ScrollIndicator.astro` | Scroll hint with horizontal/vertical orientation support |
| `GridBackground.astro` | 12-column grid line background for hero sections |
| `Breadcrumb.astro` | Consistent breadcrumb navigation |
| `SectionHeader.astro` | Section headers with title and optional meta information |
| `CustomSelect.astro` | Custom-styled dropdown to replace native `<select>` elements |

#### Component Integration

All components integrated across:
- `src/pages/index.astro` - Homepage
- `src/pages/artists/[slug].astro` - Artist detail pages
- `src/pages/booking.astro` - Booking form page

**Note:** Booking page form section sidebars were intentionally left inline due to unique mobile label display requirements.

### Artist Page Dramatic Redesign

Transformed the artist detail page from a standard layout to a cinematic, editorial experience:

#### Hero Section Transformation
- **Full-bleed background portrait** with grayscale filter and gradient overlay
- **Massive split-line typography** for artist name (first name normal, last name italic)
- **Object position adjusted** to `object-[center_20%]` for better portrait framing
- **Scroll indicator** integrated at bottom of hero

#### Layout Updates
- 12-column grid with left sidebar for section labels
- Consistent border treatments (`border-white/10` for sections, `border-white/5` for dividers)
- Floating CTA that hides when footer is visible (Intersection Observer)
- GSAP scroll-triggered animations for all sections

### Booking Page Editorial Redesign

Complete overhaul to match the established dark editorial aesthetic:

#### New Layout Structure
- **Full-bleed hero** with grid background and dove watermark
- **Large split-line typography**: "Request a / Consultation"
- **5 form sections** with left sidebars and consistent styling:
  1. Artist Selection
  2. Contact Information
  3. Project Vision
  4. Additional Details
  5. Reference Images

#### Custom Dropdown Component
Created `CustomSelect.astro` to replace native browser dropdowns:
- Custom styling matching site aesthetic
- Hidden input for form submission
- Click-to-open dropdown behavior
- Keyboard navigation (Arrow keys, Enter, Escape)
- Checkmark indicator for selected option
- ARIA attributes for accessibility

#### Form Styling
- Black/50 backdrop blur inputs with white/10 borders
- Monospace labels with uppercase tracking
- Consistent focus states (`focus:border-white/30`)
- Custom file upload zone with drag indication

### Homepage Polish (Dec 26)

Refined the existing homepage for cohesion:

#### Border Standardization
- `border-white/5` for internal dividers
- `border-white/10` for major section borders

#### Typography & Spacing
- Unified label colors to `text-neutral-500`
- Increased sidebar padding from `p-6` to `p-6 lg:p-8`
- Polished mobile CTA button for more visual weight

#### Interactive Improvements
- **Floating CTA visibility** - Intersection Observer hides CTA when footer enters viewport
- **Scroll indicator animation** - Added CSS keyframe animation (`scroll-pulse`)

### New CSS Animations

Added to `src/styles/global.css`:

```css
/* Subtle scroll indicator animation */
.scroll-line {
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}
```

### Files Created (Dec 26)

```
src/components/EditorialFooter.astro   - Reusable editorial footer component
src/components/SectionSidebar.astro    - Left sidebar for section labels
src/components/FloatingCTA.astro       - Fixed floating CTA with visibility logic
src/components/ScrollIndicator.astro   - Scroll hint (horizontal/vertical)
src/components/GridBackground.astro    - 12-column grid line background
src/components/Breadcrumb.astro        - Consistent breadcrumb navigation
src/components/SectionHeader.astro     - Section header with title/meta
src/components/CustomSelect.astro      - Custom styled dropdown component
```

### Files Modified (Dec 26)

```
src/pages/index.astro           - Refactored to use new components
src/pages/artists/[slug].astro  - Complete redesign + componentization
src/pages/booking.astro         - Complete redesign + custom dropdowns
src/styles/global.css           - Added scroll-pulse animation
```

---

## Previous Changes (Dec 24 - Technical Manual Redesign + Scroll Experience)

### Homepage Complete Overhaul

Redesigned homepage to a "Technical Manual" / "Brutalist Editorial" aesthetic inspired by creative agency portfolio sites:

#### New Layout Structure
- **12-column grid system** with visible grid lines in the background
- **Split layout hero** with chapter labels, coordinates, and "Active Ingredients" data blocks
- **Pinned sidebar columns** (left + right) that stay fixed while center content scrolls
- **Footer** with "UNITED" branding, location/hours, and directory links

#### Hero Section Features
- Chapter label: "Chapter 01: United Tattoo"
- Massive serif heading: "HIGH ART / TRUE CRAFT"
- "Active Ingredients" block (Ink 100%, Skin Canvas, Soul Infinite)
- Status indicator with "BOOKING OPEN" and CTA button
- Coordinates data block

#### Artists Section ("The Collective")
- List-style layout with numbered entries (01–06)
- Italic serif artist names with monospace specialty labels
- **Hover reveals artist portrait** (desktop only)
- Arrow indicators linking to individual artist pages

#### Process Section ("Methodology")
- 4-column grid with numbered steps
- Iconify icons for each step
- Clean descriptions with italic serif headings

### Scroll Animations (GSAP + Lenis)

Added premium scroll experience with new dependencies:
- `gsap` - Animation library with ScrollTrigger plugin
- `lenis` - Buttery-smooth scroll library

#### Animation Features

| Section | Animation |
|---------|-----------|
| Hero | Staggered title reveal, ingredient list cascade |
| Artists | Title fade-in, row stagger (0.1s delay each) |
| Process | Title slide-in, card scale-up with stagger |
| Footer | Title scale reveal, content fade cascade |

#### Sticky Pinned Columns
- Left column: Chapter label, coordinates
- Right column: Active Ingredients, Status, CTA button
- **Columns stay fixed** during Hero and Artists sections
- **Lock into place** when footer approaches (z-index layering)

### New Dependencies

```json
{
  "gsap": "^3.x",
  "lenis": "^1.x"
}
```

### Files Modified

```
src/pages/index.astro          - Complete rewrite with Technical Manual layout
src/styles/global.css          - Added animation classes, updated typography
src/layouts/SiteLayout.astro   - Added Lenis + GSAP initialization, font imports
```

### Layout Props Added

New props in `SiteLayout.astro`:
- `removeMainPadding` - Removes default padding for full-bleed pages
- `hideFooter` - Hides SiteFooter component (homepage has custom footer)

---

## Previous Changes (Dec 24 - Editorial Polish)

### Design Direction Change

Shifted the site from a "tech/system UI" vibe to a refined dark gallery / editorial feel:
- Removed most "system/protocol/spec" language and UI chrome
- Consistent typography, spacing rhythm, and image presentation across all pages
- Full-site scope: homepage, artists, booking, and all informational pages

### Key Removals

| Before | After |
|--------|-------|
| `[System Status: Active]` | "Now booking for February 2026" |
| `[ ARCHIVE_01 ]`, `[ WORKFLOW_PROTOCOL ]` | "The Collective", "How It Works" |
| `Initialize Project`, `SECURE_DATE` | "Book a Session" |
| `System Verified © 2025` | "© 2025 United Tattoo. All rights reserved." |
| `Privacy_Protocol`, `Legal_Terms` | "Privacy", "Terms" |
| Heavy mono font usage | Serif display + readable body copy |

### New Components Created

```
src/components/Announcement.astro  - Clean announcement bar
src/components/HeaderNav.astro    - Editorial navigation with link states
src/components/SiteFooter.astro   - Professional footer with location/hours
```

### Files Significantly Modified

```
src/layouts/SiteLayout.astro      - Uses new components, removed grid background
src/styles/global.css             - Added .section-label, .prose-editorial, reduced noise
src/pages/index.astro             - Complete rewrite with editorial copy
src/pages/artists/index.astro     - Clean gallery grid, updated copy
src/pages/artists/[slug].astro    - Added lightbox, editorial styling
src/pages/booking.astro           - Friendly step labels, cleaner form
src/pages/booking/thanks.astro    - Editorial styling
src/pages/404.astro               - Now uses SiteLayout, proper styling
src/pages/terms.mdx               - Updated to use .section-label and .prose-editorial
src/pages/privacy.mdx             - Updated to use .section-label and .prose-editorial
src/pages/aftercare.mdx           - Updated to use .section-label and .prose-editorial
```

### New Features

1. **Image Lightbox** - Artist portfolio/flash galleries now have a keyboard-navigable lightbox modal (Escape to close, arrow keys to navigate)

2. **Consistent Shell** - All pages now use the shared layout with HeaderNav, Announcement, and SiteFooter components

3. **Typography System** - Clear hierarchy with serif display headings, readable body copy, and mono reserved for small metadata

---

## Completed Work

### 1. Content Collections (Astro 5)

- Created `src/content.config.ts` with glob loader for artists collection
- Schema includes: `name`, `portrait`, `galleryDir`, `specialties[]`, `instagram`, `bookingEmailCc`
- 6 active artist MDX files in `src/content/artists/`:
  - `amari-rodriguez.mdx`
  - `christy-lumberg.mdx`
  - `donovan-lankford.mdx`
  - `john-lapides.mdx`
  - `pako-martinez.mdx`
  - `steven-sole-cedre.mdx`

**Note:** `dez.mdx` and `ej-segoviano.mdx` were removed/never completed - they had schema validation errors.

### 2. Artist Pages

- **`/artists`** - Grid listing of all artists from content collection
- **`/artists/[slug]`** - Individual artist pages featuring:
  - Artist bio/intro from MDX content
  - Portfolio gallery (auto-loaded from `public/{galleryDir}/Portfolio/`)
  - Flash sheet gallery (auto-loaded from `public/{galleryDir}/Flash/`)
  - **NEW:** Lightbox modal for viewing images full-screen
  - "Book with [Artist]" CTA linking to booking with preselected artist

### 3. Booking System

- **`/booking`** - Full booking form with:
  - Artist selection dropdown (supports `?artist=slug` preselect)
  - Contact info fields (name, email, phone, preferred contact method)
  - Project details (style, placement, size, budget, description)
  - Reference image uploads (up to 5 files, max 10MB each)
  - Terms/age/deposit acceptance checkboxes
  - Client-side validation and loading states

- **`POST /api/booking`** - Server endpoint that:
  - Validates all required fields
  - Enforces file upload limits (count, size, MIME types)
  - Sends booking request via Resend with attachments
  - Falls back to console logging in dev mode if no API key

- **`/booking/thanks`** - Confirmation page with next steps

### 4. Policy & Aftercare Pages

- **`/terms`** - Terms of Service (MDX)
- **`/privacy`** - Privacy Policy (MDX)
- **`/aftercare`** - Tattoo aftercare instructions (MDX)

### 5. Layout & Navigation Updates

- Created shared components in `src/components/`
- All pages now use `SiteLayout.astro` with consistent nav/footer
- Changed all booking links from `/contact` to `/booking`
- Added `/contact` → `/booking` redirect in `astro.config.mjs`

### 6. Configuration Changes

- Added packages: `@astrojs/mdx`, `@astrojs/node`, `resend`
- Updated `astro.config.mjs`:
  - `output: 'server'` for API route support
  - Node adapter for standalone deployment
  - MDX integration
  - Redirect configuration

---

## Files Created/Modified

### New Files (Dec 26 - Modular Components)
```
src/components/EditorialFooter.astro   - Reusable 12-column footer
src/components/SectionSidebar.astro    - Section label sidebar
src/components/FloatingCTA.astro       - Floating CTA with visibility logic
src/components/ScrollIndicator.astro   - Scroll hint component
src/components/GridBackground.astro    - Grid line background
src/components/Breadcrumb.astro        - Breadcrumb navigation
src/components/SectionHeader.astro     - Section header component
src/components/CustomSelect.astro      - Custom dropdown component
```

### New Files (Dec 24 Update)
```
src/components/Announcement.astro
src/components/HeaderNav.astro
src/components/SiteFooter.astro
```

### New Files (Original)
```
src/content.config.ts
src/content/artists/*.mdx (6 active files)
src/pages/artists/index.astro
src/pages/artists/[slug].astro
src/pages/booking.astro
src/pages/booking/thanks.astro
src/pages/api/booking.ts
src/pages/terms.mdx
src/pages/privacy.mdx
src/pages/aftercare.mdx
src/layouts/SiteLayout.astro
```

### Modified Files (Dec 26)
```
src/pages/index.astro           - Refactored to use modular components
src/pages/artists/[slug].astro  - Complete redesign + componentization
src/pages/booking.astro         - Complete redesign + custom dropdowns
src/styles/global.css           - Added scroll-pulse animation
```

### Modified Files (Dec 24)
```
astro.config.mjs
package.json
src/pages/index.astro
src/pages/404.astro
src/styles/global.css
```

### Deleted Files
```
src/content/config.ts (replaced by src/content.config.ts for Astro 5)
src/pages/contact.astro (redirect now in config)
```

---

## Environment Variables Required

Add these to `.env` for the booking system to send emails:

```env
RESEND_API_KEY=re_xxxxxxxxxx
BOOKING_TO_EMAIL=ink@unitedtattoo.com
BOOKING_FROM_EMAIL=bookings@unitedtattoo.com
```

**Note:** The `BOOKING_FROM_EMAIL` must be a verified sender domain in Resend.

---

## Next Steps / TODO

### Immediate Priorities

- [ ] **Verify Resend Integration**
  - Add real Resend API key to `.env`
  - Verify sender domain in Resend dashboard
  - Test end-to-end booking submission

- [ ] **Complete Artist Content**
  - Update artist MDX files with real bios (some have placeholder content)
  - Verify `galleryDir` paths match actual folder structure in `public/`
  - Add portfolio images for artists who don't have them yet

- [ ] **Social Media Links**
  - Update placeholder `#` links in footer to real Instagram/Facebook URLs

### UI/UX Improvements

- [ ] **Mobile Navigation**
  - The mobile menu button exists but has no functionality
  - Implement slide-out or fullscreen mobile nav

- [ ] **Form Enhancements**
  - Add date/time preference field to booking form
  - Consider adding a CAPTCHA or honeypot for spam prevention

- [x] **Hover States & Micro-interactions**
  - Added hover transitions for artist rows, buttons, and cards
  - Artist portrait reveals on hover (desktop)

- [x] **Scroll-triggered Animations**
  - Implemented GSAP ScrollTrigger for all sections
  - Lenis smooth scrolling enabled
  - Staggered reveals, parallax effects, and cinematic transitions

- [x] **Custom Form Controls (Dec 26)**
  - Replaced native dropdowns with custom CustomSelect component
  - Keyboard navigation and ARIA accessibility
  - Consistent styling with site aesthetic

- [x] **Modular Component Architecture (Dec 26)**
  - Extracted 8 reusable components from repeated code
  - Consistent footer, sidebars, and UI elements across all pages
  - Reduced code duplication significantly

### Content & Polish

- [ ] **Review Copy**
  - Have stakeholders review the new editorial copy
  - Ensure tone matches brand voice

- [ ] **Image Optimization**
  - Run remaining images through AVIF conversion utility
  - Lazy load offscreen images for performance

- [ ] **SEO & Meta Tags**
  - Add Open Graph / Twitter card meta tags
  - Create sitemap.xml

### Backend Enhancements (Future)

- [ ] **Admin Dashboard** - Review/approve/deny booking requests
- [ ] **SMS Notifications** - Twilio integration for SMS alerts
- [ ] **Calendar Integration** - Nextcloud calendar sync
- [ ] **Client Portal** - Allow clients to view/manage bookings

### Legal

- [ ] **Review Legal Pages** - Have attorney review Terms of Service
- [ ] **Privacy Policy** - Ensure CCPA compliance

---

## Testing Checklist

### Core Functionality
- [x] Homepage loads with artist grid from collection
- [x] `/artists` page lists all artists
- [x] `/artists/[slug]` pages render MDX content
- [x] Portfolio images load dynamically
- [x] **Lightbox opens on image click**
- [x] **Lightbox keyboard navigation (Escape, arrows)**
- [x] `/booking` form renders with all fields
- [x] Artist preselect via `?artist=` works
- [x] File upload validation (count/size) works client-side
- [x] `/api/booking` validates and logs in dev mode
- [ ] Email actually sends with Resend (needs API key)
- [x] `/contact` redirects to `/booking`
- [x] `/terms`, `/privacy`, `/aftercare` render correctly
- [x] All footer links work
- [x] **404 page styled correctly**
- [x] **Consistent nav/footer across all pages**
- [ ] Mobile navigation (not implemented)

### Scroll & Animation (Dec 24)
- [x] **Lenis smooth scrolling works**
- [x] **GSAP scroll animations trigger correctly**
- [x] **Sticky columns stay fixed during scroll**
- [x] **Sticky columns lock when footer approaches**
- [x] **Artist hover reveals portrait image**
- [x] **Homepage responsive on mobile**

### Component Refactoring (Dec 26)
- [x] **EditorialFooter renders correctly on all pages**
- [x] **SectionSidebar displays section labels correctly**
- [x] **FloatingCTA hides when footer is visible**
- [x] **ScrollIndicator animates with pulse effect**
- [x] **GridBackground shows 12-column lines**
- [x] **Breadcrumb navigation works correctly**
- [x] **SectionHeader displays titles and meta**
- [x] **CustomSelect opens/closes dropdown**
- [x] **CustomSelect keyboard navigation works**
- [x] **CustomSelect updates hidden form input**

### Artist Page Redesign (Dec 26)
- [x] **Full-bleed hero with portrait background**
- [x] **Hero portrait framed correctly (object-[center_20%])**
- [x] **Split-line artist name typography**
- [x] **Sections have proper GSAP animations**
- [x] **Floating CTA visible until footer**

### Booking Page Redesign (Dec 26)
- [x] **Editorial hero with grid background**
- [x] **Form sections render with sidebars**
- [x] **Custom dropdowns replace native selects**
- [x] **Form inputs styled consistently**
- [x] **File upload zone styled**

---

## Design System Notes

### Typography

- **Display Font:** Instrument Serif (italic for headings)
- **Body Font:** Inter (readable, mixed case)
- **Mono Font:** Geist Mono (sparingly, for metadata only)

### CSS Utilities

```css
.section-label    /* Small mono label for section metadata */
.prose-editorial  /* Styled prose for MDX content */
.glass-card       /* Subtle glass effect card */
.noise            /* Very subtle texture overlay */
```

### Animation Classes (GSAP-driven)

```css
/* Homepage */
.hero-reveal      /* Hero section staggered reveal targets */
.hero-title       /* Main hero heading animation */
.hero-cta         /* CTA button entrance */
.ingredient-item  /* Active ingredients list stagger */
.artist-row       /* Artist list row cascade */
.process-step     /* Process card animations */
.process-num      /* Process number parallax */
.footer-title     /* Footer title scale reveal */
.footer-reveal    /* Footer content cascade */

/* Artist Page (Dec 26) */
.artist-hero-portrait   /* Hero portrait fade-in */
.artist-hero-reveal     /* Hero content stagger */
.artist-hero-title      /* Artist name reveal */
.artist-hero-title-line /* Split-line text animation */
.portfolio-reveal       /* Portfolio section */
.flash-reveal           /* Flash section */
.cta-section-reveal     /* CTA section reveal */

/* Booking Page (Dec 26) */
.booking-hero-reveal    /* Hero content stagger */
.booking-section-reveal /* Form section reveals */
```

### CSS Keyframe Animations

```css
/* Scroll indicator pulse (Dec 26) */
.scroll-line {
  animation: scroll-pulse 2s ease-in-out infinite;
}
```

### Color Palette

**Dark Monochrome Foundation:**
- Background: `#050505` (near-black)
- Text: `#e0e0e0` (light gray)
- Accent: `#ffffff` (white)
- Grid lines: `rgba(255, 255, 255, 0.1)`
- Neutrals: Various gray shades for hierarchy

**Warm Accent Colors (Dec 27, 2024):**
- Burnt Orange: `#E67E50` (CTAs, key highlights)
- Terracotta: `#D87850` (Hover states, interactions)
- Burnt Dark: `#b0471e` (CTA icon fills)
- Sage: `#a28f79` (Icons, calm accents)
- Moss: `#6f5c49` (Labels, metadata)
- Cream: `#fff7ec` (Reserved)
- Sand: `#f2e3d0` (Reserved)

---

## Notes

### Technical Notes
- Astro 5 changed content collections significantly - now requires loaders and `content.config.ts` at `src/` level
- The `output: 'hybrid'` option was removed in Astro 5; using `output: 'server'` with `prerender = true` on static pages
- The booking form stores/handles files client-side before upload to avoid issues with FormData on multiple file inputs
- Removed background grid utility to keep the aesthetic clean and gallery-like

### Animation Integration (Dec 24)
- **GSAP + Lenis Integration:** Lenis handles smooth scrolling, GSAP ScrollTrigger syncs via `lenis.on('scroll', ScrollTrigger.update)`
- **Sticky Columns:** Use `position: fixed` with `z-30`, footer uses `z-20` so columns appear to "lock" as footer scrolls over them
- **Homepage hides SiteFooter:** Uses custom embedded footer with `hideFooter={true}` prop on SiteLayout

### Component Architecture (Dec 26)
- **EditorialFooter:** Imports constants from `src/consts.ts` for address, email, phone, Instagram
- **FloatingCTA:** Uses Intersection Observer to detect footer visibility and toggle CTA display
- **CustomSelect:** Uses hidden `<input>` for form submission, custom button trigger, and dropdown list with ARIA attributes
- **SectionSidebar:** Sticky positioning with `top-24` offset to account for fixed header
- **Artist Page Layout:** Uses `removeMainPadding={true}` and `hideFooter={true}` on SiteLayout for full-bleed design
- **Booking Form Sidebars:** Left inline due to unique mobile label requirements (shows section number + label on mobile)

### Border Conventions
- `border-white/5` - Internal dividers within sections
- `border-white/10` - Major section borders and outer boundaries

### Component Props Reference

| Component | Key Props |
|-----------|-----------|
| `EditorialFooter` | None (uses consts.ts) |
| `SectionSidebar` | `sectionNum`, `label`, `description?` |
| `FloatingCTA` | `href`, `text`, `artistName?` |
| `ScrollIndicator` | `orientation?` ('horizontal'/'vertical'), `class?` |
| `GridBackground` | `opacity?` (e.g., 'opacity-40') |
| `Breadcrumb` | `path[]` ({href, label}), `currentLabel`, `class?` |
| `SectionHeader` | `title`, `meta?`, `class?` |
| `CustomSelect` | `id`, `name`, `label`, `options[]`, `required?`, `placeholder?`, `hint?` |

## 2026-01-01 - Homepage UI/UX Refinement & Accessibility

### Changes Made

#### 1. Conversion & CTA Enhancements
- **Desktop Hero CTA**: Added a "Book Consultation" button to the Hero Info Bar in `src/pages/index.astro`. This provides desktop users with a direct path to booking without using the main navigation.
- **Footer "Ready to Book" Block**: Inserted a high-impact, full-width CTA block at the top of `src/components/EditorialFooter.astro`. Features a gradient text hover effect and a magnetic-style arrow button.

#### 2. Visual Polish & Micro-Interactions
- **Interactive Hero Parallax**: Implemented a mouse-move parallax effect for the hero "Dove" image in `src/pages/index.astro`. This adds depth and motion to the initial page load experience.
- **Mobile Artist Avatars**: Updated the artist list on mobile to include circular portraits. This brings visual parity with the desktop hover-reveal effect for mobile users.
- **Process Step Visuals**: Enhanced the methodology grid in `src/pages/index.astro` with defined borders (`gap-px`, `bg-white/5`) and consistent backgrounds, improving the "affordance" of the interactive steps.
- **Hero Label Hierarchy**: Updated the "Custom · Flash · Freedom" label to `text-neutral-300` and `font-medium`. This improves legibility and balances the typographic weight against the massive hero title.

#### 3. Accessibility & Contrast
- **Footer Contrast Update**: Lightened `text-neutral-500` to `text-neutral-400` throughout `EditorialFooter.astro` to improve contrast ratios on the black background, ensuring compliance with legibility standards for metadata.

### Files Modified
```
src/pages/index.astro                - Hero CTA, Parallax, Mobile Avatars, Process visuals
src/components/EditorialFooter.astro - Added "Ready to Book" block, improved contrast
```

### Decisions
- **Mobile Avatars**: Chose to include static avatars on mobile rather than attempting a touch-based reveal to ensure a fast, frictionless browsing experience on smaller screens.
- **Footer CTA Placement**: Positioned the "Ready to Book" block before the main footer grid to act as a final "handshake" with the user before they exit the page.

### How to Test
1. **Desktop Hero**: Check the info bar for the new "Book Consultation" button.
2. **Hero Parallax**: Move the mouse over the hero section and observe the dove image shifting subtly.
3. **Mobile Artist List**: Shrink the viewport and verify that circular portraits appear next to artist names.
4. **Footer**: Scroll to the bottom and verify the large "Book a session" block appears above the location/hours grid.
5. **Contrast**: Verify that the small text in the footer is easier to read than before.

### Next Steps
- [ ] Add "Selected Works" masonry gallery to the homepage.
- [ ] Implement client testimonials/social proof section.
- [ ] Add dynamic texture/ink mask to the "United" hero title.


## 2026-01-02 - CalDAV Calendar Implementation

### Changes Made

#### 1. Backend Service Layer
- **Created `src/services/caldav.ts`** - Handles CalDAV protocol communication using `tsdav` and `ical.js`.
  - Implemented `fetchCalendarEvents` to retrieve busy times from Nextcloud.
  - Added robust error handling and parsing logic.
- **Created `src/services/calendar-cache.ts`** - Implements availability logic and caching.
  - In-memory caching with 15-minute TTL.
  - Logic to calculate available slots based on:
    - Artist working hours (from MDX).
    - CalDAV busy events.
    - Buffer time (30 mins default).
    - Timezone handling (Mountain Time).

#### 2. API Endpoints
- **Created `src/pages/api/availability.ts`** - Endpoint to fetch slots for a specific artist.
  - Returns calculated available slots.
  - Implements **Alternative Artists** logic: suggests similar artists if primary has <5 slots.
- **Created `src/pages/api/validate-slot.ts`** - Real-time validation endpoint.
  - Verifies slot availability against live CalDAV data before booking.
- **Updated `src/pages/api/booking.ts`** - Enhanced booking submission handler.
  - Extracts `selected_slots` from form data.
  - Formats availability string for emails (Text & HTML versions).
  - Maintains backward compatibility with manual text entry.

#### 3. Frontend Components
- **Created `src/components/CalendarPicker.astro`** - Interactive calendar UI.
  - Month view with availability indicators.
  - Slot selection modal (up to 3 preferences).
  - Alternative artist suggestions display with "Switch" functionality.
  - Dynamic updates based on artist selection.
- **Updated `src/pages/booking.astro`** - Integrated CalendarPicker.
  - Replaced text input with CalendarPicker + Manual Fallback toggle.
  - Added logic to coordinate Artist Select change with Calendar refresh.
  - Added logic to handle "Switch Artist" requests from the calendar component.

#### 4. Configuration
- **Updated `src/content.config.ts`** - Extended artist schema.
  - Added `calendarId`, `acceptingBookings`, `schedule`, `bufferMinutes`.
- **Updated `src/content/artists/christy-lumberg.mdx`** - Added sample calendar configuration.

### Decisions
- **In-Memory Cache**: Chose simple Map-based cache for v1. Cloudflare Workers are ephemeral, but this provides sufficient caching for hot functions without complex KV setup for now.
- **Timezone Handling**: Enforced "America/Denver" for all slot calculations using `date-fns-tz` to ensure consistency with physical shop location.
- **Fallback UI**: Kept the manual text input available via a "Can't find a time?" link to ensure booking flow is never blocked by technical issues or lack of slots.

### How to Test
1. **Booking Form**: Navigate to `/booking`. Select "Christy Lumberg". Verify calendar appears.
2. **Slot Selection**: Click a green day, select slots. Verify they appear in "Your Selections".
3. **Switch Artist**: Select an artist with no slots (if any configured) or mock low availability to see alternatives. Click "Switch". Verify dropdown updates.
4. **Submission**: Submit booking with selected slots. Verify email contains formatted slot list.

### Next Steps
- [ ] Configure actual Nextcloud credentials in production environment.
- [ ] Update all artist MDX files with their specific schedules and calendar IDs.
- [ ] Monitor cache performance in production.
