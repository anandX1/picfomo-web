import MarketingClient from "./MarketingClient";

export default function Home() {
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

      <MarketingClient />
    </>
  );
}
