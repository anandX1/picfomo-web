"use client";

import { useState, useTransition } from "react";
import { Grid, Shield, Flame, Award, Link as LinkIcon, Share2, Users, Heart, BadgeCheck, Zap, X, Crown, Star } from "lucide-react";
import { toggleFollow } from "@/actions/social";
import { likePost, mockRemixPost } from "@/actions/economy";
import Link from "next/link";
import { toast } from "sonner";
import { UserStatus } from "@/utils/badges";

interface Props {
  user: any;
  publicImages: any[];
  totalLikes: number;
  isOwner: boolean;
  userStatus: UserStatus;
  initialIsFollowing: boolean;
  initialFollowersCount: number;
  currentUserId: string | null;
}

export default function ProfileClient({ 
  user, publicImages, totalLikes, isOwner, userStatus, initialIsFollowing, initialFollowersCount, currentUserId 
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [activeTab, setActiveTab] = useState<"posts" | "collabs">("posts");

  if (!user) return null;

  const handleFollow = () => {
    if (!currentUserId) return setShowAuthModal(true);
    if (isOwner) return toast.info("You can't follow yourself!");

    startTransition(async () => {
      setIsFollowing(!isFollowing);
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
      const res = await toggleFollow(user.id);
      if (!res.success) {
        setIsFollowing(isFollowing);
        setFollowersCount(followersCount);
        toast.error(res.message);
      }
    });
  };

  const handleShareProfile = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${user.display_name || user.username} on PicFOMO`, url });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Profile link copied!");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUserId) return setShowAuthModal(true);
    startTransition(async () => {
      const res = await likePost(postId);
      if (res.success) toast.success("Liked!");
      else toast.error(res.message);
    });
  };

  const handleCollab = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUserId) return setShowAuthModal(true);
    startTransition(async () => {
      const res = await mockRemixPost(postId);
      if (res.success) toast.success("Collab Started!");
      else toast.error(res.message);
    });
  };

  // Support for the new rare icons
  const renderBadgeIcon = (iconName: string) => {
    if (iconName === 'shield') return <Shield size={14} />;
    if (iconName === 'flame') return <Flame size={14} />;
    if (iconName === 'award') return <Award size={14} />;
    if (iconName === 'zap') return <Zap size={14} />;
    if (iconName === 'crown') return <Crown size={14} />;
    if (iconName === 'star') return <Star size={14} />;
    return <Award size={14} />;
  };

  const displayTitle = user.display_name || user.username;

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      
      {/* AUTH MODAL */}
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
              <Link href="/sign-up" className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 py-4 font-bold tracking-wide text-white transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,0,0,0.15)]">
                <span className="relative z-10">Create Free Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mb-12 max-w-3xl mx-auto mt-8">
        
        {/* Left: Huge Avatar */}
        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        {/* Right: Info */}
        <div className="flex flex-col items-center md:items-start w-full">
          
          {/* Row 1: Name, TICKS & Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-1.5">
              {displayTitle}
              {/* THE RPG TICK SYSTEM */}
              {userStatus.tick === 'bronze' && <BadgeCheck className="w-5 h-5 text-[#cd7f32] fill-[#cd7f32] drop-shadow-sm" style={{ color: 'white' }} />}
              {userStatus.tick === 'silver' && <BadgeCheck className="w-5 h-5 text-[#94a3b8] fill-[#94a3b8] drop-shadow-sm" style={{ color: 'white' }} />}
              {userStatus.tick === 'gold' && <BadgeCheck className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'platinum' && <BadgeCheck className="w-5 h-5 text-[#38bdf8] fill-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'emerald' && <BadgeCheck className="w-5 h-5 text-[#34d399] fill-[#34d399] drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'ruby' && <BadgeCheck className="w-5 h-5 text-[#e11d48] fill-[#e11d48] drop-shadow-[0_0_12px_rgba(225,29,72,0.8)] animate-pulse" style={{ color: 'white' }} />}
              {userStatus.tick === 'diamond' && <BadgeCheck className="w-5 h-5 text-[#818cf8] fill-[#818cf8] drop-shadow-[0_0_15px_rgba(129,140,248,1)] animate-pulse" style={{ color: 'white' }} />}
            </h1>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {isOwner ? (
                <>
                  <Link href="/dashboard/settings" className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Edit Profile</Link>
                  <Link href="/dashboard/vault" className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">View Vault</Link>
                </>
              ) : (
                <button 
                  onClick={handleFollow} 
                  disabled={isPending}
                  className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isFollowing ? 'border border-gray-200 text-gray-700 bg-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              <button onClick={handleShareProfile} className="p-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Row 2: Username */}
          <p className="text-gray-500 text-sm mb-4">@{user.username}</p>

          {/* Row 3: Stats */}
          <div className="flex items-center gap-6 mb-4 text-[15px]">
            <span><strong className="font-semibold text-gray-900">{publicImages.length}</strong> posts</span>
            <span><strong className="font-semibold text-gray-900">{followersCount}</strong> followers</span>
            <span><strong className="font-semibold text-gray-900">0</strong> collabs</span>
          </div>

          {/* Row 4: Modular Badges (Top 3 Only) */}
          {userStatus.badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
              {userStatus.badges.map((b) => (
                <span key={b.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${b.bg} ${b.color}`}>
                  {renderBadgeIcon(b.icon)} {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Row 5: Bio & Link */}
          {user.bio && (
            <p className="text-gray-800 text-sm mb-3 leading-relaxed text-center md:text-left">{user.bio}</p>
          )}
          {user.website && (
            <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-blue-600 font-medium hover:underline">
              <LinkIcon size={14} /> {user.website.replace(/^https?:\/\//, '')}
            </a>
          )}

        </div>
      </div>

      {/* CUSTOM TABS */}
      <div className="flex justify-center border-t border-gray-200 mb-8 max-w-3xl mx-auto relative">
        <button 
          onClick={() => setActiveTab('posts')} 
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest uppercase border-t-[2px] -mt-[1px] transition-colors ${activeTab === 'posts' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <Grid size={14} /> Posts
        </button>
        <button 
          onClick={() => setActiveTab('collabs')} 
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest uppercase border-t-[2px] -mt-[1px] transition-colors ${activeTab === 'collabs' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          <Users size={14} /> Collabs
        </button>
      </div>

      {/* GRID */}
      {activeTab === 'collabs' ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No Collabs Yet</h3>
        </div>
      ) : publicImages.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Grid size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No posts yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4 max-w-4xl mx-auto">
          {publicImages.map((p) => (
            <Link key={p.id} href={`/post/${p.id}`} className="aspect-square relative group overflow-hidden block bg-gray-100">
              
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              
              {/* EXACT HOVER OVERLAY FROM SCREENSHOT */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                
                {/* Center Icons */}
                <div className="flex items-center gap-6 text-white font-bold text-lg">
                  <button onClick={(e) => handleLike(p.id, e)} className="flex items-center gap-2 hover:scale-110 transition-transform">
                    <Heart size={24} className="fill-white" /> 
                    {p.likes_count || 0}
                  </button>
                  <button onClick={(e) => { e.preventDefault(); /* Open share logic */ }} className="hover:scale-110 transition-transform">
                    <Share2 size={22} />
                  </button>
                </div>

                {/* Collab Button Below */}
                <button 
                  onClick={(e) => handleCollab(p.id, e)}
                  disabled={isPending || isOwner}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-5 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  <Users size={14} />
                  Collab
                </button>
              </div>

              {/* Bottom Left Badge */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide">
                {p.style_name || 'Aesthetic'}
              </div>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
}