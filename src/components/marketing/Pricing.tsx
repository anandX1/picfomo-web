import Link from "next/link";

export default function Pricing() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="pricing">
      
      {/* Header Area */}
      <div className="mb-8 flex flex-col items-center text-center md:mb-12">
        <div className="mb-4 flex items-center justify-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
          <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
          Simple pricing
          <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        </div>
        <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-page-text)]">
          START FREE.<br />
          UPGRADE WHEN<br />
          YOU LOVE IT.
        </h2>
        <p className="max-w-[480px] text-[14px] font-light leading-[1.75] text-[var(--color-ink3)]">
          5 free portraits every single day. No credit card. No catch. Upgrade when you want more — or never.
        </p>
      </div>

      {/* Pricing Grid: Stacks on mobile, 3-columns on desktop */}
      <div className="grid grid-cols-1 gap-[1px] border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-3">
        
        {/* --- FREE TIER --- */}
        <div className="group relative bg-[var(--color-page-bg)] p-8 transition-all duration-200 hover:bg-[var(--color-cream)] md:p-9">
          <div className="mb-1 font-[family-name:var(--display)] text-[28px] tracking-[0.5px] text-[var(--color-page-text)]">FREE</div>
          <div className="mb-1 font-[family-name:var(--display)] text-[48px] leading-none text-[var(--color-gold)]">₹0</div>
          <div className="mb-5 font-[family-name:var(--mono)] text-[10px] text-[var(--color-ink3)]">forever free · no card needed</div>
          
          <div className="my-5 h-[1px] bg-[var(--rule)]"></div>
          
          <ul className="mb-8 flex flex-col gap-3">
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> 5 portraits per day</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> All trending styles</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> Share to WhatsApp & Insta</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-ink3)]">—</span> Watermark on downloads</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-ink3)]">—</span> No 4K upscale</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-ink3)]">—</span> Standard queue priority</li>
          </ul>
          
          <Link href="/sign-up?plan=free" className="block w-full border-[1.5px] border-[var(--color-page-text)] bg-transparent py-3.5 text-center font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-page-text)] transition-all duration-200 hover:bg-[var(--color-page-text)] hover:text-[var(--color-gold-light)]">
            START FREE
          </Link>
        </div>

        {/* --- CREATOR TIER (Most Popular) --- */}
        <div className="group relative bg-[var(--color-page-text)] p-8 transition-all duration-200 hover:bg-[#1a1a15] md:p-9">
          <div className="absolute right-5 top-[-1px] bg-[var(--color-gold)] px-3 py-1 font-[family-name:var(--mono)] text-[8px] uppercase tracking-[2px] text-[var(--color-page-text)]">
            Most Popular
          </div>
          <div className="mb-1 font-[family-name:var(--display)] text-[28px] tracking-[0.5px] text-white">CREATOR</div>
          <div className="mb-1 font-[family-name:var(--display)] text-[48px] leading-none text-[var(--color-gold-light)]">₹149</div>
          <div className="mb-5 font-[family-name:var(--mono)] text-[10px] text-[rgba(255,255,255,0.4)]">per month · ₹1,199/year (save 33%)</div>
          
          <div className="my-5 h-[1px] bg-[rgba(255,255,255,0.08)]"></div>
          
          <ul className="mb-8 flex flex-col gap-3">
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[var(--color-gold-light)]">✓</span> 30 portraits per day</li>
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[var(--color-gold-light)]">✓</span> No watermark</li>
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[var(--color-gold-light)]">✓</span> No ads ever</li>
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[var(--color-gold-light)]">✓</span> Early style access (+24h)</li>
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[var(--color-gold-light)]">✓</span> Priority queue</li>
            <li className="flex items-start gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><span className="text-[12px] text-[rgba(255,255,255,0.2)]">—</span> No 4K upscale</li>
          </ul>
          
          <Link href="/sign-up?plan=creator" className="block w-full border-[1.5px] border-[var(--color-gold)] bg-[var(--color-gold)] py-3.5 text-center font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-page-text)] transition-all duration-200 hover:bg-[var(--color-gold-light)] hover:border-[var(--color-gold-light)] shadow-[0_4px_14px_rgba(200,151,31,0.25)]">
            GET CREATOR →
          </Link>
        </div>

        {/* --- PRO TIER --- */}
        <div className="group relative bg-[var(--color-page-bg)] p-8 transition-all duration-200 hover:bg-[var(--color-cream)] md:p-9">
          <div className="mb-1 font-[family-name:var(--display)] text-[28px] tracking-[0.5px] text-[var(--color-page-text)]">PRO</div>
          <div className="mb-1 font-[family-name:var(--display)] text-[48px] leading-none text-[var(--color-gold)]">₹499</div>
          <div className="mb-5 font-[family-name:var(--mono)] text-[10px] text-[var(--color-ink3)]">per month · ₹3,999/year</div>
          
          <div className="my-5 h-[1px] bg-[var(--rule)]"></div>
          
          <ul className="mb-8 flex flex-col gap-3">
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> Unlimited portraits</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> No watermark</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> Zero ads</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> 4K ESRGAN upscale</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> Commercial use rights</li>
            <li className="flex items-start gap-2 text-[13px] text-[var(--color-ink2)]"><span className="text-[12px] text-[var(--color-grn)]">✓</span> Highest queue priority</li>
          </ul>
          
          <Link href="/sign-up?plan=pro" className="block w-full border-[1.5px] border-[var(--color-page-text)] bg-transparent py-3.5 text-center font-[family-name:var(--display)] text-[16px] tracking-[1.5px] text-[var(--color-page-text)] transition-all duration-200 hover:bg-[var(--color-page-text)] hover:text-[var(--color-gold-light)]">
            GET PRO
          </Link>
        </div>

      </div>
    </section>
  );
}