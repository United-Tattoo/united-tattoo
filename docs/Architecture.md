# United Tattoo — System Architecture

Version: 1.0  
Date: 2025-09-17  
Source Inputs: docs/PRD.md, repo configuration (wrangler.toml, open-next.config.ts, next.config.mjs, package.json), lib/*, sql/schema.sql, middleware.ts

1) Executive Summary
United Tattoo is a Cloudflare-first Next.js application delivering a public site, booking/client flows, and an admin system. The runtime is Cloudflare Pages + Workers via OpenNext for server-side execution, with Cloudflare D1 as the primary relational store and R2 for asset storage and incremental cache. The UI system standardizes on ShadCN. Authentication uses Auth.js (NextAuth) with JWT strategy initially. Validation uses Zod across server and forms.

This document defines the target architecture aligned with the PRD and captures the current implementation snapshot plus gaps and phased work.

2) System Context and Components
- Frontend/SSR: Next.js 14 App Router, TypeScript, Tailwind, ShadCN (ui primitives), Lenis (smooth scroll)
- Runtime/Platform: Cloudflare Pages + Workers via OpenNext adapter
- Data/Storage:
  - D1 (relational, SQLite semantics) for structured data
  - R2 for images and static-like large assets
  - R2 bucket for OpenNext incremental cache (ISR/route cache)
- Authentication/Authorization: NextAuth (JWT strategy), route RBAC via middleware
- Validation: Zod schemas for inputs, forms, and environment config
- Observability: Planned Sentry and OpenTelemetry per repository rules
- CI/CD: Planned Gitea pipeline (lint/typecheck/test/build/migration dry-run/e2e/budgets/deploy)

3) Deployment Model (Cloudflare + OpenNext)
OpenNext transforms the Next.js app into assets + a Worker.

Key files and settings:
- open-next.config.ts
  - incrementalCache: R2-based incremental cache (via @opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache)
- wrangler.toml
  - compatibility_date: "2024-09-23"
  - compatibility_flags: ["nodejs_compat"]
  - main: ".open-next/worker.js"
  - assets: ".open-next/assets" as ASSETS
  - Bindings:
    - D1: binding "DB", database_name "united-tattoo"
    - R2 (App assets): binding "R2_BUCKET", bucket "united-tattoo"
    - R2 (OpenNext incremental cache): binding "NEXT_INC_CACHE_R2_BUCKET", bucket "united-tattoo-inc-cache"
    - Self reference: "WORKER_SELF_REFERENCE" = "united-tattoo"
  - Envs:
    - env.production.vars: NEXTAUTH_URL, NODE_ENV=production
    - env.preview.vars: NEXTAUTH_URL, NODE_ENV=development
- next.config.mjs
  - images.unoptimized=true, output="standalone"
  - Ignore type and eslint build errors (presently)
- package.json scripts
  - Build to Cloudflare format: npm run pages:build (npx @opennextjs/cloudflare build)
  - Local preview: npm run preview or npm run dev:wrangler (build + preview)
  - Deploy: wrangler pages deploy .vercel/output/static
  - D1 lifecycle: db:create, db:migrate, db:migrate:local

Recommended deployment flow:
- Development:
  - npm run dev (Node dev) for local UI work OR npm run dev:wrangler to emulate Workers runtime
- Cloudflare Preview:
  - npm run pages:build && npm run preview
- Production:
  - npm run pages:build && npm run deploy

4) Application Architecture (Next.js App Router)
Structure (selected):
- app/
  - Public pages: /, /artists, /artists/[id], /aftercare, /book, /deposit, /privacy, /terms, etc.
  - Admin area: /admin (layout + subpages for uploads, portfolio, artists, calendar, settings)
  - API: app/api/* (route handlers) scoped under relevant namespaces (admin, appointments, artists, portfolio, settings, files, upload, users)
- components/
  - ShadCN components under components/ui/*
  - Page-level composed components (hero, booking-form, artists grid, etc.)
- lib/
  - db.ts: D1 and R2 binding accessors + query helpers
  - r2-upload.ts: higher-level R2 upload manager
  - auth.ts: NextAuth configuration (providers, callbacks, RBAC helpers)
  - validations.ts: Zod schemas for domain inputs
  - env.ts: Zod-validated env shape
- sql/schema.sql: D1 schema SSoT (see Data Architecture)

Interaction patterns:
- Server Actions: Use for same-origin authenticated mutations (App Router).
- Route Handlers (app/api/*): Use for public APIs, cross-origin, or webhook-like flows.
- Middleware: Role-based access checks and guardrails for routes and APIs.

5) Data Architecture (Cloudflare D1)
5.1 Schema Summary (sql/schema.sql)
- users
  - id (TEXT PK, UUID-like), email UNIQUE, name, role (SUPER_ADMIN | SHOP_ADMIN | ARTIST | CLIENT), avatar, timestamps
- artists
  - id, user_id→users.id, name, bio, specialties (JSON text), instagram_handle, is_active, hourly_rate, timestamps
- portfolio_images
  - id, artist_id→artists.id, url, caption, tags (JSON text), order_index, is_public, created_at
- appointments
  - id, artist_id→artists.id, client_id→users.id, title, description, start_time, end_time, status (PENDING|CONFIRMED|IN_PROGRESS|COMPLETED|CANCELLED), deposit_amount, total_amount, notes, timestamps
- availability
  - id, artist_id→artists.id, day_of_week (0-6), start_time, end_time, is_active
- site_settings
  - id (e.g., 'default'), studio_name, description, address, phone, email, social_media (JSON text), business_hours (JSON text), hero_image, logo_url, updated_at
- file_uploads
  - id, filename, original_name, mime_type, size, url, uploaded_by→users.id, created_at

Indexes present for common filters (artists active, appointments by time/status, etc.). Several columns store JSON encoded as TEXT to fit D1 constraints.

5.2 Data Access (lib/db.ts)
- getDB(): Locates D1 binding from:
  - env?.DB (preferred)
  - globalThis[Symbol.for("__cloudflare-context__")]?.env?.DB (OpenNext dev/preview)
  - global shims
- Typed helpers:
  - Artists: find/list/create/update/delete
  - PortfolioImages: find/create/update/delete
  - Appointments: find/create/update/delete with filter support
  - SiteSettings: get/update
- Patterns: Prepared SQL via db.prepare().bind() with RETURNING * in Cloudflare D1
- Note: Update helpers dynamically assemble SET parts and update updated_at.

5.3 Migrations
- Orchestrated via Wrangler scripts (db:migrate, db:migrate:local).
- Source of truth: sql/schema.sql (SSoT). Ensure PRs include schema updates.

6) Assets and Uploads (Cloudflare R2)
- Binding: R2_BUCKET in wrangler.toml; retrieved via getR2Bucket in lib/db.ts
- Upload manager: lib/r2-upload.ts
  - Provides uploadFile, bulkUpload, deleteFile, getFileMetadata, and portfolio/profile image specific helpers
  - Enforces size/type validation (configurable)
  - Constructs keys under prefixes (e.g., portfolio/{artistId}/..., profiles/{artistId}/...)
  - Uses R2_PUBLIC_URL (string) to construct public asset URLs. Configure this for your R2 public endpoint or proxy.
- OpenNext Incremental Cache: Separate R2 bucket bound as NEXT_INC_CACHE_R2_BUCKET, set by open-next.config.ts

7) Authentication and Authorization
- NextAuth (Auth.js) with JWT session strategy (lib/auth.ts)
  - Credentials provider used for development; seeds SUPER_ADMIN for nicholai@biohazardvfx.com
  - OAuth providers (Google/GitHub) are conditionally enabled via env
  - Role is attached to JWT token and surfaced in session
- Middleware (middleware.ts)
  - Guards /admin with SHOP_ADMIN or SUPER_ADMIN
  - Guards /artist routes for ARTIST, SHOP_ADMIN, SUPER_ADMIN
  - Enforces auth for /api/admin
  - Leaves core public pages and /api/auth public
- Future (per PRD):
  - Enforce 2FA for admin roles
  - Optional passwordless fallback (can be implemented via Magic Link/Email provider)
  - Invite-only onboarding flow and RBAC administration UI

8) Validation and Forms
- Zod validation across:
  - lib/validations.ts: users, artists, portfolio images, appointments, site settings, forms (login/signup/contact/booking), pagination and filter schemas
  - lib/env.ts: Validates process.env at boot; throws on missing/invalid
- Note: env.ts includes DATABASE_URL and AWS_* keys; these are not currently used by D1/R2 bindings. See Gaps & Decisions.

9) Performance, Caching, and Media
- ISR/Incremental cache stored in R2 (OpenNext override)
- CDN fronting via Cloudflare; leverage cache headers on API and assets
- Images currently unoptimized (next.config.mjs images.unoptimized = true). Consider Cloudflare Images or custom loader later.
- Progressive/lazy loading for gallery pages planned (per PRD UT-ARC-02)
- Service worker/PWA for offline revisit speed planned (UT-ARC-03)

10) Security, Compliance, and Headers
- Authentication/RBAC enforced via middleware
- Recommended headers (to formalize in API responses/layout):
  - Content-Security-Policy (nonce/hash where applicable)
  - Referrer-Policy: strict-origin-when-cross-origin
  - X-Frame-Options: DENY
  - Permissions-Policy: principle of least privilege
  - COOP/COEP as needed for advanced features
- Cookies where used: HttpOnly, Secure, SameSite=Strict
- Payments (PCI): Use gateway-hosted flows. Do not store card data. Store payment intents/receipts only.
- Moderation: Hooks for uploads to be added (queue for review)
- Rate Limiting: Planned Redis (Upstash or equivalent). To enforce on auth, forms, and APIs.

11) Observability
- Planned:
  - Sentry for errors + release tagging
  - OpenTelemetry for traces/metrics/logs (server actions, route handlers, MCP DB calls)
- Logging guidance:
  - Avoid logging PII
  - Structure logs for searchability

12) CI/CD, Scripts, and Budgets
- Scripts (package.json):
  - Test: vitest (ui mode and run variants)
  - Lint: next lint (disabled blocking in next.config currently)
  - Build/Preview/Deploy via OpenNext + Wrangler
- Planned CI (per project rules):
  1) Lint, Typecheck, Biome/Prettier
  2) Unit tests (Vitest) + Component tests (RTL)
  3) Build
  4) Migration dry‑run (Wrangler D1 execute on ephemeral)
  5) E2E (Playwright) on preview env
  6) Bundle size budgets enforced
  7) Release tagging (semver) + notes

13) Feature Mapping to PRD (Status Snapshot)
Admin Dashboard & Artist Management (Epic A)
- A1 Invites & Onboarding: Not yet implemented UI; middleware and roles exist; NextAuth foundation present (planned).
- A2 RBAC: Middleware enforces admin/artist; role model exists.
- A3 Artist Profiles & Portfolio: D1 schema + lib/db.ts CRUD + R2 upload scaffolding present; UI WIP.
- A4 Asset Management: R2 binding + upload manager present; compression toggles not yet in place.
- A5 Audit & Notifications: Activity logs and notifications not yet implemented.

Unified Booking & Client Management (Epic B)
- B1 Booking/Consultation forms: booking-form component exists; smart routing & quote logic WIP.
- B2 Client Portal: Account area not yet implemented.
- B3 Scheduling & Calendars: Availability table exists; Google two-way sync not implemented.
- B4 Payments: No gateway integration yet; PRD calls for Stripe/PayPal deposits.
- B5 Notifications: Pending.

Public-Facing Website (Epic C)
- C1 Design System & Visuals: ShadCN baseline across pages.
- C2 Pages & Navigation: Core pages exist; transitions/polish ongoing.
- C3 Search & Discovery: /search page not yet implemented.
- C4 Educational Content: Aftercare page implemented; PDFs/export pending.

Technical Architecture & Delivery (Epic D)
- D1 Cloudflare Integration: OpenNext + wrangler set; D1/R2 configured.
- D2 Performance & Offline: Progressive images + SW not yet implemented.
- D3 Documentation & Staging: This Architecture doc added; README present; staging via CF Pages preview supported.
- D4 Handoff: Training docs pending.

14) Environment and Configuration
Core runtime bindings:
- D1: env.DB (binding name: DB)
- R2: env.R2_BUCKET (binding name: R2_BUCKET)
- OpenNext cache R2: env.NEXT_INC_CACHE_R2_BUCKET

Important environment variables:
- NEXTAUTH_URL (wrangler.toml per env)
- NEXTAUTH_SECRET (must be set in env)
- R2_PUBLIC_URL (for composing public URLs from R2 uploads)
- OAuth (optional): GOOGLE_CLIENT_ID/SECRET, GITHUB_CLIENT_ID/SECRET
- NODE_ENV: development/production/test

Note on lib/env.ts:
- Defines DATABASE_URL, DIRECT_URL, AWS_*, AWS_BUCKET_NAME, AWS_ENDPOINT_URL
- Current implementation uses Cloudflare bindings (not S3 SDK) in lib/r2-upload.ts and lib/db.ts
- Decision: EITHER
  - A) Remove/relax unused env keys and align to bindings-first approach
  - B) Keep AWS_* for future direct S3-compatible presigned uploads and document dual path
- This doc recommends option A short-term for clarity, with a separate "direct upload via presigned URL" RFC if needed.

15) Request/Response Flows (Textual)
Public page render (SSR/ISR):
- Browser → CF CDN → Worker (OpenNext Handler)
- Worker renders via Next.js (SSR) or serves from R2 incremental cache (ISR)
- Asset URLs resolved from /public and ASSETS binding

Admin portfolio upload flow:
- Admin auth (JWT via NextAuth) → /admin/uploads
- Client submits images → API route /api/upload or server action
- Server:
  - Validates with Zod
  - Writes object to R2 via env.R2_BUCKET
  - Creates record in D1 (file_uploads and/or portfolio_images)
- Response returns canonical URL (R2_PUBLIC_URL/key) and metadata

Booking request (planned):
- Booking stepper (react-hook-form + zod) → API/server action
- If “consultation” path: stores request + notifies staff
- If “booking” path: tentative appointment + deposit intent via gateway
- On success: store intent/receipts in D1; send emails/SMS; render portal access

16) Security Model
- JWT sessions; role embedded in token
- Middleware protects admin/artist namespaces and /api/admin
- CSRF: Rely on same-origin server actions; for route handlers expose CSRF tokens if needed
- Secrets: Use Wrangler secrets; never commit
- Media access terms (PRD): scope assets via signed URLs when necessary; R2 is read-only public for finalized assets; admin-only upload

17) Testing Strategy
- Unit/Component: Vitest + RTL set up
- E2E: Playwright planned for booking and admin critical paths
- Contract Tests: Shape/status for MCPs (future)
- a11y checks: eslint-plugin-jsx-a11y + automated checks planned
- Responsive checks: breakpoint snapshots in CI planned

18) Phasing (from PRD) — Implementation Mapping
- Phase 1 (Weeks 1–2): Foundations
  - D1/R2 wiring, artist CRUD + portfolio upload MVP, admin invites stub, OpenNext build (Mostly present; invites UI pending)
- Phase 2 (Weeks 3–4): Booking & Portal + Payments
  - Booking stepper, deposit gateway, client portal (Planned)
- Phase 3 (Weeks 5–6): Visual Experience & Content
  - Parallax/split sections, search/filters, education PDFs, service worker (Planned)
- Phase 4 (Week 7): Docs & Handoff
  - Final docs, training materials, staging review (Partially present)

19) Known Gaps, Risks, and Decisions
Gaps:
- Payments (Stripe/PayPal) not implemented
- Client Portal and Scheduling (two-way Google Calendar sync) pending
- Rate limiting (Redis/Upstash) not implemented
- Activity logs and moderation queue not implemented
- Service Worker/PWA not implemented
- Search (/search) and quick search (Cmd+K) not implemented
- Security headers not centrally enforced yet
- env.ts variables misaligned with current bindings-first approach
- README deployment section references generic Next deploy; Cloudflare/OpenNext process should be canonical

Risks:
- Performance with image-heavy pages; mitigate via progressive loading and caching
- D1 limitations; ensure indexed queries, consider pagination strategies
- Role enforcement consistency across API and server actions

Decisions/Actions:
- Make Cloudflare/OpenNext path canonical in README and CI
- Add .env.example listing required vars (NEXTAUTH_URL, NEXTAUTH_SECRET, R2_PUBLIC_URL, OAuth)
- Add headers middleware/handler to enforce security headers
- Implement rate limit middleware using Redis (Upstash)
- Implement deposit flow with Stripe first
- Add SW + image placeholders for galleries
- Align lib/env.ts with runtime reality; document S3-compat optional path
- Fix schema.sql comment: references “united-tattoo-db”; scripts use “united-tattoo” (choose one name; recommend “united-tattoo”)

20) Runbooks
Local development (Node dev):
- npm install
- npm run dev
- http://localhost:3000

Cloudflare-style preview:
- npm run pages:build
- npm run preview

Database:
- Create: npm run db:create
- Migrate (prod env): npm run db:migrate
- Migrate (local dev): npm run db:migrate:local

Deploy:
- npm run pages:build
- npm run deploy

21) Appendix
Bindings quick reference (wrangler.toml):
- D1: binding DB
- R2: binding R2_BUCKET
- OpenNext cache R2: binding NEXT_INC_CACHE_R2_BUCKET

Key libraries:
- next 14.2.x, @opennextjs/cloudflare, wrangler 4.x
- next-auth, zod, @tanstack/react-query, react-hook-form
- shadcn/ui primitives via Radix + Tailwind
- vitest, @testing-library/*

End of Architecture.md
