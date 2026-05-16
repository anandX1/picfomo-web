import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Wand2, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { CommunityGrid } from '@/components/seo/CommunityGrid';
import { getStyleSpecificPosts } from "@/lib/db-queries";
import { REVALIDATE_TIMERS } from "@/lib/cache";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const ogImage = "https://www.picfomo.com/logo2.png";

  return {
    title: `Create ${cleanName}s with AI | PicFOMO`,
    description: `Generate ultra-realistic ${cleanName}s using your own face. No photographer needed. Try PicFOMO's Identity-Lock AI today.`,
    alternates: {
      canonical: `https://www.picfomo.com/style/${slug}`,
    },
    openGraph: {
      title: `${cleanName} Generator | PicFOMO`,
      description: `Put your face into a ${cleanName} instantly.`,
      url: `https://www.picfomo.com/style/${slug}`,
      type: "website",
      siteName: "PicFOMO",
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 1600,
          alt: "PicFOMO",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanName} Generator | PicFOMO`,
      description: `Generate a ${cleanName} portrait in ~20 seconds — no prompts.`,
      images: [ogImage],
    },
  };
}

export default async function StyleSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // 🌟 ADVANCED SCHEMA.ORG (Phase 4: Visual SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.softwareApplication(
        `${cleanName} AI Portrait Generator`,
        `Generate ultra-realistic ${cleanName}s using your own face. No photographer needed. Try PicFOMO's Identity-Lock AI today.`,
        `https://www.picfomo.com/style/${slug}`
      ),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Styles", url: "https://www.picfomo.com/styles" },
        { name: cleanName, url: `https://www.picfomo.com/style/${slug}` }
      ])
    ]
  };

  // 🌟 PROGRAMMATIC SEO: Fetch actual posts matching this style slug
  const recentPosts = await getStyleSpecificPosts(cleanName) as any[];

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      <section className="relative mx-auto w-full max-w-[1120px] px-6 py-20 md:px-10 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[var(--color-gold)] opacity-[0.05] blur-[100px]"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] rounded-full">
              <Sparkles size={12} /> #1 Trending Aesthetic
            </div>
            
            <h1 className="mb-6 font-[family-name:var(--display)] text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-1px] text-[var(--color-page-text)]">
              Create your perfect<br/>
              <span className="text-[var(--color-gold)]">{cleanName}</span>.
            </h1>
            
            <p className="mb-8 text-[16px] md:text-[18px] font-light leading-[1.7] text-[var(--color-ink2)] max-w-[480px]">
              Don't settle for generic face-swaps. Our PuLID Identity-Lock technology perfectly maps your facial structure into a stunning <strong className="font-semibold text-black">{cleanName}</strong> in just 20 seconds.
            </p>

            <ul className="mb-10 space-y-3">
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> 99.8% Identity Match guaranteed</li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]"><CheckCircle2 size={18} className="text-green-500" /> Downloads in gorgeous 4K resolution</li>
            </ul>

            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-page-text)] px-8 py-4 font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-[var(--color-page-text)] w-full sm:w-auto">
              <Wand2 size={18} /> GENERATE YOURS FREE <ChevronRight size={18} />
            </Link>

            <div className="mt-8 flex items-center gap-4">
              <Link href="/styles" className="text-[12px] font-[family-name:var(--mono)] uppercase tracking-[2px] text-[var(--color-ink3)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2">
                <ArrowLeft size={14} /> Browse All Styles
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[var(--color-cream)]">
            {recentPosts && recentPosts.length > 0 ? (
              <Image 
                src={(recentPosts[0] as any).image_url} 
                alt={`${cleanName} AI portrait example generated with PicFOMO Identity-Lock™`} 
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-page-text)] text-white p-8 text-center">
                 <Sparkles size={48} className="text-[var(--color-gold)] mb-6 opacity-50" />
                 <h3 className="font-[family-name:var(--display)] text-2xl mb-2 text-[var(--color-gold-light)]">Your Face Here</h3>
                 <p className="font-[family-name:var(--mono)] text-xs text-gray-400 uppercase tracking-widest leading-relaxed">Processing {cleanName} Synthesis...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🌟 THE INTERNAL LINKING FLYWHEEL */}
      <CommunityGrid 
        posts={recentPosts} 
        nicheName={cleanName} 
        title="Made by the PicFOMO Community" 
      />

      <Footer />
    </main>
  );
}
