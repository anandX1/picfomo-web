import Navbar from "@/components/marketing/Navbar";
import TrustBar from "@/components/marketing/TrustBar";
import Hero from "@/components/marketing/Hero";
import HowItWorks from "@/components/marketing/HowItWorks";
import ResultsGrid from "@/components/marketing/ResultsGrid";
import StylePalette from "@/components/marketing/StylePalette";
import SocialProof from "@/components/marketing/SocialProof";
import FAQ from "@/components/marketing/FAQ";
import CTABand from "@/components/marketing/CTABand";
import Footer from "@/components/marketing/Footer";

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
    <main className="min-h-screen bg-[var(--color-white)]">
      
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      <TrustBar />
      <Hero />
      
      <div className="mx-5 md:mx-10 h-[1px] max-w-[1040px] bg-[var(--rule)] xl:mx-auto"></div>
      <ResultsGrid />
      
      <div className="mx-5 md:mx-10 h-[1px] max-w-[1040px] bg-[var(--rule)] xl:mx-auto"></div>
      <HowItWorks />

      <div className="mx-5 md:mx-10 h-[1px] max-w-[1040px] bg-[var(--rule)] xl:mx-auto"></div>
      <StylePalette />

      <div className="mx-5 md:mx-10 h-[1px] max-w-[1040px] bg-[var(--rule)] xl:mx-auto"></div>
      <SocialProof />

      <div className="mx-5 md:mx-10 h-[1px] max-w-[1040px] bg-[var(--rule)] xl:mx-auto"></div>
      <FAQ />

      <CTABand />
      <Footer />
    </main>
  );
}