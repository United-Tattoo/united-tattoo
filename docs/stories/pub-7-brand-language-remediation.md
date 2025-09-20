# UT-PUB-07 — Brand Language Remediation (Sitewide Copy)

## Status
Ready for Dev

## Story
As a site visitor,  
I want clear, human, no‑nonsense copy without buzzwords or hype,  
so that I can understand services and artists quickly without feeling marketed to.

## Acceptance Criteria
1. Given I visit key public pages (/, /artists, /gift-cards, /services, /specials),  
   When I read the visible copy,  
   Then no disallowed phrases or hype terms appear per docs/united_tattoo_brand_language_guidelines.md, and revised copy matches the guidelines’ tone and examples.

2. Given the SEO metadata (app/layout.tsx),  
   When I review the meta description,  
   Then it uses plain language with no hype words (e.g., “stunning”, “exceptional”), following the guidelines.

3. Given artist bios and marketing blurbs (data/artists.ts),  
   When I read bios,  
   Then language is concrete and justified (years, specialties, examples), with no absolute superlatives (e.g., “powerhouse”, “unparalleled”, “next‑level results”).

4. Given a brand‑language lint test is added to CI,  
   When the test runs on PR,  
   Then it fails if disallowed phrases are introduced anywhere under app/, components/, data/ and passes after remediation.

5. Given the guidelines require Grade‑7 reading level as a standard,  
   When I spot‑check revised copy with a readability tool,  
   Then copy approximates Grade‑7 or lower (short sentences, concrete nouns/verbs) and avoids abstract metaphors.

## Tasks / Subtasks
- [ ] Apply copy rewrites in components (AC: 1)
  - [ ] components/artists-page-section.tsx  
        Replace: “Our exceptional team… unique expertise and artistic vision… your perfect tattoo.”  
        With: “Meet our artists. See their work and specialties. We’ll match you to the right artist for what you want.”
  - [ ] components/artists-grid.tsx  
        Replace: “talented… unique style… create your perfect tattoo.”  
        With: “Browse artists by style and experience. Pick the one whose work matches what you want.”
  - [ ] components/gift-cards-page.tsx  
        Replace: “Give the gift of exceptional tattoo artistry. Perfect for …”  
        With: “Give a tattoo gift card. Good for any service. Never expires.”
  - [ ] components/services-section.tsx  
        Replace: “Transform… into stunning new pieces… bold blackout designs.”  
        With: “Cover‑ups and blackout. We design a new piece to cover the old one. Free consult to pick the best approach.”
  - [ ] components/services-mobile-carousel.tsx and components/services-mobile-only.tsx  
        Mirror the services‑section rewrite above.
  - [ ] components/specials-page.tsx  
        Replace “Perfect for first‑time clients” / “Perfect gifts …”  
        With: “Good for first‑time clients” / “Good gift for anyone who wants a tattoo.”
  - [ ] components/artist-portfolio.tsx (marketing blurbs only; authentic client quotes may remain as quotes)  
        Replace hype (“powerhouse”, “exceptional”, “next‑level results”)  
        With concrete: “22+ years. Focus: cover‑ups, makeovers, illustrative work. See recent cover‑ups in the portfolio.”

- [ ] Normalize artist bios (AC: 3)
  - [ ] data/artists.ts — Christy  
        Replace: “powerhouse… exceptional… next‑level results… name you trust… creativity and expertise thrive”  
        With: “22+ years. Cover‑ups, makeovers, illustrative designs. Based in Fountain/Colorado Springs. See cover‑up examples.”
  - [ ] data/artists.ts — Donovan  
        Replace: “unparalleled passion and creativity”  
        With: “Bold illustrative work with fine detail. See recent pieces.”
  - [ ] data/artists.ts — Heather  
        Replace: “unmatched artistry… turns skin into stunning, wearable art”  
        With: “Vibrant watercolor and embroidery‑style designs. Portfolio shows healed results.”
  - [ ] data/artists.ts — Other entries  
        Remove/replace “perfect”, “exceptional”, “stunning”, “trusted name/name you trust”, “next‑level”, “powerhouse”, “thrive(s)”. Use concrete facts (years, styles, favorite subjects) and link to work.

- [ ] SEO meta description (AC: 2)
  - [ ] app/layout.tsx  
        Replace: “explore stunning tattoo portfolios”  
        With: “Browse artists’ portfolios and book with the artist you want.”

- [ ] Add brand‑language lint tests (AC: 4)
  - [ ] Create __tests__/content/brand-language-lint.test.ts  
        Fails on banned patterns (regex: “exceptional|unique|perfect|world[- ]class|cutting[- ]edge|unparalleled|next[- ]level|powerhouse|trusted name|name you trust|premium experience|seamless experience|unforgettable|thrive[s]?|elevat\w+|stunning|incredible|exceeded all my expectations”).  
        Scope: scan text content of app/, components/, data/.
  - [ ] Wire test in CI (existing Vitest runs): ensure it executes with the rest.
  - [ ] Document how to extend the banned list from docs/united_tattoo_brand_language_guidelines.md.

- [ ] Spot readability checks (AC: 5)
  - [ ] Run a quick readability check (manual or script) on changed files; shorten or simplify where needed (Grade‑7 target).
  - [ ] Ensure sentences are short; replace abstract phrasing with concrete (sizes, hours, examples).

- [ ] Regression & QA
  - [ ] Visual check of updated pages for layout shifts after copy changes (line wraps, responsiveness at sm/md/lg).
  - [ ] Verify no snapshot or RTL tests fail due to text changes (update snapshots where intended).
  - [ ] Confirm no banned phrases remain (re-run search and tests).

## Dev Notes
Authoritative source:
- docs/united_tattoo_brand_language_guidelines.md (Version 1.0)

Remediation scope (from prior audit):
- components: artists-page-section.tsx, artists-grid.tsx, gift-cards-page.tsx, services-section.tsx, services-mobile-carousel.tsx, services-mobile-only.tsx, specials-page.tsx, artist-portfolio.tsx (marketing blurbs)
- data: data/artists.ts (bios and detail lists)
- app: app/layout.tsx (SEO description)

Guidelines to enforce:
- No hype/buzzwords; plain speaking; justified confidence only
- Concrete facts over abstract claims
- Grade‑7 reading level target; short sentences, contractions OK
- Authentic client quotes can remain as quotes (not repeated as brand claims)

## Testing
- Vitest: brand‑language‑lint.test.ts ensures banned phrases absent in text sources
- RTL/component: update any snapshots impacted by copy changes
- Manual: readability spot‑checks; cross‑device text wrap checks

## Change Log
| Date       | Version | Description                               | Author        |
|------------|---------|-------------------------------------------|---------------|
| 2025-09-20 | 0.1     | Initial draft of PUB‑07 remediation story | Scrum Master  |

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
