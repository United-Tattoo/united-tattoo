# UT-PUB-02 — Parallax and Split-Screen Hero Sections

## Status
Ready for Dev

## Story
As a visitor,  
I want smooth, layered parallax and split‑screen hero sections on key pages,  
so that the site feels immersive and visually engaging without sacrificing performance or accessibility.

## Acceptance Criteria
1. Given I’m on the homepage or an artist page  
   When I scroll  
   Then layered visuals and split sections animate smoothly within performance budgets (no noticeable jank; respects prefers‑reduced‑motion)

## Tasks / Subtasks
- [ ] Define UX and constraints (AC: 1)
  - [ ] Specify max parallax depth, layers, and scroll ranges (mobile/desktop)
  - [ ] Document fallback behavior for `prefers-reduced-motion: reduce` (animations disabled or simplified)
  - [ ] Establish performance budgets: LCP target, avoid layout shift, minimal main thread cost
- [ ] Implement homepage hero enhancements (AC: 1)
  - [ ] Update/extend `components/hero-section.tsx` for layered composition (foreground text, midground overlays, background image)
  - [ ] Use CSS transforms and opacity for motion; avoid heavy JS; throttle with requestAnimationFrame
  - [ ] Guard with `use client` only where needed; ensure SSR compatibility for static layers
- [ ] Implement artist page split‑screen/hero (AC: 1)
  - [ ] Add or update hero for artist pages (e.g., `components/artists-page-section.tsx` / `components/artist-portfolio.tsx`) to support split‑screen layout (image/story)
  - [ ] Ensure composition adapts at breakpoints (stack on mobile, split at md+)
- [ ] Motion system & accessibility (AC: 1)
  - [ ] Respect `prefers-reduced-motion`; expose CSS class or data attribute to disable animations
  - [ ] Use `tailwindcss-animate` classes for subtle transitions; avoid inline animation CSS
  - [ ] Ensure focus order and headings are unaffected by decorative layers (decorative images `aria-hidden`)
- [ ] Smooth scrolling integration (AC: 1)
  - [ ] If Lenis is enabled, verify no conflict with parallax updates (no double scroll handlers)
  - [ ] Disable or degrade parallax effect when smooth scroll is off or reduced motion is on
- [ ] Performance validation (AC: 1)
  - [ ] Audit LCP/INP locally; ensure no long tasks > 50ms introduced by parallax logic
  - [ ] Validate no layout shift (CLS) from parallax layers; use fixed heights/aspect‑ratio placeholders
- [ ] Tests and checks (AC: 1)
  - [ ] RTL tests validate presence of hero layers and reduced‑motion fallback class toggles
  - [ ] Add visual acceptance notes and manual test plan for scroll behavior across sm/md/lg

## Dev Notes
Pulled from project artifacts (do not invent):
- docs/PRD.md (Epic C — Public Website)
  - UT‑PUB‑02: Smooth, performant parallax/split‑screen hero on homepage and artist pages
  - Visual emphasis with high‑quality photography; mobile‑first responsiveness (C1–C3)
- docs/ui-architecture.md
  - Use Tailwind v4 utilities; ShadCN/Radix for a11y components; use `tailwindcss-animate` and Lenis; avoid heavy JS animation libs
  - Accessibility baseline WCAG AA; focus visible; avoid keyboard traps; keep components presentational with side‑effects in hooks
  - Performance: prefer server components; client JS only when necessary; lazy‑load heavy modules
- Existing Source Tree (verify before edits)
  - `components/hero-section.tsx` (homepage hero)
  - `components/artists-page-section.tsx`, `components/artist-portfolio.tsx` (artist views)
  - `components/section-header.tsx`, `components/smooth-scroll-provider.tsx` (potential integration points)

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component: Vitest + RTL; deterministic; verify reduced‑motion behavior and layer presence
- E2E (later): confirm smooth scroll and no jank on critical scroll ranges in preview env
- Targets: No CLS from hero; initial render stable with defined heights/placeholders

## Change Log
| Date       | Version | Description                                   | Author       |
|------------|---------|-----------------------------------------------|--------------|
| 2025-09-19 | 0.2     | PO validation: Ready for Dev                  | Product Owner|
| 2025-09-19 | 0.1     | Initial draft of PUB‑02 story                 | Scrum Master |

## Dev Agent Record
### Agent Model Used
<!-- dev-agent: record model/version used during implementation -->

### Debug Log References
<!-- dev-agent: link to any debug logs or traces generated -->

### Completion Notes List
<!-- dev-agent: notes about completion, issues encountered, resolutions -->

### File List
<!-- dev-agent: list all files created/modified/affected during implementation -->

## QA Results
<!-- qa-agent: append review results and gate decision here -->
