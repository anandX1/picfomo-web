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
  return (
    <main className="min-h-screen bg-[var(--color-white)]">
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