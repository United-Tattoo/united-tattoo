# UT-PUB-04 — Quick Search (Ctrl+K) Across Artists and Content

## Status
Ready for Dev

## Story
As a visitor,  
I want a quick search palette I can open with Ctrl+K to find artists and educational content,  
so that I can rapidly navigate to the most relevant pages without leaving my current context.

## Acceptance Criteria
1. Given I press Ctrl+K (or Cmd+K on macOS)  
   When the search dialog opens and I type a query  
   Then I see navigable results for artists and key content pages, and can navigate via keyboard (Enter) or mouse

## Tasks / Subtasks
- [ ] Define UX behavior and scope (AC: 1)
  - [ ] Invocation: keyboard (Ctrl/Cmd+K), header button, and accessible “Open search” control
  - [ ] Result groups: Artists first, then content (Aftercare, Specials, Terms, Privacy, Booking, etc.)
  - [ ] Empty and loading states; close behavior (Esc/click outside); responsive treatment
- [ ] Implement command palette UI using ShadCN primitives (AC: 1)
  - [ ] Base on `Command` + `Dialog` (or `Popover`) primitives with a labeled input
  - [ ] Result items show title, type (artist/content), and optional subtitle (style)
  - [ ] Keyboard navigation: Up/Down to move, Enter to go, Esc to close; focus trap enabled
- [ ] Data sources and matching (AC: 1)
  - [ ] Artists: use `data/artists.ts` (name, styles, slug) for local search
  - [ ] Content: seed a static list of key routes with titles and tags (e.g., Aftercare, Deposit, Book, Privacy, Terms, Specials, Gift Cards, Contact)
  - [ ] Implement lightweight fuzzy/contains matching util; highlight matches (optional)
- [ ] Routing and integration (AC: 1)
  - [ ] Navigate to selected result via Next.js Link or router; close palette after navigation
  - [ ] Integrate trigger in `components/navigation.tsx` or site header
  - [ ] Support deep links (e.g., /artists/[slug])
- [ ] Accessibility (AC: 1)
  - [ ] Input has accessible name; results container has appropriate role
  - [ ] Live region optionally announces result count updates (`aria-live="polite"`)
  - [ ] Ensure focus is returned to the trigger when palette closes
- [ ] Performance and UX polish (AC: 1)
  - [ ] Debounce input; avoid layout shift; keep main thread work minimal
  - [ ] Ensure reduced motion users get no distracting transitions
- [ ] Tests and checks (AC: 1)
  - [ ] RTL tests: open with keyboard shortcut, type to filter, select with Enter, Esc to close
  - [ ] Verify a11y attributes: labels, focus trapping, screen reader announcements
  - [ ] Snapshot or DOM assertions for empty/loading states

## Dev Notes
Pulled from project artifacts (do not invent):
- docs/PRD.md (Epic C — Public Website)
  - UT‑PUB‑04: Quick search (Ctrl+K) to find artists and educational content; navigable results
  - C1–C3: ShadCN baseline; consistent navigation/responsiveness; discovery improvements
- docs/ui-architecture.md
  - Use ShadCN/Radix primitives; Tailwind v4; cva() and cn()
  - Accessibility: WCAG AA, labeled inputs, visible focus, keyboard support, focus management
  - Performance: client JS only where necessary; keep logic lightweight; lazy‑load heavy parts
- Existing Source Tree (verify before edits)
  - `data/artists.ts` for local search source
  - `components/navigation.tsx` potential trigger location
  - `components/ui/*` primitives (Command, Dialog), `lib/utils.ts` for cn()

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component (Vitest + RTL): command palette open/close, input filtering, keyboard navigation
- Accessibility: role/label presence, focus trap, ESC close, return focus to trigger
- Integration: navigation to selected result updates the URL and closes the palette

## Change Log
| Date       | Version | Description                                  | Author       |
|------------|---------|----------------------------------------------|--------------|
| 2025-09-19 | 0.2     | PO validation: Ready for Dev                 | Product Owner|
| 2025-09-19 | 0.1     | Initial draft of PUB‑04 story                | Scrum Master |

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
