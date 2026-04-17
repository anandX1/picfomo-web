"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      const data = (await res.json()) as { error?: string; output?: string };

      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      if (data.output) {
        setOutputImage(data.output);
        setIsModalOpen(false); 
      }

    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
    } finally {
      setIsGenerating(false);
    }
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
        <button 
          onClick={() => setActiveTab("styles")}
          className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "styles" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Premium Styles
        </button>
        <button 
          onClick={() => setActiveTab("imagine")}
          className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "imagine" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Imagine (Fast)
        </button>
      </div>

      {outputImage && !isModalOpen && (
        <div className="w-full aspect-square md:aspect-video relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50">
          <Image src={outputImage} alt="Result" fill className="object-contain" />
          <button 
            onClick={() => setOutputImage(null)}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-xs font-bold shadow-sm hover:bg-white"
          >
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
                <div 
                  key={style.id}
                  onClick={() => openStyleModal(style)}
                  className="group cursor-pointer relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-95 bg-gray-100"
                >
                  {style.mainImage && (
                    <Image src={style.mainImage} alt={style.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-extrabold text-sm flex items-center gap-2">
                      {style.name}
                      {style.badge && (
                        <span className="bg-white text-black text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-widest">{style.badge}</span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-400 mt-0.5">{style.spark_cost} Sparks</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* IMAGINE TAB WITH DISCLAIMER */}
      {activeTab === "imagine" && (
        <div className="space-y-4 animate-in slide-in-from-right-4">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Prompt</label>
              <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">NSFW Protected</span>
            </div>
            <textarea 
              placeholder="A sleek futuristic car racing through neon streets..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none h-24 text-sm md:text-base"
            />
          </div>
          
          {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

          <div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md"
            >
              {isGenerating ? "Synthesizing..." : "Generate (2 Sparks)"}
            </button>
            {/* 🌟 LEGAL DISCLAIMER */}
            <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
              By generating, you accept our <a href="#" className="underline">Terms & Conditions</a>. AI generations are completely private and auto-deleted from our servers.
            </p>
          </div>
        </div>
      )}

      {/* PREMIUM STYLE MODAL WITH DISCLAIMER */}
      {isModalOpen && selectedStyle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-extrabold text-lg flex items-center gap-2">
                {selectedStyle.name}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto">
              {(isUploading || isGenerating) && (
                <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 text-center animate-pulse">
                  <p className="text-blue-600 font-bold text-sm mb-1">
                    {isUploading ? "1. Securing Upload..." : "2. Processing Image..."}
                  </p>
                  <p className="text-blue-400 text-xs">[ Advertisement Space Loading ]</p>
                </div>
              )}

              <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden" 
                  id="modal-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isUploading || isGenerating}
                />
                <label htmlFor="modal-upload" className="cursor-pointer block">
                  <div className="text-3xl mb-2">{file ? "✅" : "📸"}</div>
                  <h3 className={`font-bold text-sm ${file ? 'text-green-700' : 'text-gray-700'}`}>
                    {file ? file.name : "Tap to upload photo"}
                  </h3>
                  {!file && <p className="text-gray-400 text-xs mt-1">JPEG, PNG up to 10MB</p>}
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Additional Instructions (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., make the jacket blue..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isUploading || isGenerating}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              {error && <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">{error}</div>}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || isUploading || !file}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-extrabold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/30 active:scale-95"
              >
                {isUploading || isGenerating 
                  ? "Please Wait..." 
                  : `Generate (-${selectedStyle.spark_cost} Sparks) & Watch Ad`
                }
              </button>
              {/* 🌟 LEGAL DISCLAIMER */}
              <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">
                By generating, you accept our Terms & Conditions. AI generations are completely private and auto-deleted from our servers.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}