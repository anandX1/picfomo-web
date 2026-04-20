"use client";

import { useState, useRef, useEffect } from "react";

export default function UnifiedMVPLab() {
  const [activeTab, setActiveTab] = useState<"styles" | "imagine" | "collab">("styles");
  const [status, setStatus] = useState("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- STYLES STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [stylePrompt, setStylePrompt] = useState("Professional headshot, cyberpunk lighting, highly detailed");
  const [frNumSteps, setFrNumSteps] = useState(30);
  const [frGuidance, setFrGuidance] = useState(4);
  const [frAcceleration, setFrAcceleration] = useState("regular");
  const [finalStyleImage, setFinalStyleImage] = useState<string | null>(null);

  // --- IMAGINE STATE ---
  const [imaginePrompt, setImaginePrompt] = useState("Picture a sleek, futuristic car racing through a neon-lit cityscape");
  const [selectedModel, setSelectedModel] = useState<"schnell" | "sdxl">("schnell");
  const [schWidth, setSchWidth] = useState(1024);
  const [schHeight, setSchHeight] = useState(1024);
  const [schSteps, setSchSteps] = useState(4);
  const [finalImagineImage, setFinalImagineImage] = useState<string | null>(null);

  // --- COLLAB STATE ---
  const [collabImage1, setCollabImage1] = useState<string | null>(null);
  const [collabImage2, setCollabImage2] = useState<string | null>(null);
  const [collabPrompt, setCollabPrompt] = useState("");
  const [finalCollabImage, setFinalCollabImage] = useState<string | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const toBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.readAsDataURL(f);
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
    });

  // --- PIPELINE 1: STYLES ---
  const runStylesPipeline = async () => {
    if (!file) return alert("Please upload a selfie first!");
    setIsTesting(true); setFinalStyleImage(null); setLogs([]);
    try {
      setStatus("Processing Image...");
      addLog("📸 Reading image...");
      const base64Image = await toBase64(file);
      setStatus("Generating via Secure API...");
      addLog("🚀 Sending FireRed V1.1 request...");
      addLog(`⚙️ Steps: ${frNumSteps} | Guidance: ${frGuidance}`);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: stylePrompt, model: "firered", sourceImage: base64Image, num_inference_steps: frNumSteps, guidance_scale: frGuidance }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.output) { setFinalStyleImage(data.output); setStatus("Complete."); addLog("🎉 DONE."); addLog(`✅ Post ID: ${data.post_id}`); }
      else throw new Error("No image returned.");
    } catch (e) { setStatus("ERROR"); addLog(`🛑 ${(e as Error).message}`); }
    finally { setIsTesting(false); }
  };

  // --- PIPELINE 2: IMAGINE ---
  const runImaginePipeline = async () => {
    if (!imaginePrompt) return alert("Enter a prompt!");
    if (selectedModel === "sdxl") return alert("Waiting on SDXL API Docs!");
    setIsTesting(true); setFinalImagineImage(null); setLogs([]);
    try {
      setStatus("Generating...");
      addLog("🚀 Sending to /api/generate...");
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imaginePrompt, model: selectedModel, steps: schSteps, width: schWidth, height: schHeight }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.output) { setFinalImagineImage(data.output); setStatus("Complete."); addLog("🎉 DONE."); }
      else throw new Error("No image returned.");
    } catch (e) { setStatus("ERROR"); addLog(`🛑 ${(e as Error).message}`); }
    finally { setIsTesting(false); }
  };

  // --- PIPELINE 3: COLLAB ---
  const runCollabPipeline = async () => {
    if (!collabImage1) return alert("Upload Image 1 first!");
    if (!collabImage2) return alert("Upload Image 2 first!");
    if (!collabPrompt.trim()) return alert("Write a prompt!");
    setIsTesting(true); setFinalCollabImage(null); setLogs([]);
    try {
      setStatus("Processing...");
      addLog("📸 Image 1 ready ✓");
      addLog("📸 Image 2 ready ✓");
      addLog("🚀 Sending to /api/collab...");
      const res = await fetch("/api/collab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: collabPrompt, image1: collabImage1, image2: collabImage2 }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.output) { setFinalCollabImage(data.output); setStatus("Complete."); addLog("🎉 DONE."); }
      else throw new Error("No image returned.");
    } catch (e) { setStatus("ERROR"); addLog(`🛑 ${(e as Error).message}`); }
    finally { setIsTesting(false); }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-black text-white min-h-screen font-[family-name:var(--mono)] pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--display)]">MVP Creator Lab</h1>
        <p className="text-gray-400">Status: {status}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8 bg-gray-900 p-2 rounded-2xl w-fit flex-wrap">
        <button onClick={() => setActiveTab("styles")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "styles" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>Styles (FireRed)</button>
        <button onClick={() => setActiveTab("imagine")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "imagine" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>Imagine (Free APIs)</button>
        <button onClick={() => setActiveTab("collab")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "collab" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}>Collab</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* LEFT: CONTROLS */}
        <div className="flex flex-col gap-6">

          {activeTab === "styles" && (
            <div className="space-y-6">
              <div className="border border-gray-800 p-4 rounded-xl bg-gray-900/50">
                <label className="block mb-2 font-bold text-sm text-red-400">Upload Selfie</label>
                <input type="file" accept="image/*" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-red-400 border-b border-gray-800">STYLE PROMPT</div>
                <textarea value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} className="w-full h-20 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4 space-y-4">
                <div className="text-xs font-bold text-yellow-500 mb-2">V1.1 ENGINE CONTROLS</div>
                <div>
                  <label className="flex justify-between mb-1 text-xs text-gray-400"><span>Steps</span><span className="text-yellow-500">{frNumSteps}</span></label>
                  <input type="range" min="10" max="50" value={frNumSteps} onChange={(e) => setFrNumSteps(Number(e.target.value))} className="w-full accent-yellow-500" />
                </div>
                <div>
                  <label className="flex justify-between mb-1 text-xs text-gray-400"><span>Guidance</span><span className="text-yellow-500">{frGuidance}</span></label>
                  <input type="range" min="1" max="10" step="0.5" value={frGuidance} onChange={(e) => setFrGuidance(Number(e.target.value))} className="w-full accent-yellow-500" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setFrAcceleration("regular")} className={`px-4 py-2 text-xs rounded border ${frAcceleration === "regular" ? "bg-yellow-900/40 border-yellow-500 text-yellow-400" : "bg-gray-800 border-gray-700"}`}>Regular</button>
                  <button onClick={() => setFrAcceleration("fast")} className={`px-4 py-2 text-xs rounded border ${frAcceleration === "fast" ? "bg-yellow-900/40 border-yellow-500 text-yellow-400" : "bg-gray-800 border-gray-700"}`}>Fast</button>
                </div>
              </div>
              <button onClick={runStylesPipeline} disabled={isTesting} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-500 disabled:opacity-50 active:scale-95">
                {isTesting ? "Applying Style..." : "Generate Premium Style"}
              </button>
            </div>
          )}

          {activeTab === "imagine" && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button onClick={() => setSelectedModel("schnell")} className={`flex-1 py-3 rounded-xl border text-sm font-bold ${selectedModel === "schnell" ? "bg-blue-900/40 border-blue-500 text-blue-400" : "bg-gray-900 border-gray-800"}`}>Flux Schnell</button>
                <button onClick={() => setSelectedModel("sdxl")} className={`flex-1 py-3 rounded-xl border text-sm font-bold relative overflow-hidden ${selectedModel === "sdxl" ? "bg-purple-900/40 border-purple-500 text-purple-400" : "bg-gray-900 border-gray-800"}`}>
                  SDXL <span className="absolute top-0 right-0 bg-red-600 text-[9px] px-2 py-0.5 rounded-bl-lg text-white font-black">NEED DOCS</span>
                </button>
              </div>
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-blue-400 border-b border-gray-800">IMAGINATION PROMPT</div>
                <textarea value={imaginePrompt} onChange={(e) => setImaginePrompt(e.target.value)} className="w-full h-24 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              {selectedModel === "schnell" && (
                <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4 space-y-4">
                  <div className="text-xs font-bold text-blue-400 mb-2">SCHNELL ENGINE CONTROLS</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                      <select onChange={(e) => { const v = Number(e.target.value); setSchWidth(v); setSchHeight(v); }} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm">
                        <option value={512}>512 x 512</option>
                        <option value={1024}>1024 x 1024</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Steps ({schSteps})</label>
                      <input type="range" min="1" max="8" value={schSteps} onChange={(e) => setSchSteps(Number(e.target.value))} className="w-full accent-blue-500 mt-2" />
                    </div>
                  </div>
                </div>
              )}
              <button onClick={runImaginePipeline} disabled={isTesting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 disabled:opacity-50 active:scale-95">
                {isTesting ? "Synthesizing..." : `Instant Generate (${selectedModel === "schnell" ? "Free" : "Locked"})`}
              </button>
            </div>
          )}

          {/* ===== COLLAB TAB — simple: image1, image2, prompt ===== */}
          {activeTab === "collab" && (
            <div className="space-y-5">

              {/* Image 1 */}
              <div className="border border-gray-800 rounded-xl bg-gray-900/50 p-4">
                <label className="block mb-3 font-bold text-sm text-purple-400">Image 1</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm w-full"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setCollabImage1(await toBase64(f));
                  }}
                />
                {collabImage1 && (
                  <img src={collabImage1} alt="img1" className="mt-3 w-full h-36 object-cover rounded-lg border border-gray-700" />
                )}
              </div>

              {/* Image 2 */}
              <div className="border border-gray-800 rounded-xl bg-gray-900/50 p-4">
                <label className="block mb-3 font-bold text-sm text-pink-400">Image 2</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm w-full"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setCollabImage2(await toBase64(f));
                  }}
                />
                {collabImage2 && (
                  <img src={collabImage2} alt="img2" className="mt-3 w-full h-36 object-cover rounded-lg border border-gray-700" />
                )}
              </div>

              {/* Prompt */}
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-purple-400 border-b border-gray-800">PROMPT</div>
                <textarea
                  value={collabPrompt}
                  onChange={(e) => setCollabPrompt(e.target.value)}
                  placeholder="Write your prompt here..."
                  className="w-full h-28 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-gray-600"
                />
              </div>

              <button
                onClick={runCollabPipeline}
                disabled={isTesting}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 disabled:opacity-50 active:scale-95"
              >
                {isTesting ? "Running..." : "Run Collab"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: TERMINAL */}
        <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] flex flex-col h-64 lg:h-full">
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 text-xs font-bold text-gray-400 flex justify-between">
            <span>LIVE TERMINAL</span>
            <span className={isTesting ? "text-green-500 animate-pulse" : ""}>{isTesting ? "EXECUTING" : "STANDBY"}</span>
          </div>
          <div className="p-4 overflow-y-auto flex-grow text-xs font-mono text-green-400 space-y-1">
            {logs.length === 0 && <span className="text-gray-600">Awaiting input...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes("🛑") ? "text-red-400" : ""} ${log.includes("🎉") || log.includes("✅") ? "text-blue-400" : ""}`}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* OUTPUT */}
      <div className="mt-10 max-w-lg mx-auto">
        {activeTab === "styles" && finalStyleImage && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h3 className="text-sm font-bold text-red-500 mb-2 uppercase text-center tracking-widest">Premium Output</h3>
            <img src={finalStyleImage} alt="Style" className="w-full rounded-xl border border-red-500" />
          </div>
        )}
        {activeTab === "imagine" && finalImagineImage && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h3 className="text-sm font-bold text-blue-500 mb-2 uppercase text-center tracking-widest">Instant Output</h3>
            <img src={finalImagineImage} alt="Imagine" className="w-full rounded-xl border border-blue-500" />
          </div>
        )}
        {activeTab === "collab" && finalCollabImage && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h3 className="text-sm font-bold text-purple-500 mb-2 uppercase text-center tracking-widest">Collab Output</h3>
            <img src={finalCollabImage} alt="Collab" className="w-full rounded-xl border border-purple-500" />
          </div>
        )}
      </div>
    </div>
  );
}
