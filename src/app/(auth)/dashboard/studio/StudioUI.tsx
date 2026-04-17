"use client";

import { useState, useEffect } from "react";
import Script from "next/script"; 
import { compressAndUploadImage } from "@/lib/uploadImage";

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
  const [outputPostId, setOutputPostId] = useState<string | null>(null); // NEW: Track the post ID
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
      // Fetch image as blob to bypass cross-origin canvas issues
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
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Add PicFOMO Watermark
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "right";
          
          // Add a subtle drop shadow to text for visibility
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
          ctx.fillText("✨ PicFOMO.com", canvas.width - 30, canvas.height - 30);
          
          // Trigger Download
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
      // Fallback for Desktop
      navigator.clipboard.writeText(postUrl);
      alert("Link copied to clipboard! Share it anywhere.");
    }
  };

  // 🚀 VIRAL LOOP 3: COLLAB LINK
  const handleCollab = () => {
    const collabUrl = `${window.location.origin}/explore?remix=${outputPostId}`;
    navigator.clipboard.writeText(collabUrl);
    alert("🤝 Collab link copied! Send it to a friend to remix your style.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 px-4 mt-6 text-gray-900">
      
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold flex items-center justify-center md:justify-start gap-2">
          <span>✨</span> The Studio
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Bring your imagination to reality.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-fit border border-gray-200">
        <button onClick={() => setActiveTab("styles")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "styles" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Premium Styles</button>
        <button onClick={() => setActiveTab("imagine")} className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "imagine" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Imagine (Fast)</button>
      </div>

      {outputImage && !isModalOpen && (
        <div className="w-full aspect-square md:aspect-video relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputImage} alt="Result" className="absolute inset-0 h-full w-full object-contain" />
          
          <button onClick={() => setOutputImage(null)} className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-xs font-bold shadow-sm hover:bg-white">
            Clear Result
          </button>
        </div>
      )}

      {activeTab === "styles" && (
        <>
          {dynamicStyles.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl text-gray-500">
              No premium styles available right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-in slide-in-from-left-4">
              {dynamicStyles.map((style) => (
                <div key={style.id} onClick={() => openStyleModal(style)} className="group cursor-pointer relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-95 bg-gray-100">
                  {style.mainImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={style.mainImage} alt={style.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-extrabold text-sm flex items-center gap-2">
                      {style.name}
                      {style.badge && <span className="bg-white text-black text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-widest">{style.badge}</span>}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-400 mt-0.5">{style.spark_cost} Sparks</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "imagine" && (
        <div className="space-y-4 animate-in slide-in-from-right-4">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Prompt</label>
              <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">NSFW Protected</span>
            </div>
            <textarea placeholder="A sleek futuristic car racing through neon streets..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none h-24 text-sm md:text-base" />
          </div>
          
          {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

          <div>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md">
              {isGenerating ? "Synthesizing..." : "Generate (2 Sparks)"}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
              By generating, you accept our <a href="#" className="underline">Terms & Conditions</a>. AI generations are completely private and auto-deleted from our servers.
            </p>
          </div>
        </div>
      )}

      {/* 🌟 THE DYNAMIC MODAL 🌟 */}
      {isModalOpen && selectedStyle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Modal Header */}
            {!isGenerating && !outputImage && (
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h2 className="font-extrabold text-lg flex items-center gap-2">{selectedStyle.name}</h2>
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200">✕</button>
              </div>
            )}

            {/* STATE 3: RESULT VIEW */}
            {outputImage ? (
              <div className="animate-in zoom-in-95 duration-500 bg-gray-50 flex flex-col items-center">
                <button onClick={() => { setIsModalOpen(false); setOutputImage(null); setOutputPostId(null); }} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white z-10 hover:bg-black/80">✕</button>
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outputImage} alt="Result" className="w-full aspect-[4/5] object-contain bg-black" />
                
                <div className="p-6 w-full space-y-3 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                  <h3 className="font-extrabold text-lg text-center text-green-600 mb-2">✨ Reality Synthesized</h3>
                  
                  {/* 🚀 VIRAL ACTION BUTTONS ACTIVATED 🚀 */}
                  <button onClick={handleDownload} className="w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex justify-center items-center gap-2">
                    ⬇️ Download Image
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleShare} className="bg-blue-50 border border-blue-100 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors">↗️ Share to Story</button>
                    <button onClick={handleCollab} className="bg-purple-50 border border-purple-100 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-100 transition-colors">🤝 Collab Link</button>
                  </div>

                </div>
              </div>
            ) 
            
            /* STATE 2: GENERATING (PROGRESS BAR & ADS) */
            : isGenerating || isUploading ? (
              <div className="p-8 py-10 flex flex-col items-center justify-center text-center space-y-6">
                
                {/* 🌟 RE-ADDED: ADSTERRA SOCIAL BAR (Full Screen Pop) 🌟 */}
                <Script 
                  id="adsterra-social-bar"
                  src="//pl29173184.profitablecpmratenetwork.com/60/ab/b9/60abb92c67b12ba0a5b4574a79d2e149.js"
                  strategy="afterInteractive"
                />

                <div className="text-4xl animate-bounce">⚡</div>
                <h2 className="font-extrabold text-xl text-gray-900">Synthesizing Reality...</h2>
                
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative border border-gray-200">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="font-bold text-gray-400">{progress}%</p>

                {/* 🌟 ADSTERRA NATIVE BANNER 🌟 */}
                <div className="w-full min-h-[100px] border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative pt-4 pb-2">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold absolute top-1 left-2">Sponsored</span>
                  
                  {/* Your exact Native Banner Code */}
                  <div id="container-b39280394b30c04b29a8908fb4b0bd64"></div> 
                  <Script 
                    id="adsterra-native-banner"
                    src="//pl29173183.profitablecpmratenetwork.com/b39280394b30c04b29a8908fb4b0bd64/invoke.js" 
                    strategy="afterInteractive"
                    data-cfasync="false"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 font-medium leading-relaxed text-left">
                  <p>🛠️ <strong>We are in Beta!</strong></p>
                  <p className="mt-1">High-end AI GPUs cost a fortune. We pay the server bills using the ads on this screen. Please bear with us and interact with the sponsors to keep PicFOMO free for everyone! ❤️</p>
                </div>
              </div>
            ) 
            
            /* STATE 1: UPLOAD & CONFIRM */
            : (
              <div className="flex flex-col h-full">
                <div className="p-5 space-y-5 overflow-y-auto">
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" id="modal-upload" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={isUploading || isGenerating} />
                    <label htmlFor="modal-upload" className="cursor-pointer block">
                      <div className="text-3xl mb-2">{file ? "✅" : "📸"}</div>
                      <h3 className={`font-bold text-sm ${file ? 'text-green-700' : 'text-gray-700'}`}>{file ? file.name : "Tap to upload photo"}</h3>
                      {!file && <p className="text-gray-400 text-xs mt-1">JPEG, PNG up to 10MB</p>}
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Additional Instructions (Optional)</label>
                    <input type="text" placeholder="e.g., make the jacket blue..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isUploading || isGenerating} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none focus:border-gray-400" />
                  </div>

                  {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">{error}</div>}
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 mt-auto">
                  <button onClick={handleGenerate} disabled={isGenerating || isUploading || !file} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-extrabold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/30 active:scale-95">
                    {isUploading || isGenerating ? "Please Wait..." : `Generate (-${selectedStyle.spark_cost} Sparks) & Watch Ad`}
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">By generating, you accept our Terms & Conditions. AI generations are completely private.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}