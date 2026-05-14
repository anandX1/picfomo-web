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
          "/*?*", // Block all URL parameters (prevents faceted navigation bloat)
        ],
      },
      {
        // 🌟 AGGRESSIVE BOT PROTECTION
        // We block AI scrapers that don't provide search value but eat crawl budget.
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "Omgilibot", "FacebookBot"],
        disallow: ["/style/", "/post/", "/u/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
