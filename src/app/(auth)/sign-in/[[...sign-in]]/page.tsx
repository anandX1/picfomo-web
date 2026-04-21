import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-cream)] p-6 relative overflow-hidden">
      
      {/* 🌟 CUSTOM ANIMATIONS FOR THE AUTH PAGE ONLY */}
      <style>{`
        @keyframes ai-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-ai-scan {
          animation: ai-scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 10s linear infinite;
        }
      `}</style>

      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[100px] animate-pulse"></div>

      {/* 🌟 PREMIUM AI LOADING ANIMATION & LOGO */}
      <div className="relative mb-10 flex flex-col items-center z-10">
        
        {/* Outer Glowing Ring (Rotating Aura) */}
        <div className="absolute top-0 h-[56px] w-[180px] rounded-2xl bg-gradient-to-r from-[var(--color-gold-light)] via-amber-500 to-orange-500 opacity-30 blur-xl animate-slow-spin"></div>

        <Link href="/" className="relative flex h-[56px] w-[180px] items-center justify-center rounded-xl bg-[var(--color-ink)] shadow-2xl border border-white/10 overflow-hidden transition-transform hover:scale-105 active:scale-95">

          {/* The AI Scanner Laser */}
          <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-[30%] bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent opacity-20 animate-ai-scan"></div>
          </div>

          {/* Actual Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo2.png"
            alt="PicFOMO"
            className="relative z-10 h-[24px] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          />
        </Link>

        {/* Fake System Status / Loading Text */}
        <div className="mt-6 flex items-center gap-2.5 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--rule)] shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-gold)]"></span>
          </span>
          <span className="font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-ink2)]">
            Initializing Your Dashboard...
          </span>
        </div>

      </div>

      {/* Clerk Component with slide-in animation */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: '#111009',
              colorBackground: '#FAFAF8',
              colorText: '#111009',
              borderRadius: '0px',
            },
            elements: {
              card: "shadow-[var(--shadow-lg)] border border-[var(--rule)]",
              formButtonPrimary: "bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] text-[14px] tracking-[1px] font-bold uppercase border border-[var(--color-ink)]",
              footerActionLink: "text-[var(--color-gold)] hover:text-[var(--color-ink)]",
            }
          }}
        />
      </div>
    </div>
  );
}