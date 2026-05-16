import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Users, ArrowRight, Wand2, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { SchemaFactory } from "@/lib/seo/schemaFactory";

export const metadata: Metadata = {
  title: "AI Headshots That Don't Look Fake | PicFOMO Authenticity",
  description: "Stop settling for waxy, plastic AI portraits. Discover how PicFOMO Identity-Lock technology preserves your real freckles, skin texture, and human flaws.",
  alternates: {
    canonical: "https://www.picfomo.com/authenticity",
  },
};

export default function AuthenticityPage() {
  // 🌟 ADVANCED SCHEMA.ORG (Phase 4: Trust Architecture)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.softwareApplication(
        "PicFOMO Identity-Lock™",
        "Biologically accurate AI facial rendering engine.",
        "https://www.picfomo.com/authenticity"
      ),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Authenticity", url: "https://www.picfomo.com/authenticity" }
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
            <ShieldCheck size={12} /> The Anti-Yassification Guarantee
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none display-font">
            AI Headshots that<br/>
            <span className="text-[var(--color-gold)]">Don't Look Fake</span>.
          </h1>
          <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
            Most AI generators treat your face like plastic. We treat it like biology. 
            No over-smoothing. No fake jawlines. Just you, in perfect lighting.
          </p>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="max-w-[1120px] mx-auto px-6 py-20">
         <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-zinc-100 rounded-[2.5rem] p-10 border border-zinc-200">
               <h3 className="text-2xl font-bold mb-6 display-font text-zinc-400">Legacy AI (The "Waxy" Look)</h3>
               <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-zinc-500 font-medium">Over-smoothed skin texture</li>
                  <li className="flex items-center gap-3 text-zinc-500 font-medium">AI-generated 'perfect' teeth</li>
                  <li className="flex items-center gap-3 text-zinc-500 font-medium">Loss of unique freckles/scars</li>
                  <li className="flex items-center gap-3 text-zinc-500 font-medium">Artificial 'Instagram' glow</li>
               </ul>
               <div className="aspect-[4/5] bg-zinc-200 rounded-2xl flex items-center justify-center italic text-zinc-400 text-sm">
                  Generic Plastic Output
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border-4 border-[var(--color-gold-border)] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-black font-black px-6 py-2 rounded-bl-2xl uppercase tracking-tighter text-xs">Identity-Lock™ Active</div>
               <h3 className="text-2xl font-bold mb-6 display-font">PicFOMO (The Real Look)</h3>
               <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-black font-semibold"><CheckCircle2 className="text-green-500" size={18} /> Preserved human skin pores</li>
                  <li className="flex items-center gap-3 text-black font-semibold"><CheckCircle2 className="text-green-500" size={18} /> Real human asymmetry kept</li>
                  <li className="flex items-center gap-3 text-black font-semibold"><CheckCircle2 className="text-green-500" size={18} /> Exact eye shape & color match</li>
                  <li className="flex items-center gap-3 text-black font-semibold"><CheckCircle2 className="text-green-500" size={18} /> No 'yassification' or blurring</li>
               </ul>
               <div className="aspect-[4/5] bg-[var(--color-cream)] rounded-2xl flex items-center justify-center overflow-hidden border border-[var(--rule)]">
                  <Image src="/hero/8.webp" alt="PicFOMO Realistic AI Portrait" width={400} height={500} className="w-full h-full object-cover" />
               </div>
            </div>
         </div>
      </section>

      {/* Reddit Validation Section */}
      <section className="bg-black text-white py-32 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 display-font">Verified by the <span className="text-[var(--color-gold)]">Cynics</span>.</h2>
            <p className="text-zinc-400 mb-12 text-lg">We spent months lurking on r/resumes and r/artificial to understand why people hate AI headshots. Then we built the antidote.</p>
            
            <div className="grid sm:grid-cols-2 gap-6 text-left">
               <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                  <p className="italic text-zinc-300 mb-4">"I've tried 5 different generators and this is the first one that didn't give me crazy AI eyes. It actually looks like me."</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-gold)]">- u/TechFounder2026</p>
               </div>
               <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                  <p className="italic text-zinc-300 mb-4">"Finally an AI that keeps my freckles. Every other tool airbrushes them out like I'm a porcelain doll."</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-gold)]">- u/DesignerCreative</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
         <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-12 py-5 font-bold text-[18px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-black">
            <Wand2 size={20} /> GET YOUR REAL PORTRAIT <ChevronRight size={20} />
         </Link>
      </section>

      <Footer />
    </main>
  );
}
