import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getActiveStyles } from "@/lib/db-queries";
import { REVALIDATE_TIMERS } from "@/lib/cache";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Portrait Styles & Aesthetics | PicFOMO Hub",
  description: "Browse our complete library of AI portrait styles. From Ghibli and DSLR to Cinematic and Anime, find the perfect aesthetic for your next masterpiece.",
  alternates: {
    canonical: "https://www.picfomo.com/styles",
  },
  openGraph: {
    title: "AI Portrait Styles Hub | PicFOMO",
    description: "Explore the ultimate collection of AI-powered portrait aesthetics.",
    url: "https://www.picfomo.com/styles",
    images: [{ url: "https://www.picfomo.com/logo2.png" }],
  }
};

export default async function StylesHubPage() {
  const styles = await getActiveStyles() as any[];

  // 🌟 Schema.org for the Styles Hub
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.itemList(
        "PicFOMO AI Portrait Styles",
        "A comprehensive directory of AI-powered portrait aesthetics.",
        styles.map((style) => ({
          "@type": "SoftwareApplication",
          "name": style.name,
          "url": `https://www.picfomo.com/style/${style.slug || style.id}`,
          "applicationCategory": "DesignApplication",
          "operatingSystem": "All"
        }))
      ),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Styles", url: "https://www.picfomo.com/styles" }
      ])
    ]
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] mb-6">
            <Sparkles size={12} /> The Style Library
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none display-font">
            Choose Your <span className="text-[var(--color-gold)]">Aesthetic</span>.
          </h1>
          <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
            From hyper-realistic DSLR photography to whimsical Ghibli-inspired art. 
            Our Identity-Lock technology ensures your face remains perfect across every style.
          </p>
        </div>
      </section>

      {/* Styles Grid */}
      <section className="max-w-[1280px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {styles.map((style, index) => (
            <Link 
              key={style.id} 
              href={`/style/${style.slug || style.id}`}
              className="group flex flex-col bg-[var(--color-cream)] rounded-[2.5rem] overflow-hidden border border-[var(--rule)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-cream2)]">
                <Image 
                  src={style.preview_image_url} 
                  alt={`${style.name} AI Style aesthetic portrait generated with PicFOMO`} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  priority={index < 4}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {style.badge && (
                  <div className="absolute top-4 right-4 bg-[var(--color-gold)] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                    {style.badge}
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--color-gold-light)] transition-colors display-font">
                    {style.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[var(--color-gold-light)] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Explore Style</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <p className="text-sm text-[var(--color-ink2)] leading-relaxed line-clamp-2 mb-6 italic">
                  "{style.description}"
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--rule)]">
                  <span className="text-[10px] font-bold text-[var(--color-ink3)] uppercase tracking-widest">Premium Aesthetic</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
