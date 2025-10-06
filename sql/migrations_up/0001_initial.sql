-- United Tattoo Studio Database Baseline Migration (UP)
-- Execute with wrangler:
--   Preview: wrangler d1 execute united-tattoo --file=sql/migrations_up/0001_initial.sql
--   Prod:    wrangler d1 execute united-tattoo --remote --file=sql/migrations_up/0001_initial.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SHOP_ADMIN', 'ARTIST', 'CLIENT')),
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    specialties TEXT NOT NULL, -- JSON array as text
    instagram_handle TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    hourly_rate REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Portfolio images table
CREATE TABLE IF NOT EXISTS portfolio_images (
    id TEXT PRIMARY KEY,
    artist_id TEXT NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    tags TEXT, -- JSON array as text
    order_index INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    artist_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    deposit_amount REAL,
    total_amount REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Artist availability table
CREATE TABLE IF NOT EXISTS availability (
    id TEXT PRIMARY KEY,
    artist_id TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TEXT NOT NULL, -- HH:mm format
    end_time TEXT NOT NULL, -- HH:mm format
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY,
    studio_name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    social_media TEXT, -- JSON object as text
    business_hours TEXT, -- JSON array as text
    hero_image TEXT,
    logo_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_user_id ON artists(user_id);
CREATE INDEX IF NOT EXISTS idx_artists_is_active ON artists(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_artist_id ON portfolio_images(artist_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_is_public ON portfolio_images(is_public);
CREATE INDEX IF NOT EXISTS idx_appointments_artist_id ON appointments(artist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_availability_artist_id ON availability(artist_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);

-- Insert default site settings
INSERT OR IGNORE INTO site_settings (
    id,
    studio_name,
    description,
    address,
    phone,
    email,
    social_media,
    business_hours,
    hero_image,
    logo_url
) VALUES (
    'default',
    'United Tattoo Studio',
    'Premier tattoo studio specializing in custom artwork and professional tattooing services.',
    '123 Main Street, Denver, CO 80202',
    '+1 (555) 123-4567',
    'info@unitedtattoo.com',
    '{"instagram":"https://instagram.com/unitedtattoo","facebook":"https://facebook.com/unitedtattoo","twitter":"https://twitter.com/unitedtattoo","tiktok":"https://tiktok.com/@unitedtattoo"}',
    '[{"dayOfWeek":1,"openTime":"10:00","closeTime":"20:00","isClosed":false},{"dayOfWeek":2,"openTime":"10:00","closeTime":"20:00","isClosed":false},{"dayOfWeek":3,"openTime":"10:00","closeTime":"20:00","isClosed":false},{"dayOfWeek":4,"openTime":"10:00","closeTime":"20:00","isClosed":false},{"dayOfWeek":5,"openTime":"10:00","closeTime":"22:00","isClosed":false},{"dayOfWeek":6,"openTime":"10:00","closeTime":"22:00","isClosed":false},{"dayOfWeek":0,"openTime":"12:00","closeTime":"18:00","isClosed":false}]',
    '/united-studio-main.jpg',
    '/united-logo-website.jpg'
);
