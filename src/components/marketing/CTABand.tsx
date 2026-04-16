import Link from "next/link";

export default function CTABand() {
  return (
    <div className="relative overflow-hidden bg-[var(--color-ink)] px-6 py-20 text-center md:px-10 md:py-24">
      {/* Massive Background Text Effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-[family-name:var(--display)] text-[120px] tracking-[-4px] text-[rgba(255,255,255,0.03)] md:text-[200px]">
        PicFOMO
      </div>

      <div className="relative z-10 mx-auto max-w-[600px]">
        <div className="mb-4 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[rgba(255,255,255,0.3)]">
          Start for free · No credit card
        </div>
        
        <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(40px,6vw,80px)] leading-[0.88] text-white">
          YOUR BEST <span className="text-[var(--color-gold-light)]">DP</span><br />
          IS 20 SECONDS AWAY.
        </h2>
        
        <p className="mb-8 text-[14px] font-light leading-[1.75] text-[rgba(255,255,255,0.4)]">
          5 free portraits every day. No sign-up friction. Drop your photo and see what we mean.
        </p>
        
        <Link 
          href="/sign-up" 
          className="inline-flex items-center gap-2.5 bg-[var(--color-gold)] px-8 py-4 font-[family-name:var(--display)] text-[18px] tracking-[2px] text-[var(--color-ink)] shadow-[0_4px_24px_rgba(200,151,31,0.3)] transition-all hover:-translate-y-1 hover:bg-[var(--color-gold-light)] hover:shadow-[0_8px_32px_rgba(200,151,31,0.4)]"
        >
          Create Your Portrait Free <span>→</span>
        </Link>
        
        <div className="mt-4 font-[family-name:var(--mono)] text-[11px] text-[rgba(255,255,255,0.25)]">
          No credit card · 5 free daily · Results in ~20 seconds
        </div>
      </div>
    </div>
  );
}