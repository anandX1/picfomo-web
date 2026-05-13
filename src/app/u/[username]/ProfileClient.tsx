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
    <div className="mx-auto max-w-5xl p-4 md:p-8 animate-in fade-in duration-500 text-[var(--color-page-text)]">
      
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

      {/* 🌟 HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mb-12 max-w-3xl mx-auto mt-4 md:mt-8">
        
        {/* Left: Huge Avatar with premium ring */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full p-1.5 border border-[var(--rule)] bg-[var(--color-cream)] shadow-[var(--shadow-sm)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-[var(--color-cream2)] border border-[var(--rule)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Right: Info */}
        <div className="flex flex-col items-center md:items-start w-full">
          
          {/* Row 1: Name, TICKS & Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2 w-full">
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--display)] text-[var(--color-page-text)] flex items-center gap-2 tracking-tight">
              {displayTitle}
              {/* THE RPG TICK SYSTEM */}
              {userStatus.tick === 'bronze' && <BadgeCheck className="w-6 h-6 text-[#cd7f32] fill-[#cd7f32] drop-shadow-sm" style={{ color: 'white' }} />}
              {userStatus.tick === 'silver' && <BadgeCheck className="w-6 h-6 text-[#94a3b8] fill-[#94a3b8] drop-shadow-sm" style={{ color: 'white' }} />}
              {userStatus.tick === 'gold' && <BadgeCheck className="w-6 h-6 text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'platinum' && <BadgeCheck className="w-6 h-6 text-[#38bdf8] fill-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'emerald' && <BadgeCheck className="w-6 h-6 text-[#34d399] fill-[#34d399] drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ color: 'white' }} />}
              {userStatus.tick === 'ruby' && <BadgeCheck className="w-6 h-6 text-[#e11d48] fill-[#e11d48] drop-shadow-[0_0_12px_rgba(225,29,72,0.8)] animate-pulse" style={{ color: 'white' }} />}
              {userStatus.tick === 'diamond' && <BadgeCheck className="w-6 h-6 text-[#818cf8] fill-[#818cf8] drop-shadow-[0_0_15px_rgba(129,140,248,1)] animate-pulse" style={{ color: 'white' }} />}
            </h1>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-auto">
              {isOwner ? (
                <>
                  <Link href="/dashboard/settings" className="px-5 py-2 border border-[var(--rule)] bg-[var(--color-cream)] rounded-xl font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-page-text)] hover:bg-[var(--color-cream2)] transition-colors shadow-sm">Edit Profile</Link>
                  <Link href="/dashboard/vault" className="px-5 py-2 border border-[var(--rule)] bg-[var(--color-cream)] rounded-xl font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-page-text)] hover:bg-[var(--color-cream2)] transition-colors shadow-sm">View Vault</Link>
                </>
              ) : (
                <button 
                  onClick={handleFollow} 
                  disabled={isPending}
                  className={`px-6 py-2 rounded-xl font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] transition-all shadow-sm disabled:opacity-50 ${isFollowing ? 'border border-[var(--rule)] bg-[var(--color-cream)] text-[var(--color-page-text)] hover:bg-[var(--color-cream2)]' : 'bg-[var(--color-page-text)] text-[var(--color-page-bg)] hover:bg-[var(--color-gold)] hover:text-black'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              <button onClick={handleShareProfile} className="p-2 border border-[var(--rule)] bg-[var(--color-cream)] rounded-xl text-[var(--color-page-text)] hover:bg-[var(--color-cream2)] transition-colors shadow-sm">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Row 2: Username */}
          <p className="text-[var(--color-ink3)] font-[family-name:var(--mono)] text-[13px] mb-5 tracking-wide">@{user.username}</p>

          {/* Row 3: Stats */}
          <div className="flex items-center gap-8 mb-6 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[1.5px] text-[var(--color-ink3)]">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-[family-name:var(--display)] tracking-normal text-[var(--color-page-text)] mb-0.5 leading-none">{publicImages.length}</span>
              <span className="font-bold">Posts</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-[family-name:var(--display)] tracking-normal text-[var(--color-page-text)] mb-0.5 leading-none">{followersCount}</span>
              <span className="font-bold">Followers</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-[family-name:var(--display)] tracking-normal text-[var(--color-page-text)] mb-0.5 leading-none">0</span>
              <span className="font-bold">Collabs</span>
            </div>
          </div>

          {/* Row 4: Modular Badges (Top 3 Only) */}
          {userStatus.badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
              {userStatus.badges.map((b) => (
                <span key={b.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1.5px] shadow-sm border border-white/10 ${b.bg} ${b.color}`}>
                  {renderBadgeIcon(b.icon)} {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Row 5: Bio & Link */}
          {user.bio && (
            <p className="text-[var(--color-ink2)] text-[14px] mb-3 leading-relaxed text-center md:text-left max-w-lg font-medium">{user.bio}</p>
          )}
          {user.website && (
            <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-1.5 text-[13px] text-[var(--color-gold)] font-bold tracking-wide hover:underline hover:text-[var(--color-gold-light)] transition-colors">
              <LinkIcon size={14} /> {user.website.replace(/^https?:\/\//, '')}
            </a>
          )}

        </div>
      </div>

      {/* 🌟 CUSTOM TABS */}
      <div className="flex justify-center border-t border-[var(--rule)] mb-8 max-w-4xl mx-auto relative">
        <button 
          onClick={() => setActiveTab('posts')} 
          className={`flex items-center gap-2 px-8 py-5 text-[11px] font-[family-name:var(--mono)] font-bold tracking-[2px] uppercase border-t-[2px] -mt-[1px] transition-colors ${activeTab === 'posts' ? 'border-[var(--color-page-text)] text-[var(--color-page-text)]' : 'border-transparent text-[var(--color-ink3)] hover:text-[var(--color-page-text)]'}`}
        >
          <Grid size={14} /> Posts
        </button>
        <button 
          onClick={() => setActiveTab('collabs')} 
          className={`flex items-center gap-2 px-8 py-5 text-[11px] font-[family-name:var(--mono)] font-bold tracking-[2px] uppercase border-t-[2px] -mt-[1px] transition-colors ${activeTab === 'collabs' ? 'border-[var(--color-page-text)] text-[var(--color-page-text)]' : 'border-transparent text-[var(--color-ink3)] hover:text-[var(--color-page-text)]'}`}
        >
          <Users size={14} /> Collabs
        </button>
      </div>

      {/* 🌟 GRID CONTENT */}
      {activeTab === 'collabs' ? (
        <div className="text-center py-24 text-[var(--color-ink3)]">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-[family-name:var(--display)] tracking-wide">No Collabs Yet</h3>
        </div>
      ) : publicImages.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-ink3)]">
          <Grid size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-[family-name:var(--display)] tracking-wide">No Posts Yet</h3>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 md:gap-4 max-w-5xl mx-auto pb-20">
          {publicImages.map((p, index) => (
            <div key={p.id} className="break-inside-avoid mb-3 md:mb-4">
              <Link href={`/post/${p.id}`} className="aspect-auto relative group overflow-hidden block bg-[var(--color-cream2)] rounded-2xl shadow-sm border border-[var(--rule)]">
                
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt="Post" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading={index < 4 ? "eager" : "lazy"} />
                
                {/* 🌟 EXACT HOVER OVERLAY: Fixed Hex Colors to ensure high contrast over images regardless of theme */}
                <div className="absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-5">
                  
                  {/* Center Icons */}
                  <div className="flex items-center gap-6 text-[#FFFFFF] font-bold text-lg">
                    <button onClick={(e) => handleLike(p.id, e)} className="flex items-center gap-2 hover:scale-110 transition-transform">
                      <Heart size={24} className="fill-[#FFFFFF] text-[#FFFFFF] drop-shadow-md" /> 
                      <span className="drop-shadow-md">{p.likes_count || 0}</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); /* Open share logic */ }} className="hover:scale-110 transition-transform">
                      <Share2 size={22} className="text-[#FFFFFF] drop-shadow-md" />
                    </button>
                  </div>

                  {/* Collab Button Below */}
                  <button 
                    onClick={(e) => handleCollab(p.id, e)}
                    disabled={isPending || isOwner}
                    className="flex items-center gap-2 bg-[#FFFFFF]/20 hover:bg-[#FFFFFF]/30 backdrop-blur-md border border-[#FFFFFF]/40 text-[#FFFFFF] px-6 py-2 rounded-full text-xs font-[family-name:var(--mono)] tracking-[1px] uppercase font-bold transition-colors disabled:opacity-50 shadow-lg"
                  >
                    <Users size={14} className="text-[#FFFFFF]" /> Collab
                  </button>
                </div>

                {/* Bottom Left Badge (Always visible, hex locked) */}
                <div className="absolute bottom-3 left-3 bg-[#000000]/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-[family-name:var(--mono)] uppercase font-bold text-[#FFFFFF] tracking-[1.5px] border border-[#FFFFFF]/10 shadow-sm pointer-events-none">
                  {p.style_name || 'Aesthetic'}
                </div>

              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}