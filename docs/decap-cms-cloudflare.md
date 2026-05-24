# Decap CMS on Cloudflare

This document explains the Decap CMS setup for United Tattoo: an open-source, Git-based editing interface hosted on the existing Astro/Cloudflare site.

Status: implemented in-repo. The `/admin` route and same-site `/oauth` routes exist, but production login still requires creating a GitHub OAuth app and configuring Cloudflare secrets.

---

## Goal

Let non-technical staff edit site content through a browser CMS while keeping the Astro repository as the source of truth.

The desired workflow is:

1. Staff visit `/admin`.
2. Staff log in with GitHub.
3. Staff edit artist profiles, blog posts, and images through Decap CMS forms.
4. Decap commits content changes to the repository.
5. Cloudflare rebuilds and deploys the site from Git.

This keeps the current Git-based deployment model while avoiding manual GitHub file editing.

---

## Why Decap

Decap CMS is a good fit for the current constraints:

- Open source.
- Git-based.
- Minimal admin UI served from the Astro site.
- Works with Markdown/MDX frontmatter content.
- Can commit directly to GitHub.
- Can run on Cloudflare Pages/Workers with a small OAuth bridge.
- Does not require a CMS SaaS account, database, VPS service, or custom content publisher.

This is a better first implementation target than the Nextcloud publisher if GitHub login is acceptable for the owner.

---

## Architecture

```text
Cloudflare Pages / Worker
  /admin
    Decap CMS admin page

  /oauth/auth
  /oauth/callback
    Same-site Astro API routes running on Cloudflare

GitHub
  repository content and media
  OAuth identity
  commit history

Astro
  src/content/artists/*.mdx
  src/content/blog/*.mdx
  public/artists/**/*
```

The public site still renders from repository files. Decap only provides a friendlier editing interface over those files.

---

## Authentication Flow

Decap cannot safely keep a GitHub OAuth client secret in the browser, so it needs a small server-side auth bridge.

Cloudflare can host that bridge:

```text
Editor opens /admin
  -> Decap opens GitHub login popup
  -> popup requests /oauth/auth on the Cloudflare Worker
  -> Worker redirects to GitHub OAuth
  -> GitHub redirects to /oauth/callback
  -> Worker exchanges the code for an access token
  -> Worker returns the token to Decap
  -> Decap uses the token to call GitHub APIs
  -> Decap commits content changes to the configured branch
```

The owner needs a GitHub account with write access to the repository. That is acceptable for this project.

Keep the OAuth app scoped to this site and avoid broad organization-level access where possible.

---

## Decap Configuration Shape

Decap is configured through `public/admin/config.yml`.

The production backend is configured as:

```yaml
backend:
  name: github
  repo: United-Tattoo/united-tattoo
  branch: main
  base_url: https://united-tattoos.com
  auth_endpoint: /oauth/auth
```

Do not commit OAuth secrets or sensitive deployment details into public documentation.

Local development can use Decap's local backend so CMS field configuration can be tested before OAuth is wired.

---

## First Collections

Start with content that already maps cleanly to files.

### Artists

Path:

```text
src/content/artists/*.mdx
```

Fields should mirror `src/content.config.ts`:

- `name`
- `portrait`
- `galleryDir`
- `cmsPortfolioUploads`
- `cmsFlashUploads`
- `specialties`
- social links
- `portfolioUrl`
- `testimonials`
- `acceptingBookings`
- body content

Treat these as review-sensitive at first:

- `bookingEmailCc`
- `calendarId`
- `schedule`
- `bufferMinutes`

Those fields affect booking operations and should not be casual first-pass editing fields unless we add guardrails.

### Blog

Path:

```text
src/content/blog/*.mdx
```

Fields should mirror `src/content.config.ts`:

- `title`
- `description`
- `publishDate`
- `updatedDate`
- `author`
- `tags`
- `image`
- `draft`
- body content

Blog posts are a safer early collection because draft/publish behavior is already part of the schema.

### Media

Artist gallery images are Decap-visible through frontmatter arrays:

- `cmsPortfolioUploads`
- `cmsFlashUploads`

Those arrays are the display source when present. Pages still fall back to scanning the corresponding folders when the arrays are absent, which keeps older content and manual recovery paths working.

The underlying media files stay organized by artist:

```text
public/artists/{Artist}/Portfolio/
public/artists/{Artist}/Flash/
```

Each artist entry in `public/admin/config.yml` uses image fields pointed at that artist's `Portfolio` and `Flash` folders. Uploading through those fields commits the media file and the matching frontmatter list update together.

---

## Cloudflare Pieces

Needed Cloudflare assets:

- The existing Astro deployment.
- The implemented same-site OAuth routes at `/oauth/auth` and `/oauth/callback`.
- Cloudflare secrets for the GitHub OAuth app credentials.

The Worker should receive secrets through Cloudflare configuration, not committed files:

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

Create a GitHub OAuth app with:

```text
Homepage URL: https://united-tattoos.com
Authorization callback URL: https://united-tattoos.com/oauth/callback
```

Then set the Cloudflare secrets:

```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

---

## Deployment Flow

Target publication flow:

```text
Staff edit content in /admin
  -> Decap commits to GitHub
  -> Cloudflare Workers Builds sees the Git push
  -> Cloudflare runs the configured build command
  -> Cloudflare runs the configured Wrangler deploy command
  -> Site deploys if build succeeds
```

Cloudflare Workers Builds is configured from the Worker dashboard, not from GitHub Actions. The current intended settings are:

```text
Git repository: United-Tattoo/united-tattoo
Production branch: main
Root directory: /
Build command: pnpm run build
Deploy command: npx wrangler deploy
```

Cloudflare manages the Workers Builds API token in the dashboard. Do not add a separate GitHub Actions deploy workflow unless there is a specific reason to move deployment back into GitHub.

If the build fails, Cloudflare should keep the previous successful deployment online. The Git commit remains available for debugging and rollback.

---

## Safety Rules

- Do not expose OAuth secrets in the repository.
- Do not document private server IPs, hostnames, or personal contact details.
- Prefer least-privilege GitHub access.
- Keep the CMS admin route marked `noindex`.
- Start with a narrow set of editable fields.
- Use pull-request/editorial workflow if direct commits to `main` feel too risky after testing.
- Keep Astro/Zod schema validation as the final gate.

---

## Open Questions

- Should Decap commit directly to `main`, or use editorial workflow branches?
- Should artist booking fields be hidden from Decap initially?
- Should image conversion to AVIF be automated after CMS uploads?
- Should the admin route be protected by Cloudflare Access in addition to GitHub OAuth?

---

## Verification Checklist

1. Create the GitHub OAuth app.
2. Configure the Cloudflare secrets.
3. Deploy the site.
4. Give the editor's GitHub account write access to the repository.
5. Visit `/admin` and log in with GitHub.
6. Edit one low-risk field, such as a blog draft or artist bio sentence.
7. Confirm Decap commits to `main`.
8. Confirm Cloudflare builds and deploys the updated site.
9. Confirm existing artist Portfolio and Flash images render as thumbnails in Decap.
10. Upload one image through an artist Portfolio field and confirm it appears after the next build.

Keep direct Git edits available as the fallback workflow.
