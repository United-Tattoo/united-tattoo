# United Tattoo — Brownfield Architecture Document (Focused: Epic D — Technical Architecture & Delivery)

This document captures the CURRENT STATE of technical architecture, build/deploy flows, runtime environment (Cloudflare/OpenNext), authentication/middleware, testing, and configuration. It reflects real behavior, gaps, and constraints to guide engineering delivery.

## Document Scope

Focused on: Cloudflare/OpenNext deployment model, D1/R2 bindings and access patterns, NextAuth/middleware security, build/test/CI setup, configuration (Tailwind/PostCSS/TS), Docker alternative runtime, and operational considerations.

### Change Log

| Date       | Version | Description                                           | Author           |
| ---------- | ------- | ----------------------------------------------------- | ---------------- |
| 2025-09-18 | 1.0     | Initial brownfield analysis (Tech Architecture)       | Architect Agent  |

---

## Runtime and Deployment

### OpenNext + Cloudflare Pages/Workers

- Adapter: @opennextjs/cloudflare with R2 incremental cache
  - open-next.config.ts:
    - incrementalCache: r2IncrementalCache
- wrangler.toml:
  - compatibility_date: "2024-09-23"
  - compatibility_flags: ["nodejs_compat"]
  - main: ".open-next/worker.js"
  - [assets] directory bound as ASSETS
  - D1 and R2 bindings:
    - [[d1_databases]] binding = "DB" (database_name = "united-tattoo", database_id provided)
    - [[r2_buckets]] binding = "R2_BUCKET" bucket_name = "united-tattoo"
    - [[r2_buckets]] binding = "NEXT_INC_CACHE_R2_BUCKET" bucket_name = "united-tattoo-inc-cache"
  - [[services]] self-reference (WORKER_SELF_REFERENCE)
  - Env vars:
    - [env.production.vars] NEXTAUTH_URL, NODE_ENV
    - [env.preview.vars] NEXTAUTH_URL, NODE_ENV

Build/Preview/Deploy scripts (package.json):
- pages:build → npx @opennextjs/cloudflare build
- preview → npx @opennextjs/cloudflare preview
- deploy → wrangler pages deploy .vercel/output/static
- dev:wrangler → pages:build then OpenNext preview

Notes:
- next.config.mjs: output: "standalone", images: { unoptimized: true }, ignores TS/ESLint errors during build.
- The OpenNext output directory used by deploy: .vercel/output/static (per script).
- R2-based ISR/incremental cache configured via NEXT_INC_CACHE_R2_BUCKET.

### Docker (Node runtime alternative)

- Dockerfile builds a Next.js standalone server (node:20-alpine):
  - Build stage runs `npm run build`
  - Runtime uses `.next/standalone` server.js with `.next/static` and `public/`
- This path runs a Node server on port 3000, not Cloudflare Workers.
- Considered an alternative for self-hosting; not used for Cloudflare Pages deployment.

---

## Data & Storage

### Cloudflare D1 Access

- Access pattern encapsulated in lib/db.ts:
  - getDB(env?): Prefers env.DB, otherwise reads from OpenNext global symbol (Symbol.for("__cloudflare-context__")). Throws if unavailable.
  - CRUD helpers:
    - Artists: get/create/update/delete
    - Portfolio images: get/create/update/delete
    - Appointments: get/create/update/delete with filters
    - Site settings: get/update (singleton id 'default')
  - Uses TEXT/JSON stored as string columns (specialties, tags, social_media, business_hours).

### Cloudflare R2 Access

- getR2Bucket(env?) in lib/db.ts: same global symbol pattern; returns R2 bucket binding.
- lib/r2-upload.ts:
  - FileUploadManager wrapper (put/get/delete/list none directly exposed; uses put/get/delete).
  - Public URL base constructed from process.env.R2_PUBLIC_URL (not validated in env.ts or configured in wrangler.toml).
  - Portfolio uploads helper and profile image upload functions.
  - Presigned URL generation: not implemented (returns null).

Schema (sql/schema.sql):
- Tables: users, artists, portfolio_images, appointments, availability, site_settings, file_uploads (plus indices).
- Site settings row is singleton with id='default'.

D1 setup (D1_SETUP.md):
- Guides wrangler db creation, migration, and local vs prod usage.
- Mentions DATABASE_URL for local SQLite in .env.local; prod uses env.DB binding.

---

## Authentication & Middleware

### NextAuth (lib/auth.ts)

- Session strategy: "jwt"
- Providers:
  - Credentials: accepts any email/password for dev; returns SUPER_ADMIN for non-whitelisted users (development convenience).
  - Optional Google/GitHub via env variables if provided.
- JWT callback attaches role (UserRole) and userId; session callback mirrors into session.user.
- Redirects: root-relative paths allowed; default redirect to /admin otherwise.
- pages: signIn (/auth/signin), error (/auth/error)
- events: logs sign-in/out.

Security implications:
- Dev-friendly Credentials provider grants SUPER_ADMIN by default for non-whitelisted users. Not production-safe.
- No database adapter for NextAuth; roles are token-only unless persisted via app logic elsewhere.

### Middleware (middleware.ts)

- Protects:
  - /admin: requires token and role SHOP_ADMIN or SUPER_ADMIN; else redirect to /auth/signin or /unauthorized.
  - /artist (singular) routes: requires ARTIST/SHOP_ADMIN/SUPER_ADMIN — note: public site uses /artists (plural). Potential stale path.
  - /api/admin: same admin role check; returns JSON errors with status 401/403.
- authorized() callback:
  - Allows specific public routes and /artists/[slug] as public
  - Allows /api/auth and /api/public
  - Requires auth for all else
- config.matcher excludes _next static/image assets and common image extensions; favicon, public served directly.

Observations:
- Mixed singular/plural gating ("artist" vs "artists")
- Public route list is static; ensure anchors and subpages are accounted for.

---

## Build/Test/Config Tooling

### TypeScript

- tsconfig.json:
  - strict: true; moduleResolution: "bundler"; jsx: "preserve"
  - paths alias: "@/*" → "./*"
  - allowJs: true; skipLibCheck: true; noEmit: true
- next.config.mjs sets:
  - typescript.ignoreBuildErrors = true
  - eslint.ignoreDuringBuilds = true
  - images.unoptimized = true
  - output = "standalone"

Risk:
- Ignoring TS/ESLint hides defects and reduces CI quality.

### Tailwind / PostCSS

- tailwind.config.ts:
  - darkMode: "class"
  - content globs: ./pages, ./components, ./app
  - theme extends shadcn palette via CSS variables
  - plugins: tailwindcss-animate
- postcss.config.mjs:
  - plugin: @tailwindcss/postcss (Tailwind v4-style config)

### Testing

- vitest.config.ts:
  - jsdom environment, setupFiles: vitest.setup.ts, alias "@"
- vitest.setup.ts:
  - Mocks next/router, next/navigation, next-auth/react, react-query
  - Mocks global fetch, crypto.randomUUID, matchMedia, IntersectionObserver, ResizeObserver

Existing tests:
- __tests__/lib/* present (data-migration, validations)

No E2E test framework present (e.g., Playwright) and no component test runner config beyond RTL usage via Vitest.

---

## CI/CD and Operational Considerations

- CI config files not present in repo (no GitHub Actions/Gitea workflows included).
- NPM scripts provide a conventional pipeline:
  - Lint, test, build, pages:build, preview, deploy, db:* commands
- Secrets:
  - NEXTAUTH_URL configured in wrangler.toml per env
  - NEXTAUTH_SECRET not shown in wrangler.toml; should be stored via wrangler secret or Cloudflare dashboard
  - R2_PUBLIC_URL not defined/validated but required by r2-upload.ts for public URLs

Caching:
- OpenNext R2 incremental cache configured; ensure the bound bucket exists and permissions are correct.

---

## Technical Debt and Known Issues (REALITY)

1) Env schema misalignment with runtime
- lib/env.ts requires DATABASE_URL, AWS_* for S3-style access; app uses Cloudflare D1/R2 bindings through env and global OpenNext context.
- R2_PUBLIC_URL needed by r2-upload.ts is not part of env validation and not set in wrangler.toml env vars.

2) NextAuth development shortcuts
- Credentials provider grants SUPER_ADMIN for arbitrary credentials (aside from a special-cased admin email). Production risk.
- No adapter; no persistent user/session store beyond JWT, leading to potential drift with D1 users table.

3) Middleware route mismatch
- "artist" (singular) gating vs public "artists" (plural) sections; could be dead code or misleading guard. Clean up to avoid confusion.

4) Build config suppresses quality gates
- Ignore TypeScript and ESLint errors during build masks regressions. CI quality at risk.

5) Payment and sensitive headers
- No global security headers or route handler-level headers exist for CSP, frame options, permissions policy, etc.
- Deposit and payment flows not implemented; when added, security headers and webhook validation must be addressed.

6) Availability and appointment validation duplication
- Local Zod schemas inside app/api/appointments/route.ts differ from lib/validations.ts; drift likely.

7) Docker vs Cloudflare deployment paths
- Dockerfile supports standalone Node server while OpenNext targets Cloudflare. Docs/scripts support both but only one path should be primary per environment.

8) Observability absent
- No Sentry, no OpenTelemetry, no structured logging strategy.

9) Incremental cache correctness
- OpenNext R2 incremental cache configured; ensure tags/revalidation strategy is defined for dynamic content once public data migrates from static to DB.

10) D1 setup documentation mismatch
- D1_SETUP.md references names like united-tattoo-db in examples, while wrangler.toml uses united-tattoo. Keep consistent to reduce operator confusion.

---

## Recommended Improvements (Technical Delivery)

- Environment and Secrets
  - Extend env zod schema to include R2_PUBLIC_URL; separate “Worker runtime” bindings from local dev variables (DATABASE_URL only for local sqlite).
  - Store NEXTAUTH_SECRET, any gateway secrets via `wrangler secret put` and Cloudflare Dashboard; avoid wrangler.toml for secrets.

- Authentication & RBAC
  - Replace dev SUPER_ADMIN default with an invite or email link flow.
  - Introduce an adapter if persistent user/session storage is required (or unify D1 users with NextAuth persistence).
  - Normalize middleware routes (remove singular /artist gating or align with intended private artist routes).

- Build/CI Quality Gates
  - Re-enable TypeScript and ESLint checks in next.config.mjs for CI.
  - Add CI workflow: lint → test → build → pages:build → preview deploy (manual approval) → deploy.
  - Include bundle size budgets for main routes.

- Testing
  - Expand unit/component tests (forms, route handlers with mocked env.DB).
  - Introduce Playwright for E2E: booking flow, admin flows, critical public pages render.
  - Contract tests for R2 upload endpoint responses.

- Security Headers & Policies
  - Add common headers in route handlers or middleware where appropriate:
    - X-Frame-Options: DENY; Referrer-Policy: strict-origin-when-cross-origin
    - Content-Security-Policy with nonce/hash or strict static policy
    - Permissions-Policy scoped to required APIs
  - Enforce cookie flags and CSRF patterns if/when using sessions/cookies.

- Data Contracts
  - Consolidate Zod schemas in lib/validations.ts and reuse in routes (appointments, artists, etc.) to avoid drift.
  - Align SiteSettings id handling (UUID vs 'default'); align portfolio order vs order_index.

- Observability
  - Add Sentry (server/client) with release tracking and environment tags.
  - Consider OpenTelemetry for server actions and route handlers.

- Deployment Hygiene
  - Clarify Docker vs Cloudflare path; recommend OpenNext Cloudflare as primary, Docker for local or self-host options.
  - Ensure R2 incremental cache bucket exists and is referenced by OpenNext; document cache invalidation strategy (revalidateTag).

---

## Operational Playbook

- Local Dev (Next server): `npm run dev`
- Cloudflare Preview (Worker runtime): `npm run preview` (after `npm run pages:build`)
- Deploy: `npm run deploy`
- D1:
  - Create: `npm run db:create`
  - Migrate: `npm run db:migrate[:local]`
  - Inspect: `npm run db:studio[:local]`

---

## Appendix — Key Files

- wrangler.toml
- open-next.config.ts
- next.config.mjs
- Dockerfile
- lib/db.ts, lib/r2-upload.ts, lib/auth.ts, lib/env.ts
- middleware.ts
- vitest.config.ts, vitest.setup.ts
- tailwind.config.ts, postcss.config.mjs, tsconfig.json
- sql/schema.sql, D1_SETUP.md

---

This document reflects the actual technical architecture and delivery process, calling out real gaps and steps to harden the system for production-grade delivery under Epic D.
