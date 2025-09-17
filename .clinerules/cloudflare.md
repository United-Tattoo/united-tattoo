# NextJS + Cloudflare + OpenNext Deployment

## Setup Requirements
- Node.js 18+ and Cloudflare account required
- **@opennextjs/cloudflare** adapter mandatory (not edge runtime)
- Global Wrangler CLI: `npm install -g wrangler`
- All deployments via OpenNext adapter; no direct NextJS builds

## Project Configuration
- **wrangler.toml**: compatibility_date ≥ "2024-09-23", nodejs_compat flag
- **package.json**: `pages:build` script runs `npx @opennextjs/cloudflare@latest`
- **next.config.js**: `output: 'standalone'`, image optimization configured
- Build output directory: `.vercel/output/static`

## Build & Deploy Process
- Build command: `npm run pages:build` (transforms NextJS → Workers)
- Local testing: `npm run preview` (required before deploy)
- Deploy: `npm run deploy` or Cloudflare Pages Git integration
- Never deploy untested builds; preview mimics production runtime

## Environment & Security
- Environment variables in both Cloudflare Dashboard and `wrangler.toml`
- Secrets via `wrangler secret put SECRET_NAME` (not in wrangler.toml)
- Security headers required in API routes (X-Frame-Options, CSP, etc.)
- Cache headers mandatory for API endpoints: `s-maxage=86400, stale-while-revalidate`

## Performance & Limits
- Bundle size limits: 3MB free tier, 15MB paid
- Dynamic imports for heavy components to reduce cold starts
- Static files in `public/` directory only
- Image optimization via Cloudflare Images or custom loader

## Database & Storage
- Cloudflare D1 binding in wrangler.toml for SQL databases
- Workers KV for key-value storage
- All DB operations via environment bindings (env.DB, env.KV)
- No direct database connections; use Cloudflare services

## CI/CD Integration
- GitHub Actions with CLOUDFLARE_API_TOKEN secret
- Build step: `npm run pages:build`
- Deploy: `wrangler pages deploy .vercel/output/static`
- Fail builds on type/compatibility errors