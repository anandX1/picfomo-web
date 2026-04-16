"use client";

import { useState, useEffect, useTransition } from "react";
import { X, Flame, Zap, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { fetchStoryStats } from "@/actions/story";

export default function StoryLogo() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ sparks: 0, totalLikes: 0, totalPosts: 0 });
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    if (isPending) return;
    startTransition(async () => {
      const data = await fetchStoryStats();
      setStats(data);
      setCurrentSlide(0);
      setProgress(0);
      setIsOpen(true);
    });
  };

  const slides = [
    {
      id: "intro",
      bg: "bg-[#0a0a0a]",
      content: (
        <div className="flex flex-col items-center text-center px-6 w-full">
          <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 rounded-full opacity-20 blur-xl"></div>
            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-full flex items-center justify-center shadow-2xl">
              <Zap size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
          </div>
          <h2 className="font-[family-name:var(--display)] text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4 tracking-tight leading-tight">
            Creative<br/>Energy
          </h2>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-xs mt-4">Initializing Matrix...</p>
        </div>
      )
    },
    {
      id: "stats",
      bg: "bg-[#050510]",
      content: (
        <div className="flex flex-col items-center text-center px-6 w-full">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <TrendingUp size={40} className="text-indigo-400" />
          </div>
          <h2 className="font-[family-name:var(--display)] text-7xl text-white mb-2 drop-shadow-lg">
            {stats.totalLikes}
          </h2>
          <span className="text-lg text-indigo-400 font-[family-name:var(--mono)] uppercase tracking-[0.2em] mb-10 font-bold">Total Likes</span>
          
          <div className="w-full bg-white/5 rounded-3xl p-6 backdrop-blur-xl border border-white/10">
            <p className="text-gray-300 font-medium text-lg">Generated across <span className="text-white font-bold">{stats.totalPosts}</span> epic styles.</p>
          </div>
        </div>
      )
    },
    {
      id: "sparks",
      bg: "bg-[#100505]",
      content: (
        <div className="flex flex-col items-center text-center px-6 w-full">
          <Flame size={64} className="text-orange-500 mb-8 drop-shadow-[0_0_25px_rgba(249,115,22,0.6)] animate-pulse" />
          <h2 className="font-[family-name:var(--display)] text-3xl text-gray-300 mb-2">Wallet Power</h2>
          <div className="text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 mb-12 drop-shadow-2xl leading-none">
            {stats.sparks}<span className="text-6xl text-orange-500">⚡</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-50"
          >
            Keep Building <ChevronRight size={18} />
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < slides.length - 1) {
            setCurrentSlide((s) => s + 1);
            return 0;
          } else {
            setIsOpen(false);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isOpen, currentSlide, slides.length]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
      setProgress(0);
    } else setIsOpen(false);
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
      setProgress(0);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer-gold {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slow-bg-shift {
          0% { background-size: 100% 100%; background-position: center; }
          50% { background-size: 150% 150%; background-position: top left; }
          100% { background-size: 100% 100%; background-position: center; }
        }
      `}</style>

      {/* THE SUPREME STATUS LOGO (Your exact old component structure with the new premium UI) */}
      <button 
        onClick={handleOpen}
        disabled={isPending}
        className="group relative p-[4px] rounded-[16px] transition-all hover:scale-105 disabled:opacity-70 flex items-center justify-center overflow-hidden shadow-xl"
      >
        {/* THE THICK FLOWING RING */}
        <div 
          className="absolute inset-0 opacity-100 transition-opacity group-hover:opacity-90"
          style={{
            background: 'linear-gradient(270deg, #facc15, #fef3c7, #fb923c, #fef3c7)',
            backgroundSize: '800% 800%',
            animation: 'shimmer-gold 6s ease infinite'
          }}
        />
        
        {/* THE CORE: Shifting Deep Black/Amber Radial Gradient */}
        <div 
          className="relative z-10 px-5 py-2.5 rounded-[12px] w-full h-full flex items-center justify-center border border-white/10 shadow-inner"
          style={{
            background: 'radial-gradient(circle at center, #1a1508 0%, #050505 100%)',
            animation: 'slow-bg-shift 8s ease-in-out infinite'
          }}
        >
          {isPending ? (
            <Loader2 size={22} className="animate-spin text-amber-500" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src="/logo.png" 
              alt="PicFOMO" 
              className="h-5 md:h-6 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
            />
          )}
        </div>
      </button>

      {/* STORY MODAL UI (Remains pristine) */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-200">
          <div className={`relative w-full h-full max-w-md ${slides[currentSlide].bg} transition-colors duration-700 overflow-hidden flex flex-col`}>
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1.5 p-4 pt-safe">
              {slides.map((_, index) => (
                <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all ease-linear" style={{ width: index === currentSlide ? `${progress}%` : index < currentSlide ? '100%' : '0%' }} />
                </div>
              ))}
            </div>
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-4 z-[60] p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full backdrop-blur-md">
              <X size={24} />
            </button>
            <div className="absolute inset-0 z-50 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
              <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
            </div>
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              {slides[currentSlide].content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}