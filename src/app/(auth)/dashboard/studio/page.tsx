"use client";

import { useState } from "react";
import Image from "next/image";
import { compressAndUploadImage } from "@/lib/uploadImage"; // 🌟 NEW IMPORT

const NSFW_WORDS = ["nude", "naked", "nsfw", "porn", "blood", "gore", "explicit", "violence"];

const STYLES = [
  { id: "try-on", name: "Virtual Try-On", icon: "👕", cost: 5 },
  { id: "product", name: "Product Shot", icon: "📸", cost: 4 },
  { id: "old-money", name: "Old Money", icon: "🏛️", cost: 5 },
  { id: "claymation", name: "Claymation", icon: "🧱", cost: 6 },
];

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<"styles" | "imagine">("styles");
  
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [file, setFile] = useState<File | null>(null);
  
  // 🌟 NEW: Split loading states so the user knows what is happening
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containsNSFW = (text: string) => {
    const lowerText = text.toLowerCase();
    return NSFW_WORDS.some(word => lowerText.includes(word));
  };

  const handleGenerate = async () => {
    setError(null);
    setOutputImage(null);

    if (!prompt && activeTab === "imagine") return setError("Please enter a prompt.");
    if (prompt && containsNSFW(prompt)) return setError("⚠️ Prompt rejected: Violates safety guidelines.");
    if (activeTab === "styles" && !file) return setError("Please upload an image for this style.");

    try {
      let uploadedImageUrl = "";

      // 🌟 WORKFLOW 1: PREMIUM STYLES (Needs Image Upload)
      if (activeTab === "styles" && file) {
        setIsUploading(true);
        // 1. Compress and Upload the Image to R2
        uploadedImageUrl = await compressAndUploadImage(file);
        setIsUploading(false);
      }

      // 🌟 WORKFLOW 2: CALL THE AI ENGINE
      setIsGenerating(true);
      
      const payload = activeTab === "imagine" 
        ? { prompt, model: "schnell" } 
        : { prompt, styleId: selectedStyle, sourceImage: uploadedImageUrl };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation failed");
      if (data.output) setOutputImage(data.output);

    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span>✨</span> The Studio
        </h1>
        <p className="text-gray-400 mt-2">Bring your imagination to reality.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#111] p-1.5 rounded-xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab("styles")}
          className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "styles" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
          }`}
        >
          Premium Styles
        </button>
        <button 
          onClick={() => setActiveTab("imagine")}
          className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "imagine" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
          }`}
        >
          Imagine (Fast)
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Controls */}
        <div className="space-y-6">
          
          {/* STYLES TAB CONTENT */}
          {activeTab === "styles" && (
            <div className="space-y-6 animate-in slide-in-from-left-4">
              {/* Image Upload Box */}
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer bg-[#0a0a0a]">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden" 
                  id="image-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-3">📸</div>
                  <h3 className="text-white font-medium">
                    {file ? file.name : "Drop your selfie here"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">JPEG, PNG up to 10MB (Auto-Compressed)</p>
                </label>
              </div>

              {/* Style Selector */}
              <div>
                <label className="text-sm font-bold text-gray-300 mb-3 block">Select Aesthetic</label>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                        selectedStyle === style.id 
                          ? "bg-blue-500/10 border-blue-500" 
                          : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <div className="text-white text-sm font-bold">{style.name}</div>
                        <div className="text-blue-400 text-xs font-mono">{style.cost} Sparks</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IMAGINE TAB CONTENT */}
          {activeTab === "imagine" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-blue-400">IMAGINATION PROMPT</label>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded-full font-bold tracking-wider">NSFW PROTECTED</span>
                </div>
                <textarea 
                  placeholder="A cinematic shot of a cyberpunk city..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none resize-none h-32"
                />
              </div>
            </div>
          )}

          {/* Shared Prompt for Styles */}
          {activeTab === "styles" && (
             <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
               <input 
                 type="text"
                 placeholder="Additional prompt details (optional)..."
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="w-full bg-transparent text-white placeholder:text-gray-600 text-sm focus:outline-none"
               />
             </div>
          )}

          {/* Error Display */}
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || isUploading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isUploading ? (
              "Securely Uploading Image..."
            ) : isGenerating ? (
              "Synthesizing Reality..."
            ) : (
              <>
                Generate 
                <span className="text-gray-500 font-mono text-xs ml-1">
                  ({activeTab === "imagine" ? "2 Sparks" : `${STYLES.find(s => s.id === selectedStyle)?.cost} Sparks`})
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl min-h-[500px] flex items-center justify-center relative overflow-hidden">
          {outputImage ? (
            <Image src={outputImage} alt="Generated output" fill className="object-cover" />
          ) : (
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-3 opacity-50">✨</div>
              <p className="text-sm font-medium">Awaiting Subject Input</p>
            </div>
          )}
          
          {/* Scanning Overlay Effect */}
          {(isGenerating || isUploading) && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}