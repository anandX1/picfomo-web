-- Add support for up to 5 images (stored as a JSON string array)
ALTER TABLE styles ADD COLUMN preview_urls TEXT;

-- Add support for FOMO Timers
ALTER TABLE styles ADD COLUMN expires_at DATETIME;