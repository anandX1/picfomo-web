import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowRight, ArrowLeft, Wand2, ChevronRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { BLOG_POSTS } from '@/data/blog';
import { SmartLinker } from '@/components/seo/SmartLinker';
import { SEMANTIC_LINKS } from '@/lib/seo/links';
import { SchemaFactory } from '@/lib/seo/schemaFactory';

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = BLOG_POSTS[slug];

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | PicFOMO Lab`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.picfomo.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.picfomo.com/blog/${slug}`,
      images: [{ url: "https://www.picfomo.com/hero/8.webp" }],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = BLOG_POSTS[slug];

  if (!post) return notFound();

  // 🌟 JSON-LD ARTICLE SCHEMA (PERFECT SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    ...SchemaFactory.blogPosting({ ...post, slug })
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      {/* Article Container */}
      <article className="pt-32 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        
        {/* Navigation & Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold hover:underline group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Research
           </Link>
           <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink3)]">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
              <span className="hidden sm:inline-block border border-[var(--rule)] px-2 py-0.5 rounded-full">{post.author}</span>
           </div>
        </div>

        {/* Title & Excerpt */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1] display-font">
            {post.title}
          </h1>
          <p className="text-xl md:text-2xl font-light text-[var(--color-ink2)] leading-relaxed italic border-l-4 border-[var(--color-gold-pale)] pl-8">
            "{post.excerpt}"
          </p>
        </div>

        {/* 🌟 2026 GEO OPTIMIZATION: TL;DR BLOCK */}
        <section className="bg-black text-white p-10 rounded-[3rem] mb-20 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)] opacity-10 blur-3xl" />
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center text-black">
                 <Sparkles size={16} />
              </div>
              <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-[var(--color-gold)] font-bold">Executive Summary (TL;DR)</h2>
           </div>
           <p className="text-lg leading-relaxed opacity-90 font-medium">
              {post.tldr}
           </p>
        </section>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none text-[var(--color-ink2)] leading-relaxed space-y-12">
           <SmartLinker text={post.content} links={SEMANTIC_LINKS} />
        </div>

        {/* High-Contrast Conversion Box */}
        <div className="p-12 bg-[var(--color-cream)] rounded-[3rem] border border-[var(--rule)] relative overflow-hidden mt-32 mb-20 shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-[0.03] blur-[80px] rounded-full" />
           
           <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 display-font">Stop Settling for <span className="text-[var(--color-gold)]">Fake</span>.</h2>
              <p className="text-[var(--color-ink2)] mb-10 text-lg leading-relaxed max-w-xl mx-auto">Our research proves that identity accuracy is the #1 factor in professional trust. Secure yours in 20 seconds.</p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                 <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-black">
                    <CheckCircle2 size={16} className="text-green-500" /> Identity-Lock™ Active
                 </div>
                 <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-black">
                    <CheckCircle2 size={16} className="text-green-500" /> 4K Ultra-Res
                 </div>
              </div>

              <Link href="/sign-up" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-12 py-5 font-bold text-[16px] tracking-[1.5px] text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-black display-font">
                <Wand2 size={20} /> GENERATE YOUR MASTERPIECE <ChevronRight size={18} />
              </Link>
           </div>
        </div>

        {/* Author Bio */}
        <div className="pt-20 border-t border-[var(--rule)] flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
           <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-[var(--color-gold)] font-bold text-3xl shrink-0">P</div>
           <div>
              <p className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-ink3)] mb-2">Authored By</p>
              <h4 className="font-bold text-xl mb-2">{post.author}</h4>
              <p className="text-sm text-[var(--color-ink2)] leading-relaxed">
                PicFOMO's research team combines decades of professional photography expertise with cutting-edge neural network architecture to define the next generation of digital identity.
              </p>
           </div>
        </div>
      </article>

      {/* Suggested Reading */}
      <section className="bg-[var(--color-cream)] py-32 px-6 md:px-10 border-t border-[var(--rule)]">
        <div className="max-w-4xl mx-auto">
           <div className="flex items-center gap-4 mb-12">
              <BookOpen size={24} className="text-[var(--color-gold)]" />
              <h3 className="text-3xl font-bold display-font">Further Reading</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(BLOG_POSTS).filter(([s]) => s !== slug).map(([s, p]) => (
                <Link key={s} href={`/blog/${s}`} className="group p-10 bg-white rounded-[2.5rem] border border-black/5 hover:shadow-2xl transition-all flex flex-col">
                   <h4 className="text-xl font-bold mb-6 text-zinc-900 group-hover:text-[var(--color-gold)] transition-colors display-font leading-tight">{p.title}</h4>
                   <div className="mt-auto flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
                      Read Research <ArrowRight size={14} />
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
