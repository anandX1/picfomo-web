import GeminiHomepage from "@/components/marketing/GeminiHomepage";

export default function Home() {
  // 🌟 SEO BOOST: JSON-LD Structured Data for the Homepage
  // Tells Google that PicFOMO is a legitimate Organization and Searchable Website.
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
          "url": "https://www.picfomo.com/logo2.png" // Maps to your public logo
        },
        "sameAs": [
          "https://twitter.com/picfomo", // Add your real socials here when ready!
          "https://instagram.com/picfomo"
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen">
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GeminiHomepage />
    </main>
  );
}