import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 🌟 Standard crawlers: Google, Bing, DuckDuckGo etc.
        userAgent: '*',
        allow: [
          '/',
          '/explore',
          '/post/',   // ✅ Every public post page is indexable
          '/u/',      // ✅ Every creator profile is indexable
          '/style/',  // ✅ SEO trap pages are indexable
          '/use-case/',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/_next/',
          '/sign-in',   // No point indexing auth pages
          '/sign-up',
        ],
      },
      {
        // 🌟 Google Image Bot: explicitly allow so your AI images get into Google Images
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        // 🌟 Block AI training scrapers — protects your users' generated content
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Omgilibot',
          'FacebookBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://picfomo.com/sitemap.xml',
  };
}