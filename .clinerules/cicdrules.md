# CI/CD, Budgets, Required Workflow

## Pipeline (Gitea)
1) Lint, Typecheck, Biome/Prettier
2) Unit tests (Vitest) + Component (RTL)
3) Build
4) Migration dry‑run
5) E2E (Playwright) on preview env
6) Bundle size budgets enforced (fail on overage)
7) Release tagging (semver) + notes

## Required Workflow
- Run Context7 checks for new deps, upgrades, DS changes
- Check shadcn registry before custom components
- Use Cloudflare MCP for all DB ops (incl. migrations)
- Plan & Act for complex features; reference existing patterns
- Clarify ambiguous requirements early; provide confidence rating