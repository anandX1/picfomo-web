import { Metadata } from 'next';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from 'next/link';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 3600; // Cache for 1 hour

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
  let styles: any[] = [];
  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    if (db) {
      const { results } = await db.prepare("SELECT id, name, description, slug, preview_image_url, preview_urls, badge FROM styles WHERE is_active = 1 AND id != 'schnell' ORDER BY sort_order ASC, created_at DESC").all();
      styles = results.map((style: any) => {
        let images: string[] = [];
        try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
        return { ...style, preview_image_url: images[0] || style.preview_image_url };
      });
    }
  } catch (error) {
    console.error("Styles Hub DB Error:", error);
    // Fallback styles for local dev / DB outages
    styles = [
      { id: "ghibli", name: "Ghibli", slug: "ghibli", description: "Soft, whimsical anime aesthetic.", preview_image_url: "/hero/1.png" },
      { id: "dslr", name: "DSLR", slug: "dslr", description: "Professional photorealistic portrait.", preview_image_url: "/hero/2.png" },
      { id: "cyberpunk", name: "Cyberpunk", slug: "cyberpunk", description: "Neon-drenched futuristic vibe.", preview_image_url: "/hero/3.png" },
      { id: "vogue", name: "Vogue", slug: "vogue", description: "High-fashion editorial aesthetic.", preview_image_url: "/hero/4.png" }
    ];
  }

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
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
          {styles.map((style) => (
            <Link 
              key={style.id} 
              href={`/style/${style.slug || style.id}`}
              className="group flex flex-col bg-[var(--color-cream)] rounded-[2.5rem] overflow-hidden border border-[var(--rule)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-cream2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={style.preview_image_url} 
                  alt={`${style.name} AI Style`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {style.badge && (
                  <div className="absolute top-4 right-4 bg-[var(--color-gold)] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {style.badge}
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 right-6">
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
