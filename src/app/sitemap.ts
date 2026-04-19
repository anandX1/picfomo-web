import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://picfomo.com';

  // ==========================================
  // 1. STATIC PAGES (High Priority)
  // ==========================================
  const staticPages = [
    '',              // Homepage
    '/explore',      // Public Feed
    '/how-it-works',
    '/styles',
    '/creators',
    '/sign-in',
    '/sign-up'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8, // Homepage is highest priority
  }));

  // ==========================================
  // 2. DYNAMIC PAGES (Programmatic SEO)
  // ==========================================
  let dynamicPosts: MetadataRoute.Sitemap = [];
  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    // 🌟 UNCOMMENT THIS when you are ready to connect it to your actual DB tables!
    /*
    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any);

    // Fetch the latest 10,000 public generations
    const postsResult = await db.prepare("SELECT id, created_at FROM generations WHERE is_public = 1 ORDER BY created_at DESC LIMIT 10000").all();
    
    dynamicPosts = postsResult.results.map((post: any) => ({
      url: `${baseUrl}/p/${post.id}`, // Assuming /p/[id] is your individual post route
      lastModified: new Date(post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Fetch public Creator profiles
    const usersResult = await db.prepare("SELECT username, created_at FROM users WHERE username IS NOT NULL").all();
    
    dynamicProfiles = usersResult.results.map((user: any) => ({
      url: `${baseUrl}/u/${user.username}`, // Your profile route
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    */
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  // Combine everything into one massive sitemap for Google!
  return [...staticPages, ...dynamicPosts, ...dynamicProfiles];
}