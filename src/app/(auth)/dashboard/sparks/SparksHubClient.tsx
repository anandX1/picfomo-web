"use client";

import { useState, useTransition, useEffect } from "react";
import { Zap, Gift, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, Star, Share2, Crown, Loader2, TrendingUp, List, Target, Users, Copy, Flame, ExternalLink } from "lucide-react";
// ADDED claimDividends HERE:
import { claimDailyLogin, completeTask, processReferral, claimDividends } from "@/actions/economy";
import { toast } from "sonner";

interface Props {
  balance: number;
  unclaimedSparks: number; // NEW PROP
  transactions: any[];
  hasClaimedDaily: boolean;
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
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm relative overflow-hidden mb-4">
      <div className="absolute top-0 right-0 bg-blue-500 text-white font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] px-4 py-1.5 font-bold rounded-bl-xl shadow-sm">
        Reward: +{task.reward_amount} ⚡
      </div>
      
      <div className="flex items-center gap-3 mb-2 pr-24">
        {task.task_type === 'link' ? <ExternalLink className="text-blue-500" size={24} /> : <Target className="text-blue-500" size={24} />}
        <h3 className="font-[family-name:var(--display)] text-xl text-[var(--color-ink)] tracking-tight">{task.title}</h3>
      </div>
      
      <p className="text-[12px] text-gray-600 mb-6 leading-relaxed">
        {task.description}
      </p>

      {task.task_type === 'survey' && (
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-gray-500">Value</label>
              <span className="text-md font-bold text-blue-600">{sliderValue}</span>
            </div>
            <input 
              type="range" min="1" max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
          </div>
          <input 
            type="text" 
            placeholder="Feedback / Contact info..." 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-[12px] focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      {task.task_type === 'link' && task.action_url && (
        <div className="mb-6">
          <a href={task.action_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[12px] font-medium flex items-center gap-1">
            Open Link <ArrowUpRight size={14} />
          </a>
        </div>
      )}

      <button 
        onClick={handleClaim}
        disabled={isPending}
        className="w-full rounded-xl bg-[var(--color-ink)] py-3.5 font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-gold)] shadow-md disabled:opacity-50 hover:bg-gray-900 transition-all flex justify-center items-center gap-2"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : `Complete & Claim +${task.reward_amount} ⚡`}
      </button>
    </div>
  );
}

// ADDED unclaimedSparks HERE
export default function SparksHubClient({ balance, unclaimedSparks, transactions, hasClaimedDaily, availableTasks, earnedFromLikes, earnedFromRemixes, referralCode, friendsJoined, referralEarnings }: Props) {
  const [activeTab, setActiveTab] = useState<"ledger" | "quests" | "referrals">("quests");
  const [isPending, startTransition] = useTransition();

  // THE MAGIC: Secretly checks if they were invited and processes it!
  useEffect(() => {
    const savedRef = localStorage.getItem("picfomo_ref");
    if (savedRef) {
      // RACE CONDITION FIX: Wait 2 seconds so the Webhook can finish saving the user
      const timer = setTimeout(() => {
        startTransition(async () => {
          const res = await processReferral(savedRef);
          
          // If the server says the user is still syncing, DO NOT delete the code. Let it retry next refresh.
          if (res?.message === "syncing") {
            console.log("Waiting for Webhook to finish sync...");
            return;
          }

          // If it processes (success or already used/invalid), clear it out
          if (res?.success || res?.message === "Already used a code" || res?.message === "Self referral" || res?.message === "Invalid code") {
            localStorage.removeItem("picfomo_ref");
          }
          
          if (res?.success) {
            toast.success("Referral applied! +20 Bonus Sparks added.");
          }
        });
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimDaily = () => {
    startTransition(async () => {
      const res = await claimDailyLogin();
      if (res?.success === false) toast.error(res.message);
      else toast.success("Daily Drop Claimed! +5 ⚡");
    });
  };

  // THE NEW HARVEST FUNCTION
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

  const recentEarned = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const recentSpent = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const currentStreak = hasClaimedDaily ? 1 : 0; 

  return (
    <div className="mx-auto max-w-[1200px] p-6 md:p-12">
      
      {/* HEADER & BALANCE */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] flex items-center gap-3">
            <Zap className="text-[var(--color-gold)]" size={32} /> Sparks Hub
          </h1>
          <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[1px] text-[var(--color-ink2)]">
            Your creative energy. Earn, spend, and track.
          </p>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 px-8 py-4 shadow-xl border border-gray-800 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-gold)] opacity-10 blur-2xl rounded-full"></div>
          <div className="flex flex-col relative z-10">
            <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px] text-[var(--color-gold)] opacity-90">Total Balance</span>
            <span className="font-[family-name:var(--display)] text-5xl text-white tracking-tight">{balance}</span>
          </div>
          <Zap size={48} className="fill-[var(--color-gold)] text-[var(--color-gold)] opacity-20 relative z-10 ml-4" />
        </div>
      </div>

      {/* MODERN TAB NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-200/50 rounded-xl w-full md:w-fit mb-8 border border-gray-200">
        <button 
          onClick={() => setActiveTab("quests")}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] transition-all duration-300 ${activeTab === 'quests' ? 'bg-white text-[var(--color-ink)] shadow-sm scale-100' : 'text-gray-500 hover:text-gray-900 scale-95'}`}
        >
          <Target size={14} /> Quests
        </button>
        <button 
          onClick={() => setActiveTab("ledger")}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] transition-all duration-300 ${activeTab === 'ledger' ? 'bg-white text-[var(--color-ink)] shadow-sm scale-100' : 'text-gray-500 hover:text-gray-900 scale-95'}`}
        >
          <List size={14} /> Ledger
        </button>
        <button 
          onClick={() => setActiveTab("referrals")}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] transition-all duration-300 ${activeTab === 'referrals' ? 'bg-white text-[var(--color-ink)] shadow-sm scale-100' : 'text-gray-500 hover:text-gray-900 scale-95'}`}
        >
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
              <div className={`rounded-xl border p-5 transition-all ${hasClaimedDaily ? 'border-[var(--rule)] bg-gray-50/50' : 'border-[var(--color-gold)] bg-[var(--color-gold-pale)] shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${hasClaimedDaily ? 'bg-white' : 'bg-white shadow-sm'}`}>
                      {hasClaimedDaily ? <CheckCircle size={18} className="text-green-600" /> : <Gift size={18} className="text-[var(--color-gold)]" />}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)]">Daily Login Drop</h3>
                      <p className="text-[11px] text-[var(--color-ink2)]">+5 Sparks for showing up.</p>
                    </div>
                  </div>
                  {hasClaimedDaily ? (
                    <span className="font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[1px] text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle size={12} /> Claimed
                    </span>
                  ) : (
                    <button 
                      onClick={handleClaimDaily}
                      disabled={isPending}
                      className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-gold)] transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 size={14} className="animate-spin" /> : "Claim +5 ⚡"}
                    </button>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--rule)]">
                  <div className="flex gap-1.5 w-full">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day} className={`h-2 flex-1 rounded-full ${day <= currentStreak ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{currentStreak} Day Streak</span>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">Day 7 Bonus: +20 ⚡</span>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW: THE HARVEST BANNER */}
            {unclaimedSparks > 0 && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-yellow-500 p-5 shadow-lg animate-in zoom-in-95 duration-500">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-20 blur-2xl rounded-full"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--mono)] text-[14px] font-bold text-white uppercase tracking-[1px]">Pending Sparks</h3>
                    <p className="text-yellow-50 text-[12px] mt-1 font-medium">Your styles generated hits while you were away!</p>
                  </div>
                  <button 
                    onClick={handleHarvest}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1.5px] text-yellow-600 transition-transform hover:scale-105 shadow-md disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : `Claim +${unclaimedSparks} ⚡`}
                  </button>
                </div>
              </div>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)]">The Creator Dividend</h2>
                <span className="flex items-center gap-1 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                  <TrendingUp size={12} /> Today: +{earnedFromLikes + earnedFromRemixes} ⚡
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl border border-[var(--rule)] bg-white p-5 hover:border-gray-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <Star size={18} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)]">Get Liked</h3>
                      <p className="text-[11px] text-[var(--color-ink2)]">Earned Today: +{earnedFromLikes} ⚡</p>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--mono)] text-[13px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">+1 ⚡ / like</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[var(--rule)] bg-white p-5 hover:border-gray-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      <Share2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)]">Get Remixed</h3>
                      <p className="text-[11px] text-[var(--color-ink2)]">Earned Today: +{earnedFromRemixes} ⚡</p>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--mono)] text-[13px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">+2 ⚡ / remix</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: DYNAMIC BOUNTIES */}
          <div className="flex flex-col">
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3 flex items-center gap-2">
              <Target size={14} className={availableTasks.length > 0 ? "text-blue-500" : "text-gray-400"} /> Active Bounties
            </h2>
            
            {availableTasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {availableTasks.map(task => (
                  <BountyCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
               <div className="rounded-2xl border border-dashed border-gray-300 bg-transparent p-12 flex flex-col items-center justify-center text-center mt-2">
                 <Target size={32} className="text-gray-300 mb-3" />
                 <h3 className="font-[family-name:var(--display)] text-xl text-gray-500 mb-1">All Caught Up</h3>
                 <p className="text-[12px] text-gray-400 max-w-xs">You've claimed all available bounties. Check back later for more ways to earn Sparks.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEDGER */}
      {activeTab === "ledger" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[var(--rule)] p-5 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-[family-name:var(--mono)] text-gray-500 uppercase tracking-widest font-bold mb-1">Recent Earned</span>
              <span className="text-3xl font-bold text-green-600">+{recentEarned} <span className="text-lg opacity-50">⚡</span></span>
            </div>
            <div className="bg-white rounded-xl border border-[var(--rule)] p-5 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-[family-name:var(--mono)] text-gray-500 uppercase tracking-widest font-bold mb-1">Recent Spent</span>
              <span className="text-3xl font-bold text-red-500">-{recentSpent} <span className="text-lg opacity-50">⚡</span></span>
            </div>
          </div>

          <section>
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3">Transaction History</h2>
            <div className="rounded-xl border border-[var(--rule)] bg-white overflow-hidden shadow-sm">
              
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <List size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No transactions yet.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--rule)]">
                  {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          {tx.amount > 0 ? <ArrowUpRight size={18} className="text-green-700" /> : <ArrowDownRight size={18} className="text-red-700" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-[family-name:var(--mono)] text-[13px] font-bold text-[var(--color-ink)]">{tx.reason}</span>
                          <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`font-[family-name:var(--display)] text-xl tracking-tight ${tx.amount > 0 ? 'text-green-600' : 'text-[var(--color-ink)]'}`}>
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
          <div className="bg-white border border-[var(--rule)] rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-gold)] to-yellow-500"></div>
            
            <div className="w-20 h-20 bg-[var(--color-gold-pale)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
              <Users size={32} className="text-[var(--color-gold)]" />
            </div>
            
            <h2 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] mb-4 tracking-tight">Invite & Earn</h2>
            <p className="text-[14px] text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
              Give your friends a head start. When they sign up using your link, they get <strong>55 Sparks</strong>, and you earn a permanent <strong>+35 Sparks</strong>.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 flex items-center justify-between shadow-inner group">
              <div className="px-4 font-[family-name:var(--mono)] text-[12px] text-gray-600 truncate max-w-[200px] md:max-w-xs select-all">
                {fullReferralLink}
              </div>
              <button 
                onClick={copyReferralLink}
                className="bg-[var(--color-ink)] hover:bg-gray-800 text-white rounded-lg px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 group-hover:shadow-md"
              >
                <Copy size={14} /> Copy Link
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-around">
              <div className="text-center">
                <span className="block font-[family-name:var(--display)] text-3xl text-gray-900">{friendsJoined}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Friends Joined</span>
              </div>
              <div className="text-center">
                <span className="block font-[family-name:var(--display)] text-3xl text-green-600">+{referralEarnings}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sparks Earned</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}