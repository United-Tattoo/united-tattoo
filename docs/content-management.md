# Content Management

This guide covers how to add and update artist profiles, manage portfolio images, and configure the calendar integration for each artist.

For the browser-based CMS workflow, see [Decap CMS on Cloudflare](./decap-cms-cloudflare.md). For the older alternative concept of publishing from Nextcloud, see [Nextcloud CMS Publisher Concept](./nextcloud-cms-publisher.md). The manual workflow below remains the fallback process.

---

## Site and Page Content

Decap exposes several repo files for non-technical editing while keeping Git as the source of truth:

- `src/data/site-settings.json`: studio identity, contact details, social links, logo, and favicon.
- `src/data/site-hours.json`: public studio hours for footers, schema, and LLM text.
- `src/data/home.json`: homepage hero, banners, CTA copy, images, and process steps.
- `src/data/booking-form.json`: booking page copy, booking select options, agreement text, submit label, and success modal.
- `src/content/pages/aftercare.md`, `src/content/pages/privacy.md`, `src/content/pages/terms.md`: editable Markdown utility page content.

When editing booking form options, prefer changing labels over values. The `value` fields are submitted by the browser and validated by the booking API.

---

## Artist Content Collection

Each artist is represented by a single MDX file in `src/content/artists/`. The filename becomes the artist's URL slug. For example, `christy-lumberg.mdx` is accessible at `/artists/christy-lumberg`.

Decap can create and delete artist entries from the Artists collection. Use the `Archived` toggle to hide an artist from public pages, booking, sitemap, and generated LLM text without deleting the file.

### Adding a New Artist

1. Create a new file: `src/content/artists/{first-last}.mdx`
2. Fill in the frontmatter (see schema below)
3. Write the artist's bio/statement as MDX body content
4. Add their images to `public/artists/{First-Last}/` (see Image Management)

### Frontmatter Schema

```yaml
---
name: "Jane Smith"                    # required, display name
archived: false                       # optional, hide from public site when true
portrait: /artists/Jane-Smith/portrait.avif  # required, path relative to /public
galleryDir: artists/Jane-Smith        # required, path to gallery folder relative to /public

specialties:                          # optional, displayed on profile and listing
  - Fine Line
  - Botanical

instagram: janesmithink               # optional, handle without @
facebook: janesmithink                # optional
tiktok: "@janesmithink"               # optional
twitch: janesmithink                  # optional
portfolioUrl: https://janesmith.com   # optional, external portfolio link

bookingEmailCc: artist@example.com    # optional, artist receives booking CC at this address
testimonials:                         # optional
  - quote: "Best tattoo of my life."
    client: "Alex T."

# Calendar integration (required for availability features)
calendarId: "jane-smith"              # must match the calendar name/URL segment in Nextcloud
acceptingBookings: true               # shows/hides the Book button
schedule:
  monday: "10:00-18:00"
  tuesday: "10:00-18:00"
  wednesday: closed
  thursday: "10:00-18:00"
  friday: "10:00-20:00"
  saturday: "11:00-17:00"
  sunday: closed
bufferMinutes: 30                     # buffer time added after each booked event
---
```

All fields marked "optional" can be omitted entirely. The schema is validated by Zod at build time — the build will fail if required fields are missing or have the wrong type.

### Schedule Format

- Hours use 24-hour `HH:MM-HH:MM` format
- Use the literal string `closed` for days the artist doesn't work
- Omit the `schedule` block entirely if you don't need the calendar picker (availability will be empty)

### Body Content (MDX)

The content below the frontmatter is rendered as the artist's bio on their profile page. Standard Markdown works. You can use HTML elements too.

```mdx
## About Jane

Jane specializes in delicate fine-line work and botanical illustrations...

### Style & Approach

Her approach focuses on...
```

---

## Image Management

Artist images are served from `public/artists/`. The directory structure is:

```
public/artists/
  {Artist-Name}/       # matches galleryDir in frontmatter
    portrait.avif      # matches portrait field in frontmatter
    Portfolio/
      image-001.avif
      image-002.avif
      ...
    Flash/             # optional
      flash-001.avif
      ...
```

- The site expects AVIF format for all images
- Portrait images appear on the artist listing and profile hero
- Portfolio images are managed in each artist's `cmsPortfolioUploads` list and appear in the gallery grid on the artist's page
- Flash images are managed in each artist's `cmsFlashUploads` list and appear under the "Flash" toggle tab on the artist's page
- If those CMS lists are missing, the site falls back to scanning the matching `Portfolio/` and `Flash/` folders at build time

### Converting Images to AVIF

The project includes a batch conversion script:

```bash
# Convert all JPEG images in public/
pnpm convert:avif:jpeg

# Convert all PNG images
pnpm convert:avif:png

# Convert everything (JPEG, PNG, WebP, GIF, BMP, TIFF)
pnpm convert:avif:all

# Custom quality (default is 65)
node src/utils/convert-to-avif.js --jpeg --quality 80
```

This requires ffmpeg to be installed (`sudo pacman -S ffmpeg` / `brew install ffmpeg`).

The script skips files that already have an AVIF counterpart, so it's safe to run repeatedly.

### Portrait Images

Portraits are used in:
- The artists index listing (thumbnail, ~48px circle on mobile)
- The artist profile hero (full-bleed background, desaturated)
- The desktop hover reveal on the homepage artist list

Recommended: shoot or source at 1:1 or portrait (3:4) aspect ratio, at least 800px wide. The hero applies `object-position: center 20%` so faces should be in the upper half of the frame.

---

## Calendar Integration (Artist Availability)

Each artist with a `calendarId` in their frontmatter gets a live availability calendar on the booking form. Availability is fetched from Nextcloud via CalDAV.

### Setup Requirements

The following must be configured as environment variables (in `.env` locally, or as Cloudflare Worker secrets in production):

```env
NEXTCLOUD_CALDAV_URL=https://your-nextcloud.com/remote.php/dav
NEXTCLOUD_USERNAME=admin_user
NEXTCLOUD_PASSWORD=admin_password
```

### How calendarId Maps to Nextcloud

The `calendarId` field is matched against the calendar's display name or URL. When the availability service fetches calendars, it looks for one where:

- `calendar.displayName === calendarId`, OR
- The calendar URL ends with `calendarId` or `calendarId/`

So if your Nextcloud calendar is named "Christy Lumberg" and the URL is `.../calendars/admin/christy-lumberg/`, you can set `calendarId: "christy-lumberg"`.

### Availability Logic

The system generates 30-minute time slots within each artist's `schedule` hours. A slot is marked unavailable if:

1. It overlaps with any event on the artist's Nextcloud calendar
2. It falls within `bufferMinutes` after a booked event ends

Availability is cached per artist for 15 minutes in `.calendar-cache/availability.json` to avoid hammering the CalDAV server on every page load.

### Artists Without Calendars

If an artist has no `calendarId`, no `schedule`, or if CalDAV credentials are missing, the booking form simply omits the time slot picker for that artist. The booking submission still works — the client types their availability as free text.

---

## Updating Admin Email Recipients

Booking notifications always go to the configured admin recipients defined in `src/pages/api/booking.ts`:

```ts
const ADMIN_EMAILS = ['owner@example.com', 'studio@example.com'];
```

Do not commit personal recipient addresses to public documentation. If the selected artist has a `bookingEmailCc` field in their MDX file, they are CC'd automatically.

---

## Managing Testimonials

Add the `testimonials` array to an artist's frontmatter. Each entry needs `quote` and `client`:

```yaml
testimonials:
  - quote: "Exactly what I envisioned, down to the last detail."
    client: "Morgan C."
  - quote: "Gentle hand, incredible result."
    client: "Taylor R."
```

The testimonials section renders automatically on the artist profile if this array is present and non-empty. Remove or empty the array to hide the section.
