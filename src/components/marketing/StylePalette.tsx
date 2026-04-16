import Link from 'next/link';

// Mock data: We will fetch this from your Cloudflare D1 database in Phase 2
const STYLES = [
  { id: 1, name: "Studio Ghibli", class: "c-ghibli", trending: true },
  { id: 2, name: "IPL Cricket", class: "c-ipl", trending: true },
  { id: 3, name: "Bollywood", class: "c-bolly", trending: false },
  { id: 4, name: "Action Figure", class: "c-action", trending: true },
  { id: 5, name: "Royal Wedding", class: "c-wedding", trending: false },
  { id: 6, name: "Pro Headshot", class: "bg-gradient-to-br from-zinc-700 to-zinc-900", trending: false },
];

export default function StylePalette() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="styles">
      
      {/* Header Area */}
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
        <div>
          <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
            <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
            The Library
          </div>
          <h2 className="font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-ink)]">
            47 WORLDS TO<br />
            CHOOSE FROM.
          </h2>
        </div>
        
        {/* View All Button */}
        <Link 
          href="/styles" 
          className="flex items-center gap-2 border border-[var(--color-ink)] px-6 py-2.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-gold-light)]"
        >
          VIEW ALL STYLES <span>→</span>
        </Link>
      </div>

      {/* Grid: 2 cols on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {STYLES.map((style) => (
          <div 
            key={style.id} 
            className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
          >
            {/* The Image Placeholder (using your CSS gradients) */}
            <div className={`h-full w-full ${style.class}`}></div>
            
            {/* Trending Badge */}
            {style.trending && (
              <div className="absolute left-2 top-2 bg-[var(--color-red)] px-2 py-1 font-[family-name:var(--mono)] text-[8px] uppercase tracking-[1px] text-white">
                Trending
              </div>
            )}

            {/* Title Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(17,16,9,0.9)] to-transparent p-3 text-center">
              <span className="font-[family-name:var(--display)] text-[13px] tracking-[1px] text-[var(--color-white)]">
                {style.name}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              <span className="bg-[var(--color-gold)] px-3 py-1 font-[family-name:var(--display)] text-[12px] tracking-[1.5px] text-[var(--color-ink)]">
                SELECT
              </span>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}