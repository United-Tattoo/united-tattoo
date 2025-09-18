# Brownfield Rollback Strategy (A–D Epics)

Project: United Tattoo  
Version: v1.0  
Date: 2025-09-18  
Owner: Product Manager (John) in collaboration with Architect, QA, DevOps

Purpose
- Define explicit, actionable rollback procedures for each Epic (A: Admin, B: Booking, C: Public, D: Technical/Infra).
- Establish global controls (feature flags, deploy reverts, DB/R2 backups), triggers, communications, and verification steps.
- Satisfy QA condition: “Create comprehensive rollback procedures document (per-epic)”.

Scope
- Applies to Cloudflare Pages + OpenNext deployment.
- Applies to D1 (SQL) and R2 (object storage).
- Covers toggling features, deploy reverts, DB schema/data rollback, and user impact mitigation.

References
- QA Validation Report: docs/qa/po-master-checklist-validation-report.md
- Brownfield Architecture (A): docs/brownfield-architecture.md
- Brownfield Architecture (B): docs/brownfield-architecture-booking.md
- Brownfield Architecture (C): docs/brownfield-architecture-public.md
- Brownfield Architecture (D): docs/brownfield-architecture-tech.md
- Core Config: .bmad-core/core-config.yaml (prdSharded: true; prdShardedLocation: docs/prd)

---

1) Global Rollback Principles

1.1 Triggers (General)
- Elevated 5xx rate over last 5–10 minutes (thresholds below).
- Error spikes in specific route handlers (/api/*), auth failures, or R2 failures.
- Performance regression beyond defined SLO (TTFB, P95 route latency).
- Critical UX breakage (navigation, booking submit, admin CRUD).
- Security incidents or data integrity issues.

1.2 Rollback Order of Operations (Default)
1) Freeze traffic to new risky surfaces via feature flags (prefer “dark shipping” off by default).
2) Revert config/env vars (e.g., disable BOOKING_ENABLED).
3) Revert to last-good deployment (Cloudflare Pages previous build).
4) If data shape changed, execute DB rollback (down migrations or revert script).
5) Undo R2 object operations if required (or orphan clean-up), restore references.
6) Purge caches/ISR tags if necessary.
7) Communicate status to stakeholders/end users (templates below).
8) Verify with smoke tests and targeted integration checks.

1.3 Feature Flags (Keys & Usage)
Implement a minimal runtime flag reader (server+client) backed by environment variables (wrangler.toml [vars] per env) or a flags file (lib/flags.ts). All new features must be guarded by flags for safe disables:

- ADMIN_ENABLED (Epic A switch)
- ARTISTS_MODULE_ENABLED (Epic A sub-switch)
- UPLOADS_ADMIN_ENABLED (Epic A sub-switch)
- BOOKING_ENABLED (Epic B master switch)
- PUBLIC_APPOINTMENT_REQUESTS_ENABLED (Epic B unauth booking)
- REFERENCE_UPLOADS_PUBLIC_ENABLED (Epic B ref images)
- DEPOSITS_ENABLED (Epic B payments)
- PUBLIC_DB_ARTISTS_ENABLED (Epic C db-backed artists on public)
- ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED (Epic C UX)
- STRICT_CI_GATES_ENABLED (Epic D: TS/ESLint in CI)
- ISR_CACHE_R2_ENABLED (Epic D cache behavior toggles)

1.4 Cloudflare Pages Revert (High-Level)
- Use Cloudflare Pages Deployments list (dashboard) to “Promote” or restore previous good deployment for the production branch OR redeploy the last known good commit.
- If using wrangler locally, prefer re-building the last good commit, then:
  - npm run pages:build
  - wrangler pages deploy .vercel/output/static
- After revert, purge cache as needed (dashboard) and revalidate ISR tags if used.

1.5 D1 (Database) Backups & Rollback
- Before applying any schema change:
  - Export current DB: wrangler d1 export united-tattoo > backups/d1-backup-YYYYMMDD-HHMM.sql
  - Dry-run migrations on preview DB.
- Maintain up/down SQL migrations in sql/migrations/ with idempotent checks.
- Rollback process:
  - Apply “down” migration scripts aligned to the last applied “up”.
  - If unavailable, restore from export (last resort) after change window approval.

1.6 R2 (Object Storage) Considerations
- R2_PUBLIC_URL must be configured; if misconfigured, set flag to disable public consumption paths.
- For destructive bulk operations, stage keys to a manifest to allow targeted restores or clean-ups.
- Rollback: remove new objects (based on manifest) or restore originals if overwritten (keep versioning if enabled; otherwise retain originals with “.prev” suffix convention during risky deploys).

1.7 Monitoring & Thresholds (Actionable)
- Admin routes (/api/admin/*, /api/artists, /api/portfolio, /api/files, /api/settings, /api/users):
  - Trigger if 5xx > 2% for 10 minutes OR P95 latency > 2s for 10 minutes.
- Booking (/api/appointments, booking request endpoint, /api/upload if public used):
  - Trigger if submit failure rate > 5% across 5 minutes or mean time to response > 3s.
- Public pages:
  - Trigger if homepage error > 1% or significant LCP increase (> 30% vs baseline).
- Auth:
  - Trigger on spike in sign-in failures inconsistent with traffic.

---

2) Epic A — Admin Dashboard & Artist Management (Rollback Plan)

2.1 Surfaces & Risks (from docs/brownfield-architecture.md)
- Admin UI pages under /admin/*
- APIs: /api/artists, /api/portfolio, /api/files, /api/settings, /api/users, /api/admin/*
- D1 tables: artists, portfolio_images, site_settings, file_uploads, users (role changes)
- R2 ops: admin uploads, portfolio image flows
- Middleware RBAC and NextAuth role flow

2.2 Flags & Safe Toggles
- ADMIN_ENABLED = false → Hide /admin routes entry points, return 503 or friendly “Temporarily unavailable” for admin-only surfaces.
- ARTISTS_MODULE_ENABLED = false → Disable CRUD on artists and hide related UI.
- UPLOADS_ADMIN_ENABLED = false → Disable admin uploads endpoints; return 503.

2.3 Deploy Revert Path
- Promote last-good deployment in Cloudflare Pages dashboard for production.
- Purge cache if /admin was statically cached (typically dynamic; purge anyway as precaution).

2.4 DB Rollback
- If schema changed (e.g., new columns in artists/portfolio_images/site_settings):
  - Execute corresponding down migration files.
  - If data backfill created inconsistencies, run compensating scripts to restore prior invariants.
- Users & roles: If role assignment logic changed in lib/auth.ts or data seeded:
  - Revert seed changes; ensure SUPER_ADMIN dev shortcut is disabled for production if risky.

2.5 R2 Rollback
- If new admin bulk upload introduced incorrect keys:
  - Use manifest produced during upload to delete or quarantine bad keys.
  - Restore references in D1 (portfolio_images) to previous URLs if overwritten.

2.6 Verification (Admin)
- Smoke tests:
  - Auth sign-in (admin) → access /admin/page.tsx
  - CRUD: create/update artist, upload image, update site settings (if re-enabled)
  - Portfolio list load time (P95) < 2s and error rate ~0

2.7 Communication
- Internal: Notify staff admins of temporary disablement with ETA.
- External: N/A (admin-only).

---

3) Epic B — Booking & Client Management (Rollback Plan)

3.1 Surfaces & Risks (from docs/brownfield-architecture-booking.md)
- UI: /book with components/booking-form.tsx
- APIs: /api/appointments (auth required), proposed public booking request endpoint
- Uploads: /api/upload (auth-only currently)
- D1: appointments, availability, users (client)
- Payments: deposit flow (not implemented yet; when added, gateway risk)

3.2 Flags & Safe Toggles
- BOOKING_ENABLED = false → Hide or “temporarily unavailable” booking form actions; link to Contact page as fallback.
- PUBLIC_APPOINTMENT_REQUESTS_ENABLED = false → Disable public booking endpoint; return 503/friendly message.
- REFERENCE_UPLOADS_PUBLIC_ENABLED = false → Disable public uploads (if added later).
- DEPOSITS_ENABLED = false → Disable any payment intents (if/when implemented).

3.3 Fallback UX
- Booking form Submit → disabled; show banner “Online booking temporarily unavailable. Please contact the studio.”
- Replace hero CTA (“Book Consultation”) to /contact during incident.

3.4 Deploy Revert Path
- Restore last-good deployment to eliminate new booking logic/UI.
- Purge cache for /book and home page if needed; revalidate tag for booking content.

3.5 DB Rollback
- If new columns/tables introduced (e.g., consultation_requests):
  - Apply down migrations.
- If incorrect appointments were created:
  - Mark as CANCELLED with note “Rollback cleanup [timestamp]” (prefer soft-delete).
  - Restore any previous constraints/state as needed.

3.6 R2 Rollback
- If public reference image upload was added and malfunctioned:
  - Disable endpoint via flags.
  - Delete orphaned objects based on recent upload manifests.
  - Remove/repair D1 file_uploads rows linked to orphan keys.

3.7 Verification (Booking)
- Smoke flows:
  - Page load (/book) without console errors.
  - If enabled: submit request → 200/201 with confirmation.
  - If disabled: contact fallback visible, no POST attempted.

3.8 Communication
- Public banner on /book; social post if extended outage.
- Staff: notify front desk to handle manual bookings.

---

4) Epic C — Public Website Experience (Rollback Plan)

4.1 Surfaces & Risks (from docs/brownfield-architecture-public.md)
- UI: home sections (hero, artists, services, contact), /artists listing and /artists/[id]
- Data source: currently static (data/artists.ts); potential future DB-backed
- Heavy imagery, parallax, accessibility/performance concerns

4.2 Flags & Safe Toggles
- PUBLIC_DB_ARTISTS_ENABLED = false → Revert to static data/artists.ts sourcing.
- ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED = false → Disable parallax/scroll effects for stability/perf.

4.3 Deploy Revert Path
- Revert to last-good deployment where public assets are stable.
- Consider Next/Image or loader toggles (if introduced later) → disable to reduce complexity.

4.4 Verification (Public)
- Home load LCP within baseline ±30%.
- Artists list renders; profile pages resolve; no broken images.
- Navigation anchor behavior OK or simplified (no JS errors).

4.5 Communication
- Optional banner if visible feature regression (e.g., artist directory temporarily simplified).

---

5) Epic D — Technical Architecture & Delivery (Rollback Plan)

5.1 Surfaces & Risks (from docs/brownfield-architecture-tech.md)
- OpenNext adapter, wrangler.toml compatibility, Pages build
- Incremental cache in R2
- next.config.mjs flags (ignore TS/ESLint), security headers pending
- Env validation (lib/env.ts) misalignment; missing R2_PUBLIC_URL

5.2 Flags & Safe Toggles
- STRICT_CI_GATES_ENABLED = false → Temporarily allow build leniency (emergency only).
- ISR_CACHE_R2_ENABLED = false → Disable incremental cache usage if cache corruption suspected.

5.3 Deploy Revert Path
- Promote last-good deployment; ensure wrangler.toml matches known-good config (compatibility_date/flags).
- Disable experimental toggles before re-promote to reduce risk.

5.4 DB/Env/Secrets
- Ensure NEXTAUTH_SECRET remains valid; set via “wrangler secret put”.
- Add R2_PUBLIC_URL to Cloudflare env vars for preview/production; if missing, disable features dependent on it.

5.5 Verification
- pages:build and preview succeed locally.
- OpenNext preview path OK (npm run preview).
- Admin/public critical routes pass smoke checks; no missing env warnings.

---

6) Operational Runbooks (Quick Reference)

6.1 Feature Flag Change (Cloudflare Vars)
- Update wrangler.toml [env.production.vars] for persistent changes OR set via dashboard.
- For immediate action: Ship a small change that reads the new var; or have flags read from KV for instant toggles (future improvement).

6.2 Revert to Last-Good Deployment
- Cloudflare Pages Dashboard → Project → Deployments → Promote previous successful deployment to Production.
- Alternatively, check out last-good commit locally:
  - git checkout <last-good-commit>
  - npm run pages:build
  - wrangler pages deploy .vercel/output/static
- Purge cache as needed (Dashboard) and revalidate ISR tags.

6.3 D1 Backups & Migrations
- Backup before risk:
  - wrangler d1 export united-tattoo > backups/d1-backup-YYYYMMDD-HHMM.sql
- Apply down migration (example):
  - wrangler d1 execute united-tattoo --remote --file=sql/migrations/20250918_down.sql

6.4 R2 Object Management
- If versioning enabled: restore previous versions in dashboard.
- If not: delete newly-added keys from recent manifest; restore any .prev originals.

---

7) Communications

7.1 Internal Templates
- Incident Start:
  - Subject: [Incident] Epic {A|B|C|D} regression – rollback in progress
  - Body: Symptom, start time, affected routes, ETA to mitigation, next update time.
- Incident Resolved:
  - Subject: [Resolved] Epic {A|B|C|D} rolled back
  - Body: Root cause (prelim), fix forward plan, verification summary.

7.2 Public Templates (Booking/Public)
- Banner: “Online booking temporarily unavailable while we perform maintenance. Please contact the studio at (phone/email).”
- Social (optional): “We’re making improvements; online booking briefly unavailable. We’ll be back shortly!”

---

8) Verification Checklists

8.1 Post-Rollback Smoke (All)
- Home page renders without console errors; nav usable.
- Auth sign-in/out OK; protected admin routes gated correctly.
- No spikes in 5xx; latency within baseline ±20%.
- R2 asset URLs valid (R2_PUBLIC_URL configured).

8.2 Admin (Epic A)
- /admin loads (if re-enabled); CRUD operations succeed.
- Portfolio image retrieval works; no broken admin listing grids.

8.3 Booking (Epic B)
- /book page loads; submit disabled or functional per state.
- No POST requests to disabled endpoints; fallback messaging correct.

8.4 Public (Epic C)
- Artists listing and profile pages render; imagery loads without CLS shifts.

8.5 Technical (Epic D)
- pages:build OK; preview OK; OpenNext worker stable.
- No new warnings for missing env; cache behavior normal.

---

9) Mapping: Features → Flags → Owners

| Feature/Area                            | Flag                                   | Owner        |
|----------------------------------------|----------------------------------------|--------------|
| Admin shell (all)                      | ADMIN_ENABLED                          | PM/Architect |
| Artists CRUD                           | ARTISTS_MODULE_ENABLED                 | PM/Dev       |
| Admin uploads                          | UPLOADS_ADMIN_ENABLED                  | PM/Dev       |
| Booking master                         | BOOKING_ENABLED                        | PM/Dev       |
| Public appointment request             | PUBLIC_APPOINTMENT_REQUESTS_ENABLED    | PM/Dev       |
| Reference uploads (public booking)     | REFERENCE_UPLOADS_PUBLIC_ENABLED       | PM/Dev       |
| Deposits/payments                      | DEPOSITS_ENABLED                       | PM/Dev       |
| Public artists from DB                 | PUBLIC_DB_ARTISTS_ENABLED              | PM/Dev       |
| Advanced nav/scroll animations         | ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED | PM/UX        |
| Strict CI gates (TS/ESLint)            | STRICT_CI_GATES_ENABLED                | PM/Dev       |
| OpenNext R2 ISR cache                  | ISR_CACHE_R2_ENABLED                   | PM/DevOps    |

---

10) Immediate Actions to Enable Rollbacks (Implementation Tasks)

- Add lib/flags.ts and wire flags to affected UI and API surfaces (A/B/C/D).
- Define sql/migrations/ with up/down per change; adopt wrangler migrations or controlled execute scripts.
- Add npm scripts:
  - "db:backup": "wrangler d1 export united-tattoo > backups/d1-backup-$(date +%Y%m%d-%H%M).sql"
  - "pages:promote:manual": "echo 'Promote last-good via dashboard or redeploy last good commit.'"
- Ensure R2_PUBLIC_URL is present in env validation (lib/env.ts) and set in wrangler.toml vars.
- Document “last-good commit” pointer in release notes for quick manual revert.

---

Appendix A — Known Current Gaps to Close Before Relying on This Plan
- Flags wiring: not yet implemented in repo; must be added.
- DB migrations: project uses sql/schema.sql; introduce structured migrations with down scripts.
- Cloudflare Pages “promote” is a dashboard action; CLI fallback is redeploy previous commit.
- Observability: add Sentry and minimal metrics to automate triggers.

Appendix B — Example Flag Reader (Pseudo)
```ts
// lib/flags.ts
export const Flags = {
  ADMIN_ENABLED: process.env.ADMIN_ENABLED === "true",
  BOOKING_ENABLED: process.env.BOOKING_ENABLED === "true",
  // ... (others)
};
```

Appendix C — Rollback Drill (Quarterly)
- Simulate booking outage in preview:
  - Flip BOOKING_ENABLED=false, ship preview, verify fallback UX, then restore.
- Simulate admin upload failure:
  - Flip UPLOADS_ADMIN_ENABLED=false; verify admin pages handle gracefully.
- Document timings and lessons learned.

End of document.
