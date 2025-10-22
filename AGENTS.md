# Repository Guidelines

## Project Structure & Module Organization
- `app/` defines Next.js routes and Server Actions; folder names mirror URLs and expose `page.tsx` or `route.ts` entrypoints.
- Shared UI lives in `components/`, domain hooks in `hooks/`, reusable utilities in `lib/`, and Tailwind tokens plus global CSS under `styles/`.
- Static assets sit in `public/`; data fixtures and CMS JSON in `data/`; D1 schema and migrations in `sql/`; automation scripts in `scripts/`.
- Tests mirror this layout inside `__tests__/` so suites stay close to the features they exercise.

## Build, Test, and Development Commands
- `npm run dev` starts the local server; `npm run build` and `npm run start` produce and serve the production bundle.
- Quality gates: `npm run lint`, `npm run format:check`, and `npm run ci:typecheck` keep linting, formatting, and typing aligned.
- Testing relies on Vitest: `npm run test` for watch mode, `npm run test:run` for CI-stable runs, and `npm run test:coverage` for reports.
- OpenNext & data ops: `npm run pages:build` prepares the worker bundle, `npm run deploy:preview` / `npm run deploy:production` push through Wrangler, and `npm run db:migrate[:local]` or `npm run db:backup` manage D1 state.
- Agent support tools live under `npm run bmad:*` (refresh, list, validate) and should follow any manifest updates in `bmad/`.

## Coding Style & Naming Conventions
- Ship TypeScript with strict typing; prefer explicit module exports over defaults for clean tree-shaking.
- Prettier and ESLint enforce 2-space indents, double quotes, and trailing commas; run `npm run format` before reviews.
- Files follow PascalCase for components, camelCase for hooks/utilities, and kebab-case for route folders to produce friendly URLs.

## Testing Guidelines
- Place specs under the matching `__tests__/` subtree and name them `*.test.ts[x]`.
- Combine Vitest with Testing Library for component interactions and use `vitest.setup.ts` for shared providers.
- Add regression coverage for each bug fix and ensure watch mode passes before pushing.
- Gate merges with `npm run test:coverage`; flag low coverage in the PR description.

## Commit & Pull Request Guidelines
- Follow the Conventional Commit format in history (`feat(scope): summary`, `fix(area): detail`) using present-tense voice.
- Bundle schema or fixture changes with their related code and note breaking behavior explicitly.
- Before opening a PR, run lint, typecheck, coverage, and `npm run pages:build`; attach output if CI is down.
- PRs should explain motivation, link issues or tickets, and include UI screenshots or recordings when visuals change.
