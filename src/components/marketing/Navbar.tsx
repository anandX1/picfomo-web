import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b border-[var(--rule)] bg-[rgba(250,250,248,0.92)] px-5 backdrop-blur-md md:px-10">
      
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 outline-none">
          <div className="flex h-[30px] w-[30px] items-center justify-center bg-[var(--color-ink)] font-[family-name:var(--display)] text-[13px] tracking-[1px] text-[var(--color-gold-light)]">
            PF
          </div>
          <div className="font-[family-name:var(--display)] text-[21px] tracking-[2.5px] text-[var(--color-ink)]">
            PICFOMO
          </div>
        </Link>
      </div>

      {/* Center Links (Hidden on Mobile) */}
      <div className="hidden gap-8 md:flex">
        <Link href="#styles" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">Styles</Link>
        <Link href="#how-it-works" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">How it works</Link>
        <Link href="#pricing" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">Pricing</Link>
        <Link href="/creators" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">For Creators</Link>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        <Link href="/sign-in" className="text-[12px] font-medium text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">
          Sign in
        </Link>
        <Link href="/sign-up" className="bg-[var(--color-ink)] px-5 py-2 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-gold-light)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]">
          TRY FREE →
        </Link>
      </div>
      
    </nav>
  );
}