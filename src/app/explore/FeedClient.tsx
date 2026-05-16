"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { Heart, Zap, Loader2, X, Eye, User, Search, TrendingUp, Clock, Sparkles } from "lucide-react";
import { likePost, mockRemixPost } from "@/actions/economy";
import { fetchFeedChunk } from "@/actions/feed"; 
import Link from "next/link"; 
import { toast } from "sonner"; 
import { useRouter } from "next/navigation"; 
import Script from "next/script";
import Image from "next/image";

interface Post {
  id: string;
  image_url: string;
  user_id: string;
  created_at: string;
  style_name: string | null;
  likes_count: number;
  views_count: number;
  remix_count: number;
  is_liked_by_me: number; 
  username: string | null;
  profile_image_url: string | null;
  is_wildcard?: number; 
  title?: string | null;
  description?: string | null;
}

interface Props {
  initialPosts: Post[];
  currentUserId: string | null; 
  initialRemixData?: any; 
}

type FeedTab = "trending" | "latest" | "portraits" | "art";
const TABS: { id: FeedTab; label: string; icon: React.ReactNode }[] = [
  { id: "trending",  label: "Trending",    icon: <TrendingUp size={13} /> },
  { id: "latest",    label: "Latest",      icon: <Clock size={13} /> },
  { id: "portraits", label: "Portraits",   icon: <User size={13} /> },
  { id: "art",       label: "Art & Style", icon: <Sparkles size={13} /> },
];

function PostSkeleton() {
  return (
    <div className="break-inside-avoid mb-6">
      <div className="rounded-2xl bg-[var(--color-cream2)] animate-pulse mb-2 aspect-[4/5] w-full border border-[var(--rule)]" />
      <div className="flex items-center gap-2 px-1 mt-3">
        <div className="h-6 w-6 rounded-full bg-[var(--color-cream2)] animate-pulse shrink-0 border border-[var(--rule)]" />
        <div className="h-3 w-24 rounded-full bg-[var(--color-cream2)] animate-pulse" />
      </div>
    </div>
  );
}

function PostCard({
  post, index, currentUserId, isPending, animatedPostId,
  onLike, onRemix, onDoubleTap, onInterest, refProp,
}: {
  post: Post; index: number; currentUserId: string | null; isPending: boolean;
  animatedPostId: string | null;
  onLike: (id: string, e: React.MouseEvent) => void;
  onRemix: (id: string, e?: React.MouseEvent) => void;
  onDoubleTap: (id: string, e: React.MouseEvent) => void;
  onInterest?: (styleId: string | null) => void;
  refProp?: (node: HTMLDivElement) => void;
}) {
  const isMine = post.user_id === currentUserId;
  const isLiked = post.is_liked_by_me > 0;
  const displayUsername = post.username || `user_${post.user_id.substring(0, 6)}`;
  const displayTitle = post.title || (post.style_name ? `${post.style_name} Generation` : 'AI Aesthetic Portrait');
  
  // Show highest-fill-rate 1:1 ad every 5th post
  const showAd = (index + 1) % 5 === 0;

  return (
    <div className="break-inside-avoid group mb-6 md:mb-8">
      
      {/* 🌟 PINTEREST-STYLE FIXED PLACEHOLDER */}
      <div
        ref={refProp}
        className="relative rounded-2xl overflow-hidden bg-[var(--color-cream2)] mb-3 cursor-pointer select-none aspect-[4/5] shadow-[var(--shadow-sm)] border border-[var(--rule)]"
        onDoubleClick={(e) => onDoubleTap(post.id, e)}
      >
        
        {/* BACKGROUND LAYER (z-0): Shows through only if image is shorter than 4:5 */}
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#000000]/80 to-transparent flex flex-col justify-end p-4 pb-6 z-0">
          <p className="text-[11px] font-[family-name:var(--mono)] uppercase tracking-widest text-[#FFFFFF] font-bold line-clamp-2 text-center leading-relaxed">
            {displayTitle}
          </p>
        </div>

        {/* FOREGROUND IMAGE LAYER (z-10) */}
        <Link href={`/post/${post.id}`} className="block absolute top-0 left-0 w-full h-full z-10">
          <Image
            src={post.image_url}
            alt={`${displayTitle} style AI portrait by @${displayUsername} on PicFOMO`}
            width={512} height={768}
            priority={index < 4}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="absolute top-0 left-0 w-full h-auto max-h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            unoptimized
          />
        </Link>

        {/* WILDCARD BADGE */}
        {post.is_wildcard === 1 && (
          <div className="absolute top-3 left-3 z-20 bg-[#000000]/60 backdrop-blur-md text-[#FFFFFF] font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md border border-[#FFFFFF]/20 pointer-events-none">
            <Sparkles size={12} className="text-[#FBBF24]" /> NEW
          </div>
        )}

        {/* HEART ANIMATION */}
        {animatedPostId === post.id && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart size={80} className="fill-[#EF4444] text-[#EF4444] drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-out fade-out zoom-out duration-700" />
          </div>
        )}

        {/* HOVER OVERLAYS */}
        <div className="hidden md:flex absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex-col justify-between p-4 z-20">
          <div className="flex justify-end">
            <button onClick={(e) => onRemix(post.id, e)} disabled={isPending || isMine} className="bg-[#FFFFFF]/20 hover:bg-[#FFFFFF]/30 backdrop-blur-md border border-[#FFFFFF]/40 text-[#FFFFFF] rounded-full px-5 py-2 font-[family-name:var(--mono)] font-bold text-[10px] uppercase tracking-widest shadow-lg pointer-events-auto hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
              <Zap size={14} className="fill-[#FFFFFF]" /> {isMine ? "YOURS" : "REMIX"}
            </button>
          </div>
          <div className="flex justify-end">
            <button onClick={(e) => onLike(post.id, e)} disabled={isPending || isMine} className="bg-[#FFFFFF]/90 backdrop-blur-sm text-[#111827] rounded-full p-3 shadow-lg pointer-events-auto hover:bg-[#FFFFFF] hover:scale-110 transition-transform disabled:opacity-50">
              <Heart size={20} className={isLiked ? "fill-[#EF4444] text-[#EF4444]" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATOR INFO (Below the card) */}
      <div className="flex items-center justify-between px-1">
        <Link href={`/u/${displayUsername}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[var(--color-cream2)] border border-[var(--rule)] flex items-center justify-center relative">
            {post.profile_image_url
              ? <Image src={post.profile_image_url} alt={`${displayUsername} - PicFOMO creator`} fill className="object-cover" unoptimized />
              : <User size={14} className="text-[var(--color-ink3)]" />}
          </div>
          <span className="truncate font-[family-name:var(--mono)] text-[12px] font-bold text-[var(--color-page-text)]">{displayUsername}</span>
        </Link>
        <div className="flex items-center gap-3 text-[var(--color-ink3)]">
          <div className="flex md:hidden items-center gap-1">
            <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            <span className="text-[11px] font-[family-name:var(--mono)] font-bold">{post.likes_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={15} />
            <span className="text-[11px] font-[family-name:var(--mono)] font-bold">{post.views_count}</span>
          </div>
        </div>
      </div>

      {/* 🌟 THE AD FIX: Perfectly integrated into the masonry flow as a "Fake Post" */}
      {showAd && (
        <div className="mt-8 mb-2 w-full flex flex-col group">
          
          <div className="relative rounded-2xl overflow-hidden bg-[var(--color-cream)] border border-[var(--rule)] flex flex-col items-center justify-between aspect-[4/5] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
            
            {/* Header / Sponsored Tag */}
            <div className="w-full bg-[var(--color-cream2)] py-2 border-b border-[var(--rule)] flex justify-center items-center">
              <span className="text-[9px] font-[family-name:var(--mono)] text-[var(--color-ink3)] uppercase tracking-[3px] font-bold">Sponsored</span>
            </div>
            
            {/* High Fill Rate 1:1 Widget Container (Centered) */}
            <div className="w-full flex-grow flex items-center justify-center bg-[var(--color-cream)]">
              <div id="container-b39280394b30c04b29a8908fb4b0bd64" className="w-full flex justify-center scale-95"></div>
              <Script id={`adsterra-native-${index}`} src="https://pl29173183.profitablecpmratenetwork.com/b39280394b30c04b29a8908fb4b0bd64/invoke.js" strategy="afterInteractive" data-cfasync="false" async />
            </div>

            {/* Footer / CTA */}
            <div className="h-[25%] w-full flex flex-col items-center justify-center bg-[var(--color-cream2)] border-t border-[var(--rule)] px-4 text-center">
              <p className="text-[14px] font-[family-name:var(--display)] tracking-wide text-[var(--color-page-text)]">Discover More</p>
              <p className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-widest text-[var(--color-ink3)] mt-1">Support the Network</p>
            </div>
          </div>
          
          {/* Fake User Row below the Ad to match post dimensions perfectly */}
          <div className="flex items-center justify-between px-1 mt-3">
            <div className="flex items-center gap-2 pointer-events-none opacity-80">
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[var(--color-cream2)] border border-[var(--rule)] flex items-center justify-center">
                <Sparkles size={12} className="text-[var(--color-gold)]" />
              </div>
              <span className="truncate font-[family-name:var(--mono)] text-[12px] font-bold text-[var(--color-page-text)]">PicFOMO Network</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function FeedClient({ initialPosts, currentUserId, initialRemixData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [animatedPostId, setAnimatedPostId] = useState<string | null>(null);
  const [showCollabModal, setShowCollabModal] = useState(!!initialRemixData);

  const [activeTab, setActiveTab] = useState<FeedTab>("trending");
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [offset, setOffset] = useState(15);
  const [hasMore, setHasMore] = useState(initialPosts.length === 15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 🌟 SESSION INTEREST TRACKING
  const [sessionInterests, setSessionInterests] = useState<string[]>([]);
  
  const trackStyleInterest = (styleId: string | null) => {
    if (!styleId) return;
    setSessionInterests(prev => {
      const newInterests = [styleId, ...prev.filter(id => id !== styleId)].slice(0, 5);
      return newInterests;
    });
  };

  const handleTabChange = async (tab: FeedTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setIsTabLoading(true);
    setSearchQuery("");
    const results = await fetchFeedChunk(0, 15, "", tab);
    setPosts(results);
    setOffset(15);
    setHasMore(results.length === 15);
    setIsTabLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const results = await fetchFeedChunk(0, 15, searchQuery);
    setPosts(results);
    setOffset(15);
    setHasMore(results.length === 15);
    setIsSearching(false);
  };

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore || isSearching) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMorePosts();
    }, { rootMargin: '400px' });
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, isSearching]);

  const loadMorePosts = async () => {
    setIsLoadingMore(true);
    const newPosts = await fetchFeedChunk(offset, 15, searchQuery, activeTab, sessionInterests);
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts(prev => {
        const newIds = new Set(newPosts.map(p => p.id));
        const filteredPrev = prev.filter(p => !newIds.has(p.id));
        return [...filteredPrev, ...newPosts];
      });
      setOffset(prev => prev + 15);
      if (newPosts.length < 15) setHasMore(false);
    }
    setIsLoadingMore(false);
  };

  useEffect(() => {
    if (!currentUserId && !initialRemixData) {
      const timer = setTimeout(() => setShowAuthModal(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [currentUserId, initialRemixData]);

  const triggerHeartAnimation = (postId: string) => {
    setAnimatedPostId(postId);
    setTimeout(() => setAnimatedPostId(null), 800);
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUserId) return setShowAuthModal(true);
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;
    if (targetPost.is_liked_by_me > 0) { triggerHeartAnimation(postId); return; }
    triggerHeartAnimation(postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1, is_liked_by_me: 1 } : p));
    startTransition(async () => {
      const res = await likePost(postId);
      if (res.success) toast.success("Liked! Creator earned +1 ⚡");
      else {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count - 1, is_liked_by_me: 0 } : p));
        toast.error(res.message);
      }
    });
  };

  const handleRemix = (postId: string, e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!currentUserId) return setShowAuthModal(true);
    startTransition(async () => {
      const res = await mockRemixPost(postId);
      if (res.success) { toast.success("Collab Successful! View it in your Vault."); setShowCollabModal(false); router.replace('/explore'); }
      else toast.error(res.message);
    });
  };

  const handleDoubleTap = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    handleLike(postId, e);
  };

  const closeCollabModal = () => { setShowCollabModal(false); router.replace('/explore'); };
  const isLoading = isSearching || isTabLoading;

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8 relative min-h-screen text-[var(--color-page-text)]">

      {/* COLLAB MODAL */}
      {showCollabModal && initialRemixData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-[var(--color-page-bg)] border border-[var(--rule)] p-6 shadow-[var(--shadow-2xl)] flex flex-col items-center">
            <button onClick={closeCollabModal} className="absolute right-4 top-4 z-10 rounded-full bg-[var(--color-cream)] p-2 text-[var(--color-ink3)] transition-colors hover:bg-[var(--color-cream2)] hover:text-[var(--color-page-text)] shadow-sm"><X size={16} /></button>
            <h2 className="font-[family-name:var(--display)] text-2xl text-center mb-1 tracking-wide mt-2">Collab Request 🤝</h2>
            <p className="font-[family-name:var(--mono)] text-[10px] text-[var(--color-ink3)] uppercase tracking-widest text-center mb-6">Remixing style from <span className="font-bold text-[var(--color-page-text)]">@{initialRemixData.username || "creator"}</span></p>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-md border border-[var(--rule)] bg-[var(--color-cream2)]">
              <Image src={initialRemixData.image_url} alt="Remix Target" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" unoptimized />
            </div>
            <button onClick={() => handleRemix(initialRemixData.id)} disabled={isPending} className="w-full bg-[var(--color-page-text)] text-[var(--color-page-bg)] hover:bg-[var(--color-gold)] hover:text-black font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[1.5px] py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />} REMIX STYLE (-10 Sparks)
            </button>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && !currentUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-[var(--color-page-bg)] p-8 shadow-[var(--shadow-2xl)] border border-[var(--rule)]">
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[var(--color-gold)] opacity-10 blur-3xl animate-pulse"></div>
            <button onClick={() => setShowAuthModal(false)} className="absolute right-4 top-4 z-10 rounded-full bg-[var(--color-cream)] p-2 text-[var(--color-ink3)] transition-colors hover:bg-[var(--color-cream2)] hover:text-[var(--color-page-text)]">
              <X size={16} />
            </button>
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PicFOMO Logo" className="mb-6 w-40 sm:w-48 h-auto rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] object-contain bg-black p-2" />
              <h2 className="mb-2 font-[family-name:var(--display)] text-3xl text-[var(--color-page-text)] tracking-tight">Unlock Your Aesthetic</h2>
              <p className="mb-8 font-[family-name:var(--mono)] text-[12px] uppercase leading-relaxed tracking-[1px] text-[var(--color-ink3)]">Drop your photo. Pick a trending style.<br/> Get your portrait in ~20 seconds.</p>
              <Link href="/sign-up" className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--color-page-text)] py-4 font-[family-name:var(--display)] text-lg tracking-[1.5px] text-[var(--color-page-bg)] transition-transform hover:scale-[1.02] shadow-md hover:bg-[var(--color-gold)] hover:text-black">
                <span className="relative z-10">CREATE FREE ACCOUNT</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & SEARCH */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--rule)] pb-6">
        <div>
          <h1 className="mb-2 font-[family-name:var(--display)] text-5xl tracking-[-1px] text-[var(--color-page-text)]">DISCOVER</h1>
          <p className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink3)]">Trending styles tailored to your taste</p>
        </div>
        <form onSubmit={handleSearch} className="w-full md:w-96 relative group">
          <input type="text" placeholder="Search tags, creators, or prompts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--color-cream)] border border-[var(--rule)] rounded-full py-4 pl-14 pr-6 font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-widest text-[var(--color-page-text)] placeholder-[var(--color-ink3)] focus:outline-none focus:border-[var(--color-gold-border)] focus:bg-[var(--color-page-bg)] transition-all shadow-sm group-hover:shadow-md" />
          <Search size={18} className="absolute left-6 top-4 text-[var(--color-ink3)] group-focus-within:text-[var(--color-gold)] transition-colors" />
          <button type="submit" disabled={isSearching} className="hidden">Search</button>
        </form>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)} disabled={isTabLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1.5px] whitespace-nowrap transition-all shadow-sm ${
              activeTab === tab.id ? 'bg-[var(--color-page-text)] text-[var(--color-page-bg)] shadow-md' : 'bg-[var(--color-cream)] text-[var(--color-page-text)] border border-[var(--rule)] hover:bg-[var(--color-cream2)]'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 md:gap-5 pb-20">
          {Array.from({ length: 10 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center text-[var(--color-ink3)]">
          <Search size={64} className="mb-6 opacity-20" />
          <h3 className="font-[family-name:var(--display)] text-3xl tracking-wide text-[var(--color-page-text)] mb-2">NO POSTS FOUND</h3>
          <p className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-widest">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 md:gap-5 pb-20">
          {posts.map((post, index) => (
            <PostCard
              key={`${post.id}-${index}`}
              post={post} index={index}
              currentUserId={currentUserId}
              isPending={isPending}
              animatedPostId={animatedPostId}
              onLike={handleLike} onRemix={handleRemix} onDoubleTap={handleDoubleTap}
              onInterest={trackStyleInterest}
              refProp={index === posts.length - 3 ? lastPostElementRef : undefined}
            />
          ))}
        </div>
      )}

      {isLoadingMore && (
        <div className="w-full flex justify-center py-10 pb-24">
          <Loader2 size={32} className="animate-spin text-[var(--color-gold)] drop-shadow-md" />
        </div>
      )}
    </div>
  );
}