import { MetadataRoute } from 'next';

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // ==========================================
  // 2. PROGRAMMATIC SEO LANDING PAGES
  // ==========================================
  const programmaticPages: MetadataRoute.Sitemap = [
    // Use-Cases
    '/use-case/real-estate-headshots',
    '/use-case/dating-profile-photos',
    '/use-case/linkedin-profile-pictures',
    '/use-case/acting-headshots',
    // Competitor Comparisons
    '/compare/picfomo-vs-aragon-ai',
    '/compare/picfomo-vs-photo-ai',
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
    changeFrequency: 'monthly',
    priority: 0.9, // High priority as these are entry-point landing pages
  }));

  let dynamicStyles: MetadataRoute.Sitemap = [];
  let dynamicPosts: MetadataRoute.Sitemap = [];
  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    const ctx = await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true });
    const db = (ctx.env.DB as any);

    // ==========================================
    // 3. DYNAMIC STYLE PAGES
    // ==========================================
    let stylesResult: any = { results: [] };
    try {
      stylesResult = await db.prepare(`
        SELECT slug, created_at FROM styles 
        WHERE is_active = 1 AND slug IS NOT NULL
      `).all();
    } catch { stylesResult = { results: [] }; }

    dynamicStyles = (stylesResult?.results ?? []).map((style: any) => ({
      url: `${baseUrl}/style/${encodeURIComponent(style.slug)}`,
      lastModified: style.created_at ? new Date(style.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // ==========================================
    // 4. PUBLIC COMMUNITY POSTS
    // ==========================================
    let postsResult: any = { results: [] };
    try {
      postsResult = await db.prepare(`
        SELECT id, created_at FROM posts 
        WHERE is_public = 1 ORDER BY created_at DESC LIMIT 1000
      `).all();
    } catch { postsResult = { results: [] }; }

    dynamicPosts = (postsResult?.results ?? []).map((post: any) => ({
      url: `${baseUrl}/post/${encodeURIComponent(post.id)}`,
      lastModified: post.created_at ? new Date(post.created_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // ==========================================
    // 5. CREATOR PROFILES
    // ==========================================
    let usersResult: any = { results: [] };
    try {
      usersResult = await db.prepare(`
        SELECT username FROM users WHERE username IS NOT NULL LIMIT 500
      `).all();
    } catch { usersResult = { results: [] }; }

    dynamicProfiles = (usersResult?.results ?? []).map((user: any) => ({
      url: `${baseUrl}/u/${encodeURIComponent(user.username)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [
    ...staticPages, 
    ...programmaticPages, 
    ...dynamicStyles, 
    ...dynamicPosts, 
    ...dynamicProfiles
  ];
}
