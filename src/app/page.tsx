import MarketingClient from "./MarketingClient";
import SoftwareSchema from "@/components/marketing/SoftwareSchema";
import { getActiveStyles } from "@/lib/db-queries";
import { REVALIDATE_TIMERS } from "@/lib/cache";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 60;

export default async function Home() {
  const dynamicStyles = await getActiveStyles();

  // 🌟 SEO BOOST: JSON-LD Structured Data for the Homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.softwareApplication(
        "PicFOMO — Your Best DP is 20 Seconds Away",
        "Drop your photo. Pick a trending style. Get a stunning masterpiece in 20 seconds. No photographer needed.",
        "https://www.picfomo.com/"
      )
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
