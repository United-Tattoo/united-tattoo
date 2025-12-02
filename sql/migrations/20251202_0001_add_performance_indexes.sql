-- Performance optimization indexes
-- These indexes improve query performance for common operations

-- Composite index for sorting portfolio images by artist and order
-- Speeds up queries like: SELECT * FROM portfolio_images WHERE artist_id = ? ORDER BY order_index
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON portfolio_images(artist_id, order_index);

-- Composite index for appointment queries by artist and date
-- Speeds up availability checks and schedule views
CREATE INDEX IF NOT EXISTS idx_appointments_artist_date ON appointments(artist_id, start_time);

-- Index for user email lookups
-- Speeds up authentication and user lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Note: The following indexes already exist in the schema:
-- idx_artists_slug (from 20250918_0002_add_artist_slug.sql)
-- idx_portfolio_images_artist_id (from schema.sql)
-- idx_appointments_status (from schema.sql)

