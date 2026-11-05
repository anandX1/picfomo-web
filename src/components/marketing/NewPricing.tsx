"use client";

import { useState } from "react";
import { Check, QrCode, Sparkles } from "lucide-react";

export default function NewPricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <section id="pricing" className="bg-[#050508] py-24 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4F81]/10 text-[#FF4F81] text-xs font-semibold mb-3">
            <Sparkles size={12} />
            Direct UPI • Zero Recurring Traps
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
            No forced monthly auto-debit. Pay once via UPI, activate instantly, and export to any NLE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 7-Day Launch Pass */}
          <div className="bg-[#0E0E15] border-2 border-[#FF4F81] rounded-2xl p-8 flex flex-col relative shadow-[0_0_35px_rgba(255,79,129,0.2)] md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF4F81] to-[#FF8A65] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
              Special Launch Offer
            </div>
            <h3 className="text-xl font-bold text-white mb-1">7-Day Launch Pass</h3>
            <p className="text-white/50 text-xs mb-6">Full Pro access for one project or sprint.</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-extrabold text-white">₹49</span>
              <span className="text-white/40 text-xs">/ 7 days (One-time)</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/80 mb-8 flex-grow">
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FF4F81]" /> All NLE Exporters (.jsx, .xml, .srt)</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FF4F81]" /> Kinetic Pop & Multi-Track Keyframes</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FF4F81]" /> 100% Local Processing & Privacy</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FF4F81]" /> No Automatic Subscription Debit</li>
            </ul>
            <button
              onClick={() => setSelectedPlan('7day')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4F81] to-[#FF8A65] text-white font-bold text-sm hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <QrCode size={16} /> Get 7-Day Pass (₹49)
            </button>
          </div>

          {/* Pro Monthly */}
          <div className="bg-[#0A0A10] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold text-white mb-1">Pro Monthly</h3>
            <p className="text-white/50 text-xs mb-6">For active video creators & editors.</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-extrabold text-white">₹499</span>
              <span className="text-white/40 text-xs">/ month</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/70 mb-8 flex-grow">
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#22C55E]" /> Unlimited Video & Audio Exports</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#22C55E]" /> All 40+ Curated Creator Presets</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#22C55E]" /> Syntactic Pacing Optimizer Engine</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#22C55E]" /> Direct Discord VIP Community</li>
            </ul>
            <button
              onClick={() => setSelectedPlan('monthly')}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <QrCode size={16} /> Upgrade Pro (₹499)
            </button>
          </div>

          {/* Founder Lifetime */}
          <div className="bg-[#0A0A10] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold text-white mb-1">Founder Lifetime</h3>
            <p className="text-white/50 text-xs mb-6">For editing agencies & studios.</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-extrabold text-white">₹2,999</span>
              <span className="text-white/40 text-xs">/ lifetime</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/70 mb-8 flex-grow">
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FFCD19]" /> 3 Active Device Machine Keys</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FFCD19]" /> Lifetime Updates & New NLE Formats</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FFCD19]" /> Priority Bug Fixes & Direct Developer Line</li>
              <li className="flex items-center gap-2.5"><Check size={16} className="text-[#FFCD19]" /> Full Commercial Broadcast License</li>
            </ul>
            <button
              onClick={() => setSelectedPlan('lifetime')}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <QrCode size={16} /> Get Lifetime (₹2,999)
            </button>
          </div>
        </div>

        {/* UPI QR Modal Trigger Indicator */}
        {selectedPlan && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#12121A] border border-white/15 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
              <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-white/50 hover:text-white text-sm">✕</button>
              <h4 className="text-lg font-bold text-white mb-2">Direct UPI Payment</h4>
              <p className="text-xs text-white/60 mb-4">Scan using any UPI app (GPay, PhonePe, Paytm, CRED)</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=picfomo@upi%26pn=PicFomo%20Studio%26am=${selectedPlan === '7day' ? 49 : selectedPlan === 'monthly' ? 499 : 2999}%26cu=INR`}
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto rounded-lg border-2 border-white/20 p-2 bg-white mb-4"
              />
              <div className="text-xs text-white/50 font-mono mb-4">UPI ID: picfomo@upi</div>
              <p className="text-[11px] text-[#22C55E]">Enter your 12-digit UTR in PicFomo Studio to activate instantly.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
