export interface BadgeDef {
  id: string;
  icon: 'shield' | 'flame' | 'award' | 'zap' | 'crown' | 'star';
  label: string;
  color: string;
  bg: string;
  rarity: number; 
}

export interface UserStatus {
  tick: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'emerald' | 'ruby' | 'diamond';
  badges: BadgeDef[];
}

export function calculateUserStatus(
  joinRank: number,
  totalCreations: number,
  totalLikes: number,
  followersCount: number
): UserStatus {
  
  // 1. THE RPG TICK SYSTEM
  let tick: UserStatus['tick'] = 'none';
  if (followersCount >= 1000000) tick = 'diamond';
  else if (followersCount >= 100000) tick = 'ruby';
  else if (followersCount >= 10000) tick = 'emerald';
  else if (followersCount >= 1000) tick = 'platinum';
  else if (followersCount >= 100) tick = 'gold';
  else if (followersCount >= 50) tick = 'silver';
  else if (followersCount >= 10) tick = 'bronze'; // The first achievable dopamine hit!

  const badges: BadgeDef[] = [];

  // 2. JOIN RANK BADGES (Now with glowing gradients & glassmorphism)
  if (joinRank <= 100) {
    badges.push({ 
      id: 'rank_100', icon: 'crown', label: 'Top 100', rarity: 100,
      bg: 'bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-white/40', 
      color: 'text-white drop-shadow-md' 
    });
  } else if (joinRank <= 1000) {
    badges.push({ 
      id: 'rank_1k', icon: 'shield', label: 'Top 1K', rarity: 80,
      bg: 'bg-gradient-to-br from-slate-300 to-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.5)] border border-white/40', 
      color: 'text-white drop-shadow-md' 
    });
  } else if (joinRank <= 10000) {
    badges.push({ 
      id: 'rank_10k', icon: 'shield', label: 'Top 10K', rarity: 50,
      bg: 'bg-gradient-to-br from-orange-400 to-rose-400 shadow-[0_0_10px_rgba(249,115,22,0.4)] border border-white/30', 
      color: 'text-white drop-shadow-md' 
    });
  }

  // 3. VIRALITY BADGES (Animated vibes)
  if (totalLikes >= 1000) {
    badges.push({ 
      id: 'legend', icon: 'star', label: 'Legend', rarity: 95,
      bg: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-white/50 animate-pulse', 
      color: 'text-white font-black tracking-widest' 
    });
  } else if (totalLikes >= 100) {
    badges.push({ 
      id: 'viral', icon: 'flame', label: 'Viral', rarity: 75,
      bg: 'bg-gradient-to-br from-red-500 to-orange-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-white/30', 
      color: 'text-white drop-shadow-md' 
    });
  } else if (totalLikes >= 10) {
    badges.push({ 
      id: 'rising', icon: 'award', label: 'Rising', rarity: 30,
      bg: 'bg-gradient-to-br from-blue-400 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.4)] border border-white/30', 
      color: 'text-white drop-shadow-md' 
    });
  }

  // 4. CREATOR BADGES
  if (totalCreations >= 100) {
    badges.push({ 
      id: 'master', icon: 'zap', label: 'Master', rarity: 85,
      bg: 'bg-gradient-to-br from-violet-600 to-indigo-700 shadow-[0_0_15px_rgba(109,40,217,0.5)] border border-white/30', 
      color: 'text-white drop-shadow-md' 
    });
  } else if (totalCreations >= 10) {
    badges.push({ 
      id: 'prolific', icon: 'zap', label: 'Creator', rarity: 40,
      bg: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.4)] border border-white/30', 
      color: 'text-white drop-shadow-md' 
    });
  }

  // Sort descending by rarity, limit to 3
  badges.sort((a, b) => b.rarity - a.rarity);
  
  return {
    tick,
    badges: badges.slice(0, 3)
  };
}