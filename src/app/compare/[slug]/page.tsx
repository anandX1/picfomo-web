import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Check, X, Wand2, ChevronRight, Zap, Shield, Trophy } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

import { COMPARISONS } from '@/data/comparisons';

export async function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const comp = COMPARISONS[slug] || { title: 'Comparison', subtitle: '' };

  return {
    title: `${comp.title} | Best AI Portrait Alternative`,
    description: `See how PicFOMO stacks up against ${comp.competitor}. Discover why our 20-second Identity-Lock technology is the industry leader.`,
    alternates: {
      canonical: `https://www.picfomo.com/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const comp = COMPARISONS[slug];

  if (!comp) {
    return (
      <main className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Comparison Not Found</h1>
        <Link href="/" className="text-[var(--color-gold)] hover:underline">Go Home →</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] mb-6">
            <Trophy size={12} /> Competitive Analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none display-font">
            {comp.title}
          </h1>
          <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed mb-10">
            {comp.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[var(--rule)]">
                <Zap className="text-orange-500" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">20s Speed</span>
             </div>
             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[var(--rule)]">
                <Shield className="text-blue-500" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Identity-Lock™</span>
             </div>
             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[var(--rule)]">
                <Sparkles className="text-[var(--color-gold)]" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Luxury Aesthetic</span>
             </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <div className="bg-white rounded-[2.5rem] border border-[var(--rule)] shadow-2xl overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-[var(--color-cream)] border-b border-[var(--rule)]">
                    <th className="p-8 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink3)]">Feature</th>
                    <th className="p-8 text-xl font-bold display-font text-[var(--color-gold)] text-center">PicFOMO</th>
                    <th className="p-8 text-xl font-bold display-font opacity-50 text-center">{comp.competitor}</th>
                 </tr>
              </thead>
              <tbody>
                 {comp.features.map((feat, i) => (
                    <tr key={i} className="border-b border-[var(--rule2)] hover:bg-[var(--color-page-bg)] transition-colors">
                       <td className="p-8 font-semibold text-[var(--color-page-text)]">{feat.name}</td>
                       <td className="p-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-sm font-bold text-green-600">{feat.picfomo}</span>
                             <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Check size={14} className="text-green-600" />
                             </div>
                          </div>
                       </td>
                       <td className="p-8 text-center opacity-60">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-sm font-medium">{feat.competitor}</span>
                             <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X size={14} className="text-red-600" />
                             </div>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           
           <div className="p-12 text-center bg-[var(--color-cream)]">
              <h3 className="text-2xl font-bold mb-6 display-font">The verdict is clear.</h3>
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-10 py-5 font-bold text-[18px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-black">
                <Wand2 size={20} /> TRY PICFOMO FOR FREE <ChevronRight size={20} />
              </Link>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
