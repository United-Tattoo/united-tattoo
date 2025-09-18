# Feature Flags Operations & Verification — Brownfield Addition (FF-3)

Story ID: FF-3  
Epic: Feature Flags Framework for Controlled Rollbacks — Brownfield Enhancement  
Date: 2025-09-18  
Owner: Product Manager (John)  
Depends On:  
- FF-1 (lib/flags.ts implemented)  
- FF-2 (flags wired to Admin/Booking/Public)  

Related Docs:
- docs/prd/epic-feature-flags-controlled-rollbacks.md
- docs/prd/rollback-strategy.md
- docs/brownfield-architecture-tech.md
- docs/brownfield-architecture.md
- docs/brownfield-architecture-booking.md
- docs/brownfield-architecture-public.md

---

Story Title  
Feature Flags Operations & Verification — Brownfield Addition

User Story  
As an operator,  
I want clear runbooks to toggle and verify feature flags,  
So that I can safely mitigate incidents and confirm site stability without guesswork.

Story Context

Existing System Integration
- Integrates with:  
  - Documentation set (PRD shards) under docs/prd/  
  - Cloudflare Pages/Workers operational flow (wrangler vars, dashboard)  
  - QA smoke/verification procedures (lightweight test checklists)  
- Technology: Cloudflare Pages (OpenNext), wrangler CLI, environment variables, Next.js 14 App Router  
- Follows pattern: Extend PRD with actionable ops playbooks tied to brownfield rollback strategy  
- Touch points:  
  - Update docs/prd/rollback-strategy.md with a dedicated “Feature Flags Operations” section (or add a new doc referenced from it)  
  - Optional short README ops note referencing the PRD section

Acceptance Criteria

Functional Requirements
1) A “Feature Flags Operations” section is added to docs/prd/rollback-strategy.md (or a new doc docs/prd/feature-flags-operations.md is created and linked from rollback-strategy.md) that includes:
   - Flag Catalog: Each flag, purpose, default, and affected surfaces  
     - ADMIN_ENABLED  
     - ARTISTS_MODULE_ENABLED  
     - UPLOADS_ADMIN_ENABLED  
     - BOOKING_ENABLED  
     - PUBLIC_APPOINTMENT_REQUESTS_ENABLED  
     - REFERENCE_UPLOADS_PUBLIC_ENABLED  
     - DEPOSITS_ENABLED  
     - PUBLIC_DB_ARTISTS_ENABLED  
     - ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED  
     - STRICT_CI_GATES_ENABLED  
     - ISR_CACHE_R2_ENABLED
   - Toggle Methods:  
     - How to set/unset flags via Cloudflare Dashboard (Pages → Settings → Environment Variables)  
     - How to define for preview/production in wrangler.toml [env.*.vars] (documentation snippets only; no secrets committed)
   - Example wrangler.toml snippet demonstrating booleans:
     ```toml
     [env.preview.vars]
     ADMIN_ENABLED = "true"
     BOOKING_ENABLED = "false"
     ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED = "false"

     [env.production.vars]
     ADMIN_ENABLED = "true"
     BOOKING_ENABLED = "true"
     ```
   - Post-Toggle Smoke Checklist (Enabled/Disabled states):  
     - Admin: /admin entry, CRUD smoke, uploads guarded as configured  
     - Booking: /book loads; submit disabled/enabled behavior correct; CTA to /contact present when disabled  
     - Public: home and /artists render without console errors; animations off when disabled; layout intact  
     - APIs: Representative write endpoints return 503 JSON when gated flags are false (files/portfolio/artists write paths)
   - Incident Playbook:  
     - Immediate mitigation sequence (which flags to flip, in what order)  
     - Cache considerations (when to purge or revalidate)  
     - Roll-forward steps to restore normal operations
   - Monitoring & Thresholds (reference QA report thresholds):  
     - When to consider flipping each flag based on error/latency spikes  
     - Expectations after toggling (error rates/latency return to baseline)

2) Operational Simulation Guidance (Preview)
   - Document how to simulate toggles in preview environment:  
     - Set vars in [env.preview.vars], run `npm run pages:build && npm run preview`  
     - List the exact pages/APIs to check and expected outcomes for both “on” and “off” states.

3) Communication Templates  
   - Provide copy blocks for internal ops notes and optional public banner (booking disabled state) aligning with rollback strategy.

Integration Requirements
4) All documentation changes live under docs/prd/ and are linked from existing PRD index/rollback documents where applicable.  
5) No code changes are required in this story (documentation and verification-only).

Quality Requirements
6) Documentation is concise, actionable, and specific to this project’s flags and surfaces.  
7) Run through a dry “tabletop” exercise in preview (documented steps) to validate the instructions are sufficient.  
8) Ensure links between shards (index → rollback strategy → feature flags operations) are present and correct.

Technical Notes

- Integration Approach:  
  - Prefer appending a new “Feature Flags Operations” section inside docs/prd/rollback-strategy.md to keep procedures centralized.  
  - If the section becomes long, create docs/prd/feature-flags-operations.md and link from rollback-strategy.md.  
- Existing Pattern Reference:  
  - Follow PRD shard formatting used in docs/prd/*.md files.  
- Key Constraints:  
  - Keep this story non-invasive; it should not introduce code changes.

Definition of Done
- [ ] “Feature Flags Operations” content added and linked (rollback-strategy.md updated; optional new doc created if needed).  
- [ ] Clear toggle steps for Dashboard and wrangler.toml with examples.  
- [ ] Post-toggle smoke checklist thoroughly documented.  
- [ ] Preview simulation instructions included and validated via tabletop steps.  
- [ ] Communication templates included.  
- [ ] PRD index/rollback links updated as appropriate.

Risk and Compatibility Check

Minimal Risk Assessment
- Primary Risk: Operators misapply toggles without understanding impacts.  
- Mitigation: Clear catalog, defaults, and smoke steps; incident sequence guidance.  
- Rollback: Reverse toggle states; follow smoke checklist to re-validate.

Compatibility Verification
- [x] No breaking API changes.  
- [x] No DB changes.  
- [x] UI untouched in this story (documentation-only).  
- [x] No performance impact.

Validation Checklist

Scope Validation
- [x] Single-session implementable (documentation + validation pass).  
- [x] Straightforward integration (PRD shard updates and links).  
- [x] Follows existing documentation structure.  
- [x] No design/architecture work required.

Clarity Check
- [x] Requirements are unambiguous (what to document, where to link, how to verify).  
- [x] Integration points specified (rollback-strategy.md, PRD index).  
- [x] Success criteria testable via tabletop.  
- [x] Rollback approach simple (reverse toggles).

References
- Epic: docs/prd/epic-feature-flags-controlled-rollbacks.md  
- Flags Library & Wiring: FF-1, FF-2  
- Rollback: docs/prd/rollback-strategy.md
