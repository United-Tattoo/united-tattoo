# Architecture

An explanation of the key systems and patterns in this codebase.

---

## Rendering Strategy

The site runs in Astro's `server` output mode with the `@astrojs/cloudflare` adapter. Most pages are **prerendered** (static at build time) despite the SSR adapter — the API routes require SSR.

Pages with `export const prerender = true` (homepage, artist pages, booking form, etc.) are built to static HTML at deploy time and served from Cloudflare's edge cache. The API routes (`/api/booking`, `/api/availability`, `/api/validate-slot`) run as Cloudflare Workers functions on each request.

This gives you static site performance everywhere except the API, without needing a separate functions-only deployment.

---

## Layout System

`src/layouts/SiteLayout.astro` is the root HTML shell. Every page wraps its content in this component. It handles:

- `<head>` with SEO meta tags (title, description, canonical, OG, Twitter Card)
- Schema.org JSON-LD structured data (via `Schema.astro`)
- Google Fonts loading (Outfit, Geist Mono)
- Iconify icon CDN
- Astro's `<ClientRouter />` for view transitions between pages
- Lenis smooth scroll initialization
- GSAP + ScrollTrigger initialization and global exposure (`window.gsap`, `window.lenis`, `window.ScrollTrigger`)
- `HeaderNav` and `SiteFooter`

Props accepted:

```ts
interface Props {
  title?: string;
  description?: string;
  image?: string;           // defaults to /images/united-studio-main.avif
  type?: 'website' | 'article' | 'profile';
  announcement?: string;    // optional banner text
  hideAnnouncement?: boolean;
  removeMainPadding?: boolean;  // set true on pages with full-bleed heroes
  hideFooter?: boolean;
  artistSchema?: { name, description, image, sameAs? };
}
```

---

## Animation System

GSAP and Lenis are initialized once in `SiteLayout.astro` and exposed on `window`. Individual pages and components access them via `window.gsap`, `window.ScrollTrigger`.

All page-specific animations are initialized inside a listener for `astro:page-load` (not `DOMContentLoaded`) to work correctly with Astro's view transitions:

```js
document.addEventListener('astro:page-load', () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  // ... setup animations
});
```

Lenis syncs to GSAP's ticker for smooth integration with ScrollTrigger:

```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

**Pattern used on page entry animations:** elements are hidden via `gsap.set()` before the page is visible, then animated in. This avoids a flash of the pre-animated state on page load.

---

## Content Collections

Artist profiles are managed as an Astro content collection. The collection is defined in `src/content.config.ts` with a Zod schema. All MDX files in `src/content/artists/` are validated against this schema at build time.

At build time, pages use `getCollection('artists')` to fetch all entries. The homepage builds the image marquee, artists list, and showcase grid from this data. `src/pages/artists/[slug].astro` uses `getStaticPaths()` to generate one page per artist entry.

Portfolio and flash images are stored as Decap-managed frontmatter arrays (`cmsPortfolioUploads` and `cmsFlashUploads`) so the CMS can display and reorder the live galleries. Pages still fall back to scanning the artist's `galleryDir` in `public/` when those arrays are absent.

---

## Booking Flow

```
User fills out /booking form
  → selects artist, style, size, placement, description, availability
  → optionally picks time slots via CalendarPicker (fetches /api/availability)
  → optionally uploads reference images (max 5, 10MB each, JPEG/PNG/WebP/GIF)
  → submits

POST /api/booking
  → validates required fields, email format, file count/size/type
  → looks up selected artist from collection to get bookingEmailCc
  → sends admin notification email (HTML + plain text) with all details + attachments
  → sends client confirmation email with summary and next steps
  → optionally adds client to Resend audience (if newsletter opt-in checked)
  → returns { success: true }

User is redirected to /booking/thanks
```

The booking API reads environment variables from `platform.env` (Cloudflare Workers) or `locals.runtime.env` as a fallback. In development without a Cloudflare runtime, it falls back to `import.meta.env` (Vite env).

---

## Calendar Availability System

The calendar integration has three layers:

### 1. CalDAV Client (`src/services/caldav.ts`)

A thin wrapper around `tsdav` (DAVClient) and `ical.js`. It authenticates with Nextcloud via Basic auth, fetches calendar objects for a time range, and parses each iCal event into a simple `{ title, start, end, status }` shape.

### 2. Availability Cache (`src/services/calendar-cache.ts`)

Fetching CalDAV on every request would be slow and fragile. The cache layer:

- Reads from `.calendar-cache/availability.json` (a key-value store keyed by `calendarId`)
- Returns cached data if it's less than 15 minutes old
- If stale or missing, calls the CalDAV client and regenerates slots
- Generates 30-minute availability slots for the next 3 months based on the artist's `schedule`
- Filters out slots that overlap with CalDAV events or fall within `bufferMinutes` after an event

The cache file is written to the server filesystem. On Cloudflare Workers, filesystem writes go to `/tmp/` (ephemeral per-isolate storage). Cache TTL is 15 minutes.

### 3. API Endpoints

- `GET /api/availability?artist={slug}` — Returns pre-computed available slots for an artist. If fewer than 5 slots are found, also returns up to 3 alternative artists with similar specialties who have more availability.
- `POST /api/validate-slot` — Validates a specific `{ artistId, date, startTime, endTime }` against live CalDAV data. Called before final booking submission to catch race conditions.

---

## Navigation

`HeaderNav.astro` is a fixed-position nav with two states:

- **Transparent** when at the top of the page (white text works over the dark hero photo)
- **Scrolled** when `window.scrollY > 80`: applies a frosted glass background (`backdrop-filter: blur(20px)`)

The mobile menu is a full-screen overlay with staggered link animations. It locks `document.body.overflow` when open.

The nav background state is managed with CSS classes (`nav-transparent`, `nav-scrolled`) toggled by a scroll event listener initialized on `DOMContentLoaded` and re-initialized on `astro:page-load`.

---

## Schema.org / SEO

`Schema.astro` injects JSON-LD structured data into `<head>`. It generates:

- `LocalBusiness` for the studio (homepage and generic pages)
- `Person` + `LocalBusiness` for artist profile pages (when `artistSchema` prop is passed)

The `SiteLayout` always outputs OG and Twitter Card meta tags. Canonical URLs are computed from `Astro.site` + `Astro.url.pathname`.

---

## Design Tokens

The site uses CSS custom properties for the color system, defined in `src/styles/global.css`. Key tokens:

```css
--background: oklch(...)       /* near-black, #050505 equivalent */
--foreground: oklch(...)       /* off-white */
--primary: oklch(...)          /* burnt orange / terracotta accent */
--border: oklch(...)           /* subtle border color */
--muted-foreground: oklch(...)  /* subdued text */
```

The primary color is used for accent dots, CTA buttons, hover states, and the floating CTA button. Tailwind classes like `text-primary`, `bg-primary`, `border-primary` reference these custom properties via Tailwind 4's CSS variable integration.

The editorial grid overlay pattern (vertical lines at 25%, 50%, 75% with intersection dots) is a recurring decorative motif applied manually in each section.
