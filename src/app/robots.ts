import type { MetadataRoute } from "next";

/**
 * 🌟 PROFESSIONAL ROBOTS.TS CONFIGURATION (2026 Standard)
 * This file manages PicFOMO's crawl budget and protects against aggressive AI scrapers.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.picfomo.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",        // Internal APIs
          "/admin/",      // Admin Dashboard
          "/dashboard/",  // User Dashboard
          "/sandbox/",    // Testing environment
          "/sign-in",     // Auth routes
          "/sign-up",     // Auth routes
          "/*?_rsc=",     // Next.js React Server Component internal data
          "/*?_data=",    // Next.js internal data fetching
        ],
      },
      {
        // 🤖 AI BOT MANAGEMENT: Block aggressive scrapers from training on proprietary content
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "Omgilibot", "FacebookBot"],
        disallow: ["/style/", "/post/", "/u/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
