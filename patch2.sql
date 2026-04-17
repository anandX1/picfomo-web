-- 1. Fix Profile Page Crash
ALTER TABLE users ADD COLUMN website TEXT;

-- 2. Fix Notifications System Crash
-- We add the new columns your code expects
ALTER TABLE notifications ADD COLUMN recipient_id TEXT;
ALTER TABLE notifications ADD COLUMN actor_id TEXT;

-- 3. Create the missing 15th Table
CREATE TABLE IF NOT EXISTS early_access_leads (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    expected_price TEXT,
    contact_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Prevent Replicate Webhook Crashes
ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'processing';
ALTER TABLE posts ADD COLUMN replicate_id TEXT;