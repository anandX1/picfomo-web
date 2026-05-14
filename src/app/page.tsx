import { getCloudflareContext } from "@opennextjs/cloudflare";
import MarketingClient from "./MarketingClient";
import SoftwareSchema from "@/components/marketing/SoftwareSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let dynamicStyles: any[] = [];
  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    if (db) {
      const { results } = await db.prepare("SELECT id, name, description, spark_cost, preview_image_url, preview_urls, badge FROM styles WHERE is_active = 1 AND id != 'schnell' ORDER BY sort_order ASC, created_at DESC").all();
      dynamicStyles = results.map((style: any) => {
        let images: string[] = [];
        try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
        return { ...style, preview_image_url: images[0] || style.preview_image_url };
      });
    }
  } catch (error) {
    console.error("D1 DB Error (Serving Fallback Styles):", error);
    dynamicStyles = [
      { id: "ghibli_fallback", name: "Ghibli", spark_cost: 2, preview_image_url: "/hero/1.webp" },
      { id: "dslr_fallback", name: "DSLR", spark_cost: 2, preview_image_url: "/hero/2.webp" },
      { id: "cyberpunk_fallback", name: "Cyberpunk", spark_cost: 2, preview_image_url: "/hero/3.webp" },
      { id: "vogue_fallback", name: "Vogue", spark_cost: 2, preview_image_url: "/hero/4.webp" }
    ];
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
      <SoftwareSchema />

      <MarketingClient dynamicStyles={dynamicStyles} />
    </>
  );
}
