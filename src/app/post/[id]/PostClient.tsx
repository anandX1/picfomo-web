"use client";

import { useState, useTransition, useEffect } from "react";
// Added Clock to the imports
import { Heart, Share2, Zap, Users, X, Image as ImageIcon, Eye, Clock } from "lucide-react";
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

  // THE VIEWS ENGINE: Records a view when the page loads!
  useEffect(() => {
    if (currentUserId) {
      recordView(post.id);
    } else {
      // 20-second hook for unauthenticated users
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
        await navigator.share({ title: `PicFOMO Generation`, url });
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

  // THE TIME ENGINE
  const timeAgo = (dateString: string) => {
    if (!dateString) return '';
    // Fix timezone strings coming from SQLite to work in JavaScript Date object
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
    <div className="min-h-screen bg-[var(--color-cream)] app-ui p-4 md:p-8">
      
      {/* THE FANCY CONVERSION MODAL */}
      {showAuthModal && !currentUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-[var(--color-white)] p-8 shadow-2xl border border-white/20">
            
            {/* Ambient Glowing Orbs */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-400 opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[var(--color-gold)] opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
            >
              <X size={16} />
            </button>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* THE LOGO */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                 src="/logo.png" 
                 alt="PicFOMO Logo" 
                 className="mb-6 w-40 sm:w-48 h-auto rounded-2xl bg-gray-950 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)] object-contain" 
               />
              
              <h2 className="mb-2 font-[family-name:var(--display)] text-3xl text-[var(--color-ink)] tracking-tight">
                Unlock Your Aesthetic
              </h2>
              <p className="mb-8 font-[family-name:var(--mono)] text-[12px] uppercase leading-relaxed tracking-[1px] text-[var(--color-ink3)]">
                Drop your photo. Pick a trending style.<br/> Get your portrait in ~20 seconds.
              </p>
              
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
              
              {/* SHIMMERING BUTTON */}
              <Link href="/sign-up" className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 py-4 font-bold tracking-wide text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,0,0,0.15)]">
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <span className="relative z-10">Create Free Account</span>
              </Link>

              <button 
                onClick={() => setShowAuthModal(false)}
                className="mt-5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline"
              >
                Maybe later, let me explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST DETAIL LAYOUT */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link href="/explore" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 w-fit">
             ← Back to Explore
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          
          {/* LEFT: The Big Image */}
          <div className="w-full md:w-[55%] bg-gray-100 flex items-center justify-center relative min-h-[400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image_url} alt="Aesthetic" className="w-full h-auto object-contain" />
          </div>

          {/* RIGHT: The Details & Actions */}
          <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={handleShare} className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={handleCollab}
                  disabled={isPending || isMine}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-6 py-2.5 rounded-full font-bold text-sm transition-colors disabled:opacity-50"
                >
                  <Users size={16} />
                  {isMine ? "YOUR ASSET" : "COLLAB"}
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.style_name || "Aesthetic Generation"}</h1>
              
              {post.prompt_used && (
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{post.prompt_used}</p>
              )}

              {/* NEW TIMESTAMP INJECTED HERE */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8 font-[family-name:var(--mono)]">
                <Clock size={12} />
                <span>Posted {timeAgo(post.created_at)}</span>
              </div>

              {/* Creator Info & Follow Button */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <Link href={`/u/${displayUsername}`} className="flex items-center gap-3 group">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {post.profile_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.profile_image_url} alt={displayUsername} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-bold">{displayUsername.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:underline flex items-center gap-1">
                      {displayUsername}
                      <span className="text-blue-500">✓</span>
                    </p>
                    <p className="text-xs text-gray-500">{followersCount} followers</p>
                  </div>
                </Link>

                {!isMine && (
                  <button 
                    onClick={handleFollow}
                    disabled={isPending}
                    className={`px-5 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="mt-8 flex items-center gap-6 border-t border-gray-100 pt-6">
              <button 
                onClick={handleLike}
                disabled={isPending || isMine}
                className="flex items-center gap-2 group"
              >
                <Heart size={24} className={`${likesCount > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'} transition-colors`} />
                <span className="font-bold text-lg text-gray-700">{likesCount}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-400">
                <Eye size={22} />
                <span className="font-medium text-md text-gray-500">{post.views_count}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}