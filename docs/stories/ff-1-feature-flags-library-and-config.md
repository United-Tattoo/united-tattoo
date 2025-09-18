# Feature Flags Library & Configuration — Brownfield Addition (FF-1)

Story ID: FF-1  
Epic: Feature Flags Framework for Controlled Rollbacks — Brownfield Enhancement  
Date: 2025-09-18  
Owner: Product Manager (John)  
Related Docs:
- docs/prd/epic-feature-flags-controlled-rollbacks.md
- docs/prd/rollback-strategy.md
- docs/brownfield-architecture-tech.md

---

Story Title
Feature Flags Library & Configuration — Brownfield Addition

User Story
As an operator of the United Tattoo site,
I want to control critical features via environment-driven flags,
So that I can safely disable problematic areas without redeploying the application.

Story Context

Existing System Integration
- Integrates with: Next.js 14 App Router (server/client), route handlers under app/api, Cloudflare Pages/Workers runtime via OpenNext.
- Technology: TypeScript, environment variables via wrangler.toml ([env.preview.vars] / [env.production.vars]), Cloudflare bindings.
- Follows pattern: Centralized lib utilities (e.g., lib/utils.ts), environment validation in lib/env.ts, defensive configuration.
- Touch points: 
  - New module lib/flags.ts (exporting typed, environment-driven booleans).
  - Documentation updates for wrangler env vars and operational usage.
  - Optional: non-breaking additions to lib/env.ts for boolean parsing.

Acceptance Criteria

Functional Requirements
1. A new module lib/flags.ts exports a typed Flags object (or individual exports) for the following keys with safe defaults that preserve current behavior:
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
2. Flags are derived from environment variables (string "true"/"false", case-insensitive) with robust parsing; missing or malformed values do not throw and fall back to defaults.
3. Server-side usage (route handlers, server components) and client-side usage (components) can import the same typed flags safely (tree-shakeable, no runtime errors).

Integration Requirements
4. Existing functionality remains unchanged by default when no flag variables are defined (defaults reflect current behavior).
5. The new module follows existing lib/* coding standards (TypeScript types, export conventions).
6. Documentation added to an operations note (append to docs/prd/rollback-strategy.md or new doc referenced by it) including:
   - List of flags, default behavior, and how to toggle via wrangler dashboard/vars.
   - Example wrangler.toml snippets for preview/production vars (non-secret).
   - Post-toggle smoke checklist.

Quality Requirements
7. Unit tests cover boolean parsing and default behavior for at least three representative flags (true/false/undefined cases).
8. Typecheck, lint, and unit tests pass (no suppression added).
9. No regressions in existing functionality (smoke run of dev and preview builds).

Technical Notes

- Integration Approach:
  - Implement a pure-TS helper to parse env booleans: parseBool(str | undefined, defaultValue).
  - Export a const Flags object freezing evaluated booleans at module init time (OK for Workers model).
  - Client-side consumption: Ensure flags do not leak secrets (they are booleans only) and remain serializable if needed.
- Existing Pattern Reference:
  - Align with lib/utils.ts coding style and export patterns.
  - Reference docs/prd/rollback-strategy.md “Feature Flags Operations” for operator guidance.
- Key Constraints:
  - Do not introduce breaking changes or throw errors on missing envs.
  - Do not gate any routes/components in this story (wiring will be handled in a separate story).
  - Keep the module minimal; do not add runtime network calls or storage dependencies.

Definition of Done
- [ ] lib/flags.ts created with typed exports and safe defaults.
- [ ] Tests added (Vitest) verifying parsing and defaults.
- [ ] Documentation updated (rollback strategy ops section extended with flags list, toggling, smoke steps).
- [ ] Lint, typecheck, and unit tests pass locally (npm run test).
- [ ] Preview build succeeds (npm run pages:build && npm run preview).
- [ ] No functional changes observed when flags are absent (baseline preserved).

Risk and Compatibility Check

Minimal Risk Assessment
- Primary Risk: Misinterpretation of default behavior leading to unintended disablement.
- Mitigation: Defaults preserve current behavior; explicit console.warn on server when critical flags are undefined (non-fatal).
- Rollback: Delete or bypass imports of lib/flags.ts; defaults ensure no breakage when env flags are absent.

Compatibility Verification
- [x] No breaking changes to existing APIs.
- [x] No database changes.
- [x] UI unchanged in this story (no gating yet).
- [x] Negligible performance impact (constant boolean checks).

Validation Checklist

Scope Validation
- [x] Single-session implementable (library + tests + docs).
- [x] Straightforward integration (new lib module).
- [x] Follows existing patterns exactly (lib/* utilities, env-based config).
- [x] No design/architecture work required.

Clarity Check
- [x] Requirements are unambiguous (module + keys + defaults + tests + docs).
- [x] Integration points specified (lib, docs, env).
- [x] Success criteria testable (unit tests, build/preview).
- [x] Rollback approach simple (remove usage; defaults benign).

References
- Epic: docs/prd/epic-feature-flags-controlled-rollbacks.md
- Ops: docs/prd/rollback-strategy.md (Feature Flags Operations section to be updated in this story)
