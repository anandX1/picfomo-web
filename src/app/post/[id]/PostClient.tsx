"use client";

import { useState, useTransition, useEffect } from "react";
// 🌟 FIX: Added CheckCircle2 to the imports!
import { Heart, Share2, Zap, Users, X, Image as ImageIcon, Eye, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { likePost, mockRemixPost } from "@/actions/economy";
import { toggleFollow, recordView } from "@/actions/social";
import Link from "next/link";
import { toast } from "sonner";

interface PostData {
  id: string;
  image_url: string;
  created_at: string;
  prompt_used: string | null;
  creator_id: string;
  username: string | null;
  display_name: string | null;
  profile_image_url: string | null;
  style_name: string | null;
  likes_count: number;
  views_count: number;
  followers_count: number;
  title: string | null;
  description: string | null;
  tags: string | null;
}

interface Props {
  post: PostData;
  currentUserId: string | null;
  initialIsFollowing: boolean;
}

export default function PostClient({ post, currentUserId, initialIsFollowing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Optimistic UI States
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(post.followers_count || 0);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  useEffect(() => {
    if (currentUserId) {
      recordView(post.id);
    } else {
      const timer = setTimeout(() => setShowAuthModal(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [post.id, currentUserId]);

  const handleFollow = () => {
    if (!currentUserId) return setShowAuthModal(true);
    if (currentUserId === post.creator_id) return toast.info("You can't follow yourself!");

    startTransition(async () => {
      setIsFollowing(!isFollowing);
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
      
      const res = await toggleFollow(post.creator_id);
      if (!res.success) {
        setIsFollowing(isFollowing);
        setFollowersCount(followersCount);
        toast.error(res.message);
      }
    });
  };

  const handleLike = () => {
    if (!currentUserId) return setShowAuthModal(true);

    startTransition(async () => {
      setLikesCount(likesCount + 1);
      const res = await likePost(post.id);
      if (res.success) toast.success("Liked! Creator earned +1 ⚡");
      else {
        setLikesCount(likesCount);
        toast.error(res.message);
      }
    });
  };

  const handleCollab = () => {
    if (!currentUserId) return setShowAuthModal(true);

    startTransition(async () => {
      const res = await mockRemixPost(post.id);
      if (res.success) toast.success("Collab Started! Check your Vault.");
      else toast.error(res.message);
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || "PicFOMO Generation", url });
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        toast.info("Sharing not supported on this browser.");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  const timeAgo = (dateString: string) => {
    if (!dateString) return '';
    const parsedDate = new Date(dateString.replace(' ', 'T') + 'Z'); 
    const now = new Date();
    const seconds = Math.abs(Math.round((now.getTime() - parsedDate.getTime()) / 1000));
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayUsername = post.username || `user_${post.creator_id.substring(0,6)}`;
  const isMine = currentUserId === post.creator_id;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] app-ui p-4 md:p-10 text-[var(--color-page-text)]">
      
      {/* 🌟 AUTH MODAL (Styled correctly for Dark Mode) */}
      {showAuthModal && !currentUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-[var(--color-page-bg)] p-8 shadow-[var(--shadow-2xl)] border border-[var(--rule)]">
            
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[var(--color-gold)] opacity-10 blur-3xl animate-pulse"></div>
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-[var(--color-cream)] p-2 text-[var(--color-ink3)] transition-colors hover:bg-[var(--color-cream2)] hover:text-[var(--color-page-text)]"
            >
              <X size={16} />
            </button>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="PicFOMO Logo" 
                className="mb-6 w-40 sm:w-48 h-auto rounded-2xl bg-black p-2 shadow-lg object-contain" 
              />
              
              <h2 className="mb-2 font-[family-name:var(--display)] text-3xl text-[var(--color-page-text)] tracking-tight">
                Unlock Your Aesthetic
              </h2>
              <p className="mb-8 font-[family-name:var(--mono)] text-[12px] uppercase leading-relaxed tracking-[1px] text-[var(--color-ink3)]">
                Drop your photo. Pick a trending style.<br/> Get your portrait in ~20 seconds.
              </p>
              
              <div className="mb-8 w-full space-y-3 text-left">
                <div className="flex items-center gap-3 rounded-xl bg-[var(--color-cream2)] p-3 border border-[var(--rule)]">
                  <Zap size={18} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-medium text-[var(--color-ink2)]">Get up to 55 Sparks free on signup</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[var(--color-cream2)] p-3 border border-[var(--rule)]">
                  <Sparkles size={18} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-medium text-[var(--color-ink2)]">New premium AI styles added daily</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[var(--color-cream2)] p-3 border border-[var(--rule)]">
                  <Users size={18} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-medium text-[var(--color-ink2)]">Collab and earn from your creations</span>
                </div>
              </div>
              
              <Link href="/sign-up" className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--color-page-text)] py-4 font-[family-name:var(--display)] tracking-[1.5px] text-[16px] text-[var(--color-page-bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:bg-[var(--color-gold)] hover:text-black">
                <span className="relative z-10">CREATE FREE ACCOUNT</span>
              </Link>

              <button 
                onClick={() => setShowAuthModal(false)}
                className="mt-5 text-[11px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-page-text)] hover:underline"
              >
                Maybe later, let me explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 POST DETAIL LAYOUT */}
      <div className="mx-auto max-w-6xl">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <Link href="/explore" className="text-[11px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-page-text)] transition-colors flex items-center gap-2 w-fit">
            ← BACK TO EXPLORE
          </Link>
        </div>

        {/* 🌟 MAIN CONTENT SPLIT CARD */}
        <div className="flex flex-col lg:flex-row gap-0 bg-[var(--color-cream)] rounded-[32px] overflow-hidden shadow-[var(--shadow-md)] border border-[var(--rule)]">
          
          {/* LEFT: The Big Image */}
          <div className="w-full lg:w-[55%] bg-[var(--color-cream2)] flex items-center justify-center relative min-h-[400px] border-r border-[var(--rule)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image_url} alt={post.title || "Aesthetic"} className="w-full h-auto max-h-[85vh] object-contain" />
          </div>

          {/* RIGHT: The Details & Actions */}
          <div className="w-full lg:w-[45%] p-6 md:p-10 flex flex-col justify-between">
            <div>
              
              {/* Top Action Bar */}
              <div className="flex items-center justify-between mb-8">
                <button onClick={handleShare} className="h-12 w-12 rounded-full bg-[var(--color-page-bg)] border border-[var(--rule)] flex items-center justify-center text-[var(--color-page-text)] hover:bg-[var(--color-cream2)] transition-colors shadow-sm">
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={handleCollab}
                  disabled={isPending || isMine}
                  className="flex items-center gap-2 bg-[var(--color-page-text)] text-[var(--color-page-bg)] hover:bg-[var(--color-gold)] hover:text-black px-6 py-3.5 rounded-xl font-[family-name:var(--mono)] font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm active:scale-95"
                >
                  <Users size={16} />
                  {isMine ? "YOUR ASSET" : "COLLAB"}
                </button>
              </div>

              {/* 🌟 GROQ TITLE & DESCRIPTION */}
              <h1 className="text-3xl md:text-4xl font-[family-name:var(--display)] tracking-tight text-[var(--color-page-text)] mb-3 leading-tight">
                {post.title || post.style_name || "Aesthetic Generation"}
              </h1>

              {post.description && (
                <p className="text-[var(--color-ink2)] text-[15px] mb-4 leading-relaxed font-light">
                  {post.description}
                </p>
              )}

              {/* ORIGINAL PROMPT (shown as context) */}
              {post.prompt_used && (
                <p className="text-[var(--color-ink3)] text-[13px] mb-6 leading-relaxed italic">
                  "{post.prompt_used}"
                </p>
              )}

              {/* 🌟 GROQ TAGS */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.split(",").map((tag) => (
                    <span 
                      key={tag.trim()} 
                      className="bg-[var(--color-page-bg)] text-[var(--color-page-text)] text-[10px] font-[family-name:var(--mono)] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-[var(--rule)] shadow-sm"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* TIMESTAMP */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-ink3)] uppercase tracking-widest mb-10 font-[family-name:var(--mono)]">
                <Clock size={12} />
                <span>Posted {timeAgo(post.created_at)}</span>
              </div>

              {/* 🌟 CREATOR INFO & FOLLOW BUTTON */}
              <div className="flex items-center justify-between p-5 bg-[var(--color-page-bg)] rounded-[20px] border border-[var(--rule)] shadow-sm">
                <Link href={`/u/${displayUsername}`} className="flex items-center gap-3 group">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-[var(--color-cream2)] border border-[var(--rule)] shrink-0 flex items-center justify-center relative">
                    {post.profile_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.profile_image_url} alt={displayUsername} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-page-text)] text-[var(--color-page-bg)] font-[family-name:var(--display)] text-xl">
                        {displayUsername.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-page-text)] group-hover:underline flex items-center gap-1">
                      {displayUsername}
                      <CheckCircle2 size={14} className="text-[var(--color-gold)] fill-[var(--color-gold)] drop-shadow-sm" style={{ color: 'white' }} />
                    </p>
                    <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest font-bold text-[var(--color-ink3)] mt-0.5">
                      {followersCount} followers
                    </p>
                  </div>
                </Link>

                {!isMine && (
                  <button 
                    onClick={handleFollow}
                    disabled={isPending}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 ${
                      isFollowing 
                        ? 'bg-[var(--color-cream2)] text-[var(--color-page-text)] border border-[var(--rule)] hover:bg-[var(--rule)]' 
                        : 'bg-[var(--color-page-text)] text-[var(--color-page-bg)] hover:bg-[var(--color-gold)] hover:text-black'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* 🌟 BOTTOM STATS ROW */}
            <div className="mt-10 flex items-center gap-8 border-t border-[var(--rule)] pt-6">
              <button 
                onClick={handleLike}
                disabled={isPending || isMine}
                className="flex items-center gap-2.5 group"
              >
                <Heart size={26} className={`${likesCount > 0 ? 'fill-red-500 text-red-500' : 'text-[var(--color-ink3)] group-hover:text-red-500'} transition-colors`} />
                <span className="font-[family-name:var(--display)] text-3xl text-[var(--color-page-text)]">{likesCount}</span>
              </button>

              <div className="flex items-center gap-2.5 text-[var(--color-ink3)]">
                <Eye size={24} />
                <span className="font-[family-name:var(--display)] text-3xl">{post.views_count}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}