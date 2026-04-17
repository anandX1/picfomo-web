-- 1. Create the missing table for the Explore Feed
CREATE TABLE IF NOT EXISTS post_views (
    id TEXT PRIMARY KEY,
    post_id TEXT,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add the missing column for the Sparks Dashboard
ALTER TABLE users ADD COLUMN unclaimed_sparks INTEGER DEFAULT 0;

-- 3. Add the missing column for the Studio Notifications
ALTER TABLE notifications ADD COLUMN post_id TEXT;

-- 4. Seed the 'schnell' style so the Sandbox has a valid style_id to save
INSERT OR IGNORE INTO styles (id, slug, name, spark_cost, is_active) 
VALUES ('schnell', 'flux-schnell', 'Instant Free Generation', 0, 1);