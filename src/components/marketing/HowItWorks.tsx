export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="how-it-works">
      
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
        <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        See it in action
      </div>
      
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-ink)]">
        THREE STEPS.<br />
        TWENTY SECONDS.
      </h2>
      
      <p className="mb-8 max-w-[480px] text-[14px] font-light leading-[1.75] text-[var(--color-ink3)] md:mb-12">
        No prompts. No technical knowledge. Just drop a selfie and watch the AI do the heavy lifting.
      </p>

      {/* Video Placeholder Container 
        aspect-[4/5] is perfect for mobile (taller than wide). 
        md:aspect-[16/9] makes it widescreen on desktop.
      */}
      <div className="relative mx-auto w-full max-w-[900px] aspect-[4/5] overflow-hidden border border-[var(--rule)] bg-[var(--color-cream2)] shadow-[var(--shadow-lg)] md:aspect-video">
        
        {/* The actual HTML5 Video Tag */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="h-full w-full object-cover opacity-90"
          // poster="/your-placeholder-image.jpg" <-- Add an image here later so it doesn't show a blank box while loading
        >
          {/* Change this src later to point to your actual .mp4 file sitting in your public/ folder */}
          <source src="/demo-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Premium UI Overlays */}
        <div className="pointer-events-none absolute inset-0 border-[4px] border-[var(--color-white)] opacity-20"></div>
        <div className="absolute right-4 top-4 bg-[rgba(17,16,9,0.7)] px-3 py-1.5 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[2px] text-white backdrop-blur-md">
          Live Demo
        </div>

        {/* Placeholder text for you while you don't have the video yet */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[var(--color-ink3)] mix-blend-multiply">
          <span className="mb-2 text-4xl">🎥</span>
          <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px]">Put demo-video.mp4<br/>in your /public folder</span>
        </div>

      </div>
    </section>
  );
}