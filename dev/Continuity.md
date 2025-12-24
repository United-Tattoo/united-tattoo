# Artists, Booking & Policy Pages Implementation

**Date:** December 24, 2024 @ 14:36 UTC
**Last Updated:** December 24, 2024 @ 16:45 UTC
**Branch:** astro-migration-from-scratch

---

## Summary

Implemented MDX-driven artist pages, a booking system with file uploads and Resend email integration, and policy/aftercare pages. **December 24 update:** Completed a full "Technical Manual" / "Brutalist Editorial" homepage redesign with GSAP + Lenis scroll animations, sticky pinned columns, and cinematic scroll-triggered reveals.

---

## Latest Changes (Dec 24 - Technical Manual Redesign + Scroll Experience)

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

### Modified Files
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
- [x] **Lenis smooth scrolling works**
- [x] **GSAP scroll animations trigger correctly**
- [x] **Sticky columns stay fixed during scroll**
- [x] **Sticky columns lock when footer approaches**
- [x] **Artist hover reveals portrait image**
- [x] **Homepage responsive on mobile**

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
.hero-reveal      /* Hero section staggered reveal targets */
.hero-title       /* Main hero heading animation */
.hero-cta         /* CTA button entrance */
.ingredient-item  /* Active ingredients list stagger */
.artist-row       /* Artist list row cascade */
.process-step     /* Process card animations */
.process-num      /* Process number parallax */
.footer-title     /* Footer title scale reveal */
.footer-reveal    /* Footer content cascade */
```

### Color Palette

- Background: `#050505` (near-black)
- Text: `#e0e0e0` (light gray)
- Accent: `#ffffff` (white)
- Grid lines: `rgba(255, 255, 255, 0.1)`
- Muted: Various gray shades for hierarchy

---

## Notes

- Astro 5 changed content collections significantly - now requires loaders and `content.config.ts` at `src/` level
- The `output: 'hybrid'` option was removed in Astro 5; using `output: 'server'` with `prerender = true` on static pages
- The booking form stores/handles files client-side before upload to avoid issues with FormData on multiple file inputs
- Removed background grid utility to keep the aesthetic clean and gallery-like
- **GSAP + Lenis Integration:** Lenis handles smooth scrolling, GSAP ScrollTrigger syncs via `lenis.on('scroll', ScrollTrigger.update)`
- **Sticky Columns:** Use `position: fixed` with `z-30`, footer uses `z-20` so columns appear to "lock" as footer scrolls over them
- **Homepage hides SiteFooter:** Uses custom embedded footer with `hideFooter={true}` prop on SiteLayout
