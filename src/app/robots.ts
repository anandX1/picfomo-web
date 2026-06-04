import { MetadataRoute } from "next";

/**
 * 🌟 PROFESSIONAL ROBOTS.TS CONFIGURATION (2026 Standard)
 * This file manages PicFOMO's crawl budget and protects against aggressive AI scrapers.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.picfomo.com";

  return {
    rules: [
      {
        // ✅ Main crawlers: allow everything except private areas
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/_next/",
          "/static/",
          "/sign-in",
          "/sign-up",
          // NOTE: Removed /*?* — it was blocking Googlebot and external crawlers (Acquire, etc.)
          // Query params like ?page= and ?style= are legitimate and should be crawlable
        ],
      },
      {
        // Block AI scrapers that consume crawl budget without contributing search value
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Omgilibot"],
        disallow: ["/style/", "/post/", "/u/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
