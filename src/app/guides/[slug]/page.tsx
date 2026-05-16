import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Wand2, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { SmartLinker } from '@/components/seo/SmartLinker';

const GUIDES: Record<string, { title: string; readTime: string; description: string; content: any }> = {
  'psychology-of-digital-identity': {
    title: 'The Psychology of Professional Digital Identity in 2026',
    readTime: '12 min read',
    description: 'A deep dive into how first impressions are formed in the digital age and why your AI portrait is your most valuable career asset.',
    content: (
      <div className="space-y-8">
        <p className="text-lg leading-relaxed text-[var(--color-ink2)]">
          In 2026, your physical presence is often secondary to your digital silhouette. 
          Whether it's a LinkedIn headshot, a Twitter avatar, or a Zoom profile picture, 
          human psychology processes these pixels in less than 40 milliseconds to form 
          judgments on authority, trustworthiness, and competence.
        </p>

        <h2 className="text-3xl font-bold display-font mt-12">1. The "Halo Effect" in Virtual Networking</h2>
        <p className="text-[17px] leading-[1.8] text-[var(--color-ink2)]">
          The Halo Effect is a cognitive bias where our overall impression of a person influences how we feel and think about their character. 
          When a recruiter sees a high-quality AI headshot, they subconsciously attribute professional success, attention to detail, 
          and tech-savviness to the individual. This is why tools like <SmartLinker text="Identity-Lock" /> are critical; 
          they maintain the authenticity required to bridge the gap between "Digital" and "Real."
        </p>

        <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-[var(--rule)] my-12">
           <h3 className="text-xl font-bold mb-4 display-font">The Authenticity Gap</h3>
           <p className="text-sm text-[var(--color-ink2)] leading-relaxed italic">
             "The moment a profile picture looks 'over-edited' or 'yassified,' the trust score drops. 
             The brain flags it as a fabrication. True digital authority comes from realism."
           </p>
        </div>

        <h2 className="text-3xl font-bold display-font mt-12">2. Niche-Specific Visual Language</h2>
        <p className="text-[17px] leading-[1.8] text-[var(--color-ink2)]">
          A lawyer needs to project stability and resolve, often leaning into <SmartLinker text="Corporate" /> styles with neutral palettes. 
          Conversely, a creative director might use <SmartLinker text="Cinematic Noir" /> to signal vision and depth. 
          PicFOMO allows professionals to pivot their visual identity based on the platform, whether it's <SmartLinker text="LinkedIn Profile Pictures" /> 
          or <SmartLinker text="AI Photos for Tinder" />.
        </p>

        <h2 className="text-3xl font-bold display-font mt-12">3. The Future of Facial Accuracy</h2>
        <p className="text-[17px] leading-[1.8] text-[var(--color-ink2)]">
          Technologies like <SmartLinker text="PuLID" /> and <SmartLinker text="SDXL" /> have fundamentally changed 
          how we generate <SmartLinker text="AI Portraits" />. We are moving away from generic prompt-based art 
          and towards "Zero-Prompt" identity synthesis, where the AI understands the nuances of your unique 
          facial geometry. This isn't just about making you look "good"; it's about making you look like the most 
          professional version of yourself.
        </p>
      </div>
    )
  },
  'perfect-selfie-for-ai-headshots': {
    title: 'How to Take the Perfect Selfie for AI Headshots',
    readTime: '4 min read',
    description: 'Learn the lighting, angles, and backgrounds that ensure your AI portraits look 100% like you.',
    content: (
      <div className="space-y-8">
        <p className="text-lg leading-relaxed text-[var(--color-ink2)]">
          The quality of your AI portrait depends 80% on the quality of your input photo. 
          While our Identity-Lock™ technology is powerful, following these simple steps will ensure a flawless result.
        </p>
        
        <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-[var(--rule)]">
           <h3 className="text-xl font-bold mb-4 display-font">1. Lighting is King</h3>
           <p className="text-sm text-[var(--color-ink2)] leading-relaxed">
             Stand facing a window during the day. Avoid harsh shadows or overhead lights that create "raccoon eyes." 
             Natural, even light allows our AI to map your facial features with surgical precision.
           </p>
        </div>

        <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-[var(--rule)]">
           <h3 className="text-xl font-bold mb-4 display-font">2. The "Goldilocks" Angle</h3>
           <p className="text-sm text-[var(--color-ink2)] leading-relaxed">
             Keep the camera at eye level. Looking too far up or down distorts your jawline and forehead structure. 
             A slight 3/4 turn can be flattering, but a direct head-on shot is best for accuracy.
           </p>
        </div>

        <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-[var(--rule)]">
           <h3 className="text-xl font-bold mb-4 display-font">3. Background & Clutter</h3>
           <p className="text-sm text-[var(--color-ink2)] leading-relaxed">
             Use a plain background. While our AI removes the background, a busy one can sometimes "leak" colors into your hair or skin. 
             A white or neutral wall is your best friend.
           </p>
        </div>
      </div>
    )
  },
  'how-to-use-ai-headshots-on-linkedin': {
    title: 'The LinkedIn AI Revolution: How to Stand Out in 2026',
    readTime: '6 min read',
    description: 'A guide to using AI-generated portraits to boost your professional brand and recruitment chances.',
    content: (
      <div className="space-y-8">
        <p className="text-lg leading-relaxed text-[var(--color-ink2)]">
          LinkedIn has evolved. Your profile picture is no longer just a face; it's a brand statement. 
          Here's how to use AI to ensure your brand is "Elite."
        </p>
        
        <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-[var(--rule)]">
           <h3 className="text-xl font-bold mb-4 display-font">Match Your Industry's "Vibe"</h3>
           <p className="text-sm text-[var(--color-ink2)] leading-relaxed">
             Tech founders should lean into "Cinematic" or "Studio" looks. 
             Finance and Legal professionals should stick to high-end "Corporate" aesthetics. 
             AI allows you to have multiple professional personas for different platforms.
           </p>
        </div>
      </div>
    )
  }
};

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const guide = GUIDES[slug] || { title: 'Guide', description: '' };

  return {
    title: `${guide.title} | PicFOMO Guides`,
    description: guide.description,
    alternates: {
      canonical: `https://www.picfomo.com/guides/${slug}`,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const guide = GUIDES[slug];

  if (!guide) {
    return (
      <main className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
        <Link href="/" className="text-[var(--color-gold)] hover:underline">Go Home →</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <Navbar />
      
      {/* Article Header */}
      <article className="pt-32 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
              <BookOpen size={14} /> Guide
           </div>
           <div className="flex items-center gap-2 text-[var(--color-ink3)] font-mono text-[10px] uppercase tracking-widest">
              <Clock size={14} /> {guide.readTime}
           </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1] display-font">
          {guide.title}
        </h1>
        
        <p className="text-xl text-[var(--color-ink2)] font-light mb-12 italic border-l-4 border-[var(--color-gold)] pl-6">
          "{guide.description}"
        </p>

        <div className="prose prose-lg max-w-none">
           {guide.content}
        </div>

        {/* CTA Box */}
        <div className="mt-20 p-10 bg-black rounded-[2.5rem] text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-10 blur-[80px] rounded-full -mr-20 -mt-20" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                 <h2 className="text-3xl font-bold mb-4 display-font">Ready to try it yourself?</h2>
                 <p className="text-gray-400 mb-6 text-sm">Put these tips into practice and generate your first luxury AI portrait in 20 seconds.</p>
                 <ul className="space-y-2 mb-8">
                    <li className="flex items-center gap-2 text-xs"><CheckCircle2 size={14} className="text-green-500" /> Free to start</li>
                    <li className="flex items-center gap-2 text-xs"><CheckCircle2 size={14} className="text-green-500" /> No credit card required</li>
                 </ul>
                 <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-gold)] px-8 py-4 font-bold text-[16px] tracking-[1.5px] text-black shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold-light)]">
                   <Wand2 size={18} /> GENERATE FREE <ChevronRight size={18} />
                 </Link>
              </div>
              <div className="w-full md:w-64 aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden border border-white/10">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="/hero/2.png" alt="Example Portrait" className="w-full h-full object-cover opacity-80" />
              </div>
           </div>
        </div>

        {/* More Guides */}
        <div className="mt-32 pt-16 border-t border-[var(--rule)]">
           <h3 className="text-2xl font-bold mb-10 display-font">More from the PicFOMO Lab</h3>
           <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(GUIDES).filter(([s]) => s !== slug).map(([s, g]) => (
                <Link key={s} href={`/guides/${s}`} className="group p-8 bg-[var(--color-cream)] rounded-3xl border border-[var(--rule)] hover:shadow-xl transition-all">
                   <h4 className="text-xl font-bold mb-4 group-hover:text-[var(--color-gold)] transition-colors display-font">{g.title}</h4>
                   <p className="text-sm text-[var(--color-ink2)] line-clamp-2 mb-6">{g.description}</p>
                   <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
                      Read Guide <ArrowRight size={14} />
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
