# UT-PUB-03 — Search Page with Filters (Style, Availability, Price Tier)

## Status
Ready for Dev

## Story
As a visitor,  
I want a dedicated search page with filters for style, availability, and price tier,  
so that I can quickly find relevant artists and content that match my preferences.

## Acceptance Criteria
1. Given I’m on /search  
   When I apply filters (style, availability, price tier)  
   Then artist and content results update accordingly

## Tasks / Subtasks
- [ ] Define information architecture and UX (AC: 1)
  - [ ] Specify URL and route location (e.g., `app/(marketing)/search/page.tsx`)
  - [ ] Determine filter controls: Style (multi-select), Availability (toggle/range), Price Tier (segmented or select)
  - [ ] Document a11y labels, roles, and keyboard interactions for all controls
- [ ] Implement filter UI using ShadCN primitives (AC: 1)
  - [ ] Style filter: multi-select (e.g., `Command`, `Popover`, `Checkbox`) or `Combobox`
  - [ ] Availability filter: switch/toggle or date-range stub; annotate as UI‑only if backend is pending
  - [ ] Price tier: `Select` or segmented controls; describe tiers in helper text
  - [ ] Provide a clear “Reset filters” action and active filter chips summary
- [ ] Results panel & empty/loading states (AC: 1)
  - [ ] Create results list component (artists first; content secondary if present)
  - [ ] Provide `loading` state skeletons and `empty` state messaging with guidance
  - [ ] Ensure responsive layout (stack on mobile; two-column at md+ if space allows)
- [ ] Wiring strategy (frontend scope) (AC: 1)
  - [ ] Implement client-side filter state (Zustand or component state) with URL sync via search params
  - [ ] Stub data source: use existing `data/artists.ts` and extend shape locally if needed (no DB access)
  - [ ] Add filtering utilities (pure functions) to filter by style/availability/price tier
- [ ] Accessibility & usability (AC: 1)
  - [ ] Proper labels and `aria-describedby` for controls; visible focus states
  - [ ] Keyboard navigation for opening/closing filter popovers and selecting items
  - [ ] Announce result counts with `aria-live="polite"` when filters change
- [ ] Performance & UX polish (AC: 1)
  - [ ] Debounce filter updates where typing involved; avoid layout shift
  - [ ] Progressive loading placeholders; ensure images use Next `<Image>` with defined sizes
- [ ] Tests and checks (AC: 1)
  - [ ] RTL tests: applying filters updates visible results; reset clears filters; a11y attributes present
  - [ ] Snapshot or DOM assertions for loading/empty states
  - [ ] Basic URL param sync test to preserve state on reload/back

## Dev Notes
Pulled from project artifacts (do not invent):
- docs/PRD.md (Epic C — Public Website)
  - UT‑PUB‑03: Dedicated search page with filters (style, availability, price tier); results update accordingly
  - C1–C3: ShadCN baseline; consistent navigation/responsiveness; discovery improvements
- docs/ui-architecture.md
  - Use ShadCN/Radix primitives; Tailwind v4; cva() variants and cn() for classes
  - Accessibility: WCAG AA; labeled controls; visible focus; keyboard support
  - Performance: prefer server comps; client JS only when needed; lazy‑load heavy modules
- Existing Source Tree (verify before edits)
  - `data/artists.ts` (baseline data for local filtering)
  - `components/section-header.tsx`, `components/artists-grid.tsx`, `components/artist-portfolio.tsx`
  - `components/ui/*` for primitives; `lib/utils.ts` for cn()

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component (Vitest + RTL): filter components and state logic
- Integration: page-level tests verifying URL param sync and results updates
- Accessibility: presence of labels, roles, keyboard navigation; live region announcer for counts

## Change Log
| Date       | Version | Description                                  | Author       |
|------------|---------|----------------------------------------------|--------------|
| 2025-09-19 | 0.2     | PO validation: Ready for Dev                 | Product Owner|
| 2025-09-19 | 0.1     | Initial draft of PUB‑03 story                | Scrum Master |

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
