import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Allow Google to index the homepage, explore feed, and public pages
      allow: '/',
      // STRICTLY block crawlers from your private app areas
      disallow: ['/dashboard/', '/admin/', '/api/'],
    },
    // Points Google directly to your dynamic sitemap
    sitemap: 'https://picfomo.com/sitemap.xml',
  };
}