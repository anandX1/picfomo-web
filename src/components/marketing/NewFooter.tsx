import Link from "next/link";

export default function NewFooter({ setActivePage }: { setActivePage: (p: string) => void }) {
  return (
    <footer className="border-t border-white/5 py-16 relative z-50 brand-gold-glow brand-gold-glow--footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-gold)] rounded-full flex items-center justify-center font-bold text-black">P</div>
              <span className="text-lg font-bold tracking-tight text-white display-font">picfomo<span className="text-[var(--color-gold)]">.com</span></span>
            </div>
            <p className="text-gray-200/70 text-sm mt-2 leading-relaxed">
              The fastest way to generate studio-grade AI portraits and remix viral aesthetics—without prompts.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest text-[10px]">Product</h4>
            <ul className="flex flex-col gap-3">
              <li><button onClick={() => setActivePage('home')} className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition text-left">Styles</button></li>
              <li><button onClick={() => setActivePage('feed')} className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition text-left">Creator Feed</button></li>
              <li><button onClick={() => setActivePage('pricing')} className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition text-left">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest text-[10px]">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition">About Us</Link></li>
              <li><Link href="#" className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition">Careers</Link></li>
              <li><Link href="#" className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest text-[10px]">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-200/70 hover:text-[var(--color-gold)] text-sm transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-200/60 text-xs">© 2026 PicFOMO. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-200/60 hover:text-white transition">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
