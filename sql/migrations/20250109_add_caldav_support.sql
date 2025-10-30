-- Migration: Add CalDAV support for Nextcloud calendar integration
-- Created: 2025-01-09

-- Create artist_calendars table to store calendar configuration for each artist
CREATE TABLE IF NOT EXISTS artist_calendars (
    id TEXT PRIMARY KEY,
    artist_id TEXT NOT NULL UNIQUE,
    calendar_url TEXT NOT NULL,
    calendar_id TEXT NOT NULL,
    sync_token TEXT,
    last_sync_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Add CalDAV fields to appointments table
ALTER TABLE appointments ADD COLUMN caldav_uid TEXT;
ALTER TABLE appointments ADD COLUMN caldav_etag TEXT;

-- Create index for efficient CalDAV UID lookups
CREATE INDEX IF NOT EXISTS idx_appointments_caldav_uid ON appointments(caldav_uid);

-- Create calendar_sync_logs table for monitoring sync operations
CREATE TABLE IF NOT EXISTS calendar_sync_logs (
    id TEXT PRIMARY KEY,
    artist_id TEXT,
    sync_type TEXT NOT NULL CHECK (sync_type IN ('PUSH', 'PULL', 'FULL')),
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PARTIAL')),
    error_message TEXT,
    events_processed INTEGER DEFAULT 0,
    events_created INTEGER DEFAULT 0,
    events_updated INTEGER DEFAULT 0,
    events_deleted INTEGER DEFAULT 0,
    duration_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Create index for sync log queries
CREATE INDEX IF NOT EXISTS idx_sync_logs_artist_created ON calendar_sync_logs(artist_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON calendar_sync_logs(status, created_at DESC);

