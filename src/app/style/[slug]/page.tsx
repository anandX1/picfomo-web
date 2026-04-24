import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Wand2, ChevronRight, CheckCircle2, Heart } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const revalidate = 60; // 🌟 Cache this page for 60 seconds to keep DB costs low while staying fresh

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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
    }
  };
}

export default async function StyleSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cleanName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${cleanName} AI Generator`,
    "description": `Generate ultra-realistic ${cleanName}s using your own face. No photographer needed. Try PicFOMO's Identity-Lock AI today.`,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": `https://www.picfomo.com/style/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // 🌟 PROGRAMMATIC SEO: Fetch actual posts matching this style slug
  const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  const { results: recentPosts } = await db.prepare(`
    SELECT posts.id, posts.image_url, posts.title, users.username, users.display_name,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count
    FROM posts 
    JOIN users ON posts.user_id = users.id
    LEFT JOIN styles ON posts.style_id = styles.id
    WHERE posts.is_public = 1 AND (LOWER(styles.name) LIKE ? OR LOWER(posts.tags) LIKE ?)
    ORDER BY posts.created_at DESC
    LIMIT 16
  `).bind(`%${cleanName.toLowerCase()}%`, `%${cleanName.toLowerCase()}%`).all();

  return (
    <main className="min-h-screen bg-[var(--color-white)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      <section className="relative mx-auto w-full max-w-[1120px] px-6 py-20 md:px-10 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[var(--color-gold)] opacity-[0.05] blur-[100px]"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
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
            </ul>

            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 py-4 font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-gold-light)] shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] w-full sm:w-auto">
              <Wand2 size={18} /> GENERATE YOURS FREE <ChevronRight size={18} />
            </Link>
          </div>

          {/* 🌟 Dynamic Featured Image */}
          <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            {recentPosts && recentPosts.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={(recentPosts[0] as any).image_url} alt={`${cleanName} example`} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-ink)] text-white p-8 text-center">
                 <Sparkles size={48} className="text-[var(--color-gold)] mb-6 opacity-50" />
                 <h3 className="font-[family-name:var(--display)] text-2xl mb-2 text-[var(--color-gold-light)]">Your Face Here</h3>
                 <p className="font-[family-name:var(--mono)] text-xs text-gray-400 uppercase tracking-widest leading-relaxed">Processing {cleanName} Synthesis...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🌟 THE INTERNAL LINKING FLYWHEEL */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="bg-[var(--color-cream)] py-20 px-6 md:px-10 border-t border-[var(--rule)]">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="font-[family-name:var(--display)] text-3xl md:text-4xl text-[var(--color-ink)] mb-10 text-center">
              Made by the PicFOMO Community
            </h2>
            
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {recentPosts.map((post: any) => (
                <Link href={`/post/${post.id}`} key={post.id} className="block group relative rounded-xl overflow-hidden break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image_url} alt={post.title || cleanName} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-semibold truncate">{post.title || `${cleanName} Edit`}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-300 text-xs truncate">by @{post.username}</p>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Heart size={12} className="fill-white" /> {post.likes_count}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}