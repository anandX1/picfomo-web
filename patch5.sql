-- Create the indexing_queue table for high-velocity SEO
CREATE TABLE IF NOT EXISTS indexing_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
