import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://picfomo.com';

  // ==========================================
  // 1. STATIC CORE PAGES
  // ==========================================
  const staticPages = [
    '',
    '/explore',
    '/how-it-works',
    '/styles',
    '/creators',
    '/sign-in',
    '/sign-up'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // ==========================================
  // 2. PROGRAMMATIC SEO TRAP PAGES
  // ==========================================
  const seoTrapPages = [
    '/style/professional-linkedin-headshot',
    '/style/studio-ghibli-anime-portrait',
    '/style/old-money-aesthetic-pfp',
    '/style/cyberpunk-gaming-avatar',
    '/style/vintage-y2k-camera-selfie',
    '/style/diwali-ethnic-portrait',
    '/style/ipl-cricket-player-card',
    '/use-case/ai-dating-profile-pictures',
    '/use-case/restore-old-blurry-photos',
    '/how-to-make-viral-instagram-pfp'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // ==========================================
  // 3. DYNAMIC PAGES (DB FLYWHEEL — ACTIVE)
  // ==========================================
  let dynamicPosts: MetadataRoute.Sitemap = [];
  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any);

    // 🌟 Fetch last 10,000 public posts WITH image_url for Google Image Search
    const postsResult = await db.prepare(`
      SELECT 
        posts.id, 
        posts.image_url, 
        posts.created_at,
        posts.title,
        posts.description,
        users.username
      FROM posts 
      JOIN users ON posts.user_id = users.id
      WHERE posts.is_public = 1 
      ORDER BY posts.created_at DESC 
      LIMIT 10000
    `).all();

    dynamicPosts = postsResult.results.map((post: any) => ({
      url: `${baseUrl}/post/${post.id}`,                    // ✅ Fixed: /post/ not /p/
      lastModified: new Date(post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      // 🌟 THE FIX: Next.js strictly expects an array of strings here! No more [object Object] errors.
      images: post.image_url ? [post.image_url] : undefined,
    }));

    // 🌟 Public creator profiles
    const usersResult = await db.prepare(`
      SELECT username, updated_at 
      FROM users 
      WHERE username IS NOT NULL 
      LIMIT 5000
    `).all();

    dynamicProfiles = usersResult.results.map((user: any) => ({
      url: `${baseUrl}/u/${user.username}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  } catch (error) {
    console.error("Sitemap DB error:", error);
  }

  return [...staticPages, ...seoTrapPages, ...dynamicPosts, ...dynamicProfiles];
}