import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { PostEntity } from "@/lib/schema";

interface CommunityGridProps {
  posts: PostEntity[];
  title?: string;
  nicheName: string;
}

/**
 * 🌟 PICFOMO COMMUNITY GRID
 * Staff+ Component for Programmatic SEO 'Information Gain'.
 * Injects real-world proof into static landing pages to prevent thin content penalties.
 */
export function CommunityGrid({ posts, title, nicheName }: CommunityGridProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-[var(--color-cream)] py-20 px-6 md:px-10 border-t border-[var(--rule)]">
      <div className="max-w-[1120px] mx-auto">
        <h2 className="font-[family-name:var(--display)] text-3xl md:text-4xl text-[var(--color-page-text)] mb-10 text-center">
          {title || `Recent ${nicheName} Generations`}
        </h2>
        
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {posts.map((post) => (
            <Link 
              href={`/post/${post.id}`} 
              key={post.id} 
              className="block group relative rounded-xl overflow-hidden break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="relative aspect-auto">
                <Image 
                  src={post.image_url} 
                  alt={post.title || `${nicheName} AI generated portrait by @${post.username}`} 
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm font-semibold truncate">{post.title || `${nicheName} Portrait`}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-300 text-xs truncate">by @{post.username}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/explore" 
            className="text-[12px] font-[family-name:var(--mono)] uppercase tracking-[2px] text-[var(--color-ink3)] hover:text-[var(--color-gold)] transition-colors"
          >
            Explore More community results →
          </Link>
        </div>
      </div>
    </section>
  );
}
