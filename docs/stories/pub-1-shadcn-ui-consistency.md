# UT-PUB-01 — ShadCN UI Consistency Across Pages

## Status
Draft

## Story
As a visitor,  
I want the site to provide a consistent ShadCN-based UI across all pages,  
so that navigation and interactions feel cohesive and predictable.

## Acceptance Criteria
1. Given any site page  
   When I navigate and interact  
   Then spacing, typography, components, and transitions are consistent

## Tasks / Subtasks
- [ ] Establish consistency audit across key pages (AC: 1)
  - [ ] Review /aftercare, /deposit, /terms, /privacy, /book, home, and artist-related pages for spacing/typography/component variance
  - [ ] Document variance list and map each to ShadCN primitive or composed component
- [ ] Standardize typography and spacing scales (AC: 1)
  - [ ] Align to ShadCN/Tailwind scales per docs/ui-architecture.md “Styling Guidelines”
  - [ ] Normalize heading/body sizes and leading across templates/layouts
- [ ] Replace/align components to ShadCN primitives where mismatched (AC: 1)
  - [ ] Identify ad-hoc buttons/inputs/cards and replace with registry-aligned ui/* components
  - [ ] Ensure variant management via cva() and class merging via cn()
- [ ] Ensure consistent page skeletons and boundaries (AC: 1)
  - [ ] Provide/verify loading.tsx and error.tsx per key segments for consistent loading/error states
  - [ ] Verify shared page section wrappers (components/layouts or shared) for paddings, max-width, and breakpoints
- [ ] Motion and transition alignment (AC: 1)
  - [ ] Use tailwindcss-animate for subtle transitions; avoid custom inline animation styles
  - [ ] Verify smooth scroll behavior is consistent where Lenis is used (if applicable to page)
- [ ] Tests and checks (AC: 1)
  - [ ] Add RTL tests to verify consistent class patterns on representative pages/components
  - [ ] Add visual acceptance notes for spacing/typography on critical templates

## Dev Notes
Pulled from project artifacts (do not invent):

- docs/ui-architecture.md
  - Framework: Next.js 14 App Router with server components by default
  - UI: ShadCN UI + Radix primitives; Tailwind v4 utilities; cva() variants and cn() class merge
  - Styling Guidelines: Tailwind as primary styling, follow ShadCN spacing/typography tokens
  - Routing: Provide loading.tsx and error.tsx for key segments; use route groups for separation
  - Component Standards: Typed components, cva variants, consistent naming (kebab-case files, PascalCase components)
  - Testing Requirements: Vitest + RTL for components; deterministic tests; mock external dependencies
- docs/PRD.md (Epic C — Public-Facing Website Experience)
  - C1: All pages follow ShadCN baseline; unify typography, spacing, and components
  - C2: Improve core public pages and ensure responsive, mobile-first behavior
- Existing Source Tree (reference only; verify before edits)
  - app/ (App Router segments), components/ui/ (ShadCN primitives), components/* (composed/shared), styles/globals.css (Tailwind base)

### Testing (from docs/ui-architecture.md: Testing Requirements/Best Practices)
- Unit/Component: Vitest + RTL; Arrange-Act-Assert; deterministic; mock router/network
- Structure: tests under __tests__/ with component and integration coverage
- Goals: Verify applied class patterns for typographic scale and spacing, and presence of ShadCN primitives/variants in representative pages

## Change Log
| Date       | Version | Description                                 | Author         |
|------------|---------|---------------------------------------------|----------------|
| 2025-09-19 | 0.1     | Initial draft of PUB-01 story               | Scrum Master   |

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
