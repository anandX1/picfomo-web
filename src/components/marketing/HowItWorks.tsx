export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="how-it-works">
      
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
        <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        See it in action
      </div>
      
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-page-text)]">
        THREE STEPS.<br />
        TWENTY SECONDS.
      </h2>
      
      <p className="mb-8 max-w-[480px] text-[14px] font-light leading-[1.75] text-[var(--color-ink3)] md:mb-12">
        No prompts. No technical knowledge. Just drop a selfie and watch the AI do the heavy lifting.
      </p>

      {/* Video Container 
        aspect-[4/5] is perfect for mobile (taller than wide). 
        md:aspect-[16/9] makes it widescreen on desktop.
        (This strict aspect ratio prevents CLS!)
      */}
      <div className="relative mx-auto w-full max-w-[1040px] aspect-[4/5] overflow-hidden border border-[var(--rule)] bg-[var(--color-page-text)] shadow-[var(--shadow-2xl)] md:aspect-video rounded-xl">
        
        {/* 🌟 OPTIMIZED VIDEO TAG: Added 'poster' and changed preload to 'metadata' */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata"
          poster="https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/picfomo_video_poster.jpg"
          className="h-full w-full object-cover opacity-95 transition-opacity duration-700"
        >
          {/* Cloudflare R2 Hosted Video */}
          <source src="https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/picfomo_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Premium UI Overlays */}
        <div className="pointer-events-none absolute inset-0 border-[2px] border-white/10 rounded-xl"></div>
        <div className="absolute right-4 top-4 bg-black/60 px-3 py-1.5 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[2px] text-white backdrop-blur-md rounded border border-white/10 shadow-lg">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse mr-2 mb-[1px]"></span>
          Live Demo
        </div>

      </div>
    </section>
  );
}