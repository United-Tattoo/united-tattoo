# AGENTS.md

Guidance for coding agents working in `united-tattoo`.

## Project Snapshot

- Stack: Astro 5 (SSR output), TypeScript (strict preset), Tailwind CSS 4, MDX, Cloudflare Workers adapter.
- Package manager: `pnpm` (lockfile is `pnpm-lock.yaml`).
- Runtime split:
  - Static/prerendered pages for most routes.
  - Dynamic API routes under `src/pages/api/*.ts`.
- Content model: artist data lives in `src/content/artists/*.mdx`, validated by `src/content.config.ts`.

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

### Build

- Full production build (primary quality gate):
  - `pnpm build`

### Lint / Type Check

- There is currently **no dedicated lint script** in `package.json`.
- There is currently **no configured ESLint/Prettier/Biome** config in this repo.
- Type checking can be run with:
  - `pnpm exec tsc --noEmit --pretty false`
- Note: current baseline has existing TypeScript errors in API/service files; do not assume this command is green by default.

### Tests

- There is currently **no automated test runner configured** (`vitest`, `jest`, `playwright`, etc. are absent).
- Practical validation currently relies on build + manual endpoint/page checks.

### Single Test (Important)

- Since no test framework is configured, there is no true "run one test" command today.
- Closest equivalents for targeted checks:
  - Build-only confidence: `pnpm build`
  - Type-check one file (best-effort):
    - `pnpm exec tsc --noEmit src/pages/api/availability.ts`
  - Manual endpoint check during `pnpm dev`:
    - `curl "http://localhost:4321/api/availability?artist=christy-lumberg"`
- If a test runner is introduced later, add its single-test invocation here immediately.

## Environment Variables

- Primary env file: `.env` in repo root.
- Example template: `.env.example`.
- Key vars used by app:
  - `RESEND_API_KEY`
  - `BOOKING_FROM_EMAIL`
  - `RESEND_AUDIENCE_ID` (optional)
  - `NEXTCLOUD_CALDAV_URL`
  - `NEXTCLOUD_USERNAME`
  - `NEXTCLOUD_PASSWORD`
- Utility script env (separate): `src/utils/.env` for `OPENROUTER_API_KEY`.

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

- `tsconfig` extends `astro/tsconfigs/strict`; preserve strict typing intent.
- Avoid `any` for new code; use explicit interfaces/types, discriminated unions, or `unknown` + narrowing.
- Reuse Astro types where available (`APIRoute`, `CollectionEntry<'artists'>`, etc.).
- Keep content schema changes in sync with `src/content.config.ts`.

### Naming

- Components/layouts: `PascalCase.astro` (`SiteLayout.astro`, `HeaderNav.astro`).
- API route files: kebab-case where natural (`validate-slot.ts`).
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants (`MAX_FILES`, `TIMEZONE`).
- Content slugs derive from filename; keep artist MDX filenames stable and URL-safe.

### Error Handling and Logging

- API handlers should:
  - Validate input early.
  - Return explicit status codes and JSON error bodies.
  - Wrap operational logic in `try/catch` and log failures with context.
- Prefer graceful degradation for optional integrations (email, CalDAV) over hard crashes.
- Do not leak secrets or raw credentials in logs.

### API and Data Flow

- Keep API response shapes stable with `docs/api-reference.md`.
- Booking flow touches external systems (Resend + optional audience subscription):
  - Preserve non-fatal behavior for secondary failures (e.g., newsletter opt-in failure).
- Availability logic must stay timezone-aware (`America/Denver`) and buffer-aware.

### Astro and Frontend Patterns

- Use `astro:page-load` listeners for scripts that must work with view transitions.
- Keep `export const prerender` explicit in pages/routes to match current rendering strategy.
- Maintain design token usage via CSS custom properties in `src/styles/global.css`.
- Preserve editorial grid motif and current typography system unless redesign is requested.

### Content and Assets

- Artist metadata is source-of-truth in `src/content/artists/*.mdx` frontmatter.
- Gallery assets live under `public/artists/{Artist-Name}/`.
- Prefer AVIF for images; conversion scripts are provided in `src/utils/convert-to-avif.js`.

## Agent Operating Rules

- Make minimal, scoped changes; avoid broad refactors unless requested.
- Do not commit generated build artifacts unless the workflow explicitly requires it.
- If changing API contracts or content schema, also update docs in `docs/`.
- Before handing off, run at least:
  - `pnpm build`
- When feasible, also exercise touched endpoints manually in dev.

## Cursor and Copilot Rules

- Checked for Cursor rules:
  - `.cursorrules`: not present
  - `.cursor/rules/`: not present
- Checked for Copilot rules:
  - `.github/copilot-instructions.md`: not present
- Conclusion: there are currently no additional Cursor/Copilot instruction files to merge.
