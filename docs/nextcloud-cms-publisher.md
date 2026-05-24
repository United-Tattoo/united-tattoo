# Nextcloud CMS Publisher Concept

This document captures a proposed publishing model for letting non-technical United Tattoo staff update site content from Nextcloud without needing to use GitHub directly.

Status: concept only. No sync script, systemd service, or deployment automation has been implemented. Decap CMS is now implemented as the preferred Git-based CMS path.

---

## Goal

Use Nextcloud as the editor-facing CMS while keeping the Astro repository and Cloudflare deployment as the published source of truth.

The desired owner workflow is:

1. Edit artist profile text in Nextcloud.
2. Add or remove portfolio and flash images in Nextcloud folders.
3. Wait for an automated publisher to validate, build, and deploy the site.
4. Leave the last good site online if the new content is invalid.

This avoids requiring the owner to understand Git, GitHub, MDX files, image conversion, or Cloudflare deployment.

---

## Recommended Architecture

Prefer a build-time publisher over live runtime reads from Nextcloud.

```text
Nextcloud CMS folder
  -> VPS publisher job
  -> generated Astro content and public assets
  -> pnpm build
  -> Cloudflare deploy
```

The public site should continue to serve prerendered pages and static assets. Nextcloud should be the editing interface, not a public request-time dependency.

### Why Build-Time Sync

Build-time sync fits the current repo:

- Artist profile data already lives in `src/content/artists/*.mdx`.
- The artist content schema already validates frontmatter at build time.
- Gallery images now have CMS-visible frontmatter lists, with folder scanning kept as a fallback.
- The site already uses prerendered Astro pages for the main content routes.

It also keeps the production site resilient:

- Nextcloud outages do not affect public page loads.
- Content changes are validated before deployment.
- The repository keeps a diffable history of published content.
- Rollback remains a normal Git or Cloudflare operation.
- Images can be converted and optimized before deployment.

---

## Proposed Nextcloud Folder Shape

Use one predictable folder tree for editable site content:

```text
United Tattoo CMS/
  artists/
    Artist-Name/
      profile.md
      portrait.jpg
      Portfolio/
        tattoo-001.jpg
        tattoo-002.jpg
      Flash/
        sheet-001.png
    Another-Artist/
      profile.md
      portrait.jpg
      Portfolio/
      Flash/
  pages/
    aftercare.md
```

Start with `artists/` only. Add `pages/` later if the first workflow proves reliable.

### Artist Profile Format

The first version should keep the editable profile file simple and close to Markdown:

```md
---
name: Artist Name
slug: artist-name
specialties:
  - Fine Line
  - Botanical
  - Geometric
instagram:
bookingEmailCc: artist@example.com
calendarId: artist-name
acceptingBookings: true
---

## About

Profile copy goes here.

## Style & Approach

Additional profile copy goes here.

## Booking

Booking notes go here.
```

The publisher would transform this into the existing `src/content/artists/{slug}.mdx` shape. It should derive:

- `portrait` from the copied and converted portrait file.
- `galleryDir` from the artist folder name.
- `cmsPortfolioUploads` and `cmsFlashUploads` from the copied folder contents.

The owner should not need to edit generated paths such as `portrait` or `galleryDir`.

---

## Publisher Responsibilities

The publisher should be a small script that runs on a schedule and performs the full publication loop.

Required behavior:

1. Download or mirror the Nextcloud CMS folder with `nxc`.
2. Parse artist profile files.
3. Validate required fields before touching the published checkout.
4. Generate `src/content/artists/*.mdx`.
5. Copy images into `public/artists/{Artist}/`.
6. Convert supported image formats to AVIF.
7. Run `pnpm build`.
8. Deploy only if the build succeeds.
9. Record clear logs for successful publishes and validation failures.

Recommended safety behavior:

- Use a lock with `flock` so overlapping runs cannot deploy at the same time.
- Stage generated output in a temporary directory before replacing repo files.
- Keep the previous successful site online when validation or build fails.
- Treat artist deletion, booking email changes, calendar changes, and schedule changes as review-sensitive operations.
- Produce a short change summary: added artists, removed artists, changed profiles, added images, removed images.

---

## VPS Deployment Model

The United Tattoo VPS is a good place to run the publisher because it can keep credentials, cached downloads, image tooling, and logs in one place.

Observed VPS state at time of this note:

- SSH target: available through the local `united-tattoo` Bash alias. Do not commit the underlying host, IP address, username, or credential details to the public repository.
- OS: Ubuntu 22.04.5 LTS.
- Available tools: `git`, `systemctl`, `crontab`, `flock`.
- Missing from `PATH`: `node`, `pnpm`, `nxc`, `ffmpeg`, `wrangler`.
- Root filesystem had enough free space for a cached CMS mirror and image conversion work.

Recommended layout:

```text
/opt/united-tattoo-site/        # repo checkout
/opt/united-tattoo-cms-cache/   # mirrored Nextcloud source
/etc/united-tattoo-publisher.env
/etc/systemd/system/united-tattoo-publisher.service
/etc/systemd/system/united-tattoo-publisher.timer
```

Run the publisher as a dedicated deploy user, not long-term as `root`.

The deploy user would need access to:

- The site repository checkout.
- A Nextcloud app password or `nxc` profile.
- Cloudflare deployment credentials.
- Node, pnpm, ffmpeg, nxc, and wrangler.

Use a systemd timer instead of cron so logs, retries, status, and failures are easier to inspect:

```bash
systemctl status united-tattoo-publisher.timer
journalctl -u united-tattoo-publisher.service
```

---

## Publication Flow

Target flow:

```text
Owner edits Nextcloud
  -> systemd timer fires every 5-15 minutes
  -> publisher mirrors CMS folder
  -> publisher validates content and images
  -> publisher generates repo files
  -> publisher runs pnpm build
  -> publisher deploys to Cloudflare
  -> logs success or failure
```

If there are no content changes, the publisher should exit without rebuilding or deploying.

If there are validation errors, the publisher should log them and exit non-zero without changing the live site.

If build or deploy fails, the publisher should keep the generated work available for debugging but avoid replacing the last known good deployment.

---

## What Should Be Automated First

Phase 1 should be intentionally narrow:

- Artist bios.
- Artist specialties and social links.
- Portrait images.
- Portfolio images.
- Flash images.

Avoid automating these until the basic flow is proven:

- Booking email recipients.
- Calendar IDs.
- Artist schedules.
- Page deletion.
- Artist deletion.
- Arbitrary homepage layout changes.

Those fields affect business operations or site structure and should either require a review step or a more explicit owner-facing control.

---

## Open Questions

- Should the publisher auto-commit generated changes to Git, or only deploy generated output?
- Should risky field changes open a pull request instead of deploying automatically?
- Should the owner edit Markdown files directly, or should Nextcloud Forms/Collectives/Notes provide a friendlier UI later?
- What notification channel should receive publisher failures: email, Slack, SMS, or a simple dashboard page?
- Should image deletion in Nextcloud delete images from the published site, or only hide newly missing images after review?

---

## Implementation Notes

Keep the publisher separate from runtime API code. The Cloudflare Worker should not fetch Nextcloud content at request time.

Good commands for a future implementation:

```bash
nxc files list "/United Tattoo CMS"
nxc files download "/United Tattoo CMS/artists/Artist-Name/profile.md" /tmp/profile.md
pnpm convert:avif:all
pnpm build
pnpm deploy
```

The existing `docs/content-management.md` remains the source of truth for the current manual MDX and image workflow until this publisher is implemented.
