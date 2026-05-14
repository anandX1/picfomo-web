import { MetadataRoute } from 'next';
import { USE_CASES } from '@/data/use-cases';
import { COMPARISONS } from '@/data/comparisons';
import { GLOSSARY_TERMS } from '@/data/glossary';

/**
 * 🌟 PROFESSIONAL SITEMAP ENGINE (2026 Standard)
 * This file dynamically generates a comprehensive index of PicFOMO's pages.
 * Revalidated every 24 hours to balance freshness with Cloudflare edge performance.
 */
export const revalidate = 86400; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.picfomo.com";

  // ==========================================
  // 1. CORE MARKETING & HUB PAGES
  // ==========================================
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/styles',
    '/blog',
    '/join',
    '/grader',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/grader" ? "daily" : "weekly",
    priority: route === "" || route === "/grader" ? 1.0 : 0.8,
  }));

  // ==========================================
  // 2. PROGRAMMATIC SEO LANDING PAGES
  // ==========================================
  const programmaticPages: MetadataRoute.Sitemap = [
    // Glossary index
    '/glossary',
    // Glossary terms (Dynamically generated from data/glossary.ts)
    ...Object.keys(GLOSSARY_TERMS).map((slug) => `/glossary/${slug}`),

    // Use-Cases (Dynamically generated from data/use-cases.ts)
    ...Object.keys(USE_CASES).map((slug) => `/use-case/${slug}`),
    
    // Competitor Comparisons (Dynamically generated from data/comparisons.ts)
    ...Object.keys(COMPARISONS).map((slug) => `/compare/${slug}`),

    // Guides & Educational
    '/guides/perfect-selfie-for-ai-headshots',
    '/guides/how-it-works',
    // Blog Posts
    '/blog/realistic-eyes-in-ai-headshots-2026',
    '/blog/ai-headshots-for-real-estate-agents-authenticity',
    '/blog/retro-film-style-ai-portraits-90s-aesthetic',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9, // High priority as these are entry-point landing pages
  }));

  let dynamicStyles: MetadataRoute.Sitemap = [];
  let dynamicPosts: MetadataRoute.Sitemap = [];
  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    // 🌟 USE TRY-CATCH WRAPPER TO ENSURE SITEMAP NEVER FAILS
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const db = (ctx.env as any).DB as D1Database;

    if (db) {
        // ==========================================
        // 3. DYNAMIC STYLE PAGES
        // ==========================================
        const stylesResult = await db.prepare(`
            SELECT slug, created_at, preview_urls, preview_image_url FROM styles 
            WHERE is_active = 1 AND slug IS NOT NULL
        `).all();

        dynamicStyles = (stylesResult?.results ?? []).map((style: any) => {
            let images: string[] = [];
            try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
            const featuredImage = images[0] || style.preview_image_url;

            return {
                url: `${baseUrl}/style/${encodeURIComponent(style.slug)}`,
                lastModified: style.created_at ? new Date(style.created_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            };
        });

        // ==========================================
        // 4. PUBLIC COMMUNITY POSTS
        // ==========================================
        const postsResult = await db.prepare(`
            SELECT id, created_at FROM posts 
            WHERE is_public = 1 ORDER BY created_at DESC LIMIT 1000
        `).all();

        dynamicPosts = (postsResult?.results ?? []).map((post: any) => ({
            url: `${baseUrl}/post/${encodeURIComponent(post.id)}`,
            lastModified: post.created_at ? new Date(post.created_at) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // ==========================================
        // 5. CREATOR PROFILES
        // ==========================================
        const usersResult = await db.prepare(`
            SELECT username FROM users WHERE username IS NOT NULL LIMIT 500
        `).all();

        dynamicProfiles = (usersResult?.results ?? []).map((user: any) => ({
            url: `${baseUrl}/u/${encodeURIComponent(user.username)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    }

  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return at least static and programmatic pages on error
  }

  return [
    ...staticPages, 
    ...programmaticPages, 
    ...dynamicStyles, 
    ...dynamicPosts, 
    ...dynamicProfiles
  ];
}
