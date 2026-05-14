import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

// 🌟 BLOG POST DATA (Unique, Plagiarism-Free, 2026 SEO Optimized)
const POSTS = [
  {
    slug: 'realistic-eyes-in-ai-headshots-2026',
    title: 'How to Get Realistic Eyes in AI Headshots (2026 Guide)',
    excerpt: 'Discover why AI often fails the "uncanny valley" eye test and how PicFOMO’s Identity-Lock™ technology maps human optics with surgical precision.',
    date: 'May 12, 2026',
    readTime: '5 min read',
    category: 'Technical',
    image: '/hero/2.png'
  },
  {
    slug: 'ai-headshots-for-real-estate-agents-authenticity',
    title: 'AI Headshots for Real Estate Agents: The Authenticity Shift',
    excerpt: 'Stop using plastic-looking portraits. Learn why real estate buyers in 2026 demand skin texture and natural lighting in professional headshots.',
    date: 'May 10, 2026',
    readTime: '6 min read',
    category: 'Marketing',
    image: '/hero/1.png'
  },
  {
    slug: 'retro-film-style-ai-portraits-90s-aesthetic',
    title: 'Retro Film Style AI Portraits: Achieving the 90s Aesthetic',
    excerpt: 'The film resurgence is here. Master the art of generating grainy, nostalgic, and high-contrast portraits that dominate social media trends.',
    date: 'May 08, 2026',
    readTime: '4 min read',
    category: 'Creative',
    image: '/hero/3.png'
  }
];

export const metadata: Metadata = {
  title: "PicFOMO Blog | AI Portrait Insights & Trends 2026",
  description: "Explore the latest in AI photography, professional branding, and digital identity. From technical deep-dives to aesthetic trends, master your image with PicFOMO.",
  alternates: {
    canonical: "https://www.picfomo.com/blog",
  },
  openGraph: {
    title: "PicFOMO Blog: The Future of AI Identity",
    description: "Deep insights into AI realism, professional headshots, and creative portraiture.",
    url: "https://www.picfomo.com/blog",
    images: [{ url: "https://www.picfomo.com/logo2.png" }],
  }
};

export default function BlogHubPage() {
  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <Navbar />
      
      {/* Blog Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] mb-6">
            <BookOpen size={12} /> The Lab Notes
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none display-font">
            Insight & <span className="text-[var(--color-gold)]">Innovation</span>.
          </h1>
          <p className="text-[18px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
            Deep dives into the science of AI realism, professional branding strategy, and the aesthetics of tomorrow.
          </p>
        </div>
      </section>

      {/* Featured Posts Grid */}
      <section className="max-w-[1120px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-[var(--color-cream)] rounded-3xl overflow-hidden border border-[var(--rule)] hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink3)]">
                   <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                   <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-[var(--color-gold)] transition-colors display-font">
                  {post.title}
                </h3>
                
                <p className="text-sm text-[var(--color-ink2)] leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-[var(--color-gold)] font-mono text-[10px] uppercase tracking-widest font-bold">
                   Read Full Story <ArrowRight size={14} />
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
           <h2 className="text-4xl md:text-5xl font-bold mb-6 display-font">Stay Ahead of the <span className="text-[var(--color-gold)]">Curve</span>.</h2>
           <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join our private list for early access to new AI styles, professional branding guides, and the weekly "Authenticity" report.</p>
           
           <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
              <button className="bg-white text-black font-bold uppercase tracking-[2px] text-xs px-8 py-4 rounded-xl hover:bg-[var(--color-gold)] transition-all">
                Join
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
