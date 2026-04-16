"use client";

import { useState, useRef, useEffect } from "react";

export default function UnifiedMVPLab() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<"styles" | "imagine">("styles");
  const [status, setStatus] = useState("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- STYLES (FIRE-RED V1.1) STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [stylePrompt, setStylePrompt] = useState("Professional headshot, cyberpunk lighting, highly detailed");
  const [frNumSteps, setFrNumSteps] = useState(30);
  const [frGuidance, setFrGuidance] = useState(4);
  const [frAcceleration, setFrAcceleration] = useState("regular");
  const [finalStyleImage, setFinalStyleImage] = useState<string | null>(null);

  // --- IMAGINE (SCHNELL / SDXL) STATE ---
  const [imaginePrompt, setImaginePrompt] = useState("Picture a sleek, futuristic car racing through a neon-lit cityscape");
  const [selectedModel, setSelectedModel] = useState<"schnell" | "sdxl">("schnell");
  // Schnell specific params from your new docs
  const [schWidth, setSchWidth] = useState(1024);
  const [schHeight, setSchHeight] = useState(1024);
  const [schSteps, setSchSteps] = useState(4);
  const [finalImagineImage, setFinalImagineImage] = useState<string | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // --- HELPER: R2 UPLOAD ---
  const uploadToR2 = async (fileToUpload: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error(`R2 Upload failed status ${res.status}`);
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  // --- HELPER: FIRE-RED POLLING ---
  const pollFireRedResult = async (pollingUrl: string): Promise<string> => {
    const PIXAZO_KEY = process.env.PIXAZO_API_KEY!;
    let attempts = 0;
    const MAX_ATTEMPTS = 60;
    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      addLog(`Polling attempt ${attempts}...`);
      try {
        const response = await fetch(pollingUrl, { headers: { "Ocp-Apim-Subscription-Key": PIXAZO_KEY }});
        if (!response.ok) throw new Error(`HTTP_FATAL: ${response.status}`);
       const data = (await response.json()) as any;
        const currentStatus = typeof data.status === 'string' ? data.status.toUpperCase() : "UNKNOWN";
        addLog(`↳ Status: ${currentStatus}`);
        if (currentStatus === "COMPLETED" || currentStatus === "SUCCESS") {
          addLog(`✅ Generation Successful!`);
          return Array.isArray(data.output?.media_url) ? data.output.media_url[0] : data.output?.media_url || data.media_url; 
        }
        if (currentStatus === "FAILED" || currentStatus === "ERROR") {
          throw new Error(`HARD_FAIL: ${JSON.stringify(data.error || data)}`);
        }
      } catch (err: any) {
        if (err.message.includes("HARD_FAIL") || err.message.includes("HTTP_FATAL")) throw err; 
        addLog(`⚠️ Network hiccup: ${err.message}`);
      }
    }
    throw new Error("Polling Timeout");
  };

  // --- PIPELINE 1: FIRE-RED V1.1 (Styles) ---
  const runStylesPipeline = async () => {
    if (!file) return alert("Upload a photo first!");
    if (!stylePrompt) return alert("Provide a style prompt!");
    setIsTesting(true); setFinalStyleImage(null); setLogs([]); 
    const PIXAZO_KEY = process.env.NEXT_PUBLIC_PIXAZO_API_KEY;
    if (!PIXAZO_KEY) return addLog("❌ ERROR: API KEY missing.");

    try {
      setStatus("Uploading to R2...");
      addLog(`🚀 Uploading ${file.name} to Cloudflare R2...`);
      const r2Url = await uploadToR2(file);
      addLog(`✅ R2 Upload Success.`);
      
      setStatus(`Executing FireRed v1.1...`);
      const payload = {
        prompt: stylePrompt,
        image_urls: [r2Url], // V1.1 requirement
        num_inference_steps: frNumSteps,
        guidance_scale: frGuidance,
        acceleration: frAcceleration
      };

      addLog(`🚀 Sending V1.1 JSON payload...`);
      const res = await fetch("https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${await res.text()}`);
      const data = (await res.json()) as any;
      addLog(`✅ Queued. ID: ${data.request_id}`);
      
      const targetUrl = data.polling_url || `https://gateway.pixazo.ai/v2/requests/status/${data.request_id}`;
      const generatedUrl = await pollFireRedResult(targetUrl);
      setFinalStyleImage(generatedUrl);
      setStatus("Complete.");
      addLog("🎉 STYLE SYNTHESIS SUCCESSFUL.");
    } catch (error) {
      setStatus("ERROR"); addLog(`🛑 FATAL: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // --- PIPELINE 2: FLUX SCHNELL (Imagine) ---
  const runImaginePipeline = async () => {
    if (!imaginePrompt) return alert("Enter a prompt!");
    if (selectedModel === "sdxl") return alert("ERROR: Waiting on SDXL API Docs from CTO! Upload the screenshots first.");
    
    setIsTesting(true); setFinalImagineImage(null); setLogs([]); 
    const PIXAZO_KEY = process.env.NEXT_PUBLIC_PIXAZO_API_KEY;
    if (!PIXAZO_KEY) return addLog("❌ ERROR: API KEY missing.");

    try {
      setStatus("Generating via Flux Schnell...");
      addLog(`🚀 Sending synchronous request to Flux 1 Schnell...`);
      
      // Matching your new docs exactly
      const payload = { 
        prompt: imaginePrompt, 
        num_steps: schSteps, 
        height: schHeight, 
        width: schWidth 
        // seed: omitted to allow random generation each time
      };

      const res = await fetch("https://gateway.pixazo.ai/flux-1-schnell/v1/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${await res.text()}`);
      const data = (await res.json()) as { output: string };
      
      if (data.output) {
        setFinalImagineImage(data.output);
        setStatus("Complete.");
        addLog("🎉 INSTANT GENERATION SUCCESSFUL.");
      } else {
        throw new Error("No image URL returned in payload.");
      }
    } catch (error) {
      setStatus("ERROR"); addLog(`🛑 FATAL: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-black text-white min-h-screen font-[family-name:var(--mono)] pb-24">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--display)]">MVP Creator Lab</h1>
          <p className="text-gray-400">Status: {status}</p>
        </div>
      </div>

      {/* --- MASTER TABS --- */}
      <div className="flex gap-4 mb-8 bg-gray-900 p-2 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("styles")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "styles" ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "text-gray-400 hover:text-white"}`}
        >
          Styles (FireRed)
        </button>
        <button 
          onClick={() => setActiveTab("imagine")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "imagine" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "text-gray-400 hover:text-white"}`}
        >
          Imagine (Free APIs)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* --- LEFT: CONTROLS --- */}
        <div className="flex flex-col gap-6">
          
          {activeTab === "styles" ? (
            /* --- STYLES CONTROLS (FIRE-RED) --- */
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <div className="border border-gray-800 p-4 rounded-xl bg-gray-900/50">
                <label className="block mb-2 font-bold text-sm text-red-400">Upload Selfie</label>
                <input type="file" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-red-400 border-b border-gray-800">STYLE PROMPT</div>
                <textarea 
                  value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)}
                  className="w-full h-20 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* FireRed v1.1 Params */}
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4 space-y-4">
                 <div className="text-xs font-bold text-yellow-500 mb-2">V1.1 ENGINE CONTROLS</div>
                 <div>
                    <label className="flex justify-between mb-1 text-xs text-gray-400">
                        <span>Steps</span> <span className="text-yellow-500">{frNumSteps}</span>
                    </label>
                    <input type="range" min="10" max="50" value={frNumSteps} onChange={(e) => setFrNumSteps(Number(e.target.value))} className="w-full accent-yellow-500" />
                 </div>
                 <div>
                    <label className="flex justify-between mb-1 text-xs text-gray-400">
                        <span>Guidance</span> <span className="text-yellow-500">{frGuidance}</span>
                    </label>
                    <input type="range" min="1" max="10" step="0.5" value={frGuidance} onChange={(e) => setFrGuidance(Number(e.target.value))} className="w-full accent-yellow-500" />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setFrAcceleration("regular")} className={`px-4 py-2 text-xs rounded border ${frAcceleration === "regular" ? "bg-yellow-900/40 border-yellow-500 text-yellow-400" : "bg-gray-800 border-gray-700"}`}>Regular</button>
                    <button onClick={() => setFrAcceleration("fast")} className={`px-4 py-2 text-xs rounded border ${frAcceleration === "fast" ? "bg-yellow-900/40 border-yellow-500 text-yellow-400" : "bg-gray-800 border-gray-700"}`}>Fast</button>
                 </div>
              </div>

              <button onClick={runStylesPipeline} disabled={isTesting} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-500 disabled:opacity-50 active:scale-95">
                {isTesting ? "Applying Premium Style..." : "Generate Premium Style"}
              </button>
            </div>
          ) : (
            
            /* --- IMAGINE CONTROLS (SCHNELL / SDXL) --- */
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex gap-4">
                <button onClick={() => setSelectedModel("schnell")} className={`flex-1 py-3 rounded-xl border text-sm font-bold ${selectedModel === "schnell" ? "bg-blue-900/40 border-blue-500 text-blue-400" : "bg-gray-900 border-gray-800"}`}>Flux Schnell</button>
                <button onClick={() => setSelectedModel("sdxl")} className={`flex-1 py-3 rounded-xl border text-sm font-bold ${selectedModel === "sdxl" ? "bg-purple-900/40 border-purple-500 text-purple-400" : "bg-gray-900 border-gray-800 relative overflow-hidden"}`}>
                  SDXL <span className="absolute top-0 right-0 bg-red-600 text-[9px] px-2 py-0.5 rounded-bl-lg text-white font-black">NEED DOCS</span>
                </button>
              </div>
              
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-blue-400 border-b border-gray-800">IMAGINATION PROMPT</div>
                <textarea 
                  value={imaginePrompt} onChange={(e) => setImaginePrompt(e.target.value)}
                  className="w-full h-24 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Flux Schnell Params based on docs */}
              {selectedModel === "schnell" && (
                <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4 space-y-4">
                  <div className="text-xs font-bold text-blue-400 mb-2">SCHNELL ENGINE CONTROLS</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                      <select onChange={(e) => {
                        const val = Number(e.target.value);
                        setSchWidth(val); setSchHeight(val);
                      }} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm">
                        <option value={512}>512 x 512</option>
                        <option value={1024} selected>1024 x 1024</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Steps ({schSteps})</label>
                      <input type="range" min="1" max="8" value={schSteps} onChange={(e) => setSchSteps(Number(e.target.value))} className="w-full accent-blue-500 mt-2" />
                    </div>
                  </div>
                </div>
              )}

              <button onClick={runImaginePipeline} disabled={isTesting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 disabled:opacity-50 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {isTesting ? "Synthesizing..." : `Instant Generate (${selectedModel === "schnell" ? "Free" : "Locked"})`}
              </button>
            </div>
          )}
        </div>

        {/* --- RIGHT: UNIFIED LIVE TERMINAL --- */}
        <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] flex flex-col h-64 lg:h-full">
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 text-xs font-bold text-gray-400 flex justify-between">
            <span>LIVE TERMINAL</span>
            <span className={isTesting ? "text-green-500 animate-pulse" : ""}>{isTesting ? "EXECUTING" : "STANDBY"}</span>
          </div>
          <div className="p-4 overflow-y-auto flex-grow text-xs font-mono text-green-400 space-y-1">
            {logs.length === 0 && <span className="text-gray-600">Awaiting input...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('❌') || log.includes('🛑') || log.includes('ERROR') ? 'text-red-400' : ''} ${log.includes('✅') || log.includes('🎉') ? 'text-blue-400' : ''}`}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* --- OUTPUT DISPLAY --- */}
      <div className="mt-10 max-w-lg mx-auto">
        {activeTab === "styles" && finalStyleImage && (
          <div className="animate-in fade-in zoom-in duration-500">
             <h3 className="text-sm font-bold text-red-500 mb-2 uppercase text-center tracking-widest">Premium Output</h3>
             <img src={finalStyleImage} alt="Style" className="w-full rounded-xl border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]" />
          </div>
        )}
        {activeTab === "imagine" && finalImagineImage && (
          <div className="animate-in fade-in zoom-in duration-500">
             <h3 className="text-sm font-bold text-blue-500 mb-2 uppercase text-center tracking-widest">Instant Output</h3>
             <img src={finalImagineImage} alt="Imagine" className="w-full rounded-xl border border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]" />
          </div>
        )}
      </div>
    </div>
  );
}