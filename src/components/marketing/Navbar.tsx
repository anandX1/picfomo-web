import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex h-[72px] items-center justify-between border-b border-white/5 bg-[#030303]/80 px-5 backdrop-blur-2xl md:px-10">
      
      {/* 🌟 RESPONSIVE DUAL-LOGO */}
      <div className="flex items-center">
        <Link href="/" className="inline-block outline-none transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center justify-start">
            
            {/* MOBILE LOGO: Hardcoded to 48x48 pixels. */}
            <Image 
              src="/logo-favicon.png" 
              alt="PicFOMO" 
              width={48}
              height={48}
              priority
              fetchPriority="high"
              className="block md:hidden object-contain drop-shadow-md" 
            />

            {/* DESKTOP LOGO: Forced to 180px wide. */}
            {/* 💡 PRO TIP: If your PNG file has a lot of invisible transparent padding around the text, change 180 to 220 or 250! */}
            <Image 
              src="/logo-full.png" 
              alt="PicFOMO" 
              width={180}
              height={50}
              priority
              className="hidden md:block object-contain object-left drop-shadow-md" 
            />

          </div>
        </Link>
      </div>

      {/* 🌟 OPTIMIZED CENTER LINKS */}
      <div className="hidden gap-8 md:flex">
        <Link href="/grader" className="text-sm font-semibold tracking-wide text-[var(--color-gold-light)] transition-colors hover:text-white flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-gold)]"></span>
          </span>
          Selfie Grader
        </Link>
        <Link href="/styles" className="text-sm font-semibold tracking-wide text-white/50 transition-colors hover:text-[var(--color-gold-light)] hover:text-white">
          Styles
        </Link>
        <Link href="/blog" className="text-sm font-semibold tracking-wide text-white/50 transition-colors hover:text-white">
          Blog
        </Link>
        <Link href="#how-it-works" className="text-sm font-semibold tracking-wide text-white/50 transition-colors hover:text-white">
          How it works
        </Link>
        <Link href="#features" className="text-sm font-semibold tracking-wide text-white/50 transition-colors hover:text-white">
          Creator Economy
        </Link>
      </div>

      {/* 🌟 RIGHT CTAs */}
      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="hidden sm:block text-sm font-semibold text-white/50 transition-colors hover:text-white">
          Sign in
        </Link>
        <Link href="/sign-up" className="rounded-lg bg-white px-5 py-2 md:px-6 md:py-2.5 font-bold text-xs md:text-sm tracking-wide text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          TRY FREE →
        </Link>
      </div>
    </nav>
  );
}