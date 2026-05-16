import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Sparkles, Heart, ChevronRight, CheckCircle2, TrendingUp, Award, Globe } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const revalidate = 3600; // Refresh the hub every hour

export const metadata: Metadata = {
  title: 'Top AI Creators | The PicFOMO Community Hub',
  description: 'Meet the visionaries redefining digital identity. Explore profiles of top AI portrait creators and browse thousands of community-remixed aesthetics.',
  alternates: {
    canonical: 'https://www.picfomo.com/creators',
  },
  openGraph: {
    title: 'Top AI Creators | PicFOMO Community Hub',
    description: 'Explore the world\'s most talented AI portrait creators. High-end aesthetics, remixable identities.',
    images: [{ url: 'https://www.picfomo.com/hero/8.webp' }],
  }
};

export default async function CreatorsHubPage() {
  let topCreators: any[] = [];
  
  try {
    const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);
    const { results } = await db.prepare(`
      SELECT 
        users.id, users.username, users.display_name, users.profile_image_url, users.bio,
        (SELECT COUNT(*) FROM follows WHERE following_id = users.id) as followers_count,
        (SELECT COUNT(*) FROM posts WHERE user_id = users.id AND is_public = 1) as posts_count,
        (SELECT COUNT(*) FROM likes INNER JOIN posts ON likes.post_id = posts.id WHERE posts.user_id = users.id) as total_likes
      FROM users 
      WHERE username IS NOT NULL
      ORDER BY followers_count DESC, posts_count DESC
      LIMIT 24
    `).all();
    topCreators = results || [];
  } catch (error) {
    console.error("Database fetch failed in CreatorsHubPage (likely during build):", error);
    // topCreators stays an empty array, page renders skeleton/empty state
  }

  // 🌟 JSON-LD (CollectionPage / Person List)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "PicFOMO Creator Community",
    "description": "A showcase of the most talented AI portrait creators on PicFOMO.",
    "url": "https://www.picfomo.com/creators",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": topCreators?.length || 0,
      "itemListElement": (topCreators ?? []).map((user: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Person",
          "name": user.display_name || user.username,
          "url": `https://www.picfomo.com/u/${user.username}`,
          "image": user.profile_image_url || "https://www.picfomo.com/logo2.png"
        }
      }))
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <section className="pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[var(--color-gold)] opacity-[0.03] blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          
          <div className="text-center mb-20">
            <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[2px] text-[var(--color-gold)]">
              <Users size={12} /> The Global Community
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] display-font">
              Top AI <span className="text-[var(--color-gold)]">Creators</span>
            </h1>
            <p className="text-[18px] md:text-[22px] text-[var(--color-ink2)] font-light max-w-2xl mx-auto leading-relaxed">
              Meet the architects of digital identity. Browse 47 worlds of aesthetic synthesis created by our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topCreators?.map((user: any) => (
              <Link 
                key={user.id} 
                href={`/u/${user.username}`}
                className="group relative bg-white rounded-[2.5rem] p-8 border border-[var(--rule)] shadow-sm hover:shadow-2xl hover:border-[var(--color-gold)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-black">
                     <ChevronRight size={20} />
                   </div>
                </div>

                <div className="flex items-start gap-5 mb-8">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--rule)] bg-[var(--color-cream)] shrink-0">
                    {user.profile_image_url ? (
                      <Image src={user.profile_image_url} alt={user.username} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-2xl uppercase">
                        {user.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold display-font flex items-center gap-1.5 leading-none mb-2">
                      {user.display_name || user.username}
                      <CheckCircle2 size={16} className="text-[var(--color-gold)]" />
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-[2px] text-gray-400">@{user.username}</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-ink2)] leading-relaxed line-clamp-2 mb-8 h-10">
                   {user.bio || `Generating elite AI portraits in the PicFOMO community.`}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--rule2)]">
                   <div className="text-center">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Posts</p>
                     <p className="font-bold display-font">{user.posts_count}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Followers</p>
                     <p className="font-bold display-font">{user.followers_count}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Likes</p>
                     <p className="font-bold display-font">{user.total_likes}</p>
                   </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Hub Expansion: Discover Aesthetics */}
          <div className="mt-32 p-12 bg-black rounded-[3rem] text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.07] blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
             
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                   <h2 className="text-4xl md:text-5xl font-bold mb-6 display-font leading-tight text-[var(--color-gold-light)]">
                      Your Turn to<br/> Start Trending.
                   </h2>
                   <p className="text-gray-400 text-lg mb-10 font-light">
                      Join 50,000+ creators and launch your own aesthetic world in 20 seconds.
                   </p>
                   <Link href="/sign-up" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 font-bold text-[16px] tracking-[1.5px] text-black shadow-2xl transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] display-font">
                      <Sparkles size={20} className="text-[var(--color-gold)]" /> START CREATING NOW
                   </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                   <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/5 mt-8 animate-pulse" />
                </div>
             </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
