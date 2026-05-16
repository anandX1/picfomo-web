import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Sparkles, CheckCircle2, XCircle, ArrowRight, Wand2, ChevronRight } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'AI Authenticity Standards | Anti-Yassification Portraiture | PicFOMO',
  description: 'Proving AI portraits can be authentic. See how Identity-Lock™ preserves natural skin texture, freckles, and facial asymmetry for high-trust professional headshots.',
  alternates: {
    canonical: 'https://www.picfomo.com/authenticity',
  },
};

export default function AuthenticityPage() {
  const comparisons = [
    {
      title: "Skin Texture & Pores",
      description: "Generic AI models use heavy bilateral filtering that removes pores, making you look like a plastic 3D render. PicFOMO preserves biological realism.",
      picfomo: "Native 4K texture with visible pores and natural micro-wrinkles.",
      others: "Smoothed, 'waxy' skin that looks airbrushed and fake.",
      imgBefore: "/results/vintage-before.jpg", // Using existing assets for now
      imgAfter: "/results/vintage-after.jpg"
    },
    {
      title: "Facial Asymmetry",
      description: "Human faces are not perfectly symmetrical. Standard AI 'corrects' these, making you look like a stranger. We map 120+ unique points to keep you, you.",
      picfomo: "Maintains unique jawline, eye height, and smile nuances.",
      others: "Mirror-flips and 'beautifies' features, losing your identity.",
      imgBefore: "/results/kohli-before.png",
      imgAfter: "/results/kohli-after.png"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[3px]">
            <ShieldCheck size={12} /> The Anti-Yassification Manifesto
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] display-font">
            AI with <br/><span className="text-blue-500">Real Soul</span>.
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            In an era of waxy, over-filtered AI, PicFOMO stands for Authenticity. 
            We believe your digital identity should look like <span className="text-white font-medium">you</span>—just on your best day.
          </p>
        </div>
      </section>

      {/* Comparison Sections */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        {comparisons.map((c, i) => (
          <div key={i} className={`grid md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
             <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 display-font">{c.title}</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                   {c.description}
                </p>
                
                <div className="space-y-6">
                   <div className="flex items-start gap-4 p-6 bg-green-500/5 border border-green-500/20 rounded-2xl">
                      <CheckCircle2 size={24} className="text-green-500 shrink-0 mt-1" />
                      <div>
                         <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">The PicFOMO Standard</p>
                         <p className="text-gray-200">{c.picfomo}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                      <XCircle size={24} className="text-red-500 shrink-0 mt-1" />
                      <div>
                         <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Standard AI Wrappers</p>
                         <p className="text-gray-400">{c.others}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative aspect-[4/5] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                   <Image src={c.imgAfter} alt={c.title} fill className="object-cover" />
                   <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Authenticity Pass</p>
                         <p className="text-xs font-medium">99.8% Accuracy</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black">
                         <Sparkles size={18} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </section>

      {/* Technical Truth Section */}
      <section className="bg-zinc-900 py-32 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-10 display-font">The Physics of Identity.</h2>
            <p className="text-gray-400 text-lg mb-16 leading-relaxed font-light">
               We don't use generic "Enhancers." Our <Link href="/glossary/identity-lock" className="text-blue-400 hover:underline">Identity-Lock™</Link> engine 
               uses structural similarity index mapping (SSIM) to ensure the latent space 
               respects your physical geometry.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Precision", val: "120+ Pts" },
                 { label: "Refinement", val: "40 Steps" },
                 { label: "Resolution", val: "Native 4K" },
                 { label: "Resemblance", val: "99.8%" }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center">
                    <p className="text-[10px] font-mono uppercase tracking-[3px] text-gray-500 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-white display-font">{stat.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
         <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 display-font tracking-tight">Stop looking like <span className="italic text-gray-500">everyone else</span>.</h2>
            <p className="text-gray-400 mb-12 text-lg">Experience the first AI that values your reality as much as your aesthetic.</p>
            
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 font-bold text-[18px] tracking-[1.5px] text-black shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 hover:bg-blue-500 hover:text-white w-full sm:w-auto display-font">
              <Wand2 size={20} /> START AUTHENTIC GENERATION <ChevronRight size={20} />
            </Link>
         </div>
      </section>

      <Footer />
    </main>
  );
}
