"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RawCollabSandbox() {
  // --- STATE ---
  const [targetFile, setTargetFile] = useState<File | null>(null); // The Scene/Background
  const [inputFile, setInputFile] = useState<File | null>(null);   // The Face to inject
  const [prompt, setPrompt] = useState("Seamlessly blend the face into the character, matching the exact lighting, skin tone, and artistic style of the original image.");
  const [apiKey, setApiKey] = useState(""); // Input your Pixazo key directly for testing
  
  const [status, setStatus] = useState("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- AUTO-SCROLL LOGS ---
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // --- HELPER: FILE TO BASE64 ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // --- HELPER: POLLING LOGIC ---
  const pollPixazoStatus = async (pollingUrl: string, key: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 2.5 minutes max

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      addLog(`⏳ Polling attempt ${attempts + 1}...`);
      
      const res = await fetch(pollingUrl, {
        headers: { "Ocp-Apim-Subscription-Key": key }
      });
      
      // 🌟 TS FIX: Cast as 'any' to resolve "type is unknown" errors
      const data = (await res.json()) as any;

      if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
        return data.output.media_url[0];
      }
      
      if (data.status === "FAILED" || data.status === "ERROR") {
        throw new Error(`Pixazo Generation Failed: ${data.error || JSON.stringify(data)}`);
      }
      
      attempts++;
    }
    throw new Error("Generation timed out.");
  };

  // --- MAIN PIXAZO EXECUTION ---
  const runRawPixazoTest = async () => {
    if (!apiKey) return alert("Please enter your Pixazo API Key for this test.");
    if (!targetFile || !inputFile) return alert("Please upload BOTH images.");
    if (!prompt) return alert("Please enter a prompt.");

    setIsTesting(true);
    setFinalImage(null);
    setLogs([]);
    setStatus("Processing Images...");

    try {
      addLog("📸 Converting both images to Base64 Data URIs...");
      const targetBase64 = await fileToBase64(targetFile);
      const inputBase64 = await fileToBase64(inputFile);

      setStatus("Sending to Pixazo...");
      addLog("🚀 Dispatching request to gateway.pixazo.ai...");
      
      // FIRE-RED EDIT API REQUIRES ARRAY: [TargetScene, SourceFace]
      const requestBody = {
        prompt: prompt,
        image_urls: [targetBase64, inputBase64],
        num_inference_steps: 30,
        guidance_scale: 4,
        num_images: 1
      };

      const startRes = await fetch("https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": apiKey
        },
        body: JSON.stringify(requestBody)
      });

      // 🌟 TS FIX: Cast as 'any' to resolve "type is unknown" errors
      const startData = (await startRes.json()) as any;

      if (!startRes.ok || !startData.polling_url) {
        throw new Error(`Pixazo API Error: ${startData.error || JSON.stringify(startData)}`);
      }

      addLog(`✅ Request Queued. Request ID: ${startData.request_id}`);
      addLog(`🔄 Polling URL received. Waiting for completion...`);
      setStatus("Generating Image...");

      const finalUrl = await pollPixazoStatus(startData.polling_url, apiKey);

      setFinalImage(finalUrl);
      setStatus("Complete.");
      addLog("🎉 IMAGE GENERATED SUCCESSFULLY!");

    } catch (error: any) {
      setStatus("ERROR");
      console.error(error);
      addLog(`🛑 FATAL ERROR: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-[#0a0a0a] text-white min-h-screen font-mono pb-24">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RAW PIXAZO LAB</h1>
        <p className="text-gray-400 text-sm">Status: <span className={status === "ERROR" ? "text-red-500" : status === "Complete." ? "text-green-500" : "text-blue-400"}>{status}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* --- LEFT: INPUTS --- */}
        <div className="flex flex-col gap-6">
          
          {/* SECURE API KEY INPUT */}
          <div className="border border-gray-800 p-4 rounded-xl bg-black">
            <label className="block mb-2 font-bold text-xs text-yellow-500 uppercase tracking-widest">Pixazo API Key</label>
            <input 
              type="password" 
              placeholder="Enter key to test directly from browser..."
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-yellow-500 text-yellow-500"
            />
            <p className="text-[10px] text-gray-500 mt-2">Key is kept in your browser memory and never saved to the database.</p>
          </div>

          {/* IMAGE UPLOADS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-800 p-4 rounded-xl bg-black hover:border-pink-500 transition-colors">
              <label className="block mb-2 font-bold text-xs text-pink-400 uppercase tracking-widest">1. Target Image (The Scene)</label>
              <input type="file" accept="image/*" className="text-sm w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-900/30 file:text-pink-400 hover:file:bg-pink-900/50" onChange={(e) => setTargetFile(e.target.files?.[0] || null)} />
            </div>
            
            <div className="border border-gray-800 p-4 rounded-xl bg-black hover:border-purple-500 transition-colors">
              <label className="block mb-2 font-bold text-xs text-purple-400 uppercase tracking-widest">2. Source Face (Your Selfie)</label>
              <input type="file" accept="image/*" className="text-sm w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/30 file:text-purple-400 hover:file:bg-purple-900/50" onChange={(e) => setInputFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          
          {/* PROMPT */}
          <div className="border border-gray-800 rounded-xl bg-black overflow-hidden focus-within:border-blue-500 transition-colors">
            <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-blue-400 border-b border-gray-800 uppercase tracking-widest">3. Edit Prompt</div>
            <textarea 
              value={prompt} onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 p-4 bg-transparent text-sm focus:outline-none text-gray-200"
            />
          </div>

          <button 
            onClick={runRawPixazoTest} 
            disabled={isTesting} 
            className="w-full bg-white text-black font-extrabold py-4 rounded-xl hover:bg-gray-200 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isTesting ? <><Loader2 className="animate-spin" size={18} /> EXECUTING...</> : "TEST DIRECT PIXAZO SWAP"}
          </button>
        </div>

        {/* --- RIGHT: LIVE TERMINAL --- */}
        <div className="border border-gray-800 rounded-xl bg-black flex flex-col h-80 lg:h-full overflow-hidden shadow-2xl">
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 text-xs font-bold text-gray-400 flex justify-between uppercase tracking-widest">
            <span>Terminal Output</span>
            <span className={isTesting ? "text-green-500 animate-pulse" : "text-yellow-500"}>{isTesting ? "RUNNING" : "AWAITING"}</span>
          </div>
          <div className="p-4 overflow-y-auto flex-grow text-xs font-mono text-green-400 space-y-1">
            {logs.length === 0 && <span className="text-gray-600">Enter API key, upload files, and click Test...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`
                ${log.includes('🛑') || log.includes('ERROR') ? 'text-red-400 font-bold' : ''} 
                ${log.includes('✅') || log.includes('🎉') ? 'text-blue-400 font-bold' : ''}
                ${log.includes('⏳') ? 'text-yellow-500' : ''}
              `}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* --- OUTPUT DISPLAY --- */}
      {finalImage && (
        <div className="mt-10 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <h3 className="text-xs font-bold text-green-400 mb-4 uppercase tracking-widest">Final Result</h3>
            <img src={finalImage} alt="Swap Output" className="w-full rounded-2xl shadow-[0_0_50px_rgba(74,222,128,0.1)] border border-gray-800" />
        </div>
      )}
    </div>
  );
}