"use client";

import { useState } from "react";
import { Wand2, Image as ImageIcon, Sparkles, Loader2, CheckCircle2, Upload, Zap } from "lucide-react";

interface StyleDef {
  id: string;
  name: string;
  slug: string;
  description: string;
  preview_image_url: string;
  spark_cost: number;
  badge: string | null;
}

interface Props {
  sparksBalance: number;
  styles: StyleDef[];
}

export default function StudioClient({ sparksBalance, styles }: Props) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>(styles[0]?.id || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // NEW: Image Upload State for Image-to-Image (FireRed Edit)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const selectedStyle = styles.find(s => s.id === selectedStyleId);
  const cost = selectedStyle?.spark_cost || 10;
  const canAfford = sparksBalance >= cost;

  // Handle Local Image Upload & Convert to Base64 for the API
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImagePreview(URL.createObjectURL(file));
      setGeneratedImage(null);
      
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    // Require prompt, style, affordance, AND an image (for image-to-image)
    if (!prompt || !selectedStyleId || !canAfford) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      // YOUR EXACT API LOGIC (Now sending the image too!)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Passing the imageBase64 to your backend so Pixazo/Fal can process it
        body: JSON.stringify({ 
          prompt: prompt, 
          styleId: selectedStyleId,
          image: imageBase64 
        }), 
      });

      const data = (await response.json()) as { error?: string; imageUrl?: string };

      if (!response.ok) {
        alert(data.error || "Generation failed");
        setIsGenerating(false);
        return;
      }

      setGeneratedImage(data.imageUrl || null);
    } catch (error) {
      console.error(error);
      alert("Network error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-[var(--rule)] pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] flex items-center gap-3">
            <Wand2 className="text-[var(--color-gold)]" size={32} /> The Studio
          </h1>
          <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[1px] text-[var(--color-ink2)]">
            Upload your selfie. Select a universe.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[2px] text-[var(--color-ink3)]">Wallet</span>
          <div className={`font-[family-name:var(--display)] text-3xl tracking-tight ${canAfford ? 'text-[var(--color-gold)]' : 'text-red-500'}`}>
            {sparksBalance} ⚡
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* STEP 1: DRAG & DROP ZONE */}
          <div className="rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm">
            <label className="mb-4 block font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-ink)]">
              1. Upload Subject
            </label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-pale)]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" 
              />
              
              {selectedImagePreview ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <Upload size={16} /> Replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-3 rounded-full bg-white p-3 shadow-sm border border-gray-100">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-[family-name:var(--display)] text-lg text-[var(--color-ink)]">Drop selfie here</h3>
                  <p className="mt-1 font-[family-name:var(--mono)] text-[9px] text-gray-500 uppercase tracking-widest">JPEG, PNG max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: STYLES (Dynamic from your Database!) */}
          <div className="rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm">
            <label className="mb-4 block font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-ink)]">
              2. Choose Reality
            </label>
            
            {styles.length === 0 ? (
              <div className="p-4 bg-[var(--color-cream)] rounded-lg text-center font-[family-name:var(--mono)] text-[11px] text-[var(--color-ink3)]">
                No active styles available. Go to God Mode to add some!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {styles.map((style) => {
                  const isSelected = selectedStyleId === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all group ${isSelected ? 'border-[var(--color-gold)] shadow-md scale-105' : 'border-transparent hover:border-[var(--rule)]'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={style.preview_image_url} alt={style.name} className="h-full w-full object-cover" />
                      
                      {!isSelected && <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />}
                      
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-white rounded-full text-[var(--color-gold)] shadow-sm">
                          <CheckCircle2 size={16} className="fill-[var(--color-gold)] text-white" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-left">
                        <span className="block font-[family-name:var(--mono)] text-[9px] font-bold text-white truncate drop-shadow-md">
                          {style.name}
                        </span>
                      </div>

                      {style.badge && (
                        <div className="absolute top-1 left-1 bg-[var(--color-ink)] text-[var(--color-gold)] text-[7px] px-1.5 py-0.5 rounded-sm font-bold tracking-widest shadow-md">
                          {style.badge}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 3: PROMPT & GENERATE */}
          <div className="rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm">
            <label className="mb-3 block font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-ink)]">
              3. Describe details
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Neon lights, cinematic lighting, looking at camera..."
              className="h-24 w-full resize-none rounded-lg border border-[var(--rule)] bg-[var(--color-cream)] p-4 font-[family-name:var(--mono)] text-[13px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
            />

            {!canAfford && (
              <p className="mt-3 text-red-500 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] font-bold">
                Not enough sparks. Visit Hub to earn more.
              </p>
            )}

            <button
              onClick={handleGenerate}
              // Disabled if no prompt, no style, not enough sparks, OR NO IMAGE uploaded
              disabled={!prompt || isGenerating || !selectedStyleId || !canAfford || !imageBase64}
              className={`mt-4 relative w-full overflow-hidden rounded-xl p-4 font-[family-name:var(--mono)] text-[13px] font-black uppercase tracking-[2px] transition-all shadow-md
                ${(!prompt || !imageBase64 || !canAfford)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : isGenerating 
                    ? 'bg-[#0a0a0a] text-white cursor-wait' 
                    : 'bg-[var(--color-ink)] text-[var(--color-gold)] hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                }`}
            >
              {!isGenerating && imageBase64 && prompt && canAfford && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              )}
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[var(--color-gold)]" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate <span className="text-gray-400 ml-1 opacity-70">(-{cost} ⚡)</span>
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
                  Processing Identity via Backend...
                </p>
              </div>
            ) : generatedImage ? (
              // THE RESULT
              <div className="relative w-full h-full animate-in zoom-in-95 fade-in duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={generatedImage} 
                  alt="Generated result" 
                  className="h-full w-full object-cover"
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
              <div className="flex flex-col items-center text-center opacity-30 z-20">
                <Wand2 size={64} className="text-gray-600 mb-6" />
                <p className="font-[family-name:var(--mono)] text-sm text-gray-500 uppercase tracking-widest max-w-[200px]">
                  Awaiting Subject Input
                </p>
              </div>
            )}

            {/* Matrix Background Grid Pattern */}
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