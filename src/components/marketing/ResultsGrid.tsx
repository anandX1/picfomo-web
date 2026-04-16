export default function ResultsGrid() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="results">
      {/* Eyebrow */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
        <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        Real results
      </div>
      
      {/* Heading */}
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-ink)]">
        PORTRAITS PEOPLE<br />
        ACTUALLY SHARE.
      </h2>
      
      {/* Subheading */}
      <p className="mb-12 max-w-[480px] text-[14px] font-light leading-[1.75] text-[var(--color-ink3)]">
        Every style preserves your face identity using PuLID technology. You look like you — just in a different world.
      </p>

      {/* Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        
        {/* Result Pair 1 */}
        <div className="group relative cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
          <div className="aspect-[3/4] w-full c-bolly filter grayscale-[0.6] brightness-85"></div>
          <div className="mt-1 aspect-[3/4] w-full c-ghibli"></div>
          
          <div className="absolute left-1.5 top-1.5 bg-[rgba(0,0,0,0.5)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[rgba(255,255,255,0.6)]">Before</div>
          <div className="absolute left-1.5 top-[calc(50%+2px)] bg-[var(--color-gold)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[var(--color-ink)]">Ghibli</div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(17,16,9,0.8)] to-transparent px-2.5 py-3 text-center font-[family-name:var(--display)] text-[14px] tracking-[1px] text-white">STUDIO GHIBLI</div>
          
          <div className="absolute inset-0 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)]">TRY THIS</div>
          </div>
        </div>

        {/* Result Pair 2 */}
        <div className="group relative cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
          <div className="aspect-[3/4] w-full c-wedding filter grayscale-[0.6] brightness-85"></div>
          <div className="mt-1 aspect-[3/4] w-full c-ipl"></div>
          
          <div className="absolute left-1.5 top-1.5 bg-[rgba(0,0,0,0.5)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[rgba(255,255,255,0.6)]">Before</div>
          <div className="absolute left-1.5 top-[calc(50%+2px)] bg-[var(--color-gold)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[var(--color-ink)]">IPL Card</div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(17,16,9,0.8)] to-transparent px-2.5 py-3 text-center font-[family-name:var(--display)] text-[14px] tracking-[1px] text-white">IPL CRICKET CARD</div>
          
          <div className="absolute inset-0 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)]">TRY THIS</div>
          </div>
        </div>

        {/* Result Pair 3 */}
        <div className="group relative cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
          <div className="aspect-[3/4] w-full c-cyber filter grayscale-[0.6] brightness-85"></div>
          <div className="mt-1 aspect-[3/4] w-full c-action"></div>
          
          <div className="absolute left-1.5 top-1.5 bg-[rgba(0,0,0,0.5)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[rgba(255,255,255,0.6)]">Before</div>
          <div className="absolute left-1.5 top-[calc(50%+2px)] bg-[var(--color-gold)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[var(--color-ink)]">Action Fig</div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(17,16,9,0.8)] to-transparent px-2.5 py-3 text-center font-[family-name:var(--display)] text-[14px] tracking-[1px] text-white">ACTION FIGURE</div>
          
          <div className="absolute inset-0 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)]">TRY THIS</div>
          </div>
        </div>

        {/* Result Pair 4 */}
        <div className="group relative cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
          <div className="aspect-[3/4] w-full c-action filter grayscale-[0.6] brightness-85"></div>
          <div className="mt-1 aspect-[3/4] w-full c-bolly"></div>
          
          <div className="absolute left-1.5 top-1.5 bg-[rgba(0,0,0,0.5)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[rgba(255,255,255,0.6)]">Before</div>
          <div className="absolute left-1.5 top-[calc(50%+2px)] bg-[var(--color-gold)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] font-medium uppercase tracking-[2px] text-[var(--color-ink)]">Bollywood</div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(17,16,9,0.8)] to-transparent px-2.5 py-3 text-center font-[family-name:var(--display)] text-[14px] tracking-[1px] text-white">BOLLYWOOD POSTER</div>
          
          <div className="absolute inset-0 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)]">TRY THIS</div>
          </div>
        </div>

      </div>
    </section>
  );
}