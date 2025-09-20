# UT-PUB-05 — Aftercare Enhancements (Visuals, Progress, Printable/PDF)

## Status
Draft

## Story
As a visitor,  
I want an improved aftercare page with visuals, progress tracking, and checklists,  
so that I can follow care steps easily and save/print them for reference.

## Acceptance Criteria
1. Given I open /aftercare  
   When I read and mark steps  
   Then my progress is saved locally and content is printable/PDF‑downloadable

## Tasks / Subtasks
- [ ] Define IA/UX and a11y (AC: 1)
  - [ ] Structure the page into sections (e.g., Day 0–1, Days 2–7, Weeks 2+) with clear headings and step lists
  - [ ] Provide alt‑text for visuals/diagrams; use `aria-describedby` for any step notes
  - [ ] Keyboard navigation order verified; focus states visible
- [ ] Implement checklists with local persistence (AC: 1)
  - [ ] Use ShadCN primitives for check items (`Checkbox`, `Label`, `Card`/`Accordion` as needed)
  - [ ] Persist state to `localStorage` keyed by versioned slug (e.g., `aftercare:v1`)
  - [ ] Add “Reset progress” control (with confirm) and incremental autosave
- [ ] Visuals and media (AC: 1)
  - [ ] Integrate representative images/diagrams (from `public/`), marked decorative as appropriate (`aria-hidden`) or described in text
  - [ ] Ensure images use Next `<Image>` with defined sizes/aspect ratio to avoid CLS
- [ ] Printable/PDF output (AC: 1)
  - [ ] Add a print stylesheet: hides nav/interactive chrome, shows checklist states
  - [ ] Provide “Print / Save as PDF” button (invokes `window.print()`); note PDF export in help text
  - [ ] Ensure color contrast and typography meet WCAG AA in print mode
- [ ] Empty/error/reduced‑motion states (AC: 1)
  - [ ] Provide simple skeletons for image blocks
  - [ ] Respect `prefers-reduced-motion` and avoid distracting animations
- [ ] Tests and checks (AC: 1)
  - [ ] RTL tests: checking a step persists after reload; reset clears state
  - [ ] Verify print button renders and calls `window.print()` (mocked)
  - [ ] Basic accessibility assertions: labels for checkboxes, headings structure, contrast tokens

## Dev Notes
Pulled from project artifacts (do not invent):
- docs/PRD.md (Epic C — Public Website)
  - UT‑PUB‑05: Aftercare page with visuals, progress tracking, checklists; printable/PDF
  - C1–C3: ShadCN baseline; responsive/mobile‑first; consistent navigation
- docs/ui-architecture.md
  - Use ShadCN/Radix primitives; Tailwind v4; cva() variants and `cn()` merge
  - Accessibility: WCAG AA, labels, focus, keyboard support; presentational components preferred
  - Performance: server comps where possible; client JS only for interactivity; avoid CLS with defined sizes
- Existing Source Tree (verify before edits)
  - `components/aftercare-page.tsx` (page composition)
  - `app/aftercare/` segment for route
  - `components/section-header.tsx`, `components/ui/*` primitives; `styles/globals.css`

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component (Vitest + RTL): checklist toggling, localStorage persistence, reset flow
- Integration: rendering within `app/aftercare/page.tsx` and print button behavior
- a11y: checkbox labeling, heading outline, focus indicators, print contrast

## Change Log
| Date       | Version | Description                                   | Author       |
|------------|---------|-----------------------------------------------|--------------|
| 2025-09-19 | 0.1     | Initial draft of PUB‑05 story                 | Scrum Master |

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
