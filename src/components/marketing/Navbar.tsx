import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] flex h-[64px] items-center justify-between border-b border-[var(--rule)] bg-[var(--color-white)]/90 px-5 backdrop-blur-md md:px-10">
      
      {/* 🌟 BRAND LOGO */}
      <div className="flex items-center">
        <Link href="/" className="inline-block outline-none transition-transform hover:scale-105 active:scale-95">
          {/* 🌟 FIX: Locked background to bg-black so it doesn't invert in Dark Mode */}
          <div className="flex h-[38px] items-center justify-center rounded-lg bg-black px-3.5 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="PicFOMO" 
              className="h-[22px] w-auto object-contain drop-shadow-sm" 
            />
          </div>
        </Link>
      </div>

      {/* 🌟 OPTIMIZED CENTER LINKS (Hidden on Mobile) */}
      <div className="hidden gap-8 md:flex">
        {/* "Styles" is now a stealthy conversion link to Sign Up */}
        <Link href="/sign-up" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">
          Styles
        </Link>
        
        {/* Anchors down to the Video Section */}
        <Link href="#how-it-works" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">
          How it works
        </Link>
        
        {/* Replaced "Pricing/For Creators" with an anchor down to the Bento Box explanation */}
        <Link href="#features" className="text-[12px] font-medium tracking-[0.3px] text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">
          Creator Economy
        </Link>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="text-[12px] font-medium text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]">
          Sign in
        </Link>
        {/* 🌟 FIX: Updated to text-[var(--color-white)] so it flips to Black text on White bg in Dark Mode! */}
        <Link href="/sign-up" className="rounded-md bg-[var(--color-ink)] px-5 py-2 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-white)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:shadow-md">
          TRY FREE →
        </Link>
      </div>
      
    </nav>
  );
}