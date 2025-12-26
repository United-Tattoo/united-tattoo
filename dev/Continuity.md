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

- Background: `#050505` (near-black)
- Text: `#e0e0e0` (light gray)
- Accent: `#ffffff` (white)
- Grid lines: `rgba(255, 255, 255, 0.1)`
- Muted: Various gray shades for hierarchy

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
