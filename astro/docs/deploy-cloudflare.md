# Deploying the Astro app to Cloudflare

This Astro app is configured for the **Cloudflare Workers** deployment target via `@astrojs/cloudflare`.

## Build

From repo root:

```bash
npm run astro:build
```

## Deploy (Worker)

From repo root:

```bash
npm run astro:deploy
```

This runs an Astro build and then deploys using Wrangler with `astro/wrangler.jsonc`.

## Environment variables

For Nextcloud integration, you must provide the required vars/secrets described in:

- `docs/nextcloud-env.md`
- `docs/nextcloud-content-schema.md`

## Cutover note

This repo currently still contains the existing Next.js/OpenNext deployment. The Astro worker is deployed as a separate
worker (`united-tattoo-astro`) until you’re ready to cut traffic over.


