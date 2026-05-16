-- Migration: 0003_add_subtitle_to_entities.sql
ALTER TABLE p_entities ADD COLUMN subtitle TEXT;
