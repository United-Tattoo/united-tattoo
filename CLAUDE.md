# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Change Documentation

**MANDATORY**: Whenever making any change to the repository (implementations, bug fixes, refactoring, etc.), you MUST update `dev/continuity.md` with:
- Details of the changes made
- Next steps or follow-up actions required
- Any context or decisions that should be preserved for future work

This ensures continuity of work and helps maintain context across development sessions.

## OVERVIEW

**United Tattoo** - Tattoo studio website built with Astro 5, Tailwind CSS 4, TypeScript. Features artist portfolios, booking system (Resend email), GSAP/Lenis scroll animations. Deployed to Cloudflare Pages.

## STRUCTURE

```
united-tattoo/
├── src/
│   ├── components/     # 13 reusable Astro components
│   ├── layouts/        # SiteLayout.astro (GSAP/Lenis init)
│   ├── pages/          # File-based routing + API
│   │   └── api/        # Server-side booking endpoint
│   ├── styles/         # global.css (Tailwind 4 @theme)
│   ├── content/        # MDX artist collections
│   │   └── artists/    # 8 artist MDX files
│   ├── utils/          # Utility scripts
│   └── consts.ts       # Site constants
├── dev/                # Design refs, continuity docs
└── public/             # Static assets (images)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Booking API | `src/pages/api/booking.ts` | Resend email, file uploads |
| Artist content | `src/content/artists/*.mdx` | MDX with frontmatter |
| Site layout | `src/layouts/SiteLayout.astro` | GSAP + Lenis init |
| Styling | `src/styles/global.css` | Tailwind 4 @theme block |
| Booking form | `src/pages/booking.astro` | Multi-step with file upload |
| Artist pages | `src/pages/artists/[slug].astro` | Dynamic routing |

## CONVENTIONS

### TypeScript
- Extend `astro/tsconfigs/strict`
- Props interface: `interface Props { title?: string; }`
- Destructure with defaults: `const { title = "" } = Astro.props`

### Astro Components
- Frontmatter `---` at top
- Import styles first: `import '../styles/global.css';`
- Component imports before Astro imports
- Client scripts in `<script>` tags at bottom
- Use `astro:page-load` for View Transitions

### Tailwind CSS 4
- `@import "tailwindcss";` in global.css (NOT `@tailwind base;`)
- Custom colors in `@theme` block with `--color-*` prefix
- Semantic naming: `--color-bg-deep`, `--color-accent`
- Warm palette: `--color-burnt-orange`, `--color-terracotta`, `--color-moss`

### Imports Order
```typescript
import '../styles/global.css';
import { CONSTANT } from '../consts';
import Component from '../components/Component.astro';
import { Another } from '../components/Another.astro';
```

### File Naming
- **Files:** kebab-case (`header-nav.astro`, `booking-api.ts`)
- **Classes:** PascalCase (`HeaderNav`, `SiteLayout`)
- **Constants:** SCREAMING_SNAKE_CASE (`SITE_TITLE`)
- **Variables:** camelCase (`isBookingPage`, `toggleMenu`)
- **Props:** camelCase (`currentPath`, `hasAnnouncement`)

### CSS Classes
- `.section-label` - mono-spaced metadata
- `.prose-editorial` - MDX content styling
- `.glass-card` - glass-morphism effects

## ANTI-PATTERNS (THIS PROJECT)

- **Type safety:** NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- **Error handling:** NEVER empty catch blocks `catch(e) {}`
- **Frontend visual changes:** ALWAYS delegate to frontend-ui-ux-engineer
- **Testing:** NEVER delete failing tests to "pass"
- **Git:** NEVER commit unless user explicitly asks
- **Git:** NEVER run destructive commands (push --force, hard reset) without explicit request
- **Git:** NEVER skip hooks (--no-verify) without explicit request
- **Git:** NEVER commit secret files (.env, credentials.json)

## Z-INDEX HIERARCHY

| z-index | Layer |
|---------|-------|
| z-[-1] | Background textures (noise overlay) |
| z-10 | Hero content |
| z-20 | Footer, locked columns |
| z-[60] | Header navigation |
| z-[70] | Dropdowns, announcement bar |
| z-[100] | Mobile menu overlay |
| z-[110] | Mobile menu items when open |

## COMMANDS

```bash
# Development
pnpm dev              # Astro dev server at localhost:4321
pnpm build            # Build to ./dist/
pnpm preview          # Preview production locally
pnpm deploy           # Build + Cloudflare Pages deploy

# Utilities
pnpm astro            # Run Astro CLI
pnpm commit           # AI commit msg (needs OpenRouter API key)
pnpm convert:avif     # Convert images to AVIF
pnpm convert:avif:all # Convert all images
```

## ENVIRONMENT

```env
RESEND_API_KEY=re_...      # Booking email notifications
BOOKING_FROM_EMAIL=...     # Verified sender domain
```

## NOTES

- **No test infrastructure** - Manual testing only
- **No CI/CD pipelines** - Manual or Cloudflare git integration
- **Mobile nav** - Button exists but non-functional (per dev/continuity.md)
- **Legal pages** - Need attorney review
- **After changes:** Update `dev/continuity.md` with details

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
