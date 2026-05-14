import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, CheckCircle2, Wand2, ChevronRight } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { USE_CASES } from '@/data/use-cases';

export async function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const useCase = USE_CASES[slug] || { title: 'AI Use Case', description: 'PicFOMO AI' };

  return {
    title: `${useCase.title} | PicFOMO`,
    description: useCase.description,
    alternates: {
      canonical: `https://www.picfomo.com/use-case/${slug}`,
    },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const useCase = USE_CASES[slug];

  if (!useCase) {
    return (
      <main className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Use Case Not Found</h1>
        <Link href="/styles" className="text-[var(--color-gold)] hover:underline">Browse All Styles →</Link>
      </main>
    );
  }

  // 🌟 Fetch actual style data from DB for the recommended styles
  let recommendedStyles: any[] = [];
  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    if (db) {
      const placeholders = useCase.styles.map(() => '?').join(',');
      const { results } = await db.prepare(`SELECT id, name, slug, description, preview_image_url FROM styles WHERE slug IN (${placeholders}) OR id IN (${placeholders})`).bind(...useCase.styles, ...useCase.styles).all();
      recommendedStyles = results;
    }
  } catch (error) {
    console.error("Use Case DB Error:", error);
  }

  // 🌟 Schema.org for Use-Case Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${useCase.title} Generator`,
    "description": useCase.description,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": `https://www.picfomo.com/use-case/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "850"
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)]">
              <Sparkles size={12} /> Optimized Use Case
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.9] display-font">
              {useCase.title.split(' ').map((word, i) => (
                <span key={i} className={i === useCase.title.split(' ').length - 1 ? 'text-[var(--color-gold)]' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-[18px] text-[var(--color-ink2)] font-light mb-8 leading-relaxed max-w-lg">
              {useCase.description}
            </p>
            
            <ul className="mb-10 space-y-3">
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Professional 4K Resolution</li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Identity-Lock™ Technology</li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Instant Generation (20 Seconds)</li>
            </ul>

            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-page-text)] px-8 py-4 font-bold text-[16px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-black w-full sm:w-auto display-font">
              <Wand2 size={18} /> START GENERATING FREE <ChevronRight size={18} />
            </Link>
          </div>

          <div className="relative aspect-square md:aspect-[4/5] bg-[var(--color-cream)] rounded-3xl overflow-hidden border border-[var(--rule)] shadow-2xl">
            {recommendedStyles.length > 0 && (
               <Image 
                 src={recommendedStyles[0].preview_image_url} 
                 alt={`${useCase.title} example generated with PicFOMO AI`} 
                 fill
                 priority
                 sizes="(max-width: 768px) 100vw, 440px"
                 className="w-full h-full object-cover"
               />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-mono text-[10px] uppercase tracking-[3px] text-[var(--color-gold-light)] mb-2">Featured Result</p>
              <p className="text-white text-xl font-light italic">"I couldn't believe how much this actually looks like me. Best investment for my profile."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Styles Grid */}
      <section className="max-w-[1120px] mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 display-font">Best Styles for {useCase.title.split(' ').pop()}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedStyles.map((style) => (
            <Link 
              key={style.id} 
              href={`/style/${style.slug || style.id}`}
              className="group flex flex-col bg-[var(--color-cream)] rounded-3xl overflow-hidden border border-[var(--rule)] hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={style.preview_image_url} 
                  alt={`${style.name} AI portrait style - PicFOMO recommendation`} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 display-font">{style.name}</h3>
                <p className="text-sm text-[var(--color-ink2)] line-clamp-2 mb-4 italic">"{style.description}"</p>
                <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
                  View Style <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Linking Footer */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-[1120px] mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 display-font">Ready to upgrade your <span className="text-[var(--color-gold)]">Visual Identity</span>?</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">Join 10,000+ creators and professionals using PicFOMO to dominate their niche.</p>
          <div className="flex flex-wrap justify-center gap-4">
             {Object.entries(USE_CASES).filter(([s]) => s !== slug).map(([s, uc]) => (
               <Link key={s} href={`/use-case/${s}`} className="px-6 py-3 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                 {uc.title}
               </Link>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
