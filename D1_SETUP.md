# Cloudflare D1 Database Setup Guide

This guide will help you set up Cloudflare D1 database for the United Tattoo Studio management platform.

## Prerequisites

1. **Cloudflare Account** with Workers/Pages access
2. **Wrangler CLI** installed globally: `npm install -g wrangler`
3. **Authenticated with Cloudflare**: `wrangler auth login`

## Step 1: Create D1 Database

```bash
# Create the D1 database
npm run db:create

# This will output something like:
# ✅ Successfully created DB 'united-tattoo-db' in region ENAM
# Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via point-in-time restore.
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "united-tattoo-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Step 2: Update wrangler.toml

Copy the `database_id` from the output above and update your `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "united-tattoo-db"
database_id = "your-actual-database-id-here"  # Replace with the ID from step 1
```

## Step 3: Run Database Migrations

### Baseline (schema.sql)
The legacy baseline remains available for convenience during development:
```bash
# Create tables in local D1 database using schema.sql (legacy baseline)
npm run db:migrate:local
```

### For Production (schema.sql):
```bash
# Create tables in production D1 database using schema.sql (legacy baseline)
npm run db:migrate
```

### New: Versioned SQL Migrations (UP/DOWN)
Migrations live in `sql/migrations/` using the pattern `YYYYMMDD_NNNN_description.sql` and a matching `*_down.sql`.

Initial baseline (derived from `sql/schema.sql`):
- `sql/migrations/20250918_0001_initial.sql` (UP)
- `sql/migrations/20250918_0001_initial_down.sql` (DOWN)

Run on Preview (default binding):
```bash
# Apply the initial UP migration
npm run db:migrate:up:preview

# Rollback the initial migration
npm run db:migrate:down:preview
```

Run on Production (remote):
```bash
# Apply the initial UP migration to prod
npm run db:migrate:up:prod

# Rollback the initial migration on prod
npm run db:migrate:down:prod
```

Apply all UP migrations in order:
```bash
# Preview
npm run db:migrate:latest:preview

# Production (remote)
npm run db:migrate:latest:prod
```

Notes:
- Latest simply runs all `*.sql` files excluding `*_down.sql` in lexicographic order.
- A migrations_log table will be added in a later story for precise tracking.

## Step 4: Verify Database Setup

### Check Local Database:
```bash
# List tables in local database
npm run db:studio:local
```

### Check Production Database:
```bash
# List tables in production database
npm run db:studio
```

## Step 5: Development Workflow

### Local Development:
```bash
# Start Next.js development server
npm run dev

# The app will use local SQLite file for development
# Database file: ./local.db
```

### Preview with Cloudflare:
```bash
# Build for Cloudflare Pages
npm run pages:build

# Preview locally with Cloudflare runtime
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

## Database Schema

The database includes the following tables:
- `users` - User accounts and roles
- `artists` - Artist profiles and information
- `portfolio_images` - Artist portfolio images
- `appointments` - Booking and appointment data
- `availability` - Artist availability schedules
- `site_settings` - Studio configuration
- `file_uploads` - File upload metadata

## Environment Variables

### Local Development (.env.local):
```env
DATABASE_URL="file:./local.db"
DIRECT_URL="file:./local.db"
```

### Production (Cloudflare Pages):
Environment variables are managed through:
1. `wrangler.toml` for public variables
2. Cloudflare Dashboard for secrets
3. D1 database binding automatically available as `env.DB`

## Useful Commands

```bash
# Database Management
npm run db:create            # Create new D1 database
npm run db:migrate           # Run migrations on production DB
npm run db:migrate:local     # Run migrations on local DB
npm run db:backup            # Export remote DB to backups/d1-backup-YYYYMMDD-HHMM.sql (uses --output)
npm run db:backup:local      # Export local DB to backups/d1-backup-YYYYMMDD-HHMM.sql (uses --local --output)
npm run db:migrate:up:preview    # Apply UP migration on preview
npm run db:migrate:down:preview  # Apply DOWN migration on preview
npm run db:migrate:up:prod       # Apply UP migration on production (remote)
npm run db:migrate:down:prod     # Apply DOWN migration on production (remote)
npm run db:migrate:latest:preview # Apply all UP migrations (preview)
npm run db:migrate:latest:prod    # Apply all UP migrations (prod)
npm run db:studio          # Query production database
npm run db:studio:local    # Query local database

# Cloudflare Pages
npm run pages:build        # Build for Cloudflare Pages
npm run preview           # Preview with Cloudflare runtime
npm run deploy            # Deploy to Cloudflare Pages

# Development
npm run dev               # Start Next.js dev server
npm run build             # Standard Next.js build
```

## Troubleshooting

### Common Issues:

1. **"Database not found"**
   - Make sure you've created the D1 database: `npm run db:create`
   - Verify the `database_id` in `wrangler.toml` matches the created database

2. **"Tables don't exist"**
   - Run migrations: `npm run db:migrate:local` (for local) or `npm run db:migrate` (for production)

3. **"Wrangler not authenticated"**
   - Run: `wrangler auth login`

4. **"Permission denied"**
   - Ensure your Cloudflare account has Workers/Pages access
   - Check that you're authenticated with the correct account

### Database Access in Code:

In your API routes, access the D1 database through the environment binding:

```typescript
// In API routes (production)
const db = env.DB; // Cloudflare D1 binding

// For local development, you'll use SQLite
// The lib/db.ts file handles this automatically
```

## Next Steps

After setting up D1:
1. Update the database functions in `lib/db.ts` to use actual D1 queries
2. Test the admin dashboard with real database operations
3. Deploy to Cloudflare Pages for production testing
