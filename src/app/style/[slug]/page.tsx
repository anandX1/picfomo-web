import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Wand2, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

// 🌟 DYNAMIC SEO METADATA
// Google reads this before the page even renders to rank it for specific keywords!
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  // Convert "studio-ghibli-anime-portrait" to "Studio Ghibli Anime Portrait"
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Create ${cleanName}s with AI | PicFOMO`,
    description: `Generate ultra-realistic ${cleanName}s using your own face. No photographer needed. Try PicFOMO's Identity-Lock AI today.`,
    openGraph: {
      title: `${cleanName} Generator | PicFOMO`,
      description: `Put your face into a ${cleanName} instantly.`,
    }
  };
}

export default async function StyleSeoPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // In the future, you can fetch actual R2 images from your DB that match this slug!
  // const db = ...;
  // const posts = await db.prepare("SELECT * FROM posts WHERE tags LIKE ? LIMIT 8").bind(`%${slug.replace(/-/g, ' ')}%`).all();

  return (
    <main className="min-h-screen bg-[var(--color-white)] flex flex-col">
      <Navbar />
      
      {/* 🌟 SEO OPTIMIZED HERO SECTION */}
      <section className="relative mx-auto w-full max-w-[1120px] px-6 py-20 md:px-10 md:py-32 overflow-hidden flex-1">
        
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[var(--color-gold)] opacity-[0.05] blur-[100px]"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left: The Keyword-Rich Pitch */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] rounded-full">
              <Sparkles size={12} /> #1 Trending Aesthetic
            </div>
            
            <h1 className="mb-6 font-[family-name:var(--display)] text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-1px] text-[var(--color-ink)]">
              Create your perfect<br/>
              <span className="text-[var(--color-gold)]">{cleanName}</span>.
            </h1>
            
            <p className="mb-8 text-[16px] md:text-[18px] font-light leading-[1.7] text-[var(--color-ink2)] max-w-[480px]">
              Don't settle for generic face-swaps. Our PuLID Identity-Lock technology perfectly maps your facial structure into a stunning <strong className="font-semibold text-black">{cleanName}</strong> in just 20 seconds.
            </p>

            <ul className="mb-10 space-y-3">
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> 99.8% Identity Match guaranteed</li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Downloads in gorgeous 4K resolution</li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Free to try right now</li>
            </ul>

            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 py-4 font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] w-full sm:w-auto">
              <Wand2 size={18} /> GENERATE YOURS FREE <ChevronRight size={18} />
            </Link>
          </div>

          {/* Right: The Mock Output */}
          <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <div className="absolute inset-0 bg-gray-900 animate-pulse"></div>
            {/* Fallback visual until DB is connected */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-ink)] text-white p-8 text-center">
               <Sparkles size={48} className="text-[var(--color-gold)] mb-6 opacity-50" />
               <h3 className="font-[family-name:var(--display)] text-2xl mb-2 text-[var(--color-gold-light)]">Your Face Here</h3>
               <p className="font-[family-name:var(--mono)] text-xs text-gray-400 uppercase tracking-widest leading-relaxed">Processing {cleanName} Synthesis...</p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}