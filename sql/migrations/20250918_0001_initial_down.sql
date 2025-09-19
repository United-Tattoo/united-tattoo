-- United Tattoo Studio Database Baseline Migration (DOWN)
-- Reverts the schema created by 20250918_0001_initial.sql
-- Execute with wrangler:
--   Preview: wrangler d1 execute united-tattoo --file=sql/migrations/20250918_0001_initial_down.sql
--   Prod:    wrangler d1 execute united-tattoo --remote --file=sql/migrations/20250918_0001_initial_down.sql

-- Drop indexes first (safe reverse cleanup)
DROP INDEX IF EXISTS idx_file_uploads_uploaded_by;
DROP INDEX IF EXISTS idx_availability_artist_id;
DROP INDEX IF EXISTS idx_appointments_status;
DROP INDEX IF EXISTS idx_appointments_start_time;
DROP INDEX IF EXISTS idx_appointments_client_id;
DROP INDEX IF EXISTS idx_appointments_artist_id;
DROP INDEX IF EXISTS idx_portfolio_images_is_public;
DROP INDEX IF EXISTS idx_portfolio_images_artist_id;
DROP INDEX IF EXISTS idx_artists_is_active;
DROP INDEX IF EXISTS idx_artists_user_id;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS file_uploads;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS portfolio_images;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS users;

