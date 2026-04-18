"use client";

import { Star, MessageCircle, Quote } from "lucide-react";

// 🌟 THE HYPE FEED: More human, realistic, and culturally relevant copy.
const REVIEWS_ROW_1 = [
  {
    id: 1,
    name: "Rahul",
    handle: "@rahul_dev",
    avatar: "from-blue-500 to-cyan-400",
    text: "ngl I was skeptical but this just saved me $300 on a corporate photographer. updated my linkedin 5 mins ago and my boss actually complimented it.",
  },
  {
    id: 2,
    name: "Priya",
    handle: "@priyacreates",
    avatar: "from-pink-500 to-rose-400",
    text: "the ghibli style is actually insane?? it didn't just paste my face, it kept my exact jawline. my group chat is losing it rn.",
  },
  {
    id: 3,
    name: "Karan",
    handle: "@karan_v",
    avatar: "from-amber-500 to-orange-400",
    text: "bro my mom thought I went to italy for the weekend 💀 the old money filter is way too realistic.",
  },
  {
    id: 4,
    name: "Aisha",
    handle: "@aishadesigns",
    avatar: "from-purple-500 to-indigo-400",
    text: "using this for my clothing brand. dropping my model's face into different cyberpunk worlds. literal infinite content glitch.",
  }
];

const REVIEWS_ROW_2 = [
  {
    id: 5,
    name: "Vikram",
    handle: "@vikram_eth",
    avatar: "from-emerald-500 to-teal-400",
    text: "Finally an AI that doesn't make me look like a plastic video game character. The texture on the marble statue one is crazy.",
  },
  {
    id: 6,
    name: "Sneha",
    handle: "@sneha_tech",
    avatar: "from-fuchsia-500 to-pink-500",
    text: "I used the blurry 90s photo restorer on a pic of my grandparents and actually cried. How is this even possible?",
  },
  {
    id: 7,
    name: "Dev",
    handle: "@dev_lifts",
    avatar: "from-slate-600 to-gray-800",
    text: "the action figure try-on is so tough. literally looks like a $500 custom collectible of myself.",
  },
  {
    id: 8,
    name: "Maya",
    handle: "@maya.lens",
    avatar: "from-yellow-400 to-amber-500",
    text: "as a creator the phase 2 flywheel sounds insane. building my own aesthetic styles right now to farm those sparks early.",
  }
];

// Duplicate arrays for the infinite seamless loop
const SCROLL_ROW_1 = [...REVIEWS_ROW_1, ...REVIEWS_ROW_1];
const SCROLL_ROW_2 = [...REVIEWS_ROW_2, ...REVIEWS_ROW_2];

export default function SocialProof() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 md:py-32" id="testimonials">
      
      {/* 🌟 CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }
      `}</style>

      {/* Decorative Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[120px]"></div>

      {/* Header Area */}
      <div className="relative z-10 mx-auto mb-16 flex max-w-[1120px] flex-col items-center px-6 text-center md:mb-20">
        <div className="mb-4 flex items-center justify-center gap-3 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[4px] text-[var(--color-gold)]">
          <MessageCircle size={14} className="text-[var(--color-gold)]" />
          [ THE WALL OF FOMO ]
        </div>
        <h2 className="mb-6 font-[family-name:var(--display)] text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-[-0.5px] text-white">
          DON'T JUST TAKE<br />
          OUR WORD FOR IT.
        </h2>
        <p className="max-w-[500px] text-[15px] md:text-[18px] font-light leading-[1.7] text-gray-400">
          Thousands of people are already upgrading their digital identity. Read the timeline.
        </p>
      </div>

      {/* 🌟 INFINITE SCROLLING ROWS */}
      <div className="relative z-10 flex flex-col gap-6 md:gap-8">
        
        {/* Row 1 (Scrolls Left) */}
        <div className="flex w-max animate-marquee-left gap-6 hover:[animation-play-state:paused] px-3">
          {SCROLL_ROW_1.map((review, idx) => (
            <ReviewCard key={`row1-${idx}`} review={review} />
          ))}
        </div>

        {/* Row 2 (Scrolls Right) */}
        <div className="flex w-max animate-marquee-right gap-6 hover:[animation-play-state:paused] px-3">
          {SCROLL_ROW_2.map((review, idx) => (
            <ReviewCard key={`row2-${idx}`} review={review} />
          ))}
        </div>

      </div>

      {/* Fade masks for the edges of the screen to make it look like they are fading in/out */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 md:w-32 bg-gradient-to-r from-[var(--color-ink)] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 md:w-32 bg-gradient-to-l from-[var(--color-ink)] to-transparent"></div>

    </section>
  );
}

// Sub-component for the individual review cards
function ReviewCard({ review }: { review: any }) {
  return (
    <div className="relative w-[300px] md:w-[400px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-[var(--color-gold-border)]">
      
      {/* Quote Icon Background */}
      <Quote size={80} className="absolute -right-4 -top-4 text-white/5 rotate-12" />

      {/* User Info Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Simulated colorful avatar */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatar} text-[14px] font-bold text-white shadow-inner`}>
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="font-[family-name:var(--display)] text-[15px] tracking-[0.5px] text-white">
              {review.name}
            </div>
            <div className="font-[family-name:var(--mono)] text-[11px] text-gray-400">
              {review.handle}
            </div>
          </div>
        </div>
        
        {/* Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="fill-[var(--color-gold)] text-[var(--color-gold)]" />
          ))}
        </div>
      </div>

      {/* The Review Content */}
      <p className="relative z-10 text-[14px] md:text-[15px] font-light leading-[1.6] text-gray-300">
        "{review.text}"
      </p>

    </div>
  );
}