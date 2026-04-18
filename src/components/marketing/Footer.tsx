import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--color-cream)] px-6 pb-8 pt-12 md:px-10">
      <div className="mx-auto max-w-[1120px]">
        
        {/* Top Grid */}
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-10">
          
          {/* 🌟 NEW BRAND LOGO */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-5 inline-block outline-none transition-opacity hover:opacity-80">
              <div className="flex h-[36px] items-center justify-center rounded-md bg-[var(--color-ink)] px-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.png" 
                  alt="PicFOMO" 
                  className="h-[18px] w-auto object-contain" 
                />
              </div>
            </Link>
            <p className="max-w-[180px] text-[11px] leading-[1.6] text-[var(--color-ink3)]">
              India's AI portrait platform. Your face. 47 worlds. Every week something new.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <div className="mb-4 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[3px] text-[var(--color-ink3)]">Product</div>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#styles" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">All Styles</Link></li>
              <li><Link href="#how-it-works" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">How it works</Link></li>
              <li><Link href="#pricing" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Pricing</Link></li>
              <li><Link href="/creators" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Creator Programme</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <div className="mb-4 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[3px] text-[var(--color-ink3)]">Company</div>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">About</Link></li>
              <li><Link href="/blog" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Blog</Link></li>
              <li><Link href="/careers" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Careers</Link></li>
              <li><Link href="/contact" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <div className="mb-4 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[3px] text-[var(--color-ink3)]">Legal</div>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/privacy" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Terms of Service</Link></li>
              <li><Link href="/dpdp" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">DPDP Compliance</Link></li>
              <li><Link href="/contact" className="text-[12px] text-[var(--color-ink2)] transition-colors hover:text-[var(--color-gold)]">Grievance Officer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-5">
          <div className="font-[family-name:var(--mono)] text-[11px] text-[var(--color-ink3)]">
            © 2026 PicFOMO · Made in India 🇮🇳
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-[11px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-gold)]">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-gold)]">Terms</Link>
            <Link href="/sitemap.xml" className="text-[11px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-gold)]">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}