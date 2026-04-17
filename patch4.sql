-- Add SEO metadata columns to the posts table
ALTER TABLE posts ADD COLUMN title TEXT;
ALTER TABLE posts ADD COLUMN description TEXT;
ALTER TABLE posts ADD COLUMN tags TEXT;