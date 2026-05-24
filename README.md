# United Tattoo

Official website for United Tattoo in Fountain, Colorado.

Live site: https://united-tattoos.com

## Stack

- Astro 5
- TypeScript
- Tailwind CSS 4
- MDX content collections
- Cloudflare Workers adapter
- Resend for booking email
- Nextcloud CalDAV for availability

## Quick Start

```bash
pnpm install
pnpm dev
```

The local site runs at `http://localhost:4321`.

## Common Commands

```bash
pnpm dev       # Start the dev server
pnpm lint      # Run ESLint
pnpm lint:fix  # Auto-fix lint issues where possible
pnpm test      # Run behavior/regression tests
pnpm test:watch # Run tests in watch mode
pnpm build     # Build production output
pnpm preview   # Preview the production build
pnpm deploy    # Build and deploy with Wrangler
```

Use `pnpm test`, `pnpm lint`, and `pnpm build` before opening or merging changes.

## Environment

Create `.env` in the project root when working with booking, email, or calendar features.

```bash
RESEND_API_KEY=
BOOKING_FROM_EMAIL=
RESEND_AUDIENCE_ID=

NEXTCLOUD_CALDAV_URL=
NEXTCLOUD_USERNAME=
NEXTCLOUD_PASSWORD=
```

`RESEND_AUDIENCE_ID` is optional. Local development can run without email credentials, but booking submissions will not send real email without Resend configured.

## Project Layout

```text
src/
  components/          Reusable Astro components
  content/artists/     Artist MDX content
  content/blog/        Blog MDX content
  layouts/             Shared page layouts
  pages/               Astro routes and API endpoints
  styles/global.css    Global design tokens and styles
  utils/               Utility scripts

public/
  artists/             Artist portraits and portfolio images
  images/              Site imagery
```

Important files:

- `src/content.config.ts` defines artist and blog content schemas.
- `src/pages/api/booking.ts` handles booking submissions.
- `src/pages/api/availability.ts` handles artist availability.
- `src/components/HeaderNav.astro` controls the main navigation.
- `src/components/PageHero.astro` provides the shared page hero used across booking, artists, and blog pages.
- `docs/booking-calendar-integration.md` documents booking, CalDAV availability, and regression testing.
- `docs/seo-strategy.md` documents local SEO, content, schema, social profiles, and AI/LLM discovery surfaces.

## Content Editing

Artist profiles live in `src/content/artists/*.mdx`. The filename is the URL slug, so keep filenames stable unless the route should change.

Blog posts live in `src/content/blog/*.mdx`.

Portfolio images live under `public/artists/{Artist-Name}/`. Prefer optimized images, especially AVIF, for new assets.

## Collaboration Workflow

Work from a branch instead of committing directly to `main`:

```bash
git checkout -b feat/short-description
pnpm test
pnpm build
git push origin feat/short-description
```

Then open a pull request into `main`.

Use clear commit messages, keep changes scoped, and do not commit generated output such as `dist/` or `.astro/` cache files.

## Deployment

Deployment is configured through the Cloudflare adapter and `wrangler.jsonc`.

```bash
pnpm deploy
```

Run `pnpm build` first when you only need validation without deploying.
