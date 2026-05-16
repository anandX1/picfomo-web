-- Migration: 0001_programmatic_seo.sql
-- Description: Creates the relational schema for the 1000-node programmatic SEO expansion.

-- 1. The Universal Entity Table (Handles Use-Cases, Platforms, Aesthetics, Problems)
CREATE TABLE IF NOT EXISTS p_entities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'use-case', 'platform', 'aesthetic', 'identity', 'problem'
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    meta_description TEXT,
    h1_formula TEXT,
    emotional_hook TEXT,
    schema_faqs TEXT, -- JSON Array
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_p_entities_type_slug ON p_entities(type, slug);

-- 2. The Competitor Transactional Matrix
CREATE TABLE IF NOT EXISTS p_comparisons (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    competitor_name TEXT NOT NULL,
    picfomo_speed TEXT,
    competitor_speed TEXT,
    picfomo_cost TEXT,
    competitor_cost TEXT,
    picfomo_input TEXT,
    competitor_input TEXT,
    picfomo_accuracy TEXT,
    competitor_accuracy TEXT,
    llm_markdown_bait TEXT
);

-- 3. Semantic Relationship Edge Table (Graph Links for lateral crawling)
CREATE TABLE IF NOT EXISTS p_entity_edges (
    source_id TEXT,
    target_id TEXT,
    edge_type TEXT DEFAULT 'related',
    weight INTEGER DEFAULT 1, -- Determines ranking in "Related" widgets
    PRIMARY KEY (source_id, target_id)
);
CREATE INDEX IF NOT EXISTS idx_p_edges_source ON p_entity_edges(source_id);

-- 4. Mapping Programmatic Entities to Visual Styles (for CommunityGrid injection)
CREATE TABLE IF NOT EXISTS p_entity_styles (
    entity_id TEXT,
    style_id TEXT,
    PRIMARY KEY (entity_id, style_id)
);
