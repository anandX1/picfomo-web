"use client";

import { useState, useEffect, useRef } from "react";
import { compressAndUploadImage } from "@/lib/uploadImage";
import { Sparkles, Image as ImageIcon, CheckCircle2, Download, Share, X, Zap, Loader2, ChevronLeft, ScanFace, ImagePlus, Globe } from "lucide-react";
import Image from "next/image";
import { publishPostToFeed } from "@/actions/economy"; 
import { toast } from "sonner";

const NSFW_WORDS = ["nude", "naked", "nsfw", "porn", "blood", "gore", "explicit", "violence"];

// 🌟 BULLETPROOF ADSTERRA INJECTION FOR REACT
function NativeAd() {
  useEffect(() => {
    const container = document.getElementById('container-b39280394b30c04b29a8908fb4b0bd64');
    if (container && container.childNodes.length === 0) {
      const script = document.createElement('script');
      script.src = "https://pl29173183.profitablecpmratenetwork.com/b39280394b30c04b29a8908fb4b0bd64/invoke.js";
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      container.appendChild(script);
    }
  }, []);

  return <div id="container-b39280394b30c04b29a8908fb4b0bd64" className="w-full min-h-[120px] flex items-center justify-center"></div>;
}

function SocialBarAd() {
  useEffect(() => {
    if (!document.querySelector('script[src*="60abb92c67b12ba0a5b4574a79d2e149.js"]')) {
      const script = document.createElement('script');
      script.src = "https://pl29173184.profitablecpmratenetwork.com/60/ab/b9/60abb92c67b12ba0a5b4574a79d2e149.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  return null;
}

export default function StudioUI({ dynamicStyles }: { dynamicStyles: any[] }) {

  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState<"styles" | "imagine">("styles");
  const [view, setView] = useState<"grid" | "upload" | "generating" | "result">("grid");
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  
  // --- FORM STATE ---
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null); // The Face
  
  // --- GENERATION STATE ---
  const [progress, setProgress] = useState(0); 
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [outputPostId, setOutputPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);

  // --- PUBLISH STATE ---
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Before/After Slider State for Result View
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // 🌟 PROGRESS BAR LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "generating") {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; 
          return prev + Math.floor(Math.random() * 4) + 1; 
        });
      }, 800);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [view]);

  // 🌟 AUTO-PUBLISH MODAL TRAP (DELAYED TO 5.5 SECONDS)
  useEffect(() => {
    if (view === "result" && !isPublished && outputPostId) {
      // Gives the user 5.5 seconds to admire their generated image before upselling
      const timer = setTimeout(() => setShowPublishModal(true), 5500);
      return () => clearTimeout(timer);
    }
  }, [view, isPublished, outputPostId]);

  const containsNSFW = (text: string) => NSFW_WORDS.some(word => text.toLowerCase().includes(word));

  const openUploadView = (style: any) => {
    setSelectedStyle(style);
    setFile(null); 
    setError(null);
    setView("upload");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    setError(null);

    if (!prompt && activeTab === "imagine") return setError("Please enter a prompt.");
    if (prompt && containsNSFW(prompt)) return setError("⚠️ Prompt rejected: Violates safety guidelines.");
    if (activeTab === "styles" && !file) return setError("Please upload your face photo.");

    try {
      setView("generating");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset publish state for new generation
      setIsPublished(false);
      setShowPublishModal(false);

      let uploadedFaceUrl = "";

      // 1. Upload Image to R2
      if (activeTab === "styles" && file) {
        setSourcePreviewUrl(URL.createObjectURL(file)); 
        uploadedFaceUrl = await compressAndUploadImage(file);
      } else {
        setSourcePreviewUrl(null); 
      }

      // 2. Call Plan A robust backend (Single Image payload)
      const payload = activeTab === "imagine" 
        ? { prompt, model: "schnell" } 
        : { 
            prompt, 
            styleId: selectedStyle.id, 
            sourceImage: uploadedFaceUrl
          };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as { error?: string; output?: string; post_id?: string };

      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      if (data.output) {
        setProgress(100);
        setTimeout(() => {
          setOutputImage(data.output!);
          setOutputPostId(data.post_id || "picfomo_viral");
          setView("result");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
      }

    } catch (err: any) {
      setError(err.message);
      setView("upload"); 
    }
  };

  // 🌟 FULLY WIRED PUBLISH TO FEED LOGIC
  const handlePublish = async () => {
    if (!outputPostId || isPublished) return;
    setIsPublishing(true);
    try {
      const res = await publishPostToFeed(outputPostId);
      if (res.success) {
        setIsPublished(true);
        setShowPublishModal(false);
        toast.success("Published! You just earned +5 ⚡");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to publish image.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownload = async () => {
    if (!outputImage) return;
    try {
      const response = await fetch(outputImage);
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      
      const img = new window.Image();
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "right";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
          ctx.fillText("PicFOMO.com", canvas.width - 30, canvas.height - 30);
          
          const link = document.createElement("a");
          link.download = `PicFOMO_${Date.now()}.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.95);
          link.click();
        }
        URL.revokeObjectURL(imgUrl);
      };
    } catch (error) {
      alert("Failed to download image. Try right-clicking and saving.");
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${outputPostId}`;
    if (navigator.share) {
      try { await navigator.share({ title: "My PicFOMO Creation", url: postUrl }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard! Share it anywhere.");
    }
  };

  const handleSliderMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderContainerRef.current || !sourcePreviewUrl) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 px-4 mt-6 text-[var(--color-ink)] min-h-[80vh]">
      
      {/* =========================================================================
          VIEW 1: THE GRID (Selection)
          ========================================================================= */}
      {view === "grid" && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center md:text-left mb-6">
            <h1 className="text-4xl font-[family-name:var(--display)] flex items-center justify-center md:justify-start gap-3 tracking-tight">
              <Sparkles className="text-[var(--color-gold)]" size={32} /> The Studio
            </h1>
            <p className="text-[var(--color-ink3)] mt-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[2px] font-bold">
              Bring your imagination to reality.
            </p>
          </div>

          <div className="flex bg-[var(--color-cream)] p-1.5 rounded-xl w-full md:w-fit border border-[var(--rule)] shadow-sm mb-8">
            <button onClick={() => setActiveTab("styles")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "styles" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink)] opacity-50 hover:opacity-100"}`}>Premium Styles</button>
            <button onClick={() => setActiveTab("imagine")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "imagine" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink)] opacity-50 hover:opacity-100"}`}>Imagine (Fast)</button>
          </div>

          {activeTab === "styles" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {dynamicStyles.map((style) => (
                <div key={style.id} onClick={() => openUploadView(style)} className={`group cursor-pointer relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-[var(--color-cream2)] border-[var(--rule)] hover:border-[var(--color-gold-border)]`}>
                  {style.preview_image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={style.preview_image_url} alt={style.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                      <ImagePlus size={48} className="text-gray-600" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent"></div>
                  
                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <div className="font-[family-name:var(--display)] tracking-[0.5px] text-[18px] md:text-[22px] leading-tight flex flex-wrap items-center gap-2 drop-shadow-md text-[#FFFFFF]">
                      {style.name}
                    </div>
                    <div className="text-[11px] font-[family-name:var(--mono)] uppercase tracking-[1px] font-bold text-[#FFFFFF] flex items-center gap-1 drop-shadow-md mt-2 opacity-90">
                      <Zap size={12} className="fill-[var(--color-gold)] text-[var(--color-gold)]" /> {style.spark_cost} Sparks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl border border-[var(--rule)] bg-[var(--color-white)] p-6 rounded-3xl shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <label className="text-[12px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink)] uppercase tracking-wider">Describe your vision</label>
                  <span className="bg-green-500/10 text-green-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> NSFW Protected</span>
                </div>
                <textarea placeholder="A sleek futuristic car racing through neon streets..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-[var(--color-cream)] border border-[var(--rule)] rounded-xl p-4 text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-gold-border)] resize-none h-32 text-[15px] leading-relaxed shadow-inner" />
                <button onClick={handleGenerate} className="mt-4 w-full bg-[var(--color-ink)] text-[var(--color-white)] font-[family-name:var(--display)] tracking-[2px] text-[16px] py-4 rounded-xl hover:bg-[var(--color-gold)] hover:text-black transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2">
                  <Sparkles size={18} /> GENERATE (2 SPARKS)
                </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: THE UPLOAD & CONFIGURE SCREEN
          ========================================================================= */}
      {view === "upload" && selectedStyle && (
        <div className="animate-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto">
          <button onClick={() => setView("grid")} className="mb-6 flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-ink)] transition-colors w-fit">
            <ChevronLeft size={16} /> Back to Styles
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 🌟 LEFT: STYLE PREVIEW (HIDDEN ON MOBILE TO SAVE SPACE) */}
            <div className="hidden lg:flex w-full lg:w-1/3 flex-col gap-4">
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-[var(--rule)] bg-[var(--color-cream2)]">
                {selectedStyle.preview_image_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={selectedStyle.preview_image_url} alt={selectedStyle.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                  <h2 className="font-[family-name:var(--display)] text-3xl tracking-wide mb-1">{selectedStyle.name}</h2>
                  <p className="text-xs text-white/70 font-medium leading-relaxed">{selectedStyle.description}</p>
                </div>
              </div>
              <div className="bg-[var(--color-cream)] border border-[var(--rule)] p-5 rounded-2xl flex items-center justify-between">
                <span className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink2)]">Generation Cost</span>
                <span className="font-[family-name:var(--display)] text-2xl flex items-center gap-1.5 text-[var(--color-ink)]"><Zap size={20} className="text-[var(--color-gold)] fill-[var(--color-gold)]" /> {selectedStyle.spark_cost}</span>
              </div>
            </div>

            {/* 🌟 RIGHT: UPLOAD ZONES (PRIORITY ON MOBILE) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4 md:gap-6">
              
              {/* MOBILE ONLY: Quick Style Info Header */}
              <div className="lg:hidden flex items-center justify-between bg-[var(--color-cream)] border border-[var(--rule)] p-4 rounded-xl shadow-sm">
                <div className="font-[family-name:var(--display)] text-[18px] text-[var(--color-ink)]">{selectedStyle.name}</div>
                <div className="flex items-center gap-1 text-[var(--color-gold)] font-bold text-[12px]"><Zap size={14} className="fill-current" /> {selectedStyle.spark_cost} ⚡</div>
              </div>

              {/* FACE UPLOAD ONLY */}
              <div className="bg-[var(--color-white)] border border-[var(--rule)] p-6 md:p-8 rounded-[24px] shadow-sm">
                <h3 className="font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-4 flex items-center gap-2">
                  <ScanFace className="text-[var(--color-gold)]" size={18} /> Upload Your Face
                </h3>
                <div className={`relative border-2 border-dashed rounded-[20px] p-8 md:p-10 text-center transition-all cursor-pointer overflow-hidden ${file ? 'border-[var(--color-gold)] bg-[var(--color-gold-pale)]' : 'border-[var(--rule)] bg-[var(--color-cream)] hover:bg-[var(--color-cream2)]'}`}>
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className="flex flex-col items-center justify-center relative z-0">
                    {file ? (
                       <>
                         <CheckCircle2 size={48} className="text-[var(--color-gold)] mb-4" />
                         <h4 className="font-[family-name:var(--display)] text-xl md:text-2xl text-[var(--color-ink)] px-4 truncate w-full">{file.name}</h4>
                         <p className="text-[var(--color-ink3)] font-bold text-[11px] mt-2 uppercase tracking-widest">Tap to replace</p>
                       </>
                    ) : (
                       <>
                         <div className="bg-[var(--color-white)] p-4 rounded-full shadow-sm mb-4 border border-[var(--rule)]"><ImageIcon size={32} className="text-[var(--color-ink3)]" /></div>
                         <h4 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)]">Select clear selfie</h4>
                         <p className="text-[var(--color-ink3)] font-[family-name:var(--mono)] text-[10px] mt-2 uppercase tracking-[2px] font-bold">Good lighting • No sunglasses</p>
                       </>
                    )}
                  </div>
                </div>
              </div>

              {/* PROMPT OVERRIDE */}
              <div className="bg-[var(--color-white)] border border-[var(--rule)] p-6 md:p-8 rounded-[24px] shadow-sm">
                <label className="font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-3 flex items-center justify-between">
                  Additional Details <span className="text-[9px] text-[var(--color-ink3)] tracking-widest">(Optional)</span>
                </label>
                <input type="text" placeholder="e.g., make it dark and cinematic..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-[var(--color-cream)] border border-[var(--rule)] text-[var(--color-ink)] rounded-xl p-4 text-[14px] focus:outline-none focus:border-[var(--color-gold-border)] transition-colors shadow-inner" />
              </div>

              {error && <div className="text-red-500 font-[family-name:var(--mono)] text-[11px] uppercase tracking-widest font-bold text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

              <button 
                onClick={handleGenerate} 
                disabled={!file} 
                className="w-full bg-[var(--color-ink)] text-[var(--color-white)] font-[family-name:var(--display)] tracking-[2px] text-[18px] py-5 rounded-2xl hover:bg-[var(--color-gold)] hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-[var(--color-ink)] disabled:hover:text-[var(--color-white)] shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles size={20} /> INITIALIZE SYNTHESIS
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GENERATING (THE ULTIMATE AD LOUNGE)
          ========================================================================= */}
      {view === "generating" && (
        <div className="animate-in zoom-in-95 duration-700 min-h-[75vh] flex flex-col items-center justify-center relative w-full">
          
          {/* 🌟 SOCIAL BAR AD & NATIVE AD INJECTION: Active ONLY while loading */}
          <SocialBarAd />

          <div className="w-full max-w-4xl bg-[var(--color-cream)] rounded-[40px] border border-[var(--rule)] shadow-2xl overflow-hidden flex flex-col relative px-6 py-10 md:p-12">
            
            {/* Matrix Loader (Top) */}
            <div className="w-full flex flex-col items-center justify-center relative z-10 mb-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 bg-[var(--color-gold)] opacity-20 blur-2xl rounded-full animate-pulse h-32 w-32 -ml-8 -mt-8"></div>
                <div className="h-20 w-20 bg-black rounded-3xl border border-gray-800 shadow-2xl flex items-center justify-center rotate-3 animate-[spin_6s_linear_infinite_reverse]">
                  <Zap size={32} className="text-[var(--color-gold)] fill-[var(--color-gold)]" />
                </div>
              </div>
              <h2 className="font-[family-name:var(--display)] text-3xl md:text-4xl tracking-tight text-[var(--color-ink)] mb-6 text-center">Synthesizing...</h2>
              <div className="w-full max-w-md bg-[var(--color-cream2)] rounded-full h-3 overflow-hidden relative shadow-inner z-10">
                <div className="bg-[var(--color-gold)] h-full transition-all duration-700 ease-out relative" style={{ width: `${progress}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50"></div>
                </div>
              </div>
              <p className="font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-ink3)] mt-4">{progress}% Complete</p>
            </div>

            {/* 🌟 ADSTERRA 3:1 NATIVE WIDGET LOUNGE */}
            <div className="w-full flex flex-col items-center justify-center border-t border-[var(--rule)] pt-8">
              <div className="flex items-center gap-2 mb-4">
                 <p className="font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-ink3)] text-center">
                   Ads help us keep PicFOMO free for everyone. Thanks for your patience! 💛
                 </p>
              </div>
              <div className="w-full min-h-[120px] bg-[var(--color-white)] rounded-xl border border-[var(--rule)] flex items-center justify-center overflow-hidden shadow-sm">
                 {/* Native Ad injects safely here! */}
                 <NativeAd />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: RESULT (Supports both 'Styles' and 'Imagine' outputs)
          ========================================================================= */}
      {view === "result" && outputImage && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <button onClick={() => setView("grid")} className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-ink)] transition-colors">
              <ChevronLeft size={16} /> Studio Home
            </button>
            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full border border-green-500/20 font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 size={14} /> Saved to Vault
            </div>
          </div>

          <div className="w-full bg-[var(--color-white)] rounded-[32px] md:rounded-[40px] p-4 md:p-8 shadow-[var(--shadow-2xl)] border border-[var(--rule)] flex flex-col md:flex-row gap-8 items-center relative">
            
            {/* 🌟 AGGRESSIVE PUBLISH UPSELL MODAL (DELAYED 5.5 SECONDS) */}
            {showPublishModal && (
              <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md rounded-[32px] md:rounded-[40px] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
                <div className="bg-[var(--color-white)] p-8 rounded-3xl shadow-2xl max-w-md w-full border border-[var(--rule)] text-center relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[var(--color-gold)] opacity-20 blur-2xl animate-pulse"></div>
                  
                  <button onClick={() => setShowPublishModal(false)} className="absolute right-4 top-4 text-[var(--color-ink3)] hover:text-[var(--color-ink)] bg-[var(--color-cream)] rounded-full p-2 border border-[var(--rule)]">
                    <X size={16} />
                  </button>

                  <div className="mx-auto w-16 h-16 bg-[var(--color-gold-pale)] border border-[var(--color-gold-border)] text-[var(--color-gold)] flex items-center justify-center rounded-full mb-6">
                    <Globe size={32} />
                  </div>
                  <h3 className="font-[family-name:var(--display)] text-3xl mb-2 text-[var(--color-ink)]">Publish to Explore</h3>
                  <p className="text-[var(--color-ink2)] text-[13px] mb-6 leading-relaxed">
                    Your masterpiece is ready. Publish it to the public feed to earn <strong className="text-[var(--color-ink)] font-bold">+5 ⚡ instantly</strong>, plus <strong className="text-[var(--color-ink)] font-bold">+1 ⚡</strong> every time someone likes it!
                  </p>
                  
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-[var(--color-ink)] text-[var(--color-white)] hover:bg-[var(--color-gold)] hover:text-black transition-colors font-bold uppercase tracking-[2px] text-[12px] py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
                  >
                    {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <><Zap size={16} className="fill-current" /> PUBLISH & EARN SPARKS</>}
                  </button>
                  <button onClick={() => setShowPublishModal(false)} className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-ink)] hover:underline">
                    Keep it Private
                  </button>
                </div>
              </div>
            )}

            {/* Left: The Visualizer (Slider for Styles, Static for Imagine) */}
            <div className={`w-full md:w-1/2 aspect-[4/5] relative rounded-[24px] overflow-hidden shadow-inner border border-[var(--rule)] bg-black ${sourcePreviewUrl ? 'touch-none cursor-ew-resize' : ''}`}
                 ref={sliderContainerRef}
                 onPointerMove={sourcePreviewUrl ? handleSliderMove : undefined}
            >
              {/* After Image (Background) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outputImage} alt="Synthesized Output" className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Before Image & Slider (Only shown if a file was uploaded) */}
              {sourcePreviewUrl && (
                <>
                  <div className="absolute inset-0 w-full h-full border-r-2 border-white/50" style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sourcePreviewUrl} alt="Original Input" className="absolute inset-0 w-full h-full object-cover filter blur-[2px]" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-md border border-white/10">Raw Input</div>
                  </div>
                  <div className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none" style={{ left: `calc(${sliderPos}% - 2px)` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                      <span className="text-black text-[10px] font-[family-name:var(--mono)] font-bold tracking-tighter">&lt;|&gt;</span>
                    </div>
                  </div>
                </>
              )}
              <div className="absolute top-4 right-4 bg-[var(--color-gold)] text-black text-[9px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-lg pointer-events-none">AI Output</div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 px-2 md:px-6">
              <div>
                <h2 className="font-[family-name:var(--display)] text-4xl md:text-5xl text-[var(--color-ink)] mb-3 tracking-tight">Masterpiece.</h2>
                <p className="text-[var(--color-ink2)] text-[15px] leading-relaxed">
                  {sourcePreviewUrl ? `Your identity has been successfully locked into the ${selectedStyle?.name} universe.` : "Your prompt has been fully realized into an aesthetic creation."}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {/* Download works for both Tabs now! */}
                <button onClick={handleDownload} className="w-full bg-[var(--color-ink)] text-[var(--color-white)] font-[family-name:var(--display)] tracking-[2px] text-[18px] py-5 rounded-2xl hover:bg-[var(--color-gold)] hover:text-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2">
                  <Download size={20} /> DOWNLOAD 4K
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleShare} className="bg-[var(--color-cream)] border border-[var(--rule)] text-[var(--color-ink)] font-[family-name:var(--mono)] uppercase tracking-[1.5px] font-bold text-[12px] py-4 rounded-2xl hover:bg-[var(--color-cream2)] transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Share size={16} /> Share
                  </button>
                  
                  {/* 🌟 FULLY WIRED PUBLISH BUTTON */}
                  <button 
                    onClick={handlePublish}
                    disabled={isPublished || isPublishing}
                    className={`border font-[family-name:var(--mono)] uppercase tracking-[1.5px] font-bold text-[12px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isPublished 
                        ? 'bg-[var(--color-cream2)] border-[var(--rule)] text-[var(--color-ink3)] cursor-default' 
                        : 'bg-[var(--color-gold-pale)] border-[var(--color-gold-border)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black'
                    }`}
                  >
                    {isPublishing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isPublished ? (
                      <><CheckCircle2 size={16} /> PUBLISHED</>
                    ) : (
                      <><Zap size={16} className="fill-current" /> Publish (+5⚡)</>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}