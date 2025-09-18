# United Tattoo — Brownfield Architecture Document (Focused: Epic A — Admin Dashboard & Artist Management)

This document captures the CURRENT STATE of the United Tattoo codebase relevant to Admin Dashboard & Artist Management (Epic A). It reflects actual patterns, technical debt, and constraints to enable AI agents to work effectively on enhancements in this area.

## Document Scope

Focused on areas relevant to: Admin invitations & onboarding, RBAC, artist profiles, portfolio and asset management, settings, and admin-only API routes.

### Change Log

| Date       | Version | Description                                 | Author           |
| ---------- | ------- | ------------------------------------------- | ---------------- |
| 2025-09-18 | 1.0     | Initial brownfield analysis (Admin focus)   | Architect Agent  |

---

## Quick Reference — Key Files and Entry Points

### Critical Files for Understanding the System

- App entry and layouts
  - app/layout.tsx, app/ClientLayout.tsx, app/page.tsx
  - app/admin/layout.tsx, app/admin/page.tsx, plus nested admin pages
- Routing and security
  - middleware.ts (route protection and public-route policy)
  - lib/auth.ts (NextAuth config, JWT callbacks, role assignment)
- Cloudflare/OpenNext deployment
  - wrangler.toml (D1/R2 bindings, compatibility flags)
  - next.config.mjs (output: standalone, images.unoptimized)
  - open-next.config.ts (present; not analyzed in depth here)
- Data layer and storage
  - sql/schema.sql (Cloudflare D1 schema)
  - lib/db.ts (D1 helpers and CRUD for artists, portfolio, appointments, settings; R2 bucket getter)
  - lib/r2-upload.ts (R2 upload manager, portfolio/profile helpers)
- Validation and types
  - lib/validations.ts (Zod schemas for users, artists, portfolio images, appointments, site settings, forms)
  - types/database.ts (domain models and Cloudflare D1/R2 ambient types)
- Public docs (reference)
  - docs/PRD.md (feature scope; this doc is scoped to Epic A)
  - docs/Architecture.md, docs/architecture.md (legacy/other architecture docs)

### Admin UI Pages (App Router)

- app/admin/analytics/page.tsx
- app/admin/artists/page.tsx
- app/admin/artists/[id]/page.tsx
- app/admin/artists/new/page.tsx
- app/admin/calendar/page.tsx
- app/admin/portfolio/page.tsx
- app/admin/settings/page.tsx
- app/admin/uploads/page.tsx

### Admin/Related API Routes (Route Handlers)

- app/api/admin/migrate/route.ts
- app/api/admin/stats/route.ts
- app/api/artists/route.ts
- app/api/portfolio/route.ts
- app/api/portfolio/[id]/route.ts
- app/api/portfolio/bulk-delete/route.ts
- app/api/portfolio/stats/route.ts
- app/api/files/route.ts
- app/api/files/bulk-delete/route.ts
- app/api/files/folder/route.ts
- app/api/files/stats/route.ts
- app/api/settings/route.ts
- app/api/users/route.ts
- app/api/appointments/route.ts (admin-usable but spans Booking epic as well)
- app/api/auth/[...nextauth]/ (NextAuth core)

---

## High-Level Architecture

### Technical Summary (Actual)

- Next.js 14.2.16 (App Router), React 18, Tailwind 4.x, shadcn/ui patterns
- Cloudflare Pages + Workers via OpenNext adapter
- Cloudflare D1 for relational data (env.DB); Cloudflare R2 for object storage (env.R2_BUCKET)
- Auth via next-auth (JWT session strategy, Credentials + optional Google/GitHub)
- Validation via Zod across routes and forms
- Client state: TanStack Query; forms via react-hook-form

### Actual Tech Stack (from package.json and code)

| Category        | Technology                       | Version      | Notes |
| -------------- | -------------------------------- | ----------- | ----- |
| Runtime        | Cloudflare Pages/Workers         | Wrangler 4  | OpenNext adapter, nodejs_compat enabled |
| Framework      | Next.js (App Router)             | 14.2.16     | output: standalone; images.unoptimized |
| UI             | shadcn/ui + Radix primitives     | mixed       | shadcn patterns across pages/components |
| State          | @tanstack/react-query            | ^5.89.0     | Devtools present |
| Forms          | react-hook-form + zod resolver   | ^7.60.0     | Zod schemas in lib/validations.ts |
| Auth           | next-auth (JWT)                  | ^4.24.11    | Credentials; optional Google/GitHub |
| DB             | Cloudflare D1                    | —           | Access via global env bindings |
| Storage        | Cloudflare R2                    | —           | via env.R2_BUCKET; custom public URL expected |
| Dev/Test       | Vitest + RTL                     | ^3.2.4      | tests under __tests__/ |
| Deploy         | OpenNext Cloudflare              | ^1.8.2      | pages:build → .vercel/output/static |

### Repository Structure Reality Check

- Polyrepo (single app)
- Package manager: npm (scripts define build/preview/deploy and D1 ops)
- Notable:
  - next.config.mjs ignores TS and ESLint errors during build (risk: hidden issues)
  - images.unoptimized: Cloudflare Images or custom loader recommended for prod
  - Zod env validator requires many variables not used by D1 codepaths (see debt)

---

## Source Tree and Module Organization

### Project Structure (Actual, abridged)

```
project-root/
├── app/
│   ├── admin/                      # Admin UI pages
│   ├── api/                        # Route handlers (REST-ish)
│   ├── (public sections)           # /artists, /aftercare, etc.
│   └── auth/                       # auth/signin pages
├── components/                     # UI components (public/admin)
├── lib/                            # auth, db (D1/R2), uploads, validations, utils
├── sql/schema.sql                  # D1 schema
├── types/database.ts               # domain types and Cloudflare ambient types
├── docs/                           # PRD and architecture docs
├── wrangler.toml                   # Cloudflare bindings/config
├── next.config.mjs                 # Next build config
└── open-next.config.ts             # OpenNext adapter config
```

### Key Admin Modules and Their Purpose

- RBAC and route protection
  - middleware.ts: protects /admin and API subsets; maintains public routes list.
  - lib/auth.ts: next-auth config. Credentials provider returns SUPER_ADMIN for dev users; JWT carries role.
- Data layer and storage
  - lib/db.ts: D1 CRUD for artists, portfolio images, appointments, site settings; getDB/getR2Bucket read bindings from Cloudflare context or globals (OpenNext).
  - lib/r2-upload.ts: Upload manager wrapping R2; bulk uploads; portfolio/profile helpers; expects R2_PUBLIC_URL for public reads.
- Validation and types
  - lib/validations.ts: Comprehensive Zod schemas for admin entities (artists, portfolio images, settings) and form payloads.
  - types/database.ts: Roles, entities, appointment status; Cloudflare D1/R2 ambient types to ease dev.
- Admin APIs (examples)
  - app/api/artists/route.ts:
    - GET: lists artists with filters and pagination (in-memory filtering after fetch)
    - POST: requires SHOP_ADMIN (or higher); validates body; creates artist tied to session user

---

## Data Models and APIs

### Data Models (from sql/schema.sql and types)

- users (id TEXT PK, email UNIQUE, name, role enum, avatar, timestamps)
- artists (id TEXT PK, user_id FK users, name, bio, specialties JSON string, social, is_active, hourly_rate, timestamps)
- portfolio_images (id TEXT PK, artist_id FK, url, caption, tags JSON string, order_index, is_public, created_at)
- appointments (id TEXT PK, artist_id FK, client_id FK users, title, description, times, status enum, amounts, notes, timestamps)
- availability (id TEXT PK, artist_id FK, day_of_week int, start_time/end_time HH:mm, is_active)
- site_settings (id TEXT PK, fields for studio and branding; id is 'default' row by convention)
- file_uploads (id TEXT PK, metadata, url, uploaded_by FK users)

Notes:
- IDs are TEXT and often UUIDs; site_settings uses a constant id 'default'.
- JSON stored as TEXT (specialties, tags, social_media, business_hours).

### Admin-Relevant Route Handlers (observed)

- /api/admin/migrate, /api/admin/stats
- /api/artists (GET, POST)
- /api/portfolio, /api/portfolio/[id], /api/portfolio/bulk-delete, /api/portfolio/stats
- /api/files, /api/files/bulk-delete, /api/files/folder, /api/files/stats
- /api/settings
- /api/users
- /api/appointments (shared with booking)

Patterns:
- Validations with Zod schemas from lib/validations.ts
- D1 access through lib/db.ts helpers using Cloudflare env context (context?.env in handlers)
- Role checks via middleware + requireAuth(UserRole.*) on sensitive operations

---

## Technical Debt and Known Issues (REALITY)

1. Env validation vs Cloudflare bindings
   - lib/env.ts requires DATABASE_URL, DIRECT_URL, and multiple AWS_* variables.
   - Actual DB access in lib/db.ts uses Cloudflare D1 binding (env.DB); no DATABASE_URL is used.
   - R2 uploads build public URLs using process.env.R2_PUBLIC_URL, but env.ts does not validate R2_PUBLIC_URL, and wrangler.toml does not set it. Missing/invalid public URL will break returned URLs for uploaded assets.

2. SiteSettings id handling
   - DB uses id='default' singleton row.
   - lib/validations.ts siteSettingsSchema expects id to be a UUID; mismatch with actual data causes invalidation/confusion and could break validation workflows.

3. Portfolio image ordering field name mismatch
   - DB column: order_index
   - lib/validations.ts schemas use 'order' as the property name; not aligned with DB and lib/db.ts update semantics. Risk of incorrect mapping when integrating UI forms → API → DB.

4. Auth and security (development shortcuts)
   - Credentials provider in lib/auth.ts accepts any credentials and assigns SUPER_ADMIN by default for non-whitelisted users (dev convenience).
   - No DB adapter (JWT-only). RBAC is token-based; no persistent user store beyond D1 writes that may occur when creating artists (which auto-creates ARTIST users).
   - This is acceptable for local/dev but must be hardened before production.

5. Middleware routing inconsistencies
   - middleware.ts checks pathname.startsWith("/artist") (singular) for “Artist-specific routes” role gating.
   - Public pages are under /artists/... (plural). There is also an allow rule for /^\/artists\/[^\/]+$/ as public. Mixed naming increases cognitive load; the singular check may be a stale/unused path.

6. Build config hides issues
   - next.config.mjs ignores TypeScript and ESLint errors during build. This can allow broken types or lint issues to ship; not suitable for CI/CD production gates.

7. Schema/tooling inconsistencies
   - sql/schema.sql header suggests executing “wrangler d1 execute united-tattoo-db …” while package.json uses database name “united-tattoo”. Mismatch in naming in comments could confuse operators.

8. R2 public access patterns
   - r2-upload.ts assumes a simple base URL concatenation for public reads. Cloudflare R2 often requires either a custom public domain or R2 public buckets; the base URL must be configured and documented. No presigned upload flow yet (stubbed).

---

## Integration Points and External Dependencies

### External Services

| Service       | Purpose          | Integration Type | Key Files            |
| ------------- | ---------------- | ---------------- | -------------------- |
| Cloudflare D1 | Relational DB    | Worker binding   | wrangler.toml, lib/db.ts |
| Cloudflare R2 | Object storage   | Worker binding   | wrangler.toml, lib/db.ts, lib/r2-upload.ts |
| NextAuth      | Authentication   | Providers/JWT    | lib/auth.ts, app/api/auth/[...nextauth]/ |
| OpenNext      | Next→Workers     | Build adapter    | package.json scripts, open-next.config.ts, wrangler.toml |

### Internal Integration Points

- Admin UI → API routes: Admin pages consume /api/* endpoints for CRUD on artists, portfolio images, settings, and files.
- Validation: UI forms align to Zod schemas (lib/validations.ts); ensure property names match DB contract (see debt on order/order_index).
- Role enforcement: middleware.ts + requireAuth(UserRole.*) enforce admin-only access.

---

## Development and Deployment

### Local Development Setup (Actual)

- Install deps: npm install
- D1 DB create/migrate:
  - npm run db:create (creates DB)
  - npm run db:migrate or npm run db:migrate:local (executes sql/schema.sql)
- Preview Workers runtime locally:
  - npm run dev:wrangler (build via OpenNext then preview)
  - or npm run preview (OpenNext preview)
- App dev server:
  - npm run dev (Next dev server; note some Cloudflare bindings are only available via OpenNext preview)

Required environment (observed/assumed):
- Wrangler configured/login
- Cloudflare bindings as per wrangler.toml
- NEXTAUTH_SECRET and NEXTAUTH_URL set appropriately
- R2_PUBLIC_URL should be set for correct public asset URLs (not currently validated by env.ts)

### Build and Deployment Process

- Build (OpenNext): npm run pages:build
- Preview: npm run preview
- Deploy to Cloudflare Pages: npm run deploy (wrangler pages deploy .vercel/output/static)
- wrangler.toml: 
  - compatibility_date >= 2024-09-23
  - compatibility_flags ["nodejs_compat"]
  - D1 and R2 bindings configured

---

## Testing Reality

- Unit/component tests: Vitest with RTL (see __tests__/)
- E2E: Not observed in repo
- Coverage: Test scripts available; actual coverage not measured here
- QA: Manual likely; shadcn components + form/zod patterns amenable to RTL coverage

---

## If Enhancement PRD Provided — Impact Analysis (Admin Focus)

Based on PRD Epic A, the following files/modules are most likely to be affected:

### Files/Modules Likely to Need Modification

- UI
  - app/admin/artists/* (listing, detail, new)
  - app/admin/uploads/page.tsx (batch upload flows, progress)
  - app/admin/settings/page.tsx (site settings form)
  - components/admin/* (admin-specific components)
- APIs
  - app/api/artists/route.ts (filters, pagination, create/linking behaviors)
  - app/api/portfolio/route.ts and /[id]/route.ts (CRUD, ordering, tags)
  - app/api/files/* (upload metadata, deletion, folder organization)
  - app/api/settings/route.ts (singleton settings updates)
  - app/api/users/route.ts (invite flows and role assignment)
- Lib
  - lib/r2-upload.ts (public URL handling, presigned URL path, folder conventions)
  - lib/db.ts (query optimizations, joining, business rules, activity logs)
  - lib/validations.ts (resolve property mismatches; align with DB)
  - lib/auth.ts (tighten dev-only flows, enforce role creation pathways)
  - middleware.ts (route gate consistency for admin vs artists)

### New Files/Modules Potentially Needed

- Activity Logs: D1 table and APIs for admin auditing per PRD (FR-A5.x)
- Invite & Onboarding APIs: Route handlers and email delivery for A1.x
- Moderation Queue: Table and APIs for uploads moderation hook (FR-A5.3)
- Image Processing: Server-side transformations (could leverage Cloudflare Images; not present now)

### Integration Considerations

- Enforce consistent role model end-to-end (Invite → Signup → Role assignment)
- Align Zod schemas with DB column names and types (e.g., order_index)
- R2 public URL and folder conventions should be codified and validated
- Consider introducing DB migrations governance and seed paths for admin roles

---

## Appendix — Useful Commands and Scripts

From package.json:

```bash
# Dev & Build
npm run dev
npm run pages:build
npm run preview
npm run deploy

# D1 Management
npm run db:create
npm run db:migrate
npm run db:migrate:local
npm run db:studio
npm run db:studio:local

# Tests
npm run test
npm run test:ui
npm run test:run
npm run test:coverage
```

---

## Gotchas and Practical Notes (Must Read)

- To use D1/R2 in preview, prefer OpenNext preview (npm run preview) where bindings are available via global Cloudflare context. Running plain next dev may not expose env.DB/env.R2_BUCKET without additional shims.
- Set NEXTAUTH_SECRET and NEXTAUTH_URL for auth to function correctly; in preview/production, wrangler.toml provides NEXTAUTH_URL for env scopes.
- Configure R2_PUBLIC_URL; otherwise URLs returned by upload endpoints may be unusable externally.
- next.config.mjs ignoring errors is risky; fix warnings and enable strict CI gates for production readiness.
- Site settings expect a singleton row with id 'default'; update APIs rely on this assumption.

---

## Recommended Fixes (Non-Blocking, Advisory)

- Update env validation to match Cloudflare bindings reality
  - Either remove DATABASE_URL from required env, or separate “Worker runtime” env from “local dev” .env with appropriate fallbacks.
  - Add R2_PUBLIC_URL to Zod-validated schema.

- Align schemas and properties
  - Rename portfolio image 'order' → 'orderIndex' in Zod schemas and UI forms to match DB.
  - SiteSettings schema: do not require UUID id; or adapt DB to UUID if desired (and update code).

- Security hardening
  - Replace dev-only SUPER_ADMIN behavior with an invite/token-based onboarding flow.
  - Implement NextAuth adapter (e.g., D1 via Drizzle/Kysely or Supabase per .clinerules) if persistence is required for sessions and users.

- Middleware consistency
  - Remove/rename singular '/artist' gating or align with actual '/artists' conventions; centralize route constants.

- CI/CD quality
  - Re-enable TypeScript and ESLint checks to catch regressions early.
  - Add component and route handler tests for admin flows (artists, portfolio, settings).

---

This document reflects the actual state of the system for Admin Dashboard & Artist Management, including technical debt and real-world constraints. It references concrete files and paths to accelerate development work by AI agents and maintainers.
