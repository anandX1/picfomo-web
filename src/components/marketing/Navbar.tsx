import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex h-[72px] items-center justify-between border-b border-white/5 bg-[#030303]/85 px-5 backdrop-blur-2xl md:px-10">
      <div className="flex items-center">
        <Link href="/" className="inline-block outline-none transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center justify-start">
            <Image
              src="/logo-favicon.png"
              alt="PicFomo Studio"
              width={40}
              height={40}
              priority
              className="block md:hidden object-contain"
            />
            <Image
              src="/logo-full.png"
              alt="PicFomo Studio"
              width={170}
              height={44}
              priority
              className="hidden md:block object-contain object-left"
            />
          </div>
        </Link>
      </div>

      <div className="hidden gap-8 md:flex items-center">
        <Link href="#features" className="text-sm font-semibold tracking-wide text-white/60 transition-colors hover:text-white">
          NLE Integration
        </Link>
        <Link href="#workflow" className="text-sm font-semibold tracking-wide text-white/60 transition-colors hover:text-white">
          Workflow
        </Link>
        <Link href="#pricing" className="text-sm font-semibold tracking-wide text-white/60 transition-colors hover:text-white flex items-center gap-1.5">
          Pricing
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-gold,#D4AF37)]/20 text-[var(--color-gold,#D4AF37)]">
            ₹49 Pass
          </span>
        </Link>
        <Link href="#faq" className="text-sm font-semibold tracking-wide text-white/60 transition-colors hover:text-white">
          FAQ
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="#pricing"
          className="text-xs md:text-sm font-semibold text-white/70 hover:text-white px-3 py-2 transition-colors"
        >
          ₹49 Pass
        </Link>
        <Link
          href="#download"
          className="rounded-lg bg-white px-4 py-2 md:px-5 md:py-2.5 font-bold text-xs md:text-sm tracking-wide text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#FF4F81] hover:text-white hover:shadow-[0_0_20px_rgba(255,79,129,0.4)]"
        >
          Download Studio
        </Link>
      </div>
    </nav>
  );
}
