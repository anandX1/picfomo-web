"use client";

import Link from "next/link";
import { Download, Monitor, ShieldCheck, Zap } from "lucide-react";

export default function NewHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Launch Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/80 mb-6 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#FF4F81] animate-pulse" />
        <span>PicFomo Studio 1.0 Live</span>
        <span className="text-white/40">•</span>
        <span className="text-[#FF4F81] font-semibold">Launch Pass ₹49</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
        Documentary Captions at 10x Speed.{" "}
        <span className="bg-gradient-to-r from-[#FF4F81] via-[#FF8A65] to-[#FFCD19] bg-clip-text text-transparent">
          Directly in Your NLE.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-xl text-white/60 max-w-2xl mb-8 leading-relaxed">
        Kinetic pop, syntactic word pacing, and multi-track keyframe exports for Premiere Pro,
        DaVinci Resolve, and After Effects. Runs 100% locally on your machine with zero cloud leaks.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 mb-12 w-full sm:w-auto" id="download">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="https://github.com/anandX1/picfomo-web/releases/download/v1.0.0/PicFomo-Studio-Setup-1.0.0.exe"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-black font-bold text-sm md:text-base hover:bg-[#FF4F81] hover:text-white transition-all shadow-lg hover:shadow-[#FF4F81]/25 hover:-translate-y-0.5"
          >
            <Download size={18} />
            Download for Windows (.exe)
          </a>

          <Link
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 text-white font-semibold text-sm md:text-base hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Zap size={16} className="text-[#FFCD19]" />
            Get 7-Day Pass — ₹49
          </Link>
        </div>
        <a
          href="https://github.com/anandX1/picfomo-web/releases/download/v1.0.0/PicFomo-Studio-Setup-1.0.0.zip"
          className="text-xs text-white/40 hover:text-white/80 transition-colors underline underline-offset-4"
        >
          Alternative: Download compressed (.zip) archive
        </a>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/50 mb-16 w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <ShieldCheck size={14} className="text-[#22C55E]" />
          <span>100% Local Privacy</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <Monitor size={14} className="text-[#00E0FF]" />
          <span>No Python Needed</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-bold text-[#FF4F81]">Ae</span>
          <span>After Effects Multi-Track</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-bold text-[#9999FF]">Pr / Resolve</span>
          <span>XML & SRT Timelines</span>
        </div>
      </div>

      {/* Live Kinetic Caption Preview Card */}
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0E0E15]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-white/40">timeline_export_ae.jsx</span>
          </div>
          <span className="text-xs font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
            Syntactic Pacing: Active
          </span>
        </div>

        {/* Caption Visualizer */}
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <span className="text-xs uppercase font-mono tracking-widest text-white/30">CANVAS PREVIEW • 00:01:23</span>
          <div className="text-lg md:text-2xl font-extrabold text-white/70">
            for Streamer University,
          </div>
          <div className="text-4xl md:text-6xl font-black text-[#FFCD19] tracking-wider scale-110 drop-shadow-xl animate-pulse">
            2026.
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-white/40">
          <span>Track 1: Clean Words • Track 2: Hero Kinetic Pop</span>
          <span className="text-white/60">Ready for 1-Click Import</span>
        </div>
      </div>
    </section>
  );
}
