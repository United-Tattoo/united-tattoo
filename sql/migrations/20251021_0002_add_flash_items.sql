-- Add flash_items table for predrawn/flash pieces
CREATE TABLE IF NOT EXISTS flash_items (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  price INTEGER,
  size_hint TEXT,
  tags TEXT,
  order_index INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

CREATE INDEX IF NOT EXISTS idx_flash_artist ON flash_items(artist_id, is_available, order_index);


