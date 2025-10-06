-- Add slug column to artists table for SEO-friendly URLs
-- Run this with: wrangler d1 execute united-tattoo-db --file=./sql/migrations/0001_add_artist_slug.sql

-- Add slug column
ALTER TABLE artists ADD COLUMN slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);

-- Note: Existing artists will need slugs populated via migration script
