import { z } from 'zod';

/**
 * PICFOMO SEMANTIC ENTITY SCHEMAS
 * Staff+ Implementation for strictly typed structured data.
 */

export const UseCaseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  h1: z.string().optional(),
  description: z.string(),
  styles: z.array(z.string()),
  emotional_hook: z.string().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
});

export const StyleSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  name: z.string(),
  description: z.string(),
  preview_image_url: z.string(),
  preview_urls: z.string().optional(), // JSON string from DB
  spark_cost: z.number().default(2),
  badge: z.string().optional(),
  is_active: z.number().default(1),
});

export const PostSchema = z.object({
  id: z.string(),
  image_url: z.string(),
  created_at: z.string(),
  prompt_used: z.string().nullable().optional(),
  user_id: z.string().optional(),
  creator_id: z.string().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  profile_image_url: z.string().nullable().optional(),
  style_name: z.string().nullable().optional(),
  likes_count: z.number().optional(),
  views_count: z.number().optional(),
  followers_count: z.number().optional(),
});

export const GlossaryTermSchema = z.object({
  term: z.string(),
  slug: z.string(),
  definition: z.string(),
  deepDive: z.string(),
  whyItMatters: z.string(),
  howPicfomoUsesIt: z.string(),
  relatedTerms: z.array(z.string()),
});

export const BlogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  readTime: z.string(),
  author: z.string(),
  content: z.string(),
  tldr: z.string(),
});

export type UseCaseEntity = z.infer<typeof UseCaseSchema>;
export type StyleEntity = z.infer<typeof StyleSchema>;
export type PostEntity = z.infer<typeof PostSchema>;
export type GlossaryTermEntity = z.infer<typeof GlossaryTermSchema>;
export type BlogPostEntity = z.infer<typeof BlogPostSchema>;
