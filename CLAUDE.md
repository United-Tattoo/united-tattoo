# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

United Tattoo is a Next.js-based website for a tattoo studio in Fountain, CO. The application includes artist portfolios, booking systems, appointment management with CalDAV integration, and admin dashboards.

**Stack:**
- Next.js 14 (App Router) with TypeScript
- Cloudflare D1 (SQLite) for database
- Cloudflare R2 for file storage
- NextAuth.js for authentication
- Deployed via OpenNext on Cloudflare Workers
- ShadCN UI components + Tailwind CSS
- Vitest for testing

## Common Commands

### Development
```bash
npm run dev                    # Start Next.js dev server (port 3000)
npm run dev:wrangler          # Build and preview with OpenNext/Cloudflare
```

### Testing
```bash
npm run test                  # Run Vitest in watch mode
npm run test:ui              # Run Vitest with UI
npm run test:run             # Run tests once
npm run test:coverage        # Run tests with coverage report
```

### Build & Deployment
```bash
npm run pages:build          # Build with OpenNext for Cloudflare
npm run build                # Standard Next.js build (standalone)
npm run preview              # Preview OpenNext build locally
npm run deploy               # Deploy to Cloudflare Pages
```

### CI Commands
```bash
npm run ci:lint              # ESLint
npm run ci:typecheck         # TypeScript type checking (noEmit)
npm run ci:test              # Run tests with coverage
npm run ci:build             # Build for production
npm run ci:budgets           # Check bundle size budgets
```

### Database Management
```bash
# Local database
npm run db:migrate:local                    # Apply schema to local D1
npm run db:studio:local                     # Show tables in local D1

# Preview (default) environment
npm run db:migrate                          # Apply schema to preview D1
npm run db:migrate:latest:preview           # Apply all migrations from sql/migrations/
npm run db:studio                           # Show tables in preview D1
npm run db:backup                           # Backup preview database

# Production environment
npm run db:migrate:up:prod                  # Apply specific migration to production
npm run db:migrate:latest:prod              # Apply all migrations to production
npm run db:backup:local                     # Backup local database

# Direct Wrangler commands
wrangler d1 execute united-tattoo --local --command="SELECT * FROM artists"
wrangler d1 execute united-tattoo --file=./sql/schema.sql
```

### Code Quality
```bash
npm run lint                 # Run ESLint
npm run format               # Format code with Prettier
npm run format:check         # Check formatting without changing files
npm run security:audit       # Run npm audit
```

## Architecture

### Database Layer (`lib/db.ts`)

The database layer provides type-safe functions for interacting with Cloudflare D1. Key patterns:

- **Binding access**: `getDB(env)` retrieves D1 from Cloudflare bindings via OpenNext's global symbol
- **R2 access**: `getR2Bucket(env)` retrieves R2 bucket binding for file uploads
- **Namespace-style exports**: Use `db.artists.findMany()`, `db.portfolioImages.create()`, etc.
- **JSON fields**: `specialties` and `tags` are stored as JSON strings and parsed/stringified automatically

Main tables:
- `users` - Authentication and user profiles with roles (SUPER_ADMIN, SHOP_ADMIN, ARTIST, CLIENT)
- `artists` - Artist profiles linked to users, includes slug for URLs
- `portfolio_images` - Artist portfolio work with tags and ordering
- `appointments` - Booking appointments with CalDAV sync support
- `flash_items` - Flash tattoo designs available for booking
- `site_settings` - Global site configuration
- `artist_calendars` - Nextcloud CalDAV calendar configuration per artist

### Authentication (`lib/auth.ts`)

NextAuth.js setup with role-based access control and Nextcloud OAuth integration:

- **Primary Provider**: Nextcloud OAuth (recommended for all users)
  - Artists and admins sign in via their Nextcloud credentials
  - Auto-provisioning: Users in 'artists' or 'shop_admins' Nextcloud groups are automatically created
  - Group-based role assignment:
    - `admin` or `admins` group → SUPER_ADMIN
    - `shop_admins` group (configurable) → SHOP_ADMIN
    - `artists` group (configurable) → ARTIST (with auto-created artist profile)
    - Users not in authorized groups are denied access
  - Requires: `NEXTCLOUD_OAUTH_CLIENT_ID`, `NEXTCLOUD_OAUTH_CLIENT_SECRET`, `NEXTCLOUD_BASE_URL`

- **Fallback Provider**: Credentials (email/password)
  - Available only via `/auth/signin?admin=true` query parameter
  - Admin emergency access only
  - Dev mode: Any email/password combo creates a SUPER_ADMIN user for testing
  - Seed admin: `nicholai@biohazardvfx.com` is hardcoded as admin

- **Deprecated Providers**: Google/GitHub OAuth (still configured but not actively used)

- **Session strategy**: JWT (no database adapter currently)

- **Nextcloud Integration** (`lib/nextcloud-client.ts`):
  - `getNextcloudUserProfile(userId)` - Fetch user details from Nextcloud OCS API
  - `getNextcloudUserGroups(userId)` - Get user's group memberships
  - `determineUserRole(userId)` - Auto-assign role based on Nextcloud groups
  - Uses service account credentials (NEXTCLOUD_USERNAME/PASSWORD) for API access

- **Helper functions**:
  - `requireAuth(role?)` - Protect routes, throws if unauthorized
  - `getArtistSession()` - Get artist profile for logged-in artist users
  - `canEditArtist(userId, artistId)` - Check edit permissions
  - `hasRole(userRole, requiredRole)` - Check role hierarchy

### CalDAV Integration (`lib/calendar-sync.ts`, `lib/caldav-client.ts`)

Bidirectional sync between database appointments and Nextcloud calendars:

- **Push to calendar**: `syncAppointmentToCalendar()` - Called when creating/updating appointments
- **Pull from calendar**: `pullCalendarEventsToDatabase()` - Background sync to import calendar events
- **Availability checking**: `checkArtistAvailability()` - Real-time conflict detection using CalDAV
- **Per-artist calendars**: Each artist can have their own Nextcloud calendar configured in `artist_calendars` table

Environment variables required:
- `NEXTCLOUD_BASE_URL`
- `NEXTCLOUD_USERNAME`
- `NEXTCLOUD_PASSWORD`
- `NEXTCLOUD_CALENDAR_BASE_PATH` (defaults to `/remote.php/dav/calendars`)

### File Uploads (`lib/r2-upload.ts`, `lib/upload.ts`)

- **R2 storage**: Files uploaded to Cloudflare R2 bucket
- **Image processing**: HEIC to JPEG conversion, resizing, AVIF format support
- **Public URLs**: Files served from R2 public URL
- **Upload API**: `/api/upload` handles multipart form data

### Environment Configuration (`lib/env.ts`)

Validates required environment variables at boot using Zod. Critical vars:
- Database: `DATABASE_URL`, `DIRECT_URL` (Supabase URLs, though using D1)
- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Storage: AWS/R2 credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_ENDPOINT_URL`)
- Nextcloud OAuth (required for artist authentication):
  - `NEXTCLOUD_BASE_URL` - Nextcloud instance URL (e.g., https://portal.united-tattoos.com)
  - `NEXTCLOUD_OAUTH_CLIENT_ID` - OAuth app client ID from Nextcloud
  - `NEXTCLOUD_OAUTH_CLIENT_SECRET` - OAuth app client secret from Nextcloud
  - `NEXTCLOUD_ARTISTS_GROUP` - Group name for artists (default: "artists")
  - `NEXTCLOUD_ADMINS_GROUP` - Group name for admins (default: "shop_admins")
- Nextcloud CalDAV (optional, for calendar sync):
  - `NEXTCLOUD_USERNAME` - Service account username
  - `NEXTCLOUD_PASSWORD` - Service account password or app-specific password
  - `NEXTCLOUD_CALENDAR_BASE_PATH` - CalDAV path (default: "/remote.php/dav/calendars")

Note: The env validation expects Supabase URLs but actual runtime uses Cloudflare D1 via bindings.

### API Routes

All API routes follow Next.js App Router conventions (`app/api/*/route.ts`):

**Public APIs:**
- `/api/artists` - List public artists with portfolio images
- `/api/artists/[id]` - Get single artist by ID or slug
- `/api/public/migrate` - Public migration endpoint (token-protected)

**Protected APIs** (require authentication):
- `/api/artists/me` - Current artist's profile (ARTIST role)
- `/api/portfolio` - CRUD for portfolio images
- `/api/flash/[artistId]` - Manage flash tattoo items
- `/api/appointments` - Appointment management
- `/api/upload` - File upload to R2
- `/api/admin/*` - Admin-only endpoints (stats, migrations, calendars)
- `/api/caldav/sync` - Trigger CalDAV sync
- `/api/caldav/availability` - Check artist availability

### Frontend Structure

**Pages:**
- `/` - Homepage (hero, artists, services, contact)
- `/artists` - Artist listing
- `/artists/[id]` - Individual artist portfolio (supports slug or ID)
- `/artists/[id]/book` - Book with specific artist
- `/book` - General booking page
- `/admin/*` - Admin dashboard (analytics, portfolio, calendar, artist management, uploads)
- `/artist-dashboard/*` - Artist-specific dashboard (profile, portfolio editing)
- `/auth/signin` - Login page

**Data Sources:**
- `data/artists.ts` - Static artist data (may be legacy, check if still used vs database)

### Routing Notes

- **Middleware** (`middleware.ts`): Handles permanent redirects (e.g., `/artists/amari-rodriguez` → `/artists/amari-kyss`)
- **Dynamic routes**: Artist pages work with both database IDs and slugs
- **Authentication**: Admin and artist dashboard routes require appropriate roles

### Testing

- **Framework**: Vitest with React Testing Library
- **Config**: `vitest.config.ts` (check for any custom setup)
- Tests located alongside components or in `__tests__/` directories

### Bundle Size Budgets

Defined in `package.json` under `budgets` key:
- `TOTAL_STATIC_MAX_BYTES`: 3,000,000 (3MB)
- `MAX_ASSET_BYTES`: 1,500,000 (1.5MB)

Checked by `scripts/budgets.mjs` during CI.

## Development Workflow

### Working with Migrations

1. Create new migration file in `sql/migrations/` with format `YYYYMMDD_NNNN_description.sql`
2. For local testing: `npm run db:migrate:local`
3. For preview: `npm run db:migrate:latest:preview`
4. For production: `npm run db:migrate:latest:prod`

Migrations are also tracked in `sql/migrations_up/` for Wrangler's built-in migration system.

### Working with Artists

Artists have both a user account and an artist profile:
1. User created in `users` table with role `ARTIST`
2. Artist profile in `artists` table linked via `user_id`
3. Slug auto-generated from name, handles duplicates with numeric suffix
4. Portfolio images in `portfolio_images` table
5. Flash items in `flash_items` table (optional, new feature)

### Adding New Features

When adding database tables:
1. Add to `sql/schema.sql`
2. Create migration file in `sql/migrations/`
3. Update TypeScript types in `types/database.ts`
4. Add CRUD functions to `lib/db.ts`
5. Create API routes if needed
6. Update this CLAUDE.md if it's a major architectural change

### CI/CD Pipeline

Located in `.gitea/workflows/`:
- `ci.yaml` - Main CI pipeline (lint, typecheck, test, build, budgets)
- `security.yaml` - Security audits
- `performance.yaml` - Performance checks
- `deploy.yaml` - Deployment to Cloudflare

The CI enforces:
- ESLint passing
- TypeScript compilation (with `ignoreBuildErrors: true` for builds but strict for typecheck)
- Test coverage
- Bundle size budgets
- Migration dry-run (best-effort with local D1)

### Known Configuration Quirks

- **TypeScript errors ignored during build** (`next.config.mjs`): `typescript.ignoreBuildErrors: true` allows builds to succeed even with type errors. CI separately runs `tsc --noEmit` to catch them.
- **Images unoptimized**: Next.js Image optimization disabled for Cloudflare Workers compatibility
- **Standalone output**: Docker builds use `output: "standalone"` mode
- **Node.js compatibility**: Cloudflare Workers use `nodejs_compat` flag in `wrangler.toml`

### Deployment

Production URL: `https://united-tattoos.com`

Deploy command: `npm run pages:build && wrangler deploy`

The deployment process:
1. Build with OpenNext: `npm run pages:build` → outputs to `.vercel/output/static`
2. Deploy to Cloudflare: `wrangler pages deploy .vercel/output/static`

### Docker Support

Dockerfile included for self-hosting:
```bash
docker build -t united-tattoo:latest .
docker run --rm -p 3000:3000 -e PORT=3000 united-tattoo:latest
```

Uses Next.js standalone mode for minimal image size.

## Important Notes

- Always test database changes locally first with `--local` flag
- The migration token (`MIGRATE_TOKEN`) protects public migration endpoints
- CalDAV integration is optional; appointments work without it
- Role hierarchy: CLIENT < ARTIST < SHOP_ADMIN < SUPER_ADMIN
- Flash items feature may not exist in older database schemas (lib/db.ts tolerates missing table)
