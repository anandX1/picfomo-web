import { getCloudflareContext } from "@opennextjs/cloudflare";
import StudioUI from "./StudioUI";
import { Metadata } from "next";

// 🌟 THE MAGIC FIX: Tells Next.js to NEVER cache this page stale!
// Ensures the page updates instantly when you add/rearrange styles in Admin
export const dynamic = "force-dynamic";
export const revalidate = 0; 

// 🌟 SEO BOOST 1: STATIC METADATA & CANONICAL URL
// Locks in the master URL and provides highly clickable social preview cards
export const metadata: Metadata = {
  title: "AI Portrait Studio & Generator | PicFOMO",
  description: "Step into the PicFOMO Studio. Upload your selfie, choose from dozens of premium AI styles, and generate stunning, identity-locked portraits in 20 seconds.",
  alternates: {
    canonical: "https://www.picfomo.com/dashboard/studio",
  },
  openGraph: {
    title: "AI Portrait Studio | PicFOMO",
    description: "Upload your selfie and generate stunning portraits in 20 seconds.",
    url: "https://www.picfomo.com/dashboard/studio",
    type: "website",
    siteName: "PicFOMO",
    images: [
      {
        url: "https://www.picfomo.com/logo2.png",
        width: 1600,
        height: 1600,
        alt: "PicFOMO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Portrait Studio & Generator | PicFOMO",
    description: "Generate stunning, identity-locked portraits in 20 seconds.",
    images: ["https://www.picfomo.com/logo2.png"],
  }
};

export default async function StudioPage() {
  const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 🌟 FIX: We explicitly ORDER BY sort_order ASC so your drag-and-drop order reflects here!
  // Note: I added 'description' to the SELECT so the Studio UI can display the text details properly.
  const { results } = await db.prepare(`
    SELECT id, name, description, spark_cost, preview_image_url, preview_urls, badge 
    FROM styles 
    WHERE is_active = 1 AND id != 'schnell' 
    ORDER BY sort_order ASC, created_at DESC
  `).all();

  // Clean up the data to safely handle the JSON array of images we built in the Admin panel
  const dynamicStyles = results.map((style: any) => {
    let images: string[] = [];
    try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
    
    return {
      ...style,
      // 🌟 Map the first image in the array to preview_image_url so StudioUI reads it perfectly
      preview_image_url: images[0] || style.preview_image_url 
    };
  });

  // 🌟 SEO BOOST 2: JSON-LD STRUCTURED DATA (WebApplication)
  // Tells Google this page is a specific AI tool/software application, drastically boosting 
  // its chances to appear when people search for "AI Generator Tools".
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PicFOMO AI Studio",
    "description": "Upload your selfie, choose from dozens of premium AI styles, and generate stunning, identity-locked portraits in 20 seconds.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": "https://www.picfomo.com/dashboard/studio",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudioUI dynamicStyles={dynamicStyles} />
    </>
  );
}