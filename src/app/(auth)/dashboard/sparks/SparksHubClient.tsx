"use client";

import { useState, useTransition, useEffect } from "react";
// 🌟 FIX: Added 'Sparkles' to the import list!
import { Zap, Gift, ArrowUpRight, ArrowDownRight, CheckCircle, Star, Share2, Loader2, TrendingUp, List, Target, Users, Copy, Flame, ExternalLink, Sparkles } from "lucide-react";
import { claimDailyLogin, completeTask, processReferral, claimDividends } from "@/actions/economy";
import { toast } from "sonner";

interface Props {
  balance: number;
  unclaimedSparks: number; 
  transactions: any[];
  hasClaimedDaily: boolean;
  currentStreak: number; // 🌟 NEW: Wired up to use the real database streak
  availableTasks: any[]; 
  earnedFromLikes: number;
  earnedFromRemixes: number;
  referralCode: string;
  friendsJoined: number;
  referralEarnings: number;
}

function BountyCard({ task }: { task: any }) {
  const [isPending, startTransition] = useTransition();
  const [sliderValue, setSliderValue] = useState(15);
  const [textInput, setTextInput] = useState("");

  const handleClaim = () => {
    if (task.task_type === 'survey' && !textInput) return toast.error("Please enter your feedback.");
    
    startTransition(async () => {
      const dataToSubmit = task.task_type === 'survey' 
        ? JSON.stringify({ slider: sliderValue, text: textInput }) 
        : "Clicked Link";

      const res = await completeTask(task.id, dataToSubmit);
      if (res.success) toast.success(`Bounty Claimed! +${task.reward_amount} ⚡ added.`);
      else toast.error(res.message);
    });
  };

  return (
    <div className="rounded-[20px] border border-[var(--rule)] bg-[var(--color-cream)] p-6 shadow-[var(--shadow-sm)] relative overflow-hidden mb-4 transition-all hover:shadow-[var(--shadow-md)] hover:border-[var(--color-gold-border)]">
      <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-black font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] px-4 py-1.5 font-bold rounded-bl-xl shadow-sm">
        Reward: +{task.reward_amount} ⚡
      </div>
      
      <div className="flex items-center gap-3 mb-2 pr-24">
        {task.task_type === 'link' ? <ExternalLink className="text-[var(--color-gold)]" size={24} /> : <Target className="text-[var(--color-gold)]" size={24} />}
        <h3 className="font-[family-name:var(--display)] text-xl text-[var(--color-ink)] tracking-tight">{task.title}</h3>
      </div>
      
      <p className="text-[13px] text-[var(--color-ink2)] mb-6 leading-relaxed">
        {task.description}
      </p>

      {task.task_type === 'survey' && (
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-[var(--color-white)] p-4 rounded-xl border border-[var(--rule)]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Value</label>
              <span className="text-md font-bold text-[var(--color-gold)]">{sliderValue}</span>
            </div>
            <input 
              type="range" min="1" max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-cream2)] rounded-lg appearance-none cursor-pointer accent-[var(--color-gold)]" 
            />
          </div>
          <input 
            type="text" 
            placeholder="Feedback / Contact info..." 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full rounded-xl border border-[var(--rule)] bg-[var(--color-white)] p-3 text-[13px] text-[var(--color-ink)] focus:border-[var(--color-gold)] focus:outline-none"
          />
        </div>
      )}

      {task.task_type === 'link' && task.action_url && (
        <div className="mb-6">
          <a href={task.action_url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] text-[12px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
            Open Link <ArrowUpRight size={14} />
          </a>
        </div>
      )}

      <button 
        onClick={handleClaim}
        disabled={isPending}
        className="w-full rounded-xl bg-[var(--color-ink)] py-3.5 font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-white)] shadow-md disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : `Complete & Claim +${task.reward_amount} ⚡`}
      </button>
    </div>
  );
}

export default function SparksHubClient({ balance, unclaimedSparks, transactions, hasClaimedDaily, currentStreak, availableTasks, earnedFromLikes, earnedFromRemixes, referralCode, friendsJoined, referralEarnings }: Props) {
  const [activeTab, setActiveTab] = useState<"ledger" | "quests" | "referrals">("quests");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedRef = localStorage.getItem("picfomo_ref");
    if (savedRef) {
      const timer = setTimeout(() => {
        startTransition(async () => {
          const res = await processReferral(savedRef);
          if (res?.message === "syncing") return;
          if (res?.success || res?.message === "Already used a code" || res?.message === "Self referral" || res?.message === "Invalid code") {
            localStorage.removeItem("picfomo_ref");
          }
          if (res?.success) toast.success("Referral applied! +20 Bonus Sparks added.");
        });
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimDaily = () => {
    startTransition(async () => {
      const res = await claimDailyLogin();
      if (res?.success === false) {
        toast.error(res.message);
      } else {
        toast.success(`Daily Drop Claimed! +${res?.reward || 5} ⚡`);
      }
    });
  };

  const handleHarvest = () => {
    startTransition(async () => {
      const res = await claimDividends();
      if (res?.success) toast.success(`Harvested +${res.claimedAmount} ⚡ to your wallet!`);
      else toast.error(res.message);
    });
  };

  const fullReferralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/join?ref=${referralCode}` 
    : `https://picfomo.com/join?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(fullReferralLink);
    toast.success("Referral link copied!");
  };

  // Ledger Calculations: Properly maps negative generation transactions when present
  const recentEarned = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const recentSpent = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8 animate-in fade-in duration-500 text-[var(--color-ink)]">
      
      {/* HEADER & BALANCE */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[var(--rule)] pb-6">
        <div>
          <h1 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] flex items-center gap-3">
            <Zap className="text-[var(--color-gold)]" size={32} /> Sparks Hub
          </h1>
          <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[2px] text-[var(--color-ink3)]">
            Your creative energy. Earn, spend, and track.
          </p>
        </div>
        
        {/* PREMIUM BLACK CARD: Hardcoded hex colors so it acts as an exclusive card regardless of theme */}
        <div className="flex items-center gap-4 rounded-[20px] bg-[#0a0a0a] px-8 py-5 shadow-xl border border-[#222] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-gold)] opacity-15 blur-2xl rounded-full"></div>
          <div className="flex flex-col relative z-10">
            <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] opacity-90">Total Balance</span>
            <span className="font-[family-name:var(--display)] text-5xl text-[#ffffff] tracking-tight">{balance}</span>
          </div>
          <Zap size={48} className="fill-[var(--color-gold)] text-[var(--color-gold)] opacity-20 relative z-10 ml-4" />
        </div>
      </div>

      {/* TABS: Adaptive background & hover states */}
      <div className="flex bg-[var(--color-cream)] p-1.5 rounded-xl w-full md:w-fit border border-[var(--rule)] shadow-sm mb-8">
        <button onClick={() => setActiveTab("quests")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-xs font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "quests" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink)] opacity-50 hover:opacity-100"}`}>
          <Target size={14} /> Quests
        </button>
        <button onClick={() => setActiveTab("ledger")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-xs font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "ledger" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink)] opacity-50 hover:opacity-100"}`}>
          <List size={14} /> Ledger
        </button>
        <button onClick={() => setActiveTab("referrals")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-xs font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "referrals" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink)] opacity-50 hover:opacity-100"}`}>
          <Users size={14} /> Referrals
        </button>
      </div>

      {/* TAB CONTENT: QUESTS */}
      {activeTab === "quests" && (
        <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="flex flex-col gap-6">
            <section>
              <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3 flex items-center gap-2">
                <Flame size={14} className="text-orange-500" /> Daily Streak
              </h2>
              <div className={`rounded-xl border p-6 transition-all ${hasClaimedDaily ? 'border-[var(--rule)] bg-[var(--color-cream)]' : 'border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${hasClaimedDaily ? 'bg-[var(--color-white)] border border-[var(--rule)]' : 'bg-white shadow-sm border border-yellow-200'}`}>
                      {hasClaimedDaily ? <CheckCircle size={20} className="text-green-600" /> : <Gift size={20} className="text-[var(--color-gold)]" />}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--display)] text-[16px] tracking-wide text-[var(--color-ink)]">Daily Login Drop</h3>
                      <p className="text-[12px] font-[family-name:var(--mono)] text-[var(--color-ink3)]">+5 Sparks for showing up.</p>
                    </div>
                  </div>
                  {hasClaimedDaily ? (
                    <span className="font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[1px] text-green-600 flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                      <CheckCircle size={12} /> Claimed
                    </span>
                  ) : (
                    <button 
                      onClick={handleClaimDaily}
                      disabled={isPending}
                      className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-white)] shadow-md transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 size={14} className="animate-spin" /> : "Claim +5 ⚡"}
                    </button>
                  )}
                </div>
                <div className="mt-5 pt-5 border-t border-[var(--rule)]">
                  <div className="flex gap-1.5 w-full">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day} className={`h-2 flex-1 rounded-full ${day <= currentStreak ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-[var(--rule)]'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink3)] uppercase tracking-[2px]">{currentStreak} Day Streak</span>
                    <span className="text-[10px] font-[family-name:var(--mono)] font-bold text-orange-500 uppercase tracking-[1px] flex items-center gap-1">Day 7 Bonus: +20 ⚡</span>
                  </div>
                </div>
              </div>
            </section>

            {unclaimedSparks > 0 && (
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-yellow-500 to-amber-600 p-6 shadow-lg animate-in zoom-in-95 duration-500 border border-yellow-400/50">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 blur-2xl rounded-full"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-[family-name:var(--mono)] text-[14px] font-black text-black uppercase tracking-[1px] flex items-center gap-2"><Sparkles size={16}/> Pending Sparks</h3>
                    <p className="text-amber-950 text-[13px] mt-1 font-medium">Your viral styles generated hits while you were away!</p>
                  </div>
                  <button 
                    onClick={handleHarvest}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-gold)] transition-transform hover:scale-105 shadow-xl disabled:opacity-70 disabled:hover:scale-100 whitespace-nowrap"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : `Claim +${unclaimedSparks} ⚡`}
                  </button>
                </div>
              </div>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)]">The Creator Dividend</h2>
                <span className="flex items-center gap-1 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] text-green-600 font-bold bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/20">
                  <TrendingUp size={12} /> Today: +{earnedFromLikes + earnedFromRemixes} ⚡
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-[16px] border border-[var(--rule)] bg-[var(--color-cream)] p-5 hover:border-[var(--color-gold-border)] transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <Star size={20} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)] uppercase tracking-wider">Get Liked</h3>
                      <p className="text-[11px] text-[var(--color-ink2)] mt-0.5">Earned Today: +{earnedFromLikes} ⚡</p>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--mono)] text-[12px] font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20">+1 ⚡ / like</span>
                </div>
                <div className="flex items-center justify-between rounded-[16px] border border-[var(--rule)] bg-[var(--color-cream)] p-5 hover:border-[var(--color-gold-border)] transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)] uppercase tracking-wider">Get Remixed</h3>
                      <p className="text-[11px] text-[var(--color-ink2)] mt-0.5">Earned Today: +{earnedFromRemixes} ⚡</p>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--mono)] text-[12px] font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20">+2 ⚡ / remix</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: DYNAMIC BOUNTIES */}
          <div className="flex flex-col">
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3 flex items-center gap-2">
              <Target size={14} className={availableTasks.length > 0 ? "text-[var(--color-gold)]" : "text-[var(--color-ink3)]"} /> Active Bounties
            </h2>
            
            {availableTasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {availableTasks.map(task => (
                  <BountyCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
               <div className="rounded-[20px] border-2 border-dashed border-[var(--rule)] bg-[var(--color-white)] p-12 flex flex-col items-center justify-center text-center mt-2">
                 <Target size={32} className="text-[var(--color-ink3)] mb-4" />
                 <h3 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)] mb-2">All Caught Up</h3>
                 <p className="text-[13px] text-[var(--color-ink2)] max-w-xs font-light">You've claimed all available bounties. Check back later for more ways to earn Sparks.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEDGER */}
      {activeTab === "ledger" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--color-cream)] rounded-[20px] border border-[var(--rule)] p-6 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-[family-name:var(--mono)] text-[var(--color-ink3)] uppercase tracking-[2px] font-bold mb-2">Recent Earned</span>
              <span className="font-[family-name:var(--display)] text-4xl text-green-600">+{recentEarned} <span className="text-xl opacity-50 text-[var(--color-gold)] font-sans">⚡</span></span>
            </div>
            <div className="bg-[var(--color-cream)] rounded-[20px] border border-[var(--rule)] p-6 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-[family-name:var(--mono)] text-[var(--color-ink3)] uppercase tracking-[2px] font-bold mb-2">Recent Spent</span>
              <span className="font-[family-name:var(--display)] text-4xl text-red-500">-{recentSpent} <span className="text-xl opacity-50 text-[var(--color-gold)] font-sans">⚡</span></span>
            </div>
          </div>

          <section>
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3">Transaction History</h2>
            <div className="rounded-[20px] border border-[var(--rule)] bg-[var(--color-white)] overflow-hidden shadow-[var(--shadow-sm)]">
              
              {transactions.length === 0 ? (
                <div className="p-16 text-center text-[var(--color-ink3)] flex flex-col items-center">
                  <List size={40} className="mb-4 opacity-50" />
                  <p className="font-[family-name:var(--mono)] text-[12px] uppercase tracking-widest font-bold">No transactions yet.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--rule)]">
                  {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-5 hover:bg-[var(--color-cream2)] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 border ${tx.amount > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                          {tx.amount > 0 ? <ArrowUpRight size={20} className="text-green-600" /> : <ArrowDownRight size={20} className="text-red-500" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-[family-name:var(--mono)] text-[14px] font-bold text-[var(--color-ink)] uppercase tracking-wider">{tx.reason}</span>
                          <span className="text-[11px] text-[var(--color-ink3)] font-medium mt-1">
                            {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`font-[family-name:var(--display)] text-2xl tracking-tight ${tx.amount > 0 ? 'text-green-600' : 'text-[var(--color-ink)]'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB CONTENT: REFERRALS */}
      {activeTab === "referrals" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto mt-8">
          <div className="bg-[var(--color-cream)] border border-[var(--rule)] rounded-[32px] p-8 md:p-12 text-center shadow-[var(--shadow-lg)] relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-gold)] to-orange-500"></div>
            
            <div className="w-24 h-24 bg-[var(--color-white)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--rule)]">
              <Users size={40} className="text-[var(--color-gold)]" />
            </div>
            
            <h2 className="font-[family-name:var(--display)] text-5xl text-[var(--color-ink)] mb-4 tracking-tight">Invite & Earn</h2>
            <p className="text-[15px] text-[var(--color-ink2)] mb-10 leading-relaxed max-w-md mx-auto font-light">
              Give your friends a head start. When they sign up using your link, they get <strong className="text-[var(--color-ink)] font-bold">55 Sparks</strong>, and you earn a permanent <strong className="text-[var(--color-ink)] font-bold">+35 Sparks</strong>.
            </p>
            
            <div className="bg-[var(--color-white)] border border-[var(--rule)] rounded-xl p-2.5 flex items-center justify-between shadow-inner group">
              <div className="px-4 font-[family-name:var(--mono)] text-[12px] text-[var(--color-ink)] truncate max-w-[200px] md:max-w-xs select-all">
                {fullReferralLink}
              </div>
              <button 
                onClick={copyReferralLink}
                className="bg-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-black text-[var(--color-white)] rounded-lg px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-md"
              >
                <Copy size={14} /> Copy Link
              </button>
            </div>
            
            <div className="mt-10 pt-10 border-t border-[var(--rule)] flex justify-around">
              <div className="text-center">
                <span className="block font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] mb-1">{friendsJoined}</span>
                <span className="text-[10px] font-[family-name:var(--mono)] uppercase font-bold text-[var(--color-ink3)] tracking-[2px]">Friends Joined</span>
              </div>
              <div className="text-center">
                <span className="block font-[family-name:var(--display)] text-4xl text-green-600 mb-1">+{referralEarnings}</span>
                <span className="text-[10px] font-[family-name:var(--mono)] uppercase font-bold text-[var(--color-ink3)] tracking-[2px]">Sparks Earned</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}