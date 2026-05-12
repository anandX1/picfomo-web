import { MetadataRoute } from 'next';

// 🌟 CRITICAL SEO FIX: Cache this sitemap for 24 hours (86400 seconds)!
// If you don't do this, querying rows dynamically will time out 
// your Cloudflare worker when Googlebot tries to fetch it.
export const revalidate = 86400; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Canonical host (matches `metadataBase` + all canonicals)
  const baseUrl = "https://www.picfomo.com";

  // ==========================================
  // 1. STATIC CORE PAGES
  // ==========================================
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/join',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.7,
  }));

  let dynamicStyles: MetadataRoute.Sitemap = [];
  let dynamicPosts: MetadataRoute.Sitemap = [];
  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    const ctx = await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true });
    const db = (ctx.env.DB as any);

    // ==========================================
    // 2. PROGRAMMATIC SEO TRAP PAGES (STYLES)
    // 🌟 NOW FULLY AUTOMATED! Every new style in your DB is auto-indexed.
    // ==========================================
    let stylesResult: any = { results: [] };
    try {
      stylesResult = await db.prepare(`
        SELECT slug, created_at 
        FROM styles 
        WHERE is_active = 1 AND slug IS NOT NULL
      `).all();
    } catch {
      stylesResult = { results: [] };
    }

    dynamicStyles = (stylesResult?.results ?? []).map((style: any) => ({
      url: `${baseUrl}/style/${encodeURIComponent(style.slug)}`,
      lastModified: style.created_at ? new Date(style.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // Very high priority for your landing pages!
    }));

    // ==========================================
    // 3. DYNAMIC PAGES (PUBLIC POSTS)
    // ==========================================
    // 🌟 Fetch last 1,000 public posts
    // Kept limit at 1000 to guarantee Cloudflare never times out. 
    // Googlebot prefers fast, bite-sized sitemaps over massive slow ones!
    let postsResult: any = { results: [] };
    try {
      postsResult = await db.prepare(`
        SELECT id, created_at
        FROM posts 
        WHERE is_public = 1 
        ORDER BY created_at DESC 
        LIMIT 1000
      `).all();
    } catch {
      postsResult = { results: [] };
    }

    dynamicPosts = (postsResult?.results ?? []).map((post: any) => ({
      url: `${baseUrl}/post/${encodeURIComponent(post.id)}`,
      lastModified: post.created_at ? new Date(post.created_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // ==========================================
    // 4. CREATOR PROFILES
    // ==========================================
    let usersResult: any = { results: [] };
    try {
      usersResult = await db.prepare(`
        SELECT username
        FROM users 
        WHERE username IS NOT NULL 
        LIMIT 500
      `).all();
    } catch {
      usersResult = { results: [] };
    }

    dynamicProfiles = (usersResult?.results ?? []).map((user: any) => ({
      url: `${baseUrl}/u/${encodeURIComponent(user.username)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  } catch (error) {
    // Sitemap should still be valid even if DB is unavailable (preview/build).
  }

  return [...staticPages, ...dynamicStyles, ...dynamicPosts, ...dynamicProfiles];
}