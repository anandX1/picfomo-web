"use client";

import { FileVideo, Sliders, Film } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Drop Raw Audio or Video",
    desc: "Import voiceovers or video cuts. PicFomo's local engine analyzes speech cadences, pause thresholds, and syntactic constituents in seconds.",
    icon: FileVideo,
    tag: "100% On-Device"
  },
  {
    num: "02",
    title: "In-Place Typo Fixes & Hero Pop",
    desc: "Directly fix spelling errors on live caption cards. Click any keyword token to toggle kinetic Hero scale-pops and color badge highlights.",
    icon: Sliders,
    tag: "Real-Time Canvas Preview"
  },
  {
    num: "03",
    title: "1-Click Native Multi-Track Export",
    desc: "Generate clean keyframed timelines for After Effects (.jsx), Premiere Pro (.xml), and DaVinci Resolve (.srt) with separated word and hero tracks.",
    icon: Film,
    tag: "Industry Standard Formats"
  }
];

export default function NewTimeline() {
  return (
    <section id="workflow" className="py-24 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/5">
      <div className="text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#FF4F81] mb-2 block">
          Editorial Pipeline
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          How PicFomo Studio Works
        </h2>
        <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
          From raw voiceover to keyframed documentary captions in under 60 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="rounded-2xl border border-white/10 bg-[#0A0A10]/80 p-8 flex flex-col justify-between hover:border-white/20 transition-all group backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-[#FF4F81] transition-colors">
                    {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6">{s.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono text-white/40 tracking-wider uppercase">
                  {s.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
