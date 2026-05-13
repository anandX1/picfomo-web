"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Fingerprint, Rocket, Repeat, Wallet, Sparkles, ChevronDown } from "lucide-react";

// 🌟 THE HUMANIZED, HYPER-RELEVANT COPY
const FAQS = [
  {
    icon: ShieldAlert,
    q: "Are you keeping my selfies to train your AI?",
    a: "Hell no. Your raw photo is automatically deleted from our servers within 24 hours. We don't train our base models on your face, and we don't sell your data. The only thing we keep is the final generated portrait in your vault, which you can delete yourself at any time."
  },
  {
    icon: Fingerprint,
    q: "Is this just another cheap face-swap filter?",
    a: "Not even close. Generic face-swaps just paste your eyes onto a different head. We use an advanced Identity-Lock tech (PuLID) that actually maps your exact bone structure, jawline, and facial depth. You look exactly like you, just inside a cinematic masterpiece."
  },
  {
    icon: Rocket,
    q: "What exactly can I use PicFOMO for?",
    a: "Think of it as a visual arsenal in your pocket. Need a crisp corporate headshot for LinkedIn? Done. Want to try on luxury streetwear before buying? Easy. Restoring a blurry 90s photo of your grandparents? We got you. It's not just a toy; it's a utility to upgrade your digital identity."
  },
  {
    icon: Repeat,
    q: "I'm a creator/prompt engineer. Can I make money here?",
    a: "Yes. In Phase 2, we are unlocking the Creator Flywheel. You build the viral styles, our algorithm pushes them to the community, users generate with them, and you earn 'Sparks' (revenue) every single time. It's a completely automated economy for AI artists."
  },
  {
    icon: Wallet,
    q: "Why is it free? What's the catch?",
    a: "You get daily free generation limits. Free portraits have a tiny watermark and you might see a short ad—that's how we keep the servers running. If you want to go hardcore, you can upgrade for zero watermarks, priority queue, and exclusive styles. No sneaky automatic subscriptions."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // 🌟 SEO INJECTION: This builds the Schema.org JSON-LD for Google Crawlers!
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <section className="relative mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="faq">
      
      {/* Injecting the SEO script invisibly into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[4px] text-[var(--color-gold)]">
        <Sparkles size={14} className="text-[var(--color-gold)]" />
        [ THE DETAILS ]
      </div>
      
      <h2 className="mb-12 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.9] tracking-[-0.5px] text-[var(--color-page-text)] uppercase">
        Straight Answers.<br />
        No Corporate BS.
      </h2>

      <div className="mx-auto ml-0 grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:max-w-[900px]">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;
          
          return (
            <div 
              key={idx} 
              className={`flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen 
                  ? "border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] shadow-md" 
                  : "border-[var(--rule)] bg-white hover:border-[var(--color-gold-border)]/50 hover:bg-[var(--color-cream)]"
              }`}
            >
              {/* The Clickable Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-[var(--color-gold)] text-[var(--color-page-text)]" : "bg-[var(--color-cream2)] text-[var(--color-ink3)]"}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="font-[family-name:var(--display)] text-[16px] md:text-[18px] tracking-[0.5px] leading-[1.4] text-[var(--color-page-text)]">
                    {faq.q}
                  </h3>
                </div>
                
                <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--color-page-text)]" : "text-[var(--color-ink3)]"}`}>
                  <ChevronDown size={20} />
                </div>
              </button>

              {/* Framer Motion Animated Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-6 pt-0 md:px-6 md:pl-[72px]">
                      <p className="text-[14px] md:text-[15px] font-light leading-[1.7] text-[var(--color-ink2)]">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}