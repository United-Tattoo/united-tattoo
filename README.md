<div align="center">

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://git.biohazardvfx.com/nicholai/united-tattoo">
    <img src="public/united-logo-lettering.png" alt="United Tattoo Logo" width="400">
  </a>

  <h1 align="center" style="font-size: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">United Tattoo</h1>

  <p align="center" style="font-size: 18px; max-width: 600px;">
    Official website for United Tattoo, a tattoo studio in Fountain, Colorado.
    <br />
    <br />
    <a href="https://united-tattoos.com"><strong>View Live Site »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Quick Start</a>
    ·
    <a href="https://git.biohazardvfx.com/nicholai/united-tattoo/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://git.biohazardvfx.com/nicholai/united-tattoo/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
## Table of Contents

- [About The Project](#about-the-project)
  - [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Status](#project-status)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Common Commands](#common-commands)
  - [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

</div>

## About The Project

<div align="center">
  <img src="public/united-studio-main.jpg" alt="United Tattoo Studio" width="800" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
</div>

<br />

**United Tattoo** is the official marketing website for [United Tattoo](https://united-tattoos.com), a tattoo studio in **Fountain, Colorado**. Built with Astro 5, the site features artist portfolios, an online booking system, and a modern editorial design aesthetic.

### Key Features

- **Artist Portfolios** - Dynamic artist pages with galleries and flash sheets, powered by MDX content collections
- **Online Booking** - Multi-step booking form with file uploads and email notifications via Resend
- **Editorial Design** - Dark, gallery-inspired aesthetic with GSAP scroll animations and smooth Lenis scrolling
- **Policy Pages** - Terms of Service, Privacy Policy, and Aftercare instructions
- **Responsive Layout** - Mobile-first design with modular Astro components

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Tech Stack

<div align="center">

### Core Framework
[![Astro][astro-badge]][astro-url]
[![TypeScript][typescript-badge]][typescript-url]

### Styling & Animations
[![Tailwind CSS][tailwind-badge]][tailwind-url]
[![GSAP][gsap-badge]][gsap-url]
[![Lenis][lenis-badge]][lenis-url]

### Content & Email
[![MDX][mdx-badge]][mdx-url]
[![Resend][resend-badge]][resend-url]

### Infrastructure
[![Cloudflare][cloudflare-badge]][cloudflare-url]

</div>

<details>
<summary><strong>Dependencies</strong></summary>

- **Astro 5** - Static site generator with server-side API routes
- **Tailwind CSS 4** - Utility-first CSS framework (via `@tailwindcss/vite`)
- **MDX** - Markdown with JSX support for artist content
- **GSAP** - Animation library with ScrollTrigger plugin
- **Lenis** - Smooth scrolling library
- **Resend** - Email API for booking notifications

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Project Status

<div style="background: #d1ecf1; padding: 15px; border-left: 4px solid #0c5460; border-radius: 4px; margin: 20px 0;">
<strong>Current Branch:</strong> <code>astro-migration-from-scratch</code><br><br>
This is a from-scratch rebuild using Astro. The previous Next.js implementation (with Payload CMS, NextAuth, D1 database, etc.) is archived on the <code>nextjs-archive</code> branch.
</div>

### What's Implemented

- ✅ Artist content collection with MDX files
- ✅ Dynamic artist pages (`/artists/[slug]`) with portfolio and flash galleries
- ✅ Booking form (`/booking`) with file uploads (max 5 images, 10MB each)
- ✅ Server API route (`POST /api/booking`) with Resend email integration
- ✅ Policy pages (`/terms`, `/privacy`, `/aftercare`)
- ✅ Editorial homepage with GSAP scroll animations
- ✅ Modular component architecture (EditorialFooter, SectionSidebar, FloatingCTA, etc.)
- ✅ Custom dropdown component (CustomSelect) with keyboard navigation
- ✅ Responsive design with mobile-first approach

### Planned (Not Yet Implemented)

- ⏳ Admin dashboard for booking management
- ⏳ Calendar integration (Nextcloud CalDAV)
- ⏳ SMS notifications
- ⏳ Client booking management portal
- ⏳ Mobile navigation menu

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

### Prerequisites

- **Node.js 18+** and **pnpm** installed
- **Resend API key** (for booking email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://git.biohazardvfx.com/nicholai/united-tattoo.git
   cd united-tattoo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxx
   BOOKING_FROM_EMAIL=bookings@unitedtattoo.com
   RESEND_AUDIENCE_ID=your-audience-id-here
   ```

   **Note:** `BOOKING_FROM_EMAIL` must be a verified sender domain in Resend. In development, the booking API will log emails to the console if `RESEND_API_KEY` is not set. `RESEND_AUDIENCE_ID` is optional - if set, users who opt-in to the mailing list will be added to this Resend audience.

   **Email Flow:**
   - Admin emails: `Christyl116@yahoo.com`, `ashtonjl.work@gmail.com` (hardcoded in API)
   - Artist CC: Artists with `bookingEmailCc` field in their MDX file will receive booking notifications
   - Client confirmation: Submitter receives automated confirmation with booking summary and next steps

4. **Run locally**
   ```bash
   pnpm dev
   ```
   
   The site will be available at `http://localhost:4321`

5. **Build for production**
   ```bash
   pnpm build
   ```
   
   Output will be in the `dist/` directory.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables

<details open>
<summary><strong>Required Variables</strong></summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key for sending booking emails | `re_xxxxxxxxxx` |
| `BOOKING_FROM_EMAIL` | Sender email (must be verified in Resend) | `bookings@unitedtattoo.com` |
| `RESEND_AUDIENCE_ID` | Resend audience ID for mailing list opt-ins (optional) | `053e25bb-7525-4d01...` |

**Notes:**
- If `RESEND_API_KEY` is not set, the booking API will log emails to the console instead of sending them (useful for local development).
- `RESEND_AUDIENCE_ID` is optional. If set, users who check the mailing list opt-in checkbox will be added to this Resend audience.

**Email Recipients:**
- **Shop Admins:** `Christyl116@yahoo.com`, `ashtonjl.work@gmail.com` (configured in `/src/pages/api/booking.ts`)
- **Artist Notifications:** Add `bookingEmailCc` field to artist MDX files (e.g., `/src/content/artists/christy-lumberg.mdx`)
- **Client Confirmation:** Automatically sent to the email address provided in the booking form

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Development

### Common Commands

<table>
<thead>
<tr>
<th>Command</th>
<th>Description</th>
</tr>
</thead>
<tbody>

<tr><td colspan="2"><strong>Development</strong></td></tr>
<tr>
  <td><code>pnpm dev</code></td>
  <td>Start Astro dev server at <code>localhost:4321</code></td>
</tr>
<tr>
  <td><code>pnpm build</code></td>
  <td>Build for production to <code>./dist/</code></td>
</tr>
<tr>
  <td><code>pnpm preview</code></td>
  <td>Preview production build locally</td>
</tr>

<tr><td colspan="2"><strong>Utilities</strong></td></tr>
<tr>
  <td><code>pnpm astro</code></td>
  <td>Run Astro CLI commands</td>
</tr>
<tr>
  <td><code>pnpm commit</code></td>
  <td>AI-powered commit message generator (requires OpenRouter API key)</td>
</tr>
<tr>
  <td><code>pnpm convert:avif</code></td>
  <td>Convert images to AVIF format (requires ffmpeg)</td>
</tr>
<tr>
  <td><code>pnpm convert:avif:all</code></td>
  <td>Convert all supported image formats</td>
</tr>
<tr>
  <td><code>pnpm convert:avif:jpeg</code></td>
  <td>Convert JPEG files only</td>
</tr>
<tr>
  <td><code>pnpm convert:avif:png</code></td>
  <td>Convert PNG files only</td>
</tr>

</tbody>
</table>

### Project Structure

```
united-tattoo/
├── src/
│   ├── pages/              # File-based routing
│   │   ├── index.astro     # Homepage
│   │   ├── booking.astro   # Booking form
│   │   ├── artists/        # Artist pages
│   │   │   ├── index.astro # Artist listing
│   │   │   └── [slug].astro # Individual artist pages
│   │   ├── api/
│   │   │   └── booking.ts  # Booking API endpoint
│   │   ├── terms.mdx       # Terms of Service
│   │   ├── privacy.mdx      # Privacy Policy
│   │   └── aftercare.mdx   # Aftercare instructions
│   ├── components/         # Reusable Astro components
│   │   ├── EditorialFooter.astro
│   │   ├── SectionSidebar.astro
│   │   ├── FloatingCTA.astro
│   │   ├── CustomSelect.astro
│   │   └── ...
│   ├── content/
│   │   └── artists/        # MDX artist content files
│   ├── layouts/
│   │   └── SiteLayout.astro # Main layout with GSAP/Lenis
│   ├── styles/
│   │   └── global.css      # Global styles and animations
│   ├── utils/              # Utility scripts
│   │   ├── git-commit.js   # AI commit message generator
│   │   └── convert-to-avif.js # Image conversion
│   └── consts.ts           # Site-wide constants
├── public/
│   ├── artists/            # Artist images and galleries
│   └── images/             # Static images
├── dev/                    # Development notes
│   ├── Continuity.md       # Implementation history
│   └── design-refs/        # Design references
├── astro.config.mjs        # Astro configuration
├── wrangler.jsonc          # Cloudflare Workers config
└── package.json            # Dependencies and scripts
```

### Key Files

- **`src/content.config.ts`** - Content collection schema for artists
- **`src/pages/api/booking.ts`** - Server-side booking API with file upload validation
- **`src/layouts/SiteLayout.astro`** - Main layout with GSAP + Lenis initialization
- **`dev/Continuity.md`** - Detailed implementation history and design decisions

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Deployment

**Status:** Deployment configuration is in progress.

The project currently includes:
- `@astrojs/cloudflare` adapter in `astro.config.mjs`
- `wrangler.jsonc` configuration file for Cloudflare Workers

Deployment instructions will be added once the target platform and workflow are finalized.

**Note:** The previous Next.js implementation used Cloudflare Pages with OpenNext. The Astro rebuild may target Cloudflare Workers or Pages, depending on final requirements.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Documentation

### Development Notes

- **[`dev/Continuity.md`](dev/Continuity.md)** - Complete implementation history, including:
  - Artist pages and booking system implementation
  - Editorial homepage redesign with GSAP animations
  - Component refactoring and modular architecture
  - Design system notes and CSS conventions

- **[`CLAUDE.md`](CLAUDE.md)** - AI assistant guide with:
  - Project overview and current stack
  - Common commands reference
  - Project structure and architecture notes
  - Development best practices

### Legacy Documentation

The previous Next.js implementation (archived on `nextjs-archive` branch) included extensive documentation in the `docs/` directory covering:
- Nextcloud OAuth setup
- CalDAV calendar integration
- CI/CD pipelines
- Database migrations

These docs are not applicable to the current Astro rebuild but are preserved for reference.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Roadmap

### Completed Features

- [x] Astro 5 migration from Next.js
- [x] MDX content collections for artists
- [x] Dynamic artist pages with portfolio and flash galleries
- [x] Booking form with file uploads
- [x] Server API route with Resend email integration
- [x] Policy pages (Terms, Privacy, Aftercare)
- [x] Editorial homepage with GSAP scroll animations
- [x] Modular component architecture
- [x] Custom dropdown component
- [x] Responsive design

### In Progress

- [ ] Mobile navigation menu implementation
- [ ] Deployment configuration
- [ ] SEO meta tags and sitemap

### Planned Features

- [ ] Admin dashboard for booking management
- [ ] Calendar integration (Nextcloud CalDAV)
- [ ] SMS notifications for booking reminders
- [ ] Client booking management portal
- [ ] Image optimization pipeline
- [ ] Social media link updates

See the [open issues](https://git.biohazardvfx.com/nicholai/united-tattoo/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contributing

### Development Workflow

1. **Fork the project**
   ```bash
   git clone https://git.biohazardvfx.com/nicholai/united-tattoo.git
   cd united-tattoo
   ```

2. **Create your feature branch**
   ```bash
   git checkout -b feat/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Update documentation as needed
   - Test locally with `pnpm dev`

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Formatting, missing semicolons, etc.
   - `refactor:` Code refactoring
   - `chore:` Maintenance tasks

5. **Push to your branch**
   ```bash
   git push origin feat/amazing-feature
   ```

6. **Open a Pull Request**
   - Via Gitea UI
   - Provide clear description of changes
   - Reference any related issues

### Code Style Guidelines

- **TypeScript**: Prefer strict typing, avoid `any`
- **Astro**: Use Astro components for static content, client-side scripts for interactivity
- **File organization**: Keep components modular and reusable
- **Comments**: Explain "why", not "what"

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

**Live Website**
[https://united-tattoos.com](https://united-tattoos.com)

</div>

---

<div align="center">

### Star this repository if you find it helpful!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

**Made with love for United Tattoo Studio, Fountain, CO**

</div>

<!-- MARKDOWN REFERENCE LINKS & BADGES -->
[contributors-shield]: https://img.shields.io/badge/Contributors-1-667eea?style=for-the-badge
[contributors-url]: https://git.biohazardvfx.com/nicholai/united-tattoo/graphs/contributors
[forks-shield]: https://img.shields.io/badge/Forks-0-667eea?style=for-the-badge
[forks-url]: https://git.biohazardvfx.com/nicholai/united-tattoo/network/members
[stars-shield]: https://img.shields.io/badge/Stars-0-667eea?style=for-the-badge
[stars-url]: https://git.biohazardvfx.com/nicholai/united-tattoo/stargazers
[issues-shield]: https://img.shields.io/badge/Issues-0-667eea?style=for-the-badge
[issues-url]: https://git.biohazardvfx.com/nicholai/united-tattoo/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077B5
[linkedin-url]: https://linkedin.com/in/nicholai-vogel

[astro-badge]: https://img.shields.io/badge/Astro_5-FF5D01?style=for-the-badge&logo=astro&logoColor=white
[astro-url]: https://astro.build/
[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com
[gsap-badge]: https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white
[gsap-url]: https://greensock.com/gsap/
[lenis-badge]: https://img.shields.io/badge/Lenis-000000?style=for-the-badge
[lenis-url]: https://lenis.studiofreight.com/
[mdx-badge]: https://img.shields.io/badge/MDX-1B1F24?style=for-the-badge&logo=mdx&logoColor=white
[mdx-url]: https://mdxjs.com/
[resend-badge]: https://img.shields.io/badge/Resend-3A3A3A?style=for-the-badge
[resend-url]: https://resend.com/
[cloudflare-badge]: https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white
[cloudflare-url]: https://developers.cloudflare.com/

[prettier-url]: https://prettier.io/
