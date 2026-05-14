"use client";

import { useEffect } from "react";

interface SoftwareSchemaProps {
  name?: string;
  description?: string;
  url?: string;
}

export default function SoftwareSchema({
  name = "PicFOMO",
  description = "PicFOMO — Your Best DP is 20 Seconds Away. Drop your photo, pick a trending style.",
  url = "https://www.picfomo.com/"
}: SoftwareSchemaProps) {
  useEffect(() => {
    // This is a client-side injection helper if needed, 
    // but we prefer server-side injection for SEO.
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    },
    "featureList": [
      "AI Portrait Generation",
      "One-Click Styling",
      "Identity-Lock Technology",
      "High-Resolution Exports"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
