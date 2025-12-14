# United Tattoo

Official website for United Tattoo, a tattoo studio in Fountain, Colorado.

Built with **Astro** and deployed to **Cloudflare Workers**.

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start dev server (http://localhost:4321)
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run deploy:dry-run` | Build and dry-run deploy (no publish) |
| `npm run format` | Format code with Prettier |

## Project Structure

```
united-tattoo/
├── astro/                 # Astro application
│   ├── src/
│   │   ├── components/    # Astro/React components
│   │   ├── layouts/       # Page layouts
│   │   ├── lib/           # Utilities (CalDAV, Nextcloud CMS)
│   │   ├── pages/         # File-based routing
│   │   └── assets/        # Images for astro:assets optimization
│   ├── astro.config.mjs   # Astro configuration
│   ├── wrangler.jsonc     # Cloudflare Workers config
│   └── package.json       # Astro dependencies
├── public/                # Static assets (served as-is)
├── design-language/       # Design reference & assets
├── docs/                  # Project documentation
├── sql/                   # Database schema (reference)
└── package.json           # Root orchestrator scripts
```

## Static Assets

The root `public/` directory contains all static assets (images, fonts, etc.).  
Astro is configured to use this as its `publicDir`, so files are served from `/`.

For images that need optimization with `astro:assets`, place them in `astro/src/assets/`.

## Deployment

The site deploys to Cloudflare Workers using the `@astrojs/cloudflare` adapter.

```bash
# Deploy to production
npm run deploy

# Dry-run (verify build without publishing)
npm run deploy:dry-run
```

Configuration: [`astro/wrangler.jsonc`](./astro/wrangler.jsonc)

## Legacy Next.js Version

The original Next.js/OpenNext version of this site is preserved on the [`nextjs-archive`](https://github.com/United-Tattoo/united-tattoo/tree/nextjs-archive) branch for reference and rollback purposes.

## Documentation

- [`docs/`](./docs/) — Project documentation
- [`astro/docs/`](./astro/docs/) — Astro-specific docs (Nextcloud integration, etc.)
- [`CLAUDE.md`](./CLAUDE.md) — AI assistant context file

## License

All rights reserved. See LICENSE file for details.
