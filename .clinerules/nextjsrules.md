# Cline Next.js Development Rules

## Core Technology Stack
- Next.js 14+ App Router (no Pages Router)
- Tailwind + shadcn/ui (mandatory)
- TypeScript only (.ts/.tsx)
- State: Zustand (local UI) + React Query (server state)
- DB: Postgres (Docker) **via Supabase MCP only**
- VCS: Gitea
- MCP: Supabase MCP (DB), Context7 MCP (patterns/updates)

## Project Structure (no `src/`)
app/  | components/ (ui/, custom/) | lib/ | hooks/ | types/ | constants/ | docker/ | sql/

## Next.js Rules
- App Router only; organize with `(group)`
- Implement `loading.tsx` and `error.tsx` in segments
- **Server Actions** for authenticated same‑origin mutations
- **Route Handlers** for webhooks, cross‑origin, streaming, public APIs
- Image component required; dynamic import heavy modules
- Tag‑based caching + `revalidateTag` policy

## Cross‑refs
- UI & shadcn → `UI_RULES.md`
- Security, Auth, Headers, Rate‑limit, Secrets → `SECURITY_AUTH.md`
- Data, Migrations, File Uploads, MCP usage → `DATA_INFRA.md`
- CI/CD, Budgets, Workflow → `CI_CD.md`
- Testing → `TESTING.md`
- Observability → `OBSERVABILITY.md`
- Docker & Deployment → `DOCKER_DEPLOY.md`

## Forbidden
- Direct DB access (MCP only)
- Bypass Context7 for upgrades/pattern changes
- Override shadcn internals or use inline styles
- Custom tokens outside DS; committing secrets