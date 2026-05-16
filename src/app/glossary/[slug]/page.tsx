import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowLeft, Wand2, ChevronRight, BookOpen, Lightbulb, Zap } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { SmartLinker } from '@/components/seo/SmartLinker';
import { SEMANTIC_LINKS } from '@/lib/seo/links';
import { GLOSSARY_TERMS } from '@/data/glossary';
import { REVALIDATE_TIMERS } from "@/lib/cache";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 86400;

export async function generateStaticParams() {
  return Object.keys(GLOSSARY_TERMS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const term = GLOSSARY_TERMS[slug];

  if (!term) return { title: 'Term Not Found' };

  return {
    title: `${term.term} Definition | AI Glossary | PicFOMO`,
    description: term.definition,
    alternates: {
      canonical: `https://www.picfomo.com/glossary/${slug}`,
    },
    openGraph: {
      title: term.term,
      description: term.definition,
      url: `https://www.picfomo.com/glossary/${slug}`,
    }
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const term = GLOSSARY_TERMS[slug];

  if (!term) return notFound();

  // 🌟 Schema.org for DefinedTerm
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.definedTerm(term),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Glossary", url: "https://www.picfomo.com/glossary" },
        { name: term.term, url: `https://www.picfomo.com/glossary/${slug}` }
      ])
    ]
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        <Link href="/glossary" className="inline-flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold mb-8 hover:underline group">
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Glossary
        </Link>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)]">
            <Sparkles size={10} /> Educational Deep-Dive
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-[1.1] display-font">
            {term.term}
          </h1>
          <p className="text-xl md:text-2xl font-light text-[var(--color-ink2)] leading-relaxed italic">
            "{term.definition}"
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1: Deep Dive */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-bold display-font">Technical Deep-Dive</h2>
            </div>
            <div className="prose prose-lg max-w-none text-[var(--color-ink2)] leading-relaxed">
              <p>
                <SmartLinker text={term.deepDive} links={SEMANTIC_LINKS} />
              </p>
            </div>
          </section>

          {/* Section 2: Why It Matters */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-[var(--rule)] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)] opacity-[0.03] blur-3xl" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-pale)] flex items-center justify-center text-[var(--color-gold)]">
                <Lightbulb size={20} />
              </div>
              <h2 className="text-2xl font-bold display-font">Why it matters</h2>
            </div>
            <p className="text-[var(--color-ink2)] leading-relaxed">
              <SmartLinker text={term.whyItMatters} links={SEMANTIC_LINKS} />
            </p>
          </section>

          {/* Section 3: How Picfomo Uses It */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[var(--color-gold)]">
                <Zap size={20} />
              </div>
              <h2 className="text-2xl font-bold display-font">How PicFOMO uses it</h2>
            </div>
            <p className="text-[var(--color-ink2)] leading-relaxed">
              <SmartLinker text={term.howPicfomoUsesIt} links={SEMANTIC_LINKS} />
            </p>
          </section>

          {/* High-Contrast Conversion Box */}
          <div className="p-10 bg-black rounded-[3rem] text-white relative overflow-hidden mt-20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-10 blur-[80px] rounded-full -mr-20 -mt-20" />
             
             <div className="relative z-10 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 display-font text-[var(--color-gold-light)]">Complex Tech. Simple Results.</h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed max-w-xl">We handle the {term.term.split(' ')[0]} complexity behind the scenes. You just drop your photo and get a masterpiece in 20 seconds.</p>
                
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-gold)] px-10 py-5 font-bold text-[16px] tracking-[1.5px] text-black shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold-light)] w-full sm:w-auto display-font">
                  <Wand2 size={18} /> GENERATE YOURS FREE <ChevronRight size={18} />
                </Link>
             </div>
          </div>

          {/* Related Terms */}
          <div className="pt-10 border-t border-[var(--rule)]">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-6">Related Concepts</h3>
            <div className="flex flex-wrap gap-4">
              {term.relatedTerms.map(rt => {
                const related = GLOSSARY_TERMS[rt];
                if (!related) return null;
                return (
                  <Link 
                    key={rt} 
                    href={`/glossary/${rt}`}
                    className="px-6 py-3 bg-[var(--color-cream)] rounded-xl border border-[var(--rule)] hover:border-[var(--color-gold)] transition-all text-sm font-medium"
                  >
                    {related.term}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
