# United Tattoo — Astro App

This is the main Astro application for United Tattoo.

## Development

```bash
# From repo root
npm run dev

# Or directly from this directory
npm run dev -- --host 0.0.0.0 --port 4321
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview locally
npm run preview
```

Deploy is handled from the repo root via `npm run deploy`.

## Configuration

- **`astro.config.mjs`** — Astro configuration (React, Cloudflare adapter, Tailwind)
- **`wrangler.jsonc`** — Cloudflare Workers deployment config
- **`tsconfig.json`** — TypeScript configuration

## Static Assets

Static assets live in the repo-root `public/` directory (configured via `publicDir: '../public'` in astro.config.mjs).

For images that need `astro:assets` optimization, use `src/assets/`:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---
<Image src={heroImage} alt="United Tattoo" />
```

## Key Directories

```
src/
├── components/      # Astro and React components
├── layouts/         # Page layouts (Layout.astro)
├── pages/           # File-based routing
├── lib/             # Utilities
│   ├── nextcloud-cms.ts    # Nextcloud WebDAV CMS client
│   └── caldav.ts           # CalDAV calendar integration
└── assets/          # Images for astro:assets optimization
```

## Nextcloud Integration

Artist data and content is fetched from Nextcloud via WebDAV.  
See [`docs/nextcloud-env.md`](./docs/nextcloud-env.md) for environment setup.

## Booking

The booking page uses a React island (`src/components/booking/BookingIsland.tsx`) for interactive CalDAV availability checking.
