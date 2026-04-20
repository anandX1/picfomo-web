"use client";

import { useState, useEffect } from "react";
import Script from "next/script"; 
import { compressAndUploadImage } from "@/lib/uploadImage";
import { Sparkles, Image as ImageIcon, CheckCircle2, Download, Share, Link as LinkIcon, X, Zap, Loader2 } from "lucide-react";

const NSFW_WORDS = ["nude", "naked", "nsfw", "porn", "blood", "gore", "explicit", "violence"];

export default function StudioUI({ dynamicStyles }: { dynamicStyles: any[] }) {
  const [activeTab, setActiveTab] = useState<"styles" | "imagine">("styles");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(dynamicStyles[0] || null);
  
  // Form State
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // Loading & Output States
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [outputPostId, setOutputPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🌟 PROGRESS BAR LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev; 
          return prev + Math.floor(Math.random() * 5) + 2; 
        });
      }, 1000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const containsNSFW = (text: string) => {
    return NSFW_WORDS.some(word => text.toLowerCase().includes(word));
  };

  const openStyleModal = (style: any) => {
    setSelectedStyle(style);
    setFile(null); 
    setError(null);
    setIsModalOpen(true);
  };

  const handleGenerate = async () => {
    setError(null);
    setOutputImage(null);
    setOutputPostId(null);

    if (!prompt && activeTab === "imagine") return setError("Please enter a prompt.");
    if (prompt && containsNSFW(prompt)) return setError("⚠️ Prompt rejected: Violates safety guidelines.");
    if (activeTab === "styles" && !file) return setError("Please upload your photo.");

    try {
      let uploadedImageUrl = "";

      if (activeTab === "styles" && file) {
        setIsUploading(true);
        uploadedImageUrl = await compressAndUploadImage(file);
        setIsUploading(false);
      }

      setIsGenerating(true);
      
      const payload = activeTab === "imagine" 
        ? { prompt, model: "schnell" } 
        : { prompt, styleId: selectedStyle.id, sourceImage: uploadedImageUrl };

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
          setIsGenerating(false);
          if (activeTab === "imagine") setIsModalOpen(false); 
        }, 500);
      }

    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      setIsGenerating(false);
    }
  };

  // 🚀 VIRAL LOOP 1: WATERMARK DOWNLOAD LOGIC
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
      console.error("Download failed", error);
      alert("Failed to download image. Try right-clicking and saving.");
    }
  };

  // 🚀 VIRAL LOOP 2: NATIVE MOBILE SHARE
  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${outputPostId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My PicFOMO Creation",
          text: "Check out what I generated on PicFOMO!",
          url: postUrl,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      alert("Link copied to clipboard! Share it anywhere.");
    }
  };

  // 🚀 VIRAL LOOP 3: COLLAB LINK
  const handleCollab = () => {
    const collabUrl = `${window.location.origin}/explore?remix=${outputPostId}`;
    navigator.clipboard.writeText(collabUrl);
    alert("Collab link copied! Send it to a friend to remix your style.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 px-4 mt-6 text-[var(--color-ink)]">
      
      {/* 🌟 HEADER: Fully adaptive typography */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-[family-name:var(--display)] flex items-center justify-center md:justify-start gap-3">
          <Sparkles className="text-[var(--color-gold)]" size={32} /> The Studio
        </h1>
        <p className="text-[var(--color-ink3)] mt-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[2px]">
          Bring your imagination to reality.
        </p>
      </div>

      {/* 🌟 TABS: Adaptive background & hover states */}
      <div className="flex bg-[var(--color-cream)] p-1.5 rounded-xl w-full md:w-fit border border-[var(--rule)] shadow-sm">
        <button onClick={() => setActiveTab("styles")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "styles" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink3)] hover:text-[var(--color-ink)]"}`}>Premium Styles</button>
        <button onClick={() => setActiveTab("imagine")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "imagine" ? "bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink3)] hover:text-[var(--color-ink)]"}`}>Imagine (Fast)</button>
      </div>

      {outputImage && !isModalOpen && (
        <div className="w-full aspect-square md:aspect-video relative rounded-3xl overflow-hidden shadow-[var(--shadow-lg)] border border-[var(--rule)] bg-[var(--color-cream)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputImage} alt="Result" className="absolute inset-0 h-full w-full object-contain" />
          
          <button onClick={() => setOutputImage(null)} className="absolute top-4 right-4 bg-[var(--color-white)]/80 backdrop-blur-md px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold text-[var(--color-ink)] shadow-sm hover:bg-[var(--color-white)] flex items-center gap-2 transition-colors">
            <X size={14} /> Clear Result
          </button>
        </div>
      )}

      {activeTab === "styles" && (
        <>
          {dynamicStyles.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-[var(--rule)] rounded-3xl text-[var(--color-ink3)] font-[family-name:var(--mono)] text-[12px] uppercase tracking-widest">
              No premium styles available right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-left-4">
              {dynamicStyles.map((style) => (
                <div key={style.id} onClick={() => openStyleModal(style)} className="group cursor-pointer relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-[var(--shadow-sm)] border border-[var(--rule)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-gold-border)] transition-all duration-300 active:scale-95 bg-[var(--color-cream2)]">
                  {style.mainImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={style.mainImage} alt={style.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-[family-name:var(--display)] tracking-[0.5px] text-[16px] leading-tight flex items-center gap-2 drop-shadow-md">
                      {style.name}
                      {style.badge && <span className="bg-white text-black text-[8px] font-sans px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">{style.badge}</span>}
                    </div>
                    <div className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] font-bold text-[var(--color-gold)] mt-1.5 flex items-center gap-1 drop-shadow-md">
                      <Zap size={10} className="fill-[var(--color-gold)]" /> {style.spark_cost} Sparks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "imagine" && (
        <div className="space-y-4 animate-in slide-in-from-right-4 max-w-2xl">
          <div className="bg-[var(--color-white)] border border-[var(--rule)] p-5 rounded-2xl shadow-[var(--shadow-sm)] transition-colors focus-within:border-[var(--color-gold-border)]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[11px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink2)] uppercase tracking-wider">Prompt</label>
              <span className="bg-green-500/10 text-green-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={10} /> NSFW Protected</span>
            </div>
            <textarea placeholder="A sleek futuristic car racing through neon streets..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent text-[var(--color-ink)] placeholder-[var(--color-ink3)] focus:outline-none resize-none h-24 text-sm md:text-[15px] leading-relaxed" />
          </div>
          
          {error && <div className="text-red-500 text-xs font-[family-name:var(--mono)] uppercase tracking-widest font-bold text-center">{error}</div>}

          <div>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[var(--color-ink)] text-[var(--color-white)] font-[family-name:var(--display)] tracking-[2px] text-[16px] py-4 rounded-xl hover:bg-[var(--color-gold)] hover:text-black transition-all disabled:opacity-50 active:scale-[0.98] shadow-[var(--shadow-md)] flex items-center justify-center gap-2">
              {isGenerating ? <><Loader2 size={18} className="animate-spin" /> SYNTHESIZING...</> : <><Sparkles size={18} /> GENERATE (2 SPARKS)</>}
            </button>
            <p className="text-center text-[10px] text-[var(--color-ink3)] mt-3 font-medium">
              By generating, you accept our Terms & Conditions. AI generations are completely private and auto-deleted.
            </p>
          </div>
        </div>
      )}

      {/* 🌟 THE DYNAMIC MODAL 🌟 */}
      {isModalOpen && selectedStyle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
          <div className="bg-[var(--color-white)] w-full md:max-w-lg rounded-t-[32px] md:rounded-[32px] shadow-[var(--shadow-2xl)] overflow-hidden flex flex-col max-h-[90vh] relative border border-[var(--rule)]">
            
            {/* Modal Header */}
            {!isGenerating && !outputImage && (
              <div className="flex justify-between items-center p-6 border-b border-[var(--rule)] bg-[var(--color-cream)]">
                <h2 className="font-[family-name:var(--display)] text-2xl flex items-center gap-3 text-[var(--color-ink)]">
                  {selectedStyle.name}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="bg-[var(--color-white)] border border-[var(--rule)] p-2 rounded-full text-[var(--color-ink3)] hover:bg-[var(--color-cream2)] hover:text-[var(--color-ink)] transition-colors shadow-sm">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* STATE 3: RESULT VIEW */}
            {outputImage ? (
              <div className="animate-in zoom-in-95 duration-500 bg-[var(--color-cream)] flex flex-col items-center">
                <button onClick={() => { setIsModalOpen(false); setOutputImage(null); setOutputPostId(null); }} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white z-10 hover:bg-black/80 transition-colors shadow-lg"><X size={18} /></button>
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputImage} alt="Result" className="w-full aspect-[4/5] object-contain bg-[#050505]" />
                
                <div className="p-6 w-full space-y-4 bg-[var(--color-white)] border-t border-[var(--rule)]">
                  <h3 className="font-[family-name:var(--display)] tracking-wide text-xl text-center text-[var(--color-ink)] mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="text-[var(--color-gold)]" size={20} /> Reality Synthesized
                  </h3>
                  
                  <button onClick={handleDownload} className="w-full bg-[var(--color-ink)] text-[var(--color-white)] font-[family-name:var(--display)] tracking-[1.5px] text-[15px] py-4 rounded-xl shadow-[var(--shadow-md)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2">
                    <Download size={18} /> DOWNLOAD HIGH-RES
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleShare} className="bg-[var(--color-cream)] border border-[var(--rule)] text-[var(--color-ink)] font-[family-name:var(--mono)] uppercase tracking-[1px] font-bold text-[11px] py-3.5 rounded-xl hover:bg-[var(--color-cream2)] transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <Share size={14} /> Share
                    </button>
                    <button onClick={handleCollab} className="bg-[var(--color-gold-pale)] border border-[var(--color-gold-border)] text-[var(--color-gold)] font-[family-name:var(--mono)] uppercase tracking-[1px] font-bold text-[11px] py-3.5 rounded-xl hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <LinkIcon size={14} /> Collab Link
                    </button>
                  </div>
                </div>
              </div>
            ) 
            
            /* STATE 2: GENERATING (PROGRESS BAR & ADS) */
            : isGenerating || isUploading ? (
              <div className="p-8 py-12 flex flex-col items-center justify-center text-center space-y-8 bg-[var(--color-white)]">
                
                <Script id="adsterra-social-bar" src="//pl29173184.profitablecpmratenetwork.com/60/ab/b9/60abb92c67b12ba0a5b4574a79d2e149.js" strategy="afterInteractive" />

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[var(--color-gold)] opacity-20 blur-xl rounded-full animate-pulse"></div>
                  <Zap size={48} className="text-[var(--color-gold)] animate-bounce relative z-10" />
                </div>
                
                <h2 className="font-[family-name:var(--display)] text-3xl tracking-tight text-[var(--color-ink)]">Synthesizing Reality...</h2>
                
                <div className="w-full bg-[var(--color-cream2)] rounded-full h-3 overflow-hidden relative border border-[var(--rule)] shadow-inner">
                  <div className="bg-[var(--color-gold)] h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="font-[family-name:var(--mono)] text-xs font-bold text-[var(--color-ink3)]">{progress}% Complete</p>

                {/* NATIVE AD */}
                <div className="w-full min-h-[100px] border border-[var(--rule)] rounded-[16px] bg-[var(--color-cream)] flex flex-col items-center justify-center overflow-hidden relative pt-6 pb-2 shadow-sm">
                  <span className="text-[9px] text-[var(--color-ink3)] uppercase tracking-[2px] font-bold absolute top-2 left-3">Sponsored</span>
                  <div id="container-b39280394b30c04b29a8908fb4b0bd64"></div> 
                  <Script id="adsterra-native-banner" src="//pl29173183.profitablecpmratenetwork.com/b39280394b30c04b29a8908fb4b0bd64/invoke.js" strategy="afterInteractive" data-cfasync="false" />
                </div>
              </div>
            ) 
            
            /* STATE 1: UPLOAD & CONFIRM */
            : (
              <div className="flex flex-col h-full bg-[var(--color-white)]">
                <div className="p-6 space-y-6 overflow-y-auto">
                  
                  <div className={`border-2 border-dashed rounded-[20px] p-8 text-center transition-all duration-300 cursor-pointer ${file ? 'border-[var(--color-gold)] bg-[var(--color-gold-pale)] shadow-inner' : 'border-[var(--rule)] bg-[var(--color-cream)] hover:bg-[var(--color-cream2)]'}`}>
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" id="modal-upload" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={isUploading || isGenerating} />
                    <label htmlFor="modal-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      {file ? <CheckCircle2 size={48} className="text-[var(--color-gold)] mb-4 drop-shadow-sm" /> : <ImageIcon size={48} className="text-[var(--color-ink3)] mb-4" />}
                      <h3 className={`font-[family-name:var(--display)] text-xl tracking-wide ${file ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink2)]'}`}>{file ? file.name : "Tap to upload photo"}</h3>
                      {!file && <p className="text-[var(--color-ink3)] font-[family-name:var(--mono)] text-[10px] mt-2 uppercase tracking-[2px]">JPEG, PNG up to 10MB</p>}
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink2)] uppercase tracking-wider mb-2 block">Additional Instructions (Optional)</label>
                    <input type="text" placeholder="e.g., make the jacket blue..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isUploading || isGenerating} className="w-full bg-[var(--color-cream)] border border-[var(--rule)] text-[var(--color-ink)] rounded-xl p-4 text-[14px] focus:outline-none focus:border-[var(--color-gold-border)] transition-colors shadow-sm" />
                  </div>

                  {error && <div className="text-red-500 font-[family-name:var(--mono)] text-[10px] uppercase tracking-widest font-bold text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                </div>

                <div className="p-6 border-t border-[var(--rule)] bg-[var(--color-cream)] mt-auto">
                  <button onClick={handleGenerate} disabled={isGenerating || isUploading || !file} className="w-full bg-[var(--color-gold)] text-black font-[family-name:var(--display)] tracking-[2px] text-[16px] py-4.5 rounded-xl hover:bg-[var(--color-gold-light)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 shadow-md active:scale-95 flex items-center justify-center gap-2">
                    {isUploading || isGenerating ? <><Loader2 size={18} className="animate-spin" /> INITIALIZING...</> : <><Sparkles size={18} /> GENERATE (-{selectedStyle.spark_cost} SPARKS)</>}
                  </button>
                  <p className="text-center text-[10px] text-[var(--color-ink3)] mt-4 font-medium">By generating, you accept our Terms. AI generations are auto-deleted.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}