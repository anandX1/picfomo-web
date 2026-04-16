"use client";

import { useState, useTransition, useEffect } from "react";
import { Heart, Zap, Loader2, Code, X, Image as ImageIcon, Users, Eye, User } from "lucide-react";
import { likePost, mockRemixPost } from "@/actions/economy";
import Link from "next/link"; 
import { toast } from "sonner"; 

interface Post {
  id: string;
  image_url: string;
  user_id: string;
  created_at: string;
  style_name: string | null;
  likes_count: number;
  views_count: number;
  followers_count: number;
  is_liked_by_me: number; // <-- Added to track if current user liked it
  username: string | null;
  profile_image_url: string | null;
}

interface Props {
  initialPosts: Post[];
  currentUserId: string | null; 
  injectAction: () => Promise<void>;
}

export default function FeedClient({ initialPosts, currentUserId, injectAction }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  
  // THE NEW FIX: State for the massive pop-up heart animation
  const [animatedPostId, setAnimatedPostId] = useState<string | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    if (!currentUserId) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 20000); 
      return () => clearTimeout(timer);
    }
  }, [currentUserId]);

  const triggerHeartAnimation = (postId: string) => {
    setAnimatedPostId(postId);
    setTimeout(() => setAnimatedPostId(null), 800); // Hide after 800ms
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId) return setShowAuthModal(true); 

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    // THE LOCK: If already liked, just pop the animation to feel good, but don't add numbers or hit DB
    if (targetPost.is_liked_by_me > 0) {
      triggerHeartAnimation(postId);
      return; 
    }

    // Play animation
    triggerHeartAnimation(postId);

    // OPTIMISTIC UPDATE: Add +1 and set is_liked_by_me to 1 so they can't spam it again
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId ? { ...post, likes_count: post.likes_count + 1, is_liked_by_me: 1 } : post
      )
    );

    startTransition(async () => {
      const res = await likePost(postId);
      if (res.success) {
        toast.success("Liked! Creator earned +1 ⚡");
      } else {
        // REVERT if database fails
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === postId ? { ...post, likes_count: post.likes_count - 1, is_liked_by_me: 0 } : post
          )
        );
        toast.error(res.message);
      }
    });
  };

  const handleRemix = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!currentUserId) return setShowAuthModal(true);

    startTransition(async () => {
      const res = await mockRemixPost(postId);
      if (res.success) toast.success("Collab Started! Cost you -10 ⚡.");
      else toast.error(res.message);
    });
  };

  const handleDoubleTap = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleLike(postId, e);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8">
      
      {/* THE CONVERSION MODAL */}
      {showAuthModal && !currentUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-[var(--color-white)] p-8 shadow-2xl border border-white/20">
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-400 opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[var(--color-gold)] opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <button onClick={() => setShowAuthModal(false)} className="absolute right-4 top-4 z-10 rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
              <X size={16} />
            </button>
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PicFOMO Logo" className="mb-6 w-40 sm:w-48 h-auto rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] object-contain" />
              <h2 className="mb-2 font-[family-name:var(--display)] text-3xl text-[var(--color-ink)] tracking-tight">Unlock Your Aesthetic</h2>
              <p className="mb-8 font-[family-name:var(--mono)] text-[12px] uppercase leading-relaxed tracking-[1px] text-[var(--color-ink3)]">Drop your photo. Pick a trending style.<br/> Get your portrait in ~20 seconds.</p>
              
              <div className="mb-8 w-full space-y-3 text-left">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 backdrop-blur-sm p-3 border border-gray-100/50">
                  <Zap size={18} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-medium text-gray-700">Get up to 55 Sparks free on signup</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 backdrop-blur-sm p-3 border border-gray-100/50">
                  <ImageIcon size={18} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">New premium AI styles added daily</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 backdrop-blur-sm p-3 border border-gray-100/50">
                  <Users size={18} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Collab and earn from your creations</span>
                </div>
              </div>
              
              <Link href="/sign-up" className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 py-4 font-bold tracking-wide text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,0,0,0.15)]">
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <span className="relative z-10">Create Free Account</span>
              </Link>
              <button onClick={() => setShowAuthModal(false)} className="mt-5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline">
                Maybe later, let me explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEED HEADER */}
      <div className="mb-8 hidden md:flex md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 font-[family-name:var(--display)] text-4xl tracking-[-0.5px] text-[var(--color-ink)]">
            DISCOVER
          </h1>
          <p className="font-[family-name:var(--mono)] text-[12px] uppercase tracking-[2px] text-[var(--color-ink3)]">
            Trending styles from the community
          </p>
        </div>

        {currentUserId && (
          <button 
            onClick={() => startTransition(() => injectAction())}
            disabled={isPending}
            className="flex items-center gap-2 rounded-full bg-red-100 px-6 py-2 font-[family-name:var(--mono)] text-[11px] font-bold text-red-600 uppercase tracking-[1px] border border-red-200 transition-transform hover:scale-105 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
            [DEV MODE] Inject Test Asset
          </button>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-6xl">🌍</span>
          <h3 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)]">THE FEED IS QUIET</h3>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 md:gap-4">
          {posts.map((post) => {
            const isMine = post.user_id === currentUserId;
            const displayUsername = post.username || `user_${post.user_id.substring(0,6)}`;
            
            // Boolean check based on the new logic
            const isLiked = post.is_liked_by_me > 0;

            return (
              <div key={post.id} className="mb-6 break-inside-avoid group">
                
                {/* IMAGE CONTAINER (Double Tap to Like) */}
                <div 
                  className="relative rounded-2xl overflow-hidden bg-gray-100 mb-2 cursor-pointer select-none"
                  onDoubleClick={(e) => handleDoubleTap(post.id, e)}
                >
                  <Link href={`/post/${post.id}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image_url} alt="Generated Asset" className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-95" loading="lazy" />
                  </Link>

                  {/* INSTAGRAM HEART ANIMATION OVERLAY */}
                  {animatedPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <Heart size={80} className="fill-white text-white drop-shadow-2xl animate-out fade-out zoom-out duration-700" />
                    </div>
                  )}

                  {/* PC HOVER OVERLAY (Hidden on mobile) */}
                  <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex-col justify-between p-3">
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={(e) => handleRemix(post.id, e)}
                        disabled={isPending || isMine}
                        className="bg-[var(--color-gold)] text-[var(--color-ink)] rounded-full px-4 py-2.5 font-bold text-xs shadow-lg pointer-events-auto hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Zap size={14} className="fill-[var(--color-ink)]" />
                        {isMine ? "YOURS" : "REMIX"}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={(e) => handleLike(post.id, e)}
                        disabled={isPending || isMine}
                        className="bg-white/90 backdrop-blur-sm text-gray-900 rounded-full p-2.5 shadow-lg pointer-events-auto hover:bg-white hover:scale-105 transition-all disabled:opacity-50"
                      >
                        <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>

                  </div>
                </div>

                {/* PINTEREST MINIMALIST FOOTER */}
                <div className="flex items-center justify-between px-1">
                  
                  <Link href={`/u/${displayUsername}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                      {post.profile_image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.profile_image_url} alt={displayUsername} className="h-full w-full object-cover" />
                      ) : (
                        <User size={14} className="text-gray-400" />
                      )}
                    </div>
                    <span className="truncate font-semibold text-xs text-gray-900">
                      {displayUsername}
                    </span>
                  </Link>
                  
                  <div className="flex items-center gap-3 text-gray-500">
                    {/* Mobile visible like count (super tiny) */}
                    <div className="flex md:hidden items-center gap-1">
                      <Heart size={12} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                      <span className="text-[10px] font-bold">{post.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span className="text-[11px] font-bold">{post.views_count}</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}