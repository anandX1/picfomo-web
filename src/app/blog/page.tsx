import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { BLOG_POSTS } from '@/data/blog';

export const metadata: Metadata = {
  title: "PicFOMO Blog | Expert Insights on AI Photography 2026",
  description: "High-authority guides on AI realism, professional branding, and digital identity. Master your image with research-backed insights from the PicFOMO Lab.",
  alternates: {
    canonical: "https://www.picfomo.com/blog",
  },
  openGraph: {
    title: "PicFOMO Blog: The Science of AI Identity",
    description: "Deep insights into AI realism, professional headshots, and creative portraiture.",
    url: "https://www.picfomo.com/blog",
    images: [{ url: "https://www.picfomo.com/hero/8.webp" }],
  }
};

export default function BlogHubPage() {
  const posts = Object.values(BLOG_POSTS);

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <Navbar />
      
      {/* Blog Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] mb-6">
            <BookOpen size={12} /> Expert Insights
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.9] display-font">
            The <span className="text-[var(--color-gold)]">Authenticity</span> Report.
          </h1>
          <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
            Deep-dive research into generative realism, professional branding strategy, and the physics of digital light.
          </p>
        </div>
      </section>

      {/* Featured Posts Grid */}
      <section className="max-w-[1120px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500"
            >
              <div className="p-10 flex flex-col h-full text-zinc-900">
                <div className="flex items-center gap-4 mb-6 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                   <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                   <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-[1.1] text-zinc-900 group-hover:text-[var(--color-gold)] transition-colors display-font">
                  {post.title}
                </h3>
                
                <p className="text-sm text-zinc-600 leading-relaxed mb-8 line-clamp-3 font-light">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
                      Read Expert Guide <ArrowRight size={14} />
                   </div>
                   <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-zinc-50 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-tighter text-zinc-400">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-black text-white py-24 px-6 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-[1120px] mx-auto text-center relative z-10">
           <Sparkles className="mx-auto mb-8 text-[var(--color-gold)]" size={40} />
           <h2 className="text-4xl md:text-5xl font-bold mb-6 display-font">Join the <span className="text-[var(--color-gold)]">Elite</span> List.</h2>
           <p className="text-gray-400 mb-10 max-w-xl mx-auto">Get exclusive access to our "Uncanny Valley" research papers, early style drops, and weekly branding reports.</p>
           
           <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
              <button className="bg-white text-black font-bold uppercase tracking-[2px] text-xs px-8 py-4 rounded-xl hover:bg-[var(--color-gold)] transition-all">
                Subscribe
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
