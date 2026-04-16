"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What happens to my photo after I upload it?",
    a: "Your raw photo is automatically deleted from our servers within 24 hours of upload — guaranteed. We never use your photos to train AI models and never share them with anyone. The only thing we keep is the generated portrait output, which you control completely and can delete anytime from your gallery."
  },
  {
    q: "Is the quality really that good? My face will actually look like me?",
    a: "Yes. We use PuLID — a face identity preservation technology — combined with Flux AI. The result is your actual face, faithfully reproduced in the chosen style. Not a vague likeness. You. This is why outputs are shareable — they actually look like the person who made them."
  },
  {
    q: "How are new styles created? Who makes them?",
    a: "Our team trains new style LoRA models on high-quality datasets every week, timed to trending moments — IPL season, Diwali, global AI trends like Ghibli. We're also launching a Creator Programme where AI artists can submit their own styles and earn royalties every time someone generates with them."
  },
  {
    q: "Why is it free? What's the catch?",
    a: "Free portraits include a small PicFOMO watermark, a short ad before generation, and a 5/day limit. We earn from ads and optional subscriptions. No hidden charges, no trial that converts automatically, no credit card required to start. If you love it, upgrade. If not, keep using it free."
  },
  {
    q: "Does it work for Indian skin tones and facial features?",
    a: "Yes — we specifically test across diverse Indian skin tones and facial features as a priority. Our training datasets include diverse representation, and our quality gate rejects generations where face preservation is poor rather than giving you a bad output. We take this seriously because most Western AI tools don't."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="faq">
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[5px] text-[var(--color-ink3)]">
        <div className="h-[1px] w-6 bg-[var(--color-gold)]"></div>
        Questions
      </div>
      <h2 className="mb-12 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.88] tracking-[-0.5px] text-[var(--color-ink)]">
        THINGS PEOPLE<br />
        WANT TO KNOW.
      </h2>

      <div className="mx-auto max-w-[680px] ml-0">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="cursor-pointer border-b border-[var(--rule)] transition-colors hover:bg-[var(--color-cream)]"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4 py-5 pr-4 pl-2">
                <h3 className="text-[14px] font-medium leading-[1.5] text-[var(--color-ink)]">{faq.q}</h3>
                <div className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center border font-[family-name:var(--mono)] text-[12px] transition-all duration-300 ${isOpen ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)] rotate-45' : 'border-[var(--rule)] bg-[var(--color-cream)] text-[var(--color-ink3)]'}`}>
                  +
                </div>
              </div>
              <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="pb-5 pl-2 pr-4 text-[13px] font-light leading-[1.75] text-[var(--color-ink3)]">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}