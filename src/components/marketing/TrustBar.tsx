export default function TrustBar() {
  // We extract the items into a constant so we can duplicate them for the infinite loop
  const TrustItems = (
    <>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink2)]">
        <span className="text-[13px]">⭐</span> 4.9/5 rating
      </div>
      <div className="h-3.5 w-[1px] shrink-0 bg-[var(--color-gold-border)]"></div>
      
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink2)]">
        <span className="text-[13px]">🖼️</span> 2.3M+ portraits created
      </div>
      <div className="h-3.5 w-[1px] shrink-0 bg-[var(--color-gold-border)]"></div>
      
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink2)]">
        <span className="text-[13px]">🔒</span> Photos deleted in 24h
      </div>
      <div className="h-3.5 w-[1px] shrink-0 bg-[var(--color-gold-border)]"></div>
      
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink2)]">
        <span className="text-[13px]">⚡</span> Results in ~20 seconds
      </div>
      <div className="h-3.5 w-[1px] shrink-0 bg-[var(--color-gold-border)]"></div>
    </>
  );

  return (
    <div className="w-full border-b border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] overflow-hidden py-2.5">
      {/* w-max prevents wrapping, animate-scroll-left creates the infinite glide */}
      <div className="flex w-max animate-scroll-left items-center gap-6 px-3 hover:[animation-play-state:paused]">
        {TrustItems}
        {TrustItems}
        {TrustItems}
      </div>
    </div>
  );
}