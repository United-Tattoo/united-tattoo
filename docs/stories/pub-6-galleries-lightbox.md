# UT-PUB-06 — Artist Galleries with Style Filters and Lightbox

## Status
Draft

## Story
As a visitor,  
I want to browse artist galleries with style-based filtering and interactive zoom/lightbox,  
so that I can quickly explore relevant work and inspect pieces without layout shifts.

## Acceptance Criteria
1. Given I’m on an artist page  
   When I filter by style or click an image  
   Then the gallery updates, and I can zoom without layout shift

## Tasks / Subtasks
- [ ] Define IA/UX and behavior (AC: 1)
  - [ ] Decide filter control pattern: style chips (multi-select) vs. tabs (single/multi) with clear active state
  - [ ] Provide an “All styles” default and a “Clear filters” action with keyboard support
  - [ ] Grid layout responsive spec (e.g., 2 cols sm, 3 cols md, 4 cols lg) with consistent gaps and aspect ratios
- [ ] Implement style filters using ShadCN primitives (AC: 1)
  - [ ] Build filter controls with `Badge`/`Toggle`/`Checkbox` + `Popover` or `Tabs` (consistent with DS)
  - [ ] Ensure accessible names for controls and selection state (aria-pressed/aria-checked as appropriate)
  - [ ] Optional: sync selected styles to URL search params to preserve state on reload/back
- [ ] Gallery grid with CLS-safe images (AC: 1)
  - [ ] Use Next `<Image>` with explicit width/height or `sizes` + aspect-ratio wrappers to prevent CLS
  - [ ] Lazy-load and use blur or LQIP placeholders for progressive loading
  - [ ] Support client-only fallback where required while keeping server components where possible
- [ ] Lightbox / zoom experience (AC: 1)
  - [ ] Implement lightbox with ShadCN `Dialog` (or `Sheet`) composition: open on image click; focus trap; Esc closes; overlay click closes
  - [ ] Provide keyboard navigation for next/prev (←/→) and close (Esc); visible focus for controls
  - [ ] Add basic zoom controls (+/−/fit) or at minimum a full-bleed modal image with proper alt text
  - [ ] Ensure images are marked decorative (`aria-hidden`) in grid when redundant with captions; modal has accessible name/description
- [ ] Empty/loading/error states (AC: 1)
  - [ ] Loading skeletons for grid; empty state messaging for no matching styles (with clear filters action)
  - [ ] Reduced motion supported; minimize distracting transitions; respect `prefers-reduced-motion`
- [ ] Performance checks (AC: 1)
  - [ ] Validate no layout shift on open/close or image load; pre-allocate modal dimensions or use aspect-ratio containers
  - [ ] Avoid long tasks > 50ms during navigation/zoom; throttle handlers; only minimal client JS in modal
- [ ] Tests and checks (AC: 1)
  - [ ] RTL tests: filtering updates visible thumbnails; clicking opens modal; Esc closes; arrow keys navigate
  - [ ] A11y assertions: labels/roles, focus-trap, return focus to trigger on close, live region (optional) for image count
  - [ ] Snapshot/DOM assertions for grid structure (classes for gap/cols/aspect) and empty/loading states

## Dev Notes
Pulled from project artifacts (do not invent):
- docs/PRD.md (Epic C — Public Website)
  - UT‑PUB‑06: Browse artist galleries with style-based filtering and interactive zoom/lightbox; no layout shift
  - C1–C3: ShadCN baseline; responsive behavior; smooth/consistent navigation
- docs/ui-architecture.md
  - Use ShadCN/Radix primitives; Tailwind v4; `cva()` variants + `cn()` merge
  - Accessibility: WCAG AA, labeled controls, keyboard navigation, focus management, avoid traps
  - Performance: server components where sensible; client JS only for interactivity; define sizes to prevent CLS; lazy-load heavy modules
- Existing Source Tree (verify before edits)
  - `components/artist-portfolio.tsx` (artist gallery composition)
  - `components/artists-grid.tsx` (grid listing for artists/cards)
  - `data/artists.ts` (source of artist/portfolio metadata; extend locally for styles if needed)
  - `components/ui/*` primitives (Dialog, Badge/Toggle/Checkbox, Tabs), `lib/utils.ts` (`cn`)

### Implementation Hints
- Filters:
  - Consider `Tabs` for mutually exclusive primary style with optional “All” and `Popover`/`Command` for multi-select advanced filter
  - Active filter chips summary above the grid (dismissible chips)
- Lightbox:
  - Use `Dialog` with `DialogContent` set to `max-w-[calc(100vw-2rem)]` and responsive `h-[80vh]` container; image inside `object-contain`
  - Keyboard handlers in a small hook; ensure focus returns to last clicked thumbnail on close
- Image handling:
  - Provide `sizes` for breakpoints (e.g., `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw`)
  - Use `placeholder="blur"` (or custom low-res) to improve perceived performance

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component: filter logic utilities; dialog open/close; arrow key handlers; focus return
- Integration: page-level tests on an example artist route verifying filter + modal behavior
- Accessibility: roles/labels, keyboard navigation (Tab/Shift+Tab, arrows, Esc), visible focus
- Performance: assert that `img` elements have width/height or parent aspect-ratio to avoid CLS

## Change Log
| Date       | Version | Description                                   | Author       |
|------------|---------|-----------------------------------------------|--------------|
| 2025-09-19 | 0.1     | Initial draft of PUB‑06 story                 | Scrum Master |

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
