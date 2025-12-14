# Nextcloud environment variables (Astro app)

This Astro app reads Nextcloud CMS + CalDAV data **server-side**. Do not expose credentials to the browser.

## Required

- `NEXTCLOUD_BASE_URL`: Base URL of your Nextcloud instance (example: `https://portal.united-tattoos.com`)
- `NEXTCLOUD_USERNAME`: Service account username (recommended)
- `NEXTCLOUD_PASSWORD`: Service account password / app password

## Optional

- `NEXTCLOUD_WEBDAV_BASE_PATH`: Defaults to `/remote.php/dav/files`
- `NEXTCLOUD_CMS_ARTISTS_DIR`: Defaults to `Artists`

## Local dev (one option)

Export env vars before running `npm run dev`:

```bash
export NEXTCLOUD_BASE_URL="https://portal.united-tattoos.com"
export NEXTCLOUD_USERNAME="service-account"
export NEXTCLOUD_PASSWORD="app-password"
cd astro && npm run dev
```

## Cloudflare

Define these as Wrangler vars/secrets (exact method depends on whether you deploy to Workers vs Pages Functions).

## Content schema

See `docs/nextcloud-content-schema.md` for the expected Nextcloud folder/file layout and required `info.json` fields (including `calendarUrl`).


