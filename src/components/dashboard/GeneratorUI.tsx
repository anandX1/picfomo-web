"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, Zap, Image as ImageIcon, CheckCircle2, Loader2, Wand2 } from "lucide-react";

// Your exact styles, upgraded with the premium UI colors
const AI_STYLES = [
  { id: "cyberpunk", name: "Cyberpunk", icon: "🦾", color: "border-pink-500" },
  { id: "ghibli", name: "Studio G", icon: "🍃", color: "border-green-400" },
  { id: "clay", name: "Claymation", icon: "🧱", color: "border-orange-400" },
  { id: "ps2", name: "PS2 Era", icon: "🎮", color: "border-blue-500" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", color: "border-gray-400" },
];

export default function GeneratorUI() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setGeneratedResult(null);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const clearSelection = () => {
    setPreviewUrl(null);
    setGeneratedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // YOUR EXACT API LOGIC (Untouched, just wrapped in the new UI state)
  const handleGenerate = async () => {
    if (!fileInputRef.current?.files?.[0] || !selectedStyle) return;
    
    setIsGenerating(true);
    setGeneratedResult(null);
    
    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);
    formData.append("styleId", selectedStyle);

    try {
      // 1. MOCK LATENCY FOR DOPAMINE (Remove this later when API is real)
      await new Promise(resolve => setTimeout(resolve, 8000)); 

      /* --- YOUR REAL API CALL (Uncomment when connecting Pixazo) ---
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json() as { message?: string; error?: string; imageUrl?: string };
      
      if (response.ok) {
        setGeneratedResult(data.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
        router.refresh(); 
      } else {
        alert("Error: " + data.error);
      }
      -------------------------------------------------------------- */

      // 2. MOCK SUCCESS STATE (Remove this when API is real)
      setGeneratedResult("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
      router.refresh(); 

    } catch (error) {
      alert("Something went wrong with the network!");
    } finally {
      setIsGenerating(false);
    }
  };

  const isReadyToGenerate = previewUrl !== null && selectedStyle !== null;

  return (
    <div className="mx-auto max-w-[1200px] animate-in fade-in duration-500">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: UPLOAD & CONTROLS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* DRAG & DROP ZONE */}
          <div className="rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm">
            <label className="mb-4 block font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-page-text)]">
              1. Upload Subject
            </label>
            
            {!previewUrl ? (
              <div 
                onClick={triggerFileInput}
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]"
              >
                <div className="mb-4 rounded-full bg-white p-4 shadow-sm border border-gray-100 transition-transform group-hover:scale-110 group-hover:-translate-y-1">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="font-[family-name:var(--display)] text-xl text-[var(--color-page-text)]">Drop selfie here</h3>
                <p className="mt-1 font-[family-name:var(--mono)] text-[9px] text-gray-500 uppercase tracking-widest font-bold">Tap to browse</p>
              </div>
            ) : (
              <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-md border border-[var(--rule)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Upload size={16} /> Replace Photo
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* STYLE SELECTOR */}
          <div className={`rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm transition-all duration-500 ${previewUrl ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="mb-4 block font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-page-text)]">
              2. Pick a World
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {AI_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all active:scale-95 ${
                    selectedStyle === style.id 
                      ? `border-[var(--color-gold)] bg-[var(--color-gold-pale)] shadow-md scale-105` 
                      : 'border-transparent bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {selectedStyle === style.id && (
                    <div className="absolute -top-2 -right-2 bg-[var(--color-gold)] rounded-full p-1 shadow-sm z-10">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                  <span className={`text-3xl mb-2 transition-transform duration-300 ${selectedStyle === style.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {style.icon}
                  </span>
                  <span className={`font-[family-name:var(--mono)] text-[9px] font-bold text-center uppercase tracking-widest ${selectedStyle === style.id ? 'text-[var(--color-page-text)]' : 'text-gray-500'}`}>
                    {style.name}
                  </span>
                </button>
              ))}
            </div>

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={!isReadyToGenerate || isGenerating}
              className={`mt-6 relative w-full overflow-hidden rounded-xl p-4 font-[family-name:var(--mono)] text-[13px] font-black uppercase tracking-[2px] transition-all shadow-md
                ${!isReadyToGenerate 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : isGenerating 
                    ? 'bg-[#0a0a0a] text-white cursor-wait' 
                    : 'bg-[var(--color-page-text)] text-[var(--color-gold)] hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                }`}
            >
              {!isGenerating && isReadyToGenerate && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              )}
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[var(--color-gold)]" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate <span className="text-gray-400 ml-1 opacity-70">(-10 ⚡)</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: THE MATRIX RESULT VIEWER */}
        <div className="lg:col-span-7">
          <div className="relative flex aspect-[4/5] lg:aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-[#0a0a0a] border border-gray-800 shadow-2xl">
            
            {isGenerating ? (
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
                  Processing Identity...
                </p>
              </div>
            ) : generatedResult ? (
              <div className="relative w-full h-full animate-in zoom-in-95 fade-in duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generatedResult} alt="Generated result" className="h-full w-full object-cover" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 border border-white/20 shadow-2xl">
                    <span className="text-white font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-400" /> Saved to Vault
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center opacity-30 z-20">
                <Wand2 size={64} className="text-gray-600 mb-6" />
                <p className="font-[family-name:var(--mono)] text-sm text-gray-500 uppercase tracking-widest max-w-[200px]">
                  Awaiting Subject Input
                </p>
              </div>
            )}

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10"></div>
          </div>
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