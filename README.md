# United Tattoo — Official Website (Next.js + ShadCN UI)

Hi, I’m Nicholai. I built this site for my friend Christy (aka Ink Mama) and the United Tattoo crew in Fountain, CO. The goal was simple: give the studio a site that actually reflects the art, the people, and the experience — not the stiff, generic stuff you usually see. This is also a thank you for everything Christy has done for Amari (my girlfriend and soulmate), who was her apprentice. So yeah, this is personal — and it shows.

This repo powers the official United Tattoo website, built with:
- Next.js App Router
- TypeScript
- Tailwind CSS
- ShadCN UI components (used across all pages)
- Lenis (smooth scroll)
- Lucide (icons)

Live dev server: http://localhost:3000


## Project Structure

- app/
  - page.tsx — homepage (Hero, Artists, Services, Contact sections)
  - aftercare/page.tsx — aftercare instructions (ShadCN-driven)
  - deposit/page.tsx — deposit policy + payment options (Afterpay, Stripe)
  - terms/page.tsx — terms of service
  - privacy/page.tsx — privacy policy
  - artists/ — artists listing + dynamic routes for profiles (coming from data)
  - book/page.tsx — booking flow
  - specials/page.tsx — promotions (monthly specials, VIP list)
  - contact/page.tsx — contact
  - gift-cards/page.tsx — gift card info

- components/
  - hero-section.tsx, artists-section.tsx, services-section.tsx, contact-section.tsx
  - aftercare-page.tsx, deposit-page.tsx, terms-page.tsx, privacy-page.tsx
  - booking-form.tsx — multi-step form using ShadCN components
  - footer.tsx — contains direct links to Aftercare, Deposit Policy, Terms, and Privacy
  - ui/ — ShadCN UI primitives

- data/
  - artists.ts — single source of truth for artist metadata and images used across pages

- public/
  - united-logo-*.png/jpg, artists/, and other stable assets


## Content & Assets

- All the “real” content, bios, and images are now wired in (not seed placeholders).
- Artist portraits and tattoo samples live under public/artists/.
- Pages like Aftercare, Deposit, Terms, and Privacy use consistent styling patterned after the homepage and portfolio pages — powered by ShadCN components.

If you need to re-copy images from the temp folder into public (on your machine), there’s a helper script:
- ./copy-artist-images.sh
Note: This script expects the temp directory structure to exist locally; it silently skips if a source is missing.


## Getting Started (Local Dev)

- Install deps:
  - npm install

- Run dev server:
  - npm run dev
  - Open http://localhost:3000

- Lint (optional):
  - npm run lint

Build:
- npm run build
- npm start


## Docker

This repo is docker-ready. We build a standalone Next.js app for a smaller runtime image.

Build image:
- docker build -t united-tattoo:latest .

Run container (port 3000):
- docker run --rm -p 3000:3000 -e PORT=3000 united-tattoo:latest
- Open http://localhost:3000

Notes:
- next.config.mjs sets output: "standalone"
- The Dockerfile copies .next/standalone + .next/static and runs the server with HOSTNAME=0.0.0.0


## Pages Overview

- Home — Bold, high-contrast, split imagery, parallax accents. This sets the identity.
- Artists — Grid and profile surfaces wired to data/artists.ts. Each artist shows image, specialties, and sample work.
- Aftercare — Two flows: General Aftercare and Transparent Bandage Aftercare (accurate, readable, ShadCN cards + alerts).
- Deposit — Clear policy, payment options, and compliance notes (LW2 Investments, LLC oversight).
- Terms & Privacy — Straightforward, legally sound, human-readable. Both accessible from the footer.
- Booking — Multi-step form with ShadCN components and validation-friendly structure.
- Specials — Marketing surface for time-bound promotions and membership-like advantages.


## Design Language

- ShadCN components everywhere possible
- Monochrome foundation with high contrast and cinematic image splits
- Type scales + spacing match the homepage/portfolio feeling
- Lucide icons for affordances


## Tech Notes

- TypeScript errors are ignored during build in CI to allow non-blocking content/design iteration (next.config.mjs).
- Images are unoptimized (no Next image loader), served statically; change if you plan to put this behind a CDN with transforms.
- Smooth scroll and parallax-style offsets are kept subtle to let the work shine.


## Deployment

- Standard Next.js deploys work (Vercel, Node server, Docker)
- For self-hosting or VPS, use the Dockerfile in the repo
- The site runs on port 3000 by default


## Why This Exists

Because Christy deserved a proper site — and because the previous one was, bluntly, not it. United Tattoo is more than a shop. It’s a community with real people and real art. This site tries to honor that.

— Nicholai
