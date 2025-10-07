-- Add slug column to artists table for SEO-friendly URLs (migrated after initial schema)
-- Supersedes 0001_add_artist_slug.sql to ensure correct ordering

-- Add slug column
ALTER TABLE artists ADD COLUMN slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);

-- Note: Existing artists will need slugs populated via migration script
