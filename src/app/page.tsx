import { getCloudflareContext } from "@opennextjs/cloudflare";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const envCtx = (await getCloudflareContext()).env as any;
  const db = envCtx.DB;

  let dynamicStyles: any[] = [];
  try {
    const { results } = await db.prepare(`
      SELECT id, name, description, spark_cost, preview_image_url, preview_urls, badge 
      FROM styles 
      WHERE is_active = 1 AND id != 'schnell' 
      ORDER BY sort_order ASC, created_at DESC
    `).all();

    dynamicStyles = results.map((style: any) => ({
      ...style,
      preview_urls: typeof style.preview_urls === 'string' ? JSON.parse(style.preview_urls) : (style.preview_urls || [])
    }));
  } catch (error) {
    console.error("Failed to fetch styles:", error);
  }

  // 🌟 SEO BOOST: JSON-LD Structured Data for the Homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.picfomo.com/#website",
        "url": "https://www.picfomo.com/",
        "name": "PicFOMO",
        "description": "Your Best DP is 20 Seconds Away. Drop your photo, pick a trending style.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.picfomo.com/explore?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.picfomo.com/#organization",
        "name": "PicFOMO",
        "url": "https://www.picfomo.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.picfomo.com/logo2.png"
        },
        "sameAs": [
          "https://twitter.com/picfomo",
          "https://instagram.com/picfomo"
        ]
      }
    ]
  };

  return (
    <>
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingClient dynamicStyles={dynamicStyles} />
    </>
  );
}
