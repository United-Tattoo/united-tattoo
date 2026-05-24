# AGENTS.md

Guidance for coding agents working in `united-tattoo`.

## Project Snapshot

- Site: United Tattoo's public website and booking flow for Fountain, Colorado.
- Stack: Astro 5, TypeScript strict preset, Tailwind CSS 4 through Vite, MDX content collections, Cloudflare Workers adapter.
- Package manager: `pnpm` (lockfile is `pnpm-lock.yaml`).
- Rendering model:
  - `astro.config.mjs` uses `output: 'server'` with `@astrojs/cloudflare`.
  - Most pages explicitly set `export const prerender = true`.
  - Dynamic routes include API endpoints under `src/pages/api/*.ts` and Decap CMS OAuth routes under `src/pages/oauth/*.ts`.
- Content model:
  - Artist data lives in `src/content/artists/*.mdx`.
  - Blog data lives in `src/content/blog/*.mdx`.
  - Both collections are validated by `src/content.config.ts`.
  - Site/business settings live in `src/data/site-settings.json` and are exposed through `src/consts.ts`.
- CMS: Decap CMS config lives in `public/admin/config.yml`; the admin entry route is `src/pages/admin.astro`.

## Setup Commands

- Install dependencies:
  - `pnpm install`
- Start local development server:
  - `pnpm dev`
  - Default URL: `http://localhost:4321`
- Build production output:
  - `pnpm build`
- Preview production build locally:
  - `pnpm preview`
- Deploy to Cloudflare:
  - `pnpm deploy`

## Build, Lint, and Test Commands

### Primary Gate

Run these before opening or merging changes when the touched area can affect runtime behavior:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

For documentation-only changes, `pnpm build` is usually enough if you need a repo-level sanity check.

### Lint

- ESLint is configured in `eslint.config.js`.
- Scripts:
  - `pnpm lint`
  - `pnpm lint:fix`
- The config uses `@eslint/js`, `typescript-eslint`, and `eslint-plugin-astro`.

### Tests

- Vitest is configured in `vitest.config.ts`.
- Scripts:
  - `pnpm test`
  - `pnpm test:watch`
- Current tests live under `tests/` and cover booking API behavior, booking formatting, CalDAV, and calendar cache behavior.
- Single-file test examples:
  - `pnpm exec vitest run tests/booking-api.test.ts`
  - `pnpm exec vitest run tests/calendar-cache.test.ts`

### Type Check

- There is no dedicated `typecheck` script in `package.json`.
- Best-effort full type check:
  - `pnpm exec tsc --noEmit --pretty false`
- Astro's production build is still the practical TypeScript/Astro integration gate:
  - `pnpm build`

## Environment Variables

- Primary local env file: `.env` in repo root.
- `.env.example` currently documents Nextcloud and Decap OAuth values; `README.md` also documents Resend booking email values.
- Booking/email:
  - `RESEND_API_KEY`
  - `BOOKING_FROM_EMAIL`
  - `RESEND_AUDIENCE_ID` (optional)
- Calendar availability:
  - `NEXTCLOUD_CALDAV_URL`
  - `NEXTCLOUD_USERNAME`
  - `NEXTCLOUD_PASSWORD`
  - `NEXTCLOUD_CALENDAR_PREFIX` (documented in `.env.example`; verify usage before relying on it)
- Decap CMS GitHub OAuth:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `GITHUB_REPO_PRIVATE` (optional route behavior flag)
- Utility script env:
  - `src/utils/.env` may be used by `src/utils/git-commit.js` for `OPENROUTER_API_KEY`.
- Do not read or print real `.env` secrets unless the task explicitly requires debugging env loading.

## Repository Conventions

### Imports

- Use ESM syntax everywhere (`type: module` project).
- Prefer grouping imports in this order:
  1. Astro/framework imports (`astro`, `astro:content`, etc.).
  2. Third-party packages.
  3. Node built-ins (`node:fs`, `node:path`, etc.).
  4. Local relative imports.
- Use `import type` for type-only imports when possible.

### Formatting

- Follow existing style already used across source files:
  - 2-space indentation.
  - Semicolons enabled.
  - Single quotes in TS/JS.
  - Trailing commas in multiline literals.
- Keep line lengths readable; prefer wrapping long object literals and template expressions.
- Avoid introducing a formatter-specific style unless the repo adopts one.

### TypeScript and Types

- `tsconfig.json` extends `astro/tsconfigs/strict`; preserve strict typing intent.
- Avoid `any` for new code; use explicit interfaces/types, discriminated unions, or `unknown` plus narrowing.
- Reuse Astro types where available (`APIRoute`, `CollectionEntry<'artists'>`, etc.).
- Keep collection schema changes in sync with `src/content.config.ts` and Decap CMS field config in `public/admin/config.yml`.

### Naming

- Components/layouts: `PascalCase.astro` (`SiteLayout.astro`, `HeaderNav.astro`).
- API route files: kebab-case where natural (`validate-slot.ts`).
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants (`SITE_TITLE`, `PHONE_NUMBER`).
- Content slugs derive from filenames; keep artist and blog MDX filenames stable unless the route should change.

## API and Data Flow

- Keep API response shapes stable with `docs/api-reference.md`.
- API handlers should:
  - Validate input early.
  - Return explicit status codes and JSON error bodies.
  - Wrap operational logic in `try/catch` and log failures with context.
  - Avoid leaking secrets or raw credentials in logs.
- Booking flow:
  - `src/pages/api/booking.ts` handles multipart booking submissions.
  - Resend sends admin and client emails when `RESEND_API_KEY` is configured.
  - Missing Resend config should degrade to dev logging rather than failing local work.
  - Newsletter opt-in through `RESEND_AUDIENCE_ID` is secondary and should remain non-fatal.
  - Artist-specific notification CCs come from `bookingEmailCc` in artist frontmatter.
- Availability flow:
  - `src/pages/api/availability.ts` returns cached artist slots.
  - `src/pages/api/validate-slot.ts` checks a selected slot against live CalDAV data.
  - Availability logic must stay timezone-aware for `America/Denver` and respect `bufferMinutes`.
  - Calendar/cache logic lives in `src/services/caldav.ts` and `src/services/calendar-cache.ts`.

## Astro and Frontend Patterns

- Use `astro:page-load` listeners for scripts that must work with Astro view transitions.
- Keep `export const prerender` explicit in pages/routes to preserve the current rendering strategy.
- Maintain design token usage via CSS custom properties in `src/styles/global.css`.
- Preserve the current dark editorial visual system, grid motif, typography, and restrained motion unless redesign is requested.
- `SiteLayout.astro` owns global SEO metadata, schema injection, fonts, view transitions, Lenis, GSAP setup, `HeaderNav`, and `SiteFooter`.
- `HeaderNav.astro` manages transparent/scrolled states and the mobile overlay menu.

## Content and Assets

- Artist metadata is source-of-truth in `src/content/artists/*.mdx` frontmatter.
- Blog posts live in `src/content/blog/*.mdx`.
- Site-wide business metadata lives in `src/data/site-settings.json`; update that rather than hard-coding repeated business details.
- Gallery assets live under `public/artists/{Artist-Name}/`.
- General site imagery lives under `public/images/`.
- Prefer AVIF for images. Conversion helpers:
  - `pnpm convert:avif`
  - `pnpm convert:avif:all`
  - `pnpm convert:avif:jpeg`
  - `pnpm convert:avif:png`
- Decap-managed artist gallery lists use `cmsPortfolioUploads` and `cmsFlashUploads`; pages may fall back to scanning `galleryDir` when those arrays are absent.

## Documentation

- If changing API contracts, update `docs/api-reference.md`.
- If changing booking/calendar behavior, update `docs/booking-calendar-integration.md`.
- If changing CMS fields or content workflow, update `docs/content-management.md`, `docs/decap-cms-cloudflare.md`, and `public/admin/config.yml` as needed.
- If changing SEO/schema/LLM discovery surfaces, update `docs/seo-strategy.md`.
- Keep README command lists aligned with `package.json`.

## Agent Operating Rules

- Make minimal, scoped changes; avoid broad refactors unless requested.
- Preserve unrelated dirty work. This repo may have active edits in multiple files.
- Do not commit generated build artifacts (`dist/`, `.astro/`, `.wrangler/`) unless a workflow explicitly requires it.
- Prefer source/config edits over built output edits.
- Before handing off non-trivial code changes, run the narrowest useful checks plus the primary gate when feasible.
- When touching API endpoints, exercise the endpoint manually during `pnpm dev` when practical.
- When touching visual/frontend behavior, inspect the page in a browser at desktop and mobile widths when practical.

## Cursor and Copilot Rules

- Checked for Cursor rules:
  - `.cursorrules`: not present
  - `.cursor/rules/`: not present
- Checked for Copilot rules:
  - `.github/copilot-instructions.md`: not present
- Conclusion: there are currently no additional Cursor/Copilot instruction files to merge.
