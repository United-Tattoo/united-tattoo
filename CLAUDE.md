# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

United Tattoo is a tattoo studio website for a shop in Fountain, CO. The project is currently in early development using Astro as a minimal static site generator.

**Current Stack:**
- Astro 5 (minimal setup)
- Tailwind CSS 4
- No deployment configuration yet

**Project Status:** This is a from-scratch rebuild on the `astro-migration-from-scratch` branch. The previous Next.js version (with Payload CMS, NextAuth, D1 database, etc.) is archived on the `nextjs-archive` branch.

## Common Commands

All commands run from the project root:

```bash
# Development
pnpm dev             # Start Astro dev server at localhost:4321

# Build & Preview
pnpm build           # Build for production to ./dist/
pnpm preview         # Preview production build locally

# Utilities
pnpm astro           # Run Astro CLI commands
pnpm commit          # AI-powered commit message generator
pnpm convert:avif    # Convert images to AVIF format
```

## Project Structure

```
united-tattoo/
├── src/
│   ├── pages/           # File-based routing
│   │   ├── index.astro  # Homepage (minimal scaffold)
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── llms.txt.ts  # LLM crawlable content
│   │   └── rss.xml.js   # RSS feed
│   └── utils/           # Utility scripts (image conversion, etc.)
├── public/              # Static assets
│   ├── artists/         # Artist-related content
│   └── images/          # Static images
├── dev/                 # Development notes and design references
│   ├── Talk-with-christy.md  # Booking flow requirements
│   └── design-refs/          # Design inspiration
├── astro.config.mjs     # Minimal Astro config (no adapters yet)
├── tsconfig.json        # TypeScript config
└── package.json         # Project dependencies
```

## Planned Architecture

Based on `dev/Talk-with-christy.md`, the site will include:

1. **Artist Portfolios**: Artist pages with galleries and booking links
2. **Booking System**: Complex multi-step booking flow with:
   - Client form submission with reference images
   - Receptionist approval layer
   - Artist approval/veto capability
   - Nextcloud calendar integration (CalDAV)
   - Automated reminders (email + text)
   - Client booking management UI
   - Alternative artist suggestions on denial
3. **Content Management**: Nextcloud WebDAV for artist content (not yet implemented)
4. **Notifications**: Email + text notifications for booking workflow (not yet implemented)

**Out of Scope** (handled in-shop):
- Deposits/payments
- Medical intake forms
- ID verification
- Multi-session bookings

## Current State

This is a minimal Astro starter with only basic pages. The architecture described above is planned but not yet implemented. The current codebase has:

- Basic Astro pages (mostly scaffolds)
- No database integration
- No authentication
- No booking system
- No Nextcloud/CalDAV integration
- No deployment configuration

## Legacy Next.js Version

The previous implementation is on the `nextjs-archive` branch and included:
- Full admin dashboard
- NextAuth.js authentication
- Cloudflare D1 database
- Payload CMS
- OpenNext deployment to Cloudflare Workers

If you need to reference that implementation, check out that branch.

## Utility Scripts

Located in `src/utils/`:

### AI-Powered Commit Messages (`pnpm commit`)
Generates commit messages using OpenRouter AI based on staged changes.

**Setup:**
1. Get a free API key from [openrouter.ai/keys](https://openrouter.ai/keys)
2. Copy `src/utils/.env.example` to `src/utils/.env`
3. Add your API key to the `.env` file
4. Stage changes with `git add`
5. Run `pnpm commit` to generate and review commit message

### Image Conversion (`pnpm convert:avif`)
Converts images to AVIF format using ffmpeg. Requires ffmpeg to be installed.

**Usage:**
- `pnpm convert:avif:all` - Convert all supported formats
- `pnpm convert:avif:jpeg` - Convert JPEG files only
- `pnpm convert:avif:png` - Convert PNG files only
- See `src/utils/README.md` for full documentation

## Development Notes

- The `.next/` directory exists in the working tree but should be ignored (legacy artifact)
- Build output goes to `dist/` (not `astro/dist/`)
- The project uses **pnpm** for package management
- Design preferences documented in `dev/Talk-with-christy.md` and `dev/DESIGN_SYSTEM_SUMMARY.md`
- Utility scripts require setup - see `src/utils/README.md`
