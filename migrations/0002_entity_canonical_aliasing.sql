-- Patch: 0002_entity_canonical_aliasing.sql
-- Goal: Prevent keyword cannibalization by allowing entities to point to a single canonical node.

ALTER TABLE p_entities ADD COLUMN canonical_id TEXT REFERENCES p_entities(id) DEFAULT NULL;
ALTER TABLE p_entities ADD COLUMN canonical_slug TEXT DEFAULT NULL;

-- Index for fast canonical lookups
CREATE INDEX IF NOT EXISTS idx_p_entities_canonical ON p_entities(canonical_id);
CREATE INDEX IF NOT EXISTS idx_p_entities_canonical_slug ON p_entities(canonical_slug);

-- 5. Persistent Indexing Queue
CREATE TABLE IF NOT EXISTS indexing_queue (
    url TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
