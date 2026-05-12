"use client";

export default function NewPricing() {
  return (
    <section className="bg-[#030303] py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="text-center mb-16">
          <h2 className="font-extrabold mb-4 display-font type-h2 text-balance text-white">Simple, transparent pricing</h2>
          <p className="text-gray-300/80 max-w-2xl mx-auto type-lead text-balance">
            Start free with Sparks. Upgrade when you want more generations, higher resolution, and premium styles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 flex flex-col hover:border-white/10 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
            <p className="text-gray-300/70 text-sm mb-6">Try the studio, test a few styles, share your first look.</p>
            <div className="mb-8"><span className="text-4xl font-extrabold text-white">$0</span><span className="text-gray-500">/mo</span></div>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="text-gray-500 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                5 Free Sparks daily
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="text-gray-500 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                Standard Resolution
              </li>
            </ul>
            <button className="fluid-btn fluid-btn-dark w-full py-3 rounded-xl font-bold">
              <span className="fluid-btn-bg"></span>
              <span className="fluid-text-wrapper">
                <span className="fluid-text fluid-text-top">Get Started</span>
                <span className="fluid-text fluid-text-bottom">Get Started</span>
              </span>
            </button>
          </div>

          {/* Creator Tier */}
          <div className="bg-[#151515] border border-[var(--color-gold)] rounded-[2rem] p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.25)] transition-all">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
            <h3 className="text-xl font-bold text-[var(--color-gold)] mb-2">Creator Tier</h3>
            <p className="text-gray-300/70 text-sm mb-6">For daily creators: more Sparks, premium output, and better visibility.</p>
            <div className="mb-8"><span className="text-4xl font-extrabold text-white">$12</span><span className="text-gray-500">/mo</span></div>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="text-[var(--color-gold)] w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                500 Sparks per month
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="text-[var(--color-gold)] w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                4K Ultra-HD Resolution
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <svg className="text-[var(--color-gold)] w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                No watermarks
              </li>
            </ul>
            <button className="fluid-btn fluid-btn-gold w-full py-3 rounded-xl font-bold">
              <span className="fluid-btn-bg"></span>
              <span className="fluid-text-wrapper">
                <span className="fluid-text fluid-text-top">Subscribe Now</span>
                <span className="fluid-text fluid-text-bottom">Subscribe Now</span>
              </span>
            </button>
          </div>

          {/* API Access */}
          <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 flex flex-col hover:border-white/10 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">API Access</h3>
            <p className="text-gray-400 text-sm mb-6">Build our engine into your app.</p>
            <div className="mb-8"><span className="text-4xl font-extrabold text-white">Pay as you go</span></div>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="text-gray-500 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                $0.02 per successful generation
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="text-gray-500 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 
                Unlimited API calls
              </li>
            </ul>
            <button className="fluid-btn fluid-btn-dark w-full py-3 rounded-xl font-bold">
              <span className="fluid-btn-bg"></span>
              <span className="fluid-text-wrapper">
                <span className="fluid-text fluid-text-top">View Docs</span>
                <span className="fluid-text fluid-text-bottom">View Docs</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
