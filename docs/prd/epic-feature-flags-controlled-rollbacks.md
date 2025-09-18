# Feature Flags Framework for Controlled Rollbacks — Brownfield Enhancement

Version: 1.0  
Date: 2025-09-18  
Owner: Product Manager (John)  
Related Docs:  
- docs/prd/rollback-strategy.md  
- docs/brownfield-architecture.md  
- docs/brownfield-architecture-booking.md  
- docs/brownfield-architecture-public.md  
- docs/brownfield-architecture-tech.md

---

Epic Title
Feature Flags Framework for Controlled Rollbacks — Brownfield Enhancement

Epic Goal
Implement a centralized, minimal feature flag framework and wire it to key surfaces (Admin, Booking, Public) to enable safe, fast rollbacks and controlled exposure per the rollback strategy.

Epic Description

Existing System Context
- Current relevant functionality:
  - Next.js 14 App Router running on Cloudflare Pages/Workers via OpenNext.
  - Admin (/admin), Booking (/book), and Public (/ and /artists) surfaces with route handlers under /app/api.
  - No project-wide feature flags; rollbacks require full deployment revert.
- Technology stack:
  - Next.js 14, OpenNext Cloudflare adapter, Cloudflare D1/R2, NextAuth (JWT), Tailwind + shadcn/ui, Zod validations.
- Integration points:
  - Cloudflare env vars via wrangler.toml ([env.preview.vars]/[env.production.vars]).
  - UI components/pages under app/, route handlers under app/api/.
  - lib/env.ts for env validation; rollback procedures documented in docs/prd/rollback-strategy.md.

Enhancement Details
- What’s being added/changed:
  - Introduce a simple, typed flags module (lib/flags.ts) that reads boolean switches from environment variables.
  - Add first-class flags for Admin, Booking, and Public UX controls as defined in rollback-strategy.md.
  - Gate critical UI flows and API endpoints behind these flags with graceful fallbacks (e.g., disable Booking submit with friendly messaging).
- How it integrates:
  - Flags read from env (wrangler vars); server-side checks in route handlers and server components, client-side checks for UI affordances.
  - No architectural changes; minimal localized conditionals and guard rails.
- Success criteria:
  - Toggling a flag disables the associated feature safely without redeploy.
  - Disabled states present appropriate UX and non-2xx responses for APIs (e.g., 503 with JSON message) where appropriate.
  - No impact on unaffected features; default flag values replicate current behavior.

Stories

1. Feature Flags Library & Configuration
   - Implement lib/flags.ts with typed boolean flags:
     - ADMIN_ENABLED, ARTISTS_MODULE_ENABLED, UPLOADS_ADMIN_ENABLED
     - BOOKING_ENABLED, PUBLIC_APPOINTMENT_REQUESTS_ENABLED, REFERENCE_UPLOADS_PUBLIC_ENABLED, DEPOSITS_ENABLED
     - PUBLIC_DB_ARTISTS_ENABLED, ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED
     - STRICT_CI_GATES_ENABLED, ISR_CACHE_R2_ENABLED
   - Read values from process.env (wrangler vars) with safe defaults that preserve current behavior.
   - Document expected vars and defaults in README and docs/prd/rollback-strategy.md linkage.
   - Optional: Update lib/env.ts to include non-breaking optional validation for key flags (boolean parsing).

2. Wire Flags to Critical Surfaces (Admin/Booking/Public)
   - Admin:
     - Gate /admin shell with ADMIN_ENABLED; show friendly “Temporarily unavailable” if disabled.
     - Gate admin uploads endpoints with UPLOADS_ADMIN_ENABLED; return 503 JSON on POST/DELETE when disabled.
   - Booking:
     - Gate BookingForm submit path with BOOKING_ENABLED; disabled state shows user message and redirects to /contact.
     - If/when public booking endpoint exists, gate with PUBLIC_APPOINTMENT_REQUESTS_ENABLED.
   - Public:
     - Gate advanced scroll/parallax with ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED; ensure no JS errors when off.
   - Add smoke tests/checklist notes to verify disabled vs enabled behavior.

3. Operational Guidance & Verification
   - Add a “Feature Flags Operations” section to docs/prd/rollback-strategy.md or a short ops note with:
     - How to toggle flags (wrangler vars / dashboard).
     - Expected UX/API behavior per flag.
     - Post-toggle smoke steps.
   - Ensure flags are listed in wrangler.toml example vars for preview/production (documentation only; no secrets committed).

Compatibility Requirements
- [x] Existing APIs remain unchanged unless disabled via flags (return 503 with structured message when gated).
- [x] No DB schema changes introduced.
- [x] UI changes follow existing patterns and provide accessible fallback messages.
- [x] Performance impact minimal (light conditional checks, no heavy client logic).
- [x] Default state preserves current behavior if flags are unset.

Risk Mitigation
- Primary Risk: Misconfiguration of env vars causing unintended disablement.
- Mitigation: Safe defaults that preserve current behavior; add console.warn on server when a critical flag is undefined (non-fatal).
- Rollback Plan: Set flags to disable problematic surfaces immediately; revert local changes by removing guards if needed (code rollback not required in normal operation).

Definition of Done
- [ ] lib/flags.ts implemented with typed flags and safe defaults.
- [ ] Admin, Booking, Public surfaces gated with appropriate UX/API responses.
- [ ] Documentation updated (flags list, how to toggle, expected behaviors).
- [ ] Smoke verification steps executed for both enabled and disabled states.
- [ ] No regressions observed in unaffected areas.

Validation Checklist

Scope Validation
- [x] Epic can be completed in 1–3 stories maximum.
- [x] No architectural documentation required beyond existing brownfield references.
- [x] Enhancement follows existing patterns (env-based configuration, conditional rendering).
- [x] Integration complexity is manageable.

Risk Assessment
- [x] Risk to existing system is low (additive, defensive controls).
- [x] Rollback plan is feasible (toggle flags via env).
- [x] Testing approach covers existing functionality (smoke on disabled/enabled).
- [x] Team has sufficient knowledge of integration points.

Completeness Check
- [x] Epic goal is clear and achievable.
- [x] Stories are properly scoped (library, wiring, ops).
- [x] Success criteria are measurable (toggle effects, UX/API responses).
- [x] Dependencies identified (wrangler vars, docs updates).

Handoff to Story Manager
Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running Next.js 14 App Router on Cloudflare Pages/Workers with D1/R2 and OpenNext.
- Integration points: 
  - Env vars from wrangler.toml ([env.preview.vars]/[env.production.vars]).
  - Admin pages under /app/admin, Booking under /app/book, related route handlers under /app/api.
  - Documented rollback procedures in docs/prd/rollback-strategy.md.
- Existing patterns to follow:
  - Zod validations for route handlers, shadcn/ui for UX, middleware RBAC, minimal conditional checks.
- Critical compatibility requirements:
  - Defaults preserve current behavior.
  - Disabled states provide clear user messaging and appropriate HTTP statuses for APIs (503).
  - No DB schema changes; no secrets in repo.
- Each story must include verification that existing functionality remains intact with flags both enabled and disabled.

Epic should maintain system integrity while enabling safe, immediate disablement of high-risk surfaces without a redeploy.
