# United Tattoo — Brownfield Architecture Document (Focused: Epic C — Public Website Experience)

This document captures the CURRENT STATE of the public-facing website (home/marketing pages, artist discovery, static content). It reflects actual behavior, patterns, and technical constraints to guide improvements.

## Document Scope

Focused on: homepage sections (Hero, Artists, Services, Contact), navigation and scroll behaviors, artists discovery and profiles, static informational pages (aftercare, deposit, terms, privacy, specials, gift cards).

### Change Log

| Date       | Version | Description                                      | Author           |
| ---------- | ------- | ------------------------------------------------ | ---------------- |
| 2025-09-18 | 1.0     | Initial brownfield analysis (Public website)    | Architect Agent  |

---

## Quick Reference — Key Files and Entry Points

### Pages and Sections
- app/page.tsx (Home) → renders in-page sections:
  - components/hero-section.tsx
  - components/artists-section.tsx
  - components/services-section.tsx
  - components/contact-section.tsx
- app/artists/page.tsx → artists listing surface
- app/artists/[id]/page.tsx → dynamic artist portfolio page via ArtistPortfolio
- app/contact/page.tsx → contact page wrapper (components/contact-page.tsx)
- app/aftercare/page.tsx → aftercare (components/aftercare-page.tsx)
- app/deposit/page.tsx → deposit (components/deposit-page.tsx)
- app/terms/page.tsx → terms (components/terms-page.tsx)
- app/privacy/page.tsx → privacy (components/privacy-page.tsx)
- app/specials/page.tsx → specials (components/specials-page.tsx)
- app/gift-cards/page.tsx → gift cards (components/gift-cards-page.tsx)

### Core Components (Public)
- components/navigation.tsx → top nav with anchor-based section links (#home, #artists, #services, #contact)
- components/scroll-progress.tsx, components/scroll-to-section.tsx → scroll UX affordances
- components/mobile-booking-bar.tsx (present; not necessarily mounted globally)
- components/artist-portfolio.tsx → artist detail content (on dynamic page)
- components/artists-section.tsx → parallax artist grid on homepage (uses static data)
- components/artists-page-section.tsx → listing page content
- components/footer.tsx → global footer with site links

### Data
- data/artists.ts → static artist data (names, bios, images, styles, slugs)

---

## High-Level Architecture (Public Website Reality)

- Home uses App Router and is composed of client components with scroll-based effects (parallax, reveal-on-intersection).
- Navigation uses hash anchor links to scroll to in-page sections. Active section highlighting is computed via window.scroll position.
- Artist discovery is powered by a static file (data/artists.ts) rather than D1; the homepage and artists pages read directly from this file.
- Artist detail pages are dynamic routes at /artists/[id] and render ArtistPortfolio with the id URL param (string).
- Static informational pages (aftercare, deposit, terms, privacy) use ShadCN components for consistent typography and layout.
- Visuals are image-forward; images are served from public/ (images unoptimized at Next level).

Implication: The public site is primarily static and visually rich. Dynamic content (artists, availability) is not sourced from DB for public surfaces yet.

---

## Source Tree and Composition (Relevant Extract)

```
app/
├── page.tsx                      # Home (sections via components)
├── artists/page.tsx              # Artists listing wrapper
├── artists/[id]/page.tsx         # Artist profile
├── contact/page.tsx              # Contact wrapper
├── aftercare/page.tsx            # Aftercare content
├── deposit/page.tsx              # Deposit content
├── terms/page.tsx                # Terms
├── privacy/page.tsx              # Privacy
├── specials/page.tsx             # Specials
├── gift-cards/page.tsx           # Gift cards
components/
├── navigation.tsx                # Top navigation (anchors)
├── hero-section.tsx              # Landing hero w/ parallax
├── artists-section.tsx           # Home artists grid w/ parallax
├── services-section.tsx          # Home services section
├── contact-section.tsx           # Home contact section
├── artists-page-section.tsx      # Full artists page section
├── artist-portfolio.tsx          # Artist detail content
├── scroll-progress.tsx           # Scroll indicator
├── scroll-to-section.tsx         # Jump/scroll utility
├── footer.tsx                    # Global footer
data/
└── artists.ts                    # Static artist directory
public/
└── artists/                      # Artist images, work images
```

---

## Behavior Details and UX Patterns

### Navigation (components/navigation.tsx)
- Client component with internal state: isOpen (mobile menu), isScrolled, activeSection.
- On scroll: toggles header styling (opaque/transparent) and updates activeSection based on element positions for ids [home, artists, services, contact].
- Links:
  - Large screens: anchor links with active underline animation.
  - Mobile: full-screen menu with section links and a prominent “Book Now” button (links to /book).
- Note: Anchor links are only relevant on the homepage. When navigation is used on subpages (e.g., /artists), anchors may not exist, resulting in no-op or jump to missing sections.

### Hero (components/hero-section.tsx)
- Parallax background using united-logo-full.jpg; foreground elements translate subtly on scroll.
- Animated reveal on mount.
- Primary CTA button “Book Consultation” presently does not link to /book (no href provided in code).

### Artists Section (components/artists-section.tsx)
- Uses IntersectionObserver for reveal animations and requestAnimationFrame for parallax updates.
- Distributes artists into left/center/right columns for visual balance.
- Uses static data from data/artists.ts. Buttons:
  - PORTFOLIO → /artists/{artist.id} (numeric id)
  - BOOK → /book
- Background and portrait layering with CSS masks; heavy imagery and parallax transforms.

### Artists Listing and Profiles
- app/artists/page.tsx wraps ArtistsPageSection.
- app/artists/[id]/page.tsx passes params.id to ArtistPortfolio.
- Static directory usage; no D1-driven content yet.

### Static Pages (aftercare, deposit, terms, privacy, contact, specials, gift cards)
- Each page wraps respective components using ShadCN primitives.
- Deposit page is comprehensive policy content (no live payment integration).

---

## Technical Debt and Known Issues (REALITY)

1) Static artist source vs DB
- Public site uses data/artists.ts for artist info and imagery. Admin uses D1 for artists and portfolio. These diverge and will drift.
- The dynamic profile route takes numeric id; elsewhere in the codebase and future API plans prefer UUIDs. Slug vs id inconsistencies also exist (booking form uses slug for artist selection).

2) Navigation anchors on non-home pages
- Navigation links are section anchors (#home, #artists, etc.). On subpages (e.g., /artists), these anchors aren’t present, so links will not scroll to corresponding sections. Consider routing back to home with hash or using route segments with scroll to id.

3) CTA link missing
- “Book Consultation” in hero-section.tsx is a button without a link to /book, reducing conversion.

4) Image optimization
- next.config.mjs sets images.unoptimized: true. All images served as-is from public. Heavy images + parallax effects may impact LCP/INP. No Next/Image usage nor CDN transforms configured.

5) Accessibility and SEO gaps
- No explicit metadata/SEO (title/description per page), OG tags, or structured data for artists.
- Animations and parallax may affect accessibility (motion sensitivity); no reduced-motion handling observed.
- Color contrast appears high but isn’t programmatically validated.

6) Performance considerations
- Many large images on the homepage; no lazy loading for offscreen images in custom sections (browser handles basic lazy if configured with loading attributes; not used in plain img tags).
- Parallax and scroll handlers are on the main thread; may affect performance on low-end devices.

7) Link consistency (artists)
- Homepage PORTFOLIO links to /artists/{numeric id}. The site also uses slug elsewhere. Deep-link stability may suffer if numeric ids change.

8) Content/UX duplication across pages
- Contact information appears in multiple places; ensure single source to avoid drift (footer/contact/aftercare/deposit pages).

---

## Recommended Improvements (Public Site)

- Unify artist data source
  - Replace data/artists.ts with DB-backed data fetched via a public /api/artists (sanitized fields).
  - Prefer slugs for stable URLs (/artists/christy-lumberg) and map to DB IDs internally.

- Fix navigation behavior on subpages
  - For anchor targets, either:
    - Route to “/” with hash (e.g., “/ #artists”) and handle scroll on mount, or
    - Create dedicated routes (/artists, /services, /contact) and update nav links accordingly.
  - Ensure active section logic degrades cleanly on non-home pages.

- Wire primary CTAs
  - Update the Hero “Book Consultation” button to link to /book.

- Image strategy
  - Introduce Next/Image for key imagery or configure a Cloudflare image loader.
  - Add width/height to prevent CLS; add loading="lazy" and decoding="async" where appropriate.
  - Consider responsive sources and low-quality placeholders for hero and artist tiles.

- Accessibility and SEO
  - Provide alt text for all decorative/semantic images (artist portraits/work).
  - Respect reduced motion prefers-reduced-motion to tone down parallax.
  - Add metadata per route (title/description), OG tags, and JSON-LD for artists.

- Performance tuning
  - Throttle scroll work, and offload heavy effects where possible.
  - Lazy-render offscreen artist tiles (virtualization or intersection-based reveal) and defer heavy imagery.

- Link stability for profiles
  - Adopt slug routes consistently; redirect old numeric routes to slug.

---

## Gotchas and Practical Notes

- If you switch to API-driven artists, adjust:
  - ArtistsSection and ArtistsPageSection to fetch via /api/artists (public variant).
  - ArtistPortfolio to fetch by slug (or translate slug→id server-side).
- Ensure any new dynamic content is cache-aware; use ISR or tag revalidation patterns to keep public pages responsive.
- Verify the mobile navigation overlay for keyboard and screen reader accessibility.

---

## Appendix — Useful Commands

```bash
npm run dev            # Develop locally
npm run pages:build    # Build for Cloudflare (OpenNext)
npm run preview        # Preview Cloudflare worker locally
npm run deploy         # Deploy to Cloudflare Pages
npm run test           # Unit/component tests
```

---

This document reflects the real state of the public website. It identifies where static content should migrate to data services and highlights UX/accessibility/performance improvements for a robust Epic C delivery.
