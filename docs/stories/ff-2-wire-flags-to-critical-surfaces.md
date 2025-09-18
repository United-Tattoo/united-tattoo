# Wire Flags to Critical Surfaces — Admin/Booking/Public (FF-2)

Story ID: FF-2  
Epic: Feature Flags Framework for Controlled Rollbacks — Brownfield Enhancement  
Date: 2025-09-18  
Owner: Product Manager (John)  
Depends On: FF-1 (lib/flags.ts implemented)  
Related Docs:
- docs/prd/epic-feature-flags-controlled-rollbacks.md
- docs/prd/rollback-strategy.md
- docs/brownfield-architecture.md
- docs/brownfield-architecture-booking.md
- docs/brownfield-architecture-public.md

---

Story Title  
Wire Flags to Critical Surfaces — Admin/Booking/Public

User Story  
As a site operator,  
I want key site areas to respect feature flags,  
So that I can safely disable Admin, Booking, or heavy Public UX behaviors immediately during incidents.

Story Context

Existing System Integration
- Integrates with:
  - Admin UI at app/admin/* (layouts/pages) and admin-related APIs (app/api/admin/*, app/api/artists, app/api/portfolio, app/api/files, app/api/settings, app/api/users)
  - Booking UI at components/booking-form.tsx (mounted by app/book/page.tsx)
  - Public UX components for heavy scroll/animation (components/hero-section.tsx, components/artists-section.tsx)
- Technology: Next.js 14 App Router, TypeScript, Zod validations, shadcn/ui, Cloudflare Workers (OpenNext)
- Follows pattern: Conditional rendering/early-return guards, user-friendly fallbacks, HTTP 503 JSON for disabled APIs
- Touch points:
  - Admin shell/layout and sensitive routes
  - Booking form submission path
  - Parallax/scroll-heavy public components

Acceptance Criteria

Functional Requirements
1) Admin Gating
   - When ADMIN_ENABLED === false, navigating to any /admin route renders a friendly “Admin temporarily unavailable” page (no stacktrace, no redirect loop).
   - Admin uploads routes respect UPLOADS_ADMIN_ENABLED:
     - POST/DELETE to app/api/files/* return 503 JSON: { error: "Admin uploads disabled" } when false.
     - Portfolio bulk operations also respect the flag (e.g., app/api/portfolio/bulk-delete/route.ts).
   - If ARTISTS_MODULE_ENABLED === false, POST/PUT/DELETE on app/api/artists return 503 JSON with a clear error; GET remains unaffected.

2) Booking Gating
   - When BOOKING_ENABLED === false:
     - components/booking-form.tsx disables the final submit action (button disabled and shows inline message “Online booking is temporarily unavailable. Please contact the studio.” with a link to /contact).
     - If a submit is invoked programmatically, the handler no-ops on the client (no network call).
     - Any server-side booking endpoint that receives a call for booking creation must return 503 JSON: { error: "Booking disabled" } as a safety net (no new endpoint is required; apply to existing ones if reachable).
   - PUBLIC_APPOINTMENT_REQUESTS_ENABLED is reserved for future public booking endpoint (no-op in this story).

3) Public Advanced Animations Gating
   - When ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED === false:
     - components/hero-section.tsx and components/artists-section.tsx render without parallax/scroll-linked transforms; no requestAnimationFrame loops or heavy IntersectionObserver effects are active.
     - Static rendering must not degrade layout or accessibility (no console errors/warnings).

Integration Requirements
4) Defaults: When no flags are set, existing behavior remains unchanged (baseline preserved).
5) Server/API: Early-return 503 JSON responses include an informative message and do not leak internals; do not throw errors for missing flags.
6) UI: Disabled states are accessible (aria-live or clear text), with obvious call to action (link to /contact for booking).

Quality Requirements
7) Minimal unit tests (or component tests) for:
   - Booking form disabled mode (BOOKING_ENABLED=false) ensuring button disabled and message present.
   - A representative API route (e.g., app/api/files/route.ts) returning 503 when UPLOADS_ADMIN_ENABLED=false.
8) Lint/typecheck/tests pass; preview build succeeds.
9) No regression in unaffected surfaces (Admin when ADMIN_ENABLED=true; Booking enabled path unchanged).

Technical Notes

- Integration Approach:
  - Import typed flags from lib/flags.ts (FF-1).
  - Admin: add gating in app/admin/layout.tsx or app/admin/page.tsx (render an Unavailable component/page when ADMIN_ENABLED=false). For APIs, add top-of-handler guards for UPLOADS_ADMIN_ENABLED and ARTISTS_MODULE_ENABLED.
  - Booking: in components/booking-form.tsx, derive a boolean from flags and disable the primary submit. Show a shadcn/ui Alert or inline text with a link Button to /contact.
  - Public: add a simple boolean check to skip setting up observers/raf and render static content. Ensure prefers-reduced-motion remains respected independent of flag.
- Existing Pattern Reference:
  - Route handler early exits with Zod-validated structured error responses (reuse project patterns for JSON responses).
  - UI follows existing shadcn styling and messaging patterns.
- Key Constraints:
  - Do not alter middleware routing in this story; scope is view/API-level gating only.
  - Keep changes localized; no DB or schema modification.

Suggested Files to Touch (for implementation reference)
- app/admin/layout.tsx or app/admin/page.tsx — render “Unavailable” when ADMIN_ENABLED=false
- app/api/files/route.ts — guard with UPLOADS_ADMIN_ENABLED
- app/api/portfolio/bulk-delete/route.ts — guard with UPLOADS_ADMIN_ENABLED
- app/api/artists/route.ts — guard write methods when ARTISTS_MODULE_ENABLED=false
- components/booking-form.tsx — gate submit on BOOKING_ENABLED
- components/hero-section.tsx — disable parallax on ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED=false
- components/artists-section.tsx — disable parallax on ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED=false

Definition of Done
- [ ] Admin shell disabled state rendering implemented and verified.
- [ ] Admin uploads/api write routes return 503 when corresponding flags are false.
- [ ] Booking form submit disabled with clear message and /contact CTA when flag false; no network call issued on submit in disabled mode.
- [ ] Public parallax/scroll animations disabled cleanly when flag false; layout remains intact.
- [ ] Minimal tests added and passing; preview build succeeds.
- [ ] No changes in default behavior when flags are unset (manual smoke).

Risk and Compatibility Check

Minimal Risk Assessment
- Primary Risk: Over-gating could hide critical admin functionality unintentionally.
- Mitigation: Defaults preserve behavior; add console.warn in server logs only when a critical flag is explicitly set to false (optional).
- Rollback: Remove or bypass guards; set flags to re-enable surfaces instantly.

Compatibility Verification
- [x] No breaking changes to existing APIs when flags are unset.
- [x] No database changes.
- [x] UI follows existing design system.
- [x] Performance impact negligible (boolean checks).

Validation Checklist

Scope Validation
- [x] Single-session implementable in targeted files.
- [x] Straightforward integration using flags from FF-1.
- [x] Follows existing patterns (conditional UI and API guards).
- [x] No design/architecture work required.

Clarity Check
- [x] Requirements are unambiguous for Admin, Booking, Public.
- [x] Integration points and files specified.
- [x] Success criteria testable via small unit/component tests and manual smoke.
- [x] Rollback approach simple (flip flags).

References
- Epic: docs/prd/epic-feature-flags-controlled-rollbacks.md
- Library from FF-1: lib/flags.ts (pre-req)
- Ops: docs/prd/rollback-strategy.md
