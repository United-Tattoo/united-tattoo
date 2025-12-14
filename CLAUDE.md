# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

United Tattoo is an Astro-based website for a tattoo studio in Fountain, CO. The application includes artist portfolios with Nextcloud CMS integration, booking with CalDAV, and is deployed to Cloudflare Workers.

**Stack:**
- Astro 5 with React islands
- Cloudflare Workers via `@astrojs/cloudflare`
- Tailwind CSS 4
- Nextcloud WebDAV for artist content
- CalDAV for appointment availability

## Common Commands

```bash
# Development
npm run dev                    # Start Astro dev server (port 4321)

# Build & Deploy
npm run build                  # Build Astro for production
npm run preview                # Preview production build locally
npm run deploy                 # Build and deploy to Cloudflare Workers
npm run deploy:dry-run         # Build only (no deploy)

# Utilities
npm run format                 # Format code with Prettier
npm run install:all            # Install root + astro dependencies
```

## Architecture

### Project Structure

```
united-tattoo/
├── astro/                 # Main Astro application
│   ├── src/
│   │   ├── components/    # Astro + React components
│   │   ├── layouts/       # Page layouts
│   │   ├── lib/           # Utilities (nextcloud-cms.ts, caldav.ts)
│   │   ├── pages/         # File-based routing
│   │   └── assets/        # Images for astro:assets optimization
│   ├── astro.config.mjs   # Astro config
│   ├── wrangler.jsonc     # Cloudflare Workers config
│   └── package.json       # Astro dependencies
├── public/                # Static assets (served by Astro via publicDir)
├── design-language/       # Design reference materials
├── docs/                  # Project documentation
├── sql/                   # Database schema reference
└── package.json           # Root orchestrator
```

### Static Assets

Root `public/` is configured as Astro's `publicDir` (via `publicDir: '../public'` in astro.config.mjs).  
Files are served at `/` without processing.

For images needing optimization, use `astro/src/assets/` with `astro:assets`:

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Image src={hero} alt="..." />
```

### Key Files

- **`astro/astro.config.mjs`** — Astro configuration (React, Cloudflare adapter, Tailwind, publicDir)
- **`astro/wrangler.jsonc`** — Cloudflare Workers deployment config
- **`astro/src/lib/nextcloud-cms.ts`** — Nextcloud WebDAV client for artist content
- **`astro/src/lib/caldav.ts`** — CalDAV integration for booking availability
- **`astro/src/components/booking/BookingIsland.tsx`** — React island for interactive booking

### Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/index.astro` | Homepage |
| `/artists` | `pages/artists/index.astro` | Artist listing |
| `/artists/[slug]` | `pages/artists/[slug].astro` | Individual artist |
| `/book` | `pages/book/index.astro` | Booking page |

### Nextcloud Integration

Artist data is stored in Nextcloud and fetched via WebDAV:

- `listArtistSlugs(env)` — List all artist slugs
- `getArtistRecord(env, slug)` — Get artist details + portfolio

Environment variables:
- `NEXTCLOUD_BASE_URL` — Nextcloud instance URL
- `NEXTCLOUD_USERNAME` — Service account username
- `NEXTCLOUD_PASSWORD` — Service account password

See `astro/docs/nextcloud-env.md` for setup.

### CalDAV Integration

Appointment availability checking via CalDAV:

- `checkAvailability(artistSlug, date)` — Check if artist is available

## CI/CD

Located in `.gitea/workflows/ci.yaml`:
- Installs dependencies (root + astro)
- Builds Astro
- Verifies build output exists
- Runs preview smoke check

## Legacy Next.js Version

The original Next.js/OpenNext version is archived on the `nextjs-archive` branch. It includes:
- Full admin dashboard
- NextAuth.js authentication
- Cloudflare D1 database integration
- Payload CMS

If you need to reference or restore any of that functionality, check out that branch.

## Important Notes

- The root `package.json` only contains orchestration scripts — actual app code is in `astro/`
- Static assets are in root `public/`, not `astro/public/`
- React components are used as Astro islands with `client:load` directive
- Build output goes to `astro/dist/`
