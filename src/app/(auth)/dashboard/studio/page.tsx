"use client";

import { useState, useTransition } from "react";
import { Upload, Sparkles, Zap, Image as ImageIcon, CheckCircle2, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// The Aesthetics the user can choose from
const AESTHETICS = [
  { id: "cyberpunk", name: "Cyberpunk 2077", emoji: "🤖", color: "from-pink-500 to-cyan-500" },
  { id: "old_money", name: "Old Money", emoji: "🏛️", color: "from-amber-700 to-stone-900" },
  { id: "anime", name: "Studio Ghibli", emoji: "🌸", color: "from-emerald-400 to-cyan-400" },
  { id: "cinematic", name: "Cinematic Film", emoji: "🎥", color: "from-slate-800 to-slate-900" },
];

export default function StudioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(AESTHETICS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // Mock Handle Image Upload (Just reads local file for preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setGeneratedResult(null); // Reset previous result
    }
  };

  // THE MOCK GENERATION LOOP (The "Fake Brain")
  const handleGenerate = () => {
    if (!selectedImage) return toast.error("Please upload a photo first.");

    // We simulate the UI experience of deducting sparks and hitting the API
    setIsGenerating(true);
    
    // Simulate API Latency (8 seconds to build anticipation)
    setTimeout(() => {
      setIsGenerating(false);
      // Hardcoded masterpiece image to prove the UI works
      setGeneratedResult("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
      toast.success("Masterpiece generated! -10 ⚡");
    }, 8000);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] flex items-center gap-3">
          <Wand2 className="text-[var(--color-gold)]" size={32} /> The Studio
        </h1>
        <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[1px] text-[var(--color-ink2)]">
          Upload your selfie. Choose your reality.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* LEFT COLUMN: UPLOAD & STYLE SELECTION */}
        <div className="flex flex-col gap-6">
          
          {/* DRAG & DROP ZONE */}
          <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" 
            />
            
            {selectedImage ? (
              <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-md">
                <Image src={selectedImage} alt="Upload preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Upload size={16} /> Click to replace
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-gray-50 p-4 shadow-inner border border-gray-100">
                  <ImageIcon size={40} className="text-gray-300" />
                </div>
                <h3 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)]">Drop your selfie here</h3>
                <p className="mt-2 font-[family-name:var(--mono)] text-[10px] text-gray-500 uppercase tracking-widest font-bold">JPEG, PNG up to 10MB</p>
              </div>
            )}
          </div>

          {/* AESTHETIC SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)]">
                Select Aesthetic
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {AESTHETICS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                    selectedStyle === style.id 
                      ? 'border-[var(--color-gold)] bg-[var(--color-gold-pale)] shadow-md scale-105' 
                      : 'border-[var(--rule)] bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {selectedStyle === style.id && (
                    <div className="absolute -top-2 -right-2 bg-[var(--color-gold)] rounded-full p-1 shadow-sm">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                  <span className="text-3xl mb-2 transition-transform group-hover:scale-110">{style.emoji}</span>
                  <span className="font-[family-name:var(--mono)] text-[10px] font-bold text-center uppercase tracking-wider text-[var(--color-ink)]">
                    {style.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || isGenerating}
            className={`relative w-full overflow-hidden rounded-2xl p-4 font-[family-name:var(--mono)] text-[13px] font-black uppercase tracking-[2px] transition-all shadow-xl
              ${!selectedImage 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : isGenerating 
                  ? 'bg-[#0a0a0a] text-white cursor-wait' 
                  : 'bg-[var(--color-ink)] text-[var(--color-gold)] hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]'
              }`}
          >
            {/* The Shimmer Effect */}
            {!isGenerating && selectedImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            )}
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[var(--color-gold)]" /> Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Identity <span className="text-gray-400 ml-2 font-normal flex items-center gap-1 opacity-70">(10 <Zap size={12} className="fill-gray-400" />)</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: THE RESULT MATRIX */}
        <div className="relative flex flex-col items-center justify-center min-h-[500px] rounded-3xl bg-[#0a0a0a] overflow-hidden border border-gray-800 shadow-2xl">
          
          {isGenerating ? (
            // THE MATRIX LOADING ANIMATION
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500 z-20">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-t-[var(--color-gold)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-l-orange-500 border-r-transparent border-b-transparent border-t-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                <Zap size={32} className="absolute inset-0 m-auto text-[var(--color-gold)] animate-pulse" />
              </div>
              <h3 className="font-[family-name:var(--display)] text-3xl text-white tracking-widest animate-pulse drop-shadow-lg">
                INITIALIZING<br/>MATRIX
              </h3>
              <p className="mt-4 text-[10px] font-[family-name:var(--mono)] text-gray-500 uppercase tracking-[3px]">
                Mapping Identity Vectors...
              </p>
            </div>
          ) : generatedResult ? (
            // THE RESULT
            <div className="relative w-full h-full animate-in zoom-in-95 fade-in duration-700">
              <Image 
                src={generatedResult} 
                alt="Generated Masterpiece" 
                fill 
                className="object-cover"
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 border border-white/20 shadow-2xl">
                  <span className="text-white font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" /> Saved to Vault
                  </span>
                  <div className="h-4 w-[1px] bg-white/20"></div>
                  <button className="text-[var(--color-gold)] font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors">
                    Share to Feed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // EMPTY STATE
            <div className="flex flex-col items-center text-center opacity-30">
              <Wand2 size={64} className="text-gray-600 mb-6" />
              <p className="font-[family-name:var(--mono)] text-sm text-gray-500 uppercase tracking-widest max-w-[200px]">
                Awaiting Subject Input
              </p>
            </div>
          )}

          {/* Background Grid Pattern for empty/loading states */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10"></div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}