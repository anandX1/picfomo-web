// Mock Data: We'll pull these from a real database or Twitter API later
const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya S.",
    role: "Content Creator",
    text: "Literally changed my entire Instagram aesthetic in 20 seconds. The Studio Ghibli filter is insanely accurate to my facial features. Not just a generic face swap.",
  },
  {
    id: 2,
    name: "Rahul M.",
    role: "Tech Founder",
    text: "Needed professional headshots for my startup's landing page. Saved ₹5,000 and a trip to the studio. The corporate lighting styles look like they were shot on a DSLR.",
  },
  {
    id: 3,
    name: "Anjali K.",
    role: "Student",
    text: "My WhatsApp family group went crazy over the Diwali portrait I made. Everyone thought I actually hired a photographer lol. The IPL card is next.",
  }
];

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="testimonials">
      
      {/* Header Area */}
      <div className="mb-8 flex flex-col items-center text-center md:mb-14">
        <div className="mb-4 flex items-center justify-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
          <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
          Wall of Love
          <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        </div>
        <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-ink)]">
          DON'T JUST TAKE<br />
          OUR WORD FOR IT.
        </h2>
        <p className="max-w-[480px] text-[14px] font-light leading-[1.75] text-[var(--color-ink3)]">
          Join thousands of users upgrading their digital identity every single day.
        </p>
      </div>

      {/* Mobile: Horizontal snap scroll. Desktop: 3-column grid */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:pb-0 [&::-webkit-scrollbar]:hidden">
        
        {TESTIMONIALS.map((review) => (
          <div 
            key={review.id}
            className="relative w-[85vw] shrink-0 snap-center border border-[var(--rule)] bg-[var(--color-white)] p-8 transition-colors duration-200 hover:border-[var(--color-gold-border)] hover:bg-[var(--color-gold-pale)] md:w-auto md:p-10"
          >
            {/* Stars */}
            <div className="mb-6 flex gap-1 text-[14px]">
              ⭐⭐⭐⭐⭐
            </div>
            
            {/* Review Text */}
            <p className="mb-8 text-[14px] font-light leading-[1.8] text-[var(--color-ink2)]">
              "{review.text}"
            </p>
            
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] font-[family-name:var(--display)] text-[14px] text-[var(--color-gold-pale)]">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="font-[family-name:var(--display)] text-[15px] tracking-[0.5px] text-[var(--color-ink)]">
                  {review.name}
                </div>
                <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] text-[var(--color-ink3)]">
                  {review.role}
                </div>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}