# Feature Flags Configuration, Preview QA, and Release Notes — Brownfield Addition (OPS-1)

Story ID: OPS-1  
Type: Brownfield Story (Single-session)  
Date: 2025-09-19  
Owner: Product Manager (John)  
Depends On:  
- FF-1 (lib/flags.ts implemented)  
- FF-2 (flags wired to Admin/Booking/Public)  
- FF-3 (ops guidance available or to be updated during this story)

Related Docs:
- docs/prd/epic-feature-flags-controlled-rollbacks.md  
- docs/prd/rollback-strategy.md (Feature Flags Operations)  
- .clinerules/cloudflare.md  
- .clinerules/cicdrules.md  
- docs/brownfield-architecture-tech.md  

---

Story Title  
Feature Flags Configuration (Preview/Production), Preview QA with Flags Flipped, and Release Notes

User Story  
As a product/ops team,  
I want production/preview feature flags configured, a preview smoke QA with flags flipped,  
and a release notes record with last‑good commit and default flags,  
So that we can safely toggle features, validate disabled/enabled behavior, and document rollback-ready states.

Story Context

Existing System Integration  
- Flags read from environment (Cloudflare Pages Dashboard vars or wrangler.toml [env.*.vars]).  
- FF-2 wired Admin/Booking/Public surfaces to these flags.  
- Preview runtime via OpenNext (npm run pages:build && npm run preview) mimics production.  

Scope of Change  
- No runtime code changes.  
- Environment configuration, manual QA validation on Preview, and a new release notes document.

Acceptance Criteria

Functional Requirements  
1) Configure flags for Preview and Production (booleans as strings). Choose one option and complete it:  
   Option A — Cloudflare Pages Dashboard (recommended for ops toggling)  
   - Cloudflare Dashboard → Pages → Project → Settings → Environment Variables  
   - Set the following for Preview and Production:  
     - ADMIN_ENABLED = "true"  
     - ARTISTS_MODULE_ENABLED = "true"  
     - UPLOADS_ADMIN_ENABLED = "true"  
     - BOOKING_ENABLED = "true"  (Preview: set "false" temporarily for QA)  
     - PUBLIC_APPOINTMENT_REQUESTS_ENABLED = "false"  
     - REFERENCE_UPLOADS_PUBLIC_ENABLED = "false"  
     - DEPOSITS_ENABLED = "false"  
     - PUBLIC_DB_ARTISTS_ENABLED = "false"  
     - ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED = "true" (Preview: set "false" temporarily for QA)  
     - STRICT_CI_GATES_ENABLED = "true"  
     - ISR_CACHE_R2_ENABLED = "true"  
     - R2_PUBLIC_URL = "https://YOUR-PUBLIC-R2-DOMAIN" (required by uploads)  
   - Save and trigger a new deployment (or push a no-op commit).

   Option B — wrangler.toml (versioned defaults; do not add secrets)  
   - Add to wrangler.toml:  
     [env.preview.vars]  
     ADMIN_ENABLED = "true"  
     BOOKING_ENABLED = "false"  
     ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED = "false"  
     ARTISTS_MODULE_ENABLED = "true"  
     UPLOADS_ADMIN_ENABLED = "true"  
     STRICT_CI_GATES_ENABLED = "true"  
     ISR_CACHE_R2_ENABLED = "true"  
     PUBLIC_APPOINTMENT_REQUESTS_ENABLED = "false"  
     REFERENCE_UPLOADS_PUBLIC_ENABLED = "false"  
     DEPOSITS_ENABLED = "false"  
     PUBLIC_DB_ARTISTS_ENABLED = "false"  
     R2_PUBLIC_URL = "https://YOUR-PUBLIC-R2-DOMAIN"

     [env.production.vars]  
     ADMIN_ENABLED = "true"  
     BOOKING_ENABLED = "true"  
     ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED = "true"  
     ARTISTS_MODULE_ENABLED = "true"  
     UPLOADS_ADMIN_ENABLED = "true"  
     STRICT_CI_GATES_ENABLED = "true"  
     ISR_CACHE_R2_ENABLED = "true"  
     PUBLIC_APPOINTMENT_REQUESTS_ENABLED = "false"  
     REFERENCE_UPLOADS_PUBLIC_ENABLED = "false"  
     DEPOSITS_ENABLED = "false"  
     PUBLIC_DB_ARTISTS_ENABLED = "false"  
     R2_PUBLIC_URL = "https://YOUR-PUBLIC-R2-DOMAIN"

2) Preview QA smoke with flags flipped (BOOKING_ENABLED="false", ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED="false")  
   Preparation  
   - Build & start Preview locally to validate behavior:  
     - npm run pages:build  
     - npm run preview  
     - Note local URL (e.g., http://localhost:8788).  
   - Ensure Preview flag values are active (Dashboard preview vars or wrangler [env.preview.vars]).  

   Smoke Checks  
   A. Admin (ADMIN_ENABLED="true")  
   - Visit /admin → Admin dashboard loads (if ADMIN_ENABLED="false", “Admin temporarily unavailable” page; no redirect loop).  
   - If UPLOADS_ADMIN_ENABLED="false": POST/DELETE to /api/files/* returns 503 JSON { error: "Admin uploads disabled" }.  

   B. Booking (BOOKING_ENABLED="false")  
   - Visit /book:  
     - Final submit is disabled.  
     - Inline message shows: “Online booking is temporarily unavailable. Please contact the studio.” with CTA to /contact.  
     - Clicking submit does not issue a network call (no-op).  
   - If booking creation endpoint is hit directly: returns 503 JSON { error: "Booking disabled" }.  

   C. Public Animations (ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED="false")  
   - Visit / and /artists:  
     - No parallax/scroll-linked animations, no requestAnimationFrame loops/IO observers.  
     - No console errors/warnings; layout intact.  

   D. Representative API behavior (503 on gated write operations)  
   - Example: With UPLOADS_ADMIN_ENABLED="false", POST /api/files returns 503 JSON.  
   - Note: Handlers requiring auth may 401 before 503; if desired, ensure flag check occurs before auth in handler order (document actual behavior observed).

   E. Regression quick checks (restore defaults)  
   - Flip BOOKING_ENABLED="true" and ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED="true":  
     - /book submit enabled; normal flow ok.  
     - Home/Artists animations restored; no console errors.

3) Release notes created  
   - Add doc: docs/releases/2025-09-19-feature-flags-rollout.md (or CHANGELOG.md entry) including:  
     - Version/Date, Stories included (FF-1, FF-2, FF-3, DB-1, CI-1)  
     - Last-good commit metadata:  
       - Commit hash (git rev-parse HEAD)  
       - Author/Date/Subject (git log -1 --pretty=format:"%h %ad %an %s")  
     - Default production flag matrix:  
       ADMIN_ENABLED=true, ARTISTS_MODULE_ENABLED=true, UPLOADS_ADMIN_ENABLED=true, BOOKING_ENABLED=true,  
       PUBLIC_APPOINTMENT_REQUESTS_ENABLED=false, REFERENCE_UPLOADS_PUBLIC_ENABLED=false, DEPOSITS_ENABLED=false,  
       PUBLIC_DB_ARTISTS_ENABLED=false, ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED=true, STRICT_CI_GATES_ENABLED=true,  
       ISR_CACHE_R2_ENABLED=true, R2_PUBLIC_URL=https://YOUR-PUBLIC-R2-DOMAIN  
     - Preview test matrix used during QA (e.g., BOOKING_ENABLED=false; ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED=false; others as above)  
     - Rollback instructions (which flags to flip; Cloudflare Pages “Promote previous deploy” for full revert; reference DB-1 backup/down steps)  
     - Smoke checklist summary — pass/fail for Admin/Booking/Public/API in disabled/enabled states  

Integration Requirements  
4) docs/prd/rollback-strategy.md references this ops procedure (link to release notes file and flags catalog).  
5) No code changes are required; environment and docs only.

Quality Requirements  
6) Preview QA results documented in release notes (brief table or checklist with outcomes).  
7) R2_PUBLIC_URL present for both Preview and Production; if missing, note remediation in release notes.  
8) Screenshots or console logs optional but encouraged for Admin/Booking/Public behaviors.

Technical Notes  
- Prefer Dashboard for day‑to‑day toggles; wrangler.toml holds versioned defaults.  
- Keep booleans as strings "true"/"false" to match Workers env semantics.  
- If a route handler still authenticates before flag checks, document current order and rationale in the ops note.

Definition of Done  
- [ ] Preview and Production flag values configured via Dashboard or wrangler.toml.  
- [ ] Preview QA with flags flipped executed; results captured.  
- [ ] Release notes file created with last‑good commit, matrices, rollback instructions, and smoke summary.  
- [ ] docs/prd/rollback-strategy.md updated with link to release notes and/or dedicated Feature Flags Operations section.

Risk and Compatibility Check

Minimal Risk Assessment  
- Primary Risk: Misconfigured flags causing unintended disablement.  
- Mitigation: Defaults preserve current behavior; validate on Preview first; document matrices.  
- Rollback: Flip flags back; promote previous deploy if necessary.

Compatibility Verification  
- [x] No runtime code changes.  
- [x] No DB changes.  
- [x] No performance impact.  

Validation Checklist  
- [x] Single-session implementable (configure → QA → release notes).  
- [x] Clear instructions and success criteria.  
- [x] Rollback approach straightforward (flags + Pages promotion).  

References  
- FF‑1/FF‑2/FF‑3 stories; DB‑1 for backup/down; CI‑1 for pipelines and budgets.
