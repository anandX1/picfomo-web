import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.picfomo.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/post/", "/style/", "/u/", "/join"],
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/sandbox",
          "/sign-in",
          "/sign-up",
          "/_next/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

