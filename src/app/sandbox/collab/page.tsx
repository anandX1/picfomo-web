"use client";

import { useState, useRef, useEffect } from "react";

export default function UnifiedMVPLab() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<"styles" | "imagine" | "collab">("styles");
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
  const [schWidth, setSchWidth] = useState(1024);
  const [schHeight, setSchHeight] = useState(1024);
  const [schSteps, setSchSteps] = useState(4);
  const [finalImagineImage, setFinalImagineImage] = useState<string | null>(null);

  // --- COLLAB / FACE TRANSFER STATE ---
  const [collabInputFile, setCollabInputFile] = useState<File | null>(null);
  const [collabTargetFile, setCollabTargetFile] = useState<File | null>(null);
  const [collabInputPreview, setCollabInputPreview] = useState<string | null>(null);
  const [collabTargetPreview, setCollabTargetPreview] = useState<string | null>(null);
  const [collabInputBase64, setCollabInputBase64] = useState<string | null>(null);
  const [collabTargetBase64, setCollabTargetBase64] = useState<string | null>(null);
  const [collabLightingStyle, setCollabLightingStyle] = useState<"natural" | "cinematic" | "studio" | "golden">("cinematic");
  const [collabFidelity, setCollabFidelity] = useState(0.85);
  const [finalCollabImage, setFinalCollabImage] = useState<string | null>(null);

  // Build the FireRed Edit 1.1 prompt dynamically based on selected options
  const LIGHTING_DESCRIPTORS: Record<string, string> = {
    natural:   "natural soft ambient lighting, realistic daylight, even skin tones",
    cinematic: "cinematic dramatic lighting, high contrast shadows, film-quality depth",
    studio:    "professional studio lighting, softbox fill light, clean background separation",
    golden:    "warm golden hour lighting, soft diffused sunlight, rich highlights",
  };

  const buildCollabPrompt = () =>
    `Seamlessly place the person's face from the source image into the target scene. ` +
    `Preserve the exact identity, facial structure, and skin tone of the source face. ` +
    `Match ${LIGHTING_DESCRIPTORS[collabLightingStyle]}. ` +
    `Blend naturally with the target environment, preserving the style, color grading, and composition of the target image. ` +
    `High fidelity face transfer, photorealistic, no artifacts.`;

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Generic file → base64 + preview loader
  const loadImageFile = (
    f: File,
    setPreview: (v: string) => void,
    setBase64: (v: string) => void
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBase64(result);
    };
  };

  const handleCollabInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCollabInputFile(f);
    loadImageFile(f, setCollabInputPreview, setCollabInputBase64);
  };

  const handleCollabTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCollabTargetFile(f);
    loadImageFile(f, setCollabTargetPreview, setCollabTargetBase64);
  };

  // --- PIPELINE 1: FIRE-RED V1.1 (Styles) ---
  const runStylesPipeline = async () => {
    if (!file) return alert("Please upload a selfie first!");
    if (!stylePrompt) return alert("Please enter a style prompt!");

    setIsTesting(true);
    setFinalStyleImage(null);
    setLogs([]);

    try {
      setStatus("Processing Image...");
      addLog("📸 Reading uploaded image file...");

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      setStatus("Generating via Secure API...");
      addLog(`🚀 Sending FireRed V1.1 request to backend engine...`);
      addLog(`⚙️ Steps: ${frNumSteps} | Guidance: ${frGuidance}`);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: stylePrompt,
          model: "firered",
          sourceImage: base64Image,
          num_inference_steps: frNumSteps,
          guidance_scale: frGuidance,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to generate style");

      if (data.output) {
        setFinalStyleImage(data.output);
        setStatus("Complete.");
        addLog("🎉 INSTANT GENERATION SUCCESSFUL.");
        addLog(`✅ Post ID: ${data.post_id}`);
      } else {
        throw new Error("No image URL returned in payload.");
      }
    } catch (error) {
      setStatus("ERROR");
      addLog(`🛑 FATAL: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // --- PIPELINE 2: FLUX SCHNELL (Imagine) ---
  const runImaginePipeline = async () => {
    if (!imaginePrompt) return alert("Enter a prompt!");
    if (selectedModel === "sdxl") return alert("ERROR: Waiting on SDXL API Docs!");

    setIsTesting(true);
    setFinalImagineImage(null);
    setLogs([]);

    try {
      setStatus("Generating via Secure API...");
      addLog(`🚀 Sending request to backend engine (/api/generate)...`);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imaginePrompt,
          model: selectedModel,
          steps: schSteps,
          width: schWidth,
          height: schHeight,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to generate image");

      if (data.output) {
        setFinalImagineImage(data.output);
        setStatus("Complete.");
        addLog("🎉 INSTANT GENERATION SUCCESSFUL.");
      } else {
        throw new Error("No image URL returned in payload.");
      }
    } catch (error) {
      setStatus("ERROR");
      addLog(`🛑 FATAL: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // --- PIPELINE 3: COLLAB / FACE TRANSFER (FireRed Edit 1.1) ---
  const runCollabPipeline = async () => {
    if (!collabInputBase64) return alert("Please upload the Input Face image!");
    if (!collabTargetBase64) return alert("Please upload the Target Scene image!");

    setIsTesting(true);
    setFinalCollabImage(null);
    setLogs([]);

    const prompt = buildCollabPrompt();

    try {
      setStatus("Preparing Face Transfer...");
      addLog("📸 Input face loaded ✓");
      addLog("🖼️  Target scene loaded ✓");
      addLog(`💡 Lighting mode: ${collabLightingStyle.toUpperCase()}`);
      addLog(`🎯 Face fidelity strength: ${collabFidelity}`);

      setStatus("Generating via FireRed Edit 1.1...");
      addLog("🚀 Sending face-transfer request to /api/generate...");
      addLog(`📝 Prompt: "${prompt.slice(0, 80)}..."`);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "firered",
          prompt,
          // sourceImage → user's face (FireRed's edit source)
          sourceImage: collabInputBase64,
          // targetImage → the scene to transfer into (passed as reference)
          targetImage: collabTargetBase64,
          // FireRed Edit 1.1 params tuned for face-transfer
          num_inference_steps: 30,
          guidance_scale: 3.5,
          // strength controls how much the source identity dominates
          strength: collabFidelity,
          mode: "face_transfer",
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to process face transfer");

      if (data.output) {
        setFinalCollabImage(data.output);
        setStatus("Complete.");
        addLog("🎉 FACE TRANSFER SUCCESSFUL.");
        if (data.post_id) addLog(`✅ Post ID: ${data.post_id}`);
      } else {
        throw new Error("No image URL returned in payload.");
      }
    } catch (error) {
      setStatus("ERROR");
      addLog(`🛑 FATAL: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Reusable upload card with live preview
  const UploadCard = ({
    label,
    sublabel,
    accentColor,
    preview,
    onChange,
  }: {
    label: string;
    sublabel: string;
    accentColor: string;
    preview: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <label className={`flex flex-col gap-3 border border-gray-800 rounded-xl bg-gray-900/50 p-4 cursor-pointer hover:border-gray-600 transition-colors`}>
      <div>
        <p className={`font-bold text-sm ${accentColor}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
      </div>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-40 object-cover rounded-lg border border-gray-700"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
            LOADED
          </div>
        </div>
      ) : (
        <div className="h-40 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-500 transition-colors">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span className="text-xs">Click to upload</span>
        </div>
      )}

      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto bg-black text-white min-h-screen font-[family-name:var(--mono)] pb-24">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--display)]">MVP Creator Lab</h1>
          <p className="text-gray-400">Status: {status}</p>
        </div>
      </div>

      {/* --- MASTER TABS --- */}
      <div className="flex gap-4 mb-8 bg-gray-900 p-2 rounded-2xl w-fit flex-wrap">
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
        <button
          onClick={() => setActiveTab("collab")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "collab" ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "text-gray-400 hover:text-white"}`}
        >
          Collab (Face Transfer)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* --- LEFT: CONTROLS --- */}
        <div className="flex flex-col gap-6">

          {activeTab === "styles" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <div className="border border-gray-800 p-4 rounded-xl bg-gray-900/50">
                <label className="block mb-2 font-bold text-sm text-red-400">Upload Selfie</label>
                <input type="file" accept="image/*" className="text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>

              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-red-400 border-b border-gray-800">STYLE PROMPT</div>
                <textarea
                  value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)}
                  className="w-full h-20 p-4 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

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
          )}

          {activeTab === "imagine" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex gap-4">
                <button onClick={() => setSelectedModel("schnell")} className={`flex-1 py-3 rounded-xl border text-sm font-bold ${selectedModel === "schnell" ? "bg-blue-900/40 border-blue-500 text-blue-400" : "bg-gray-900 border-gray-800"}`}>Flux Schnell</button>
                <button onClick={() => setSelectedModel("sdxl")} className={`flex-1 py-3 rounded-xl border text-sm font-bold relative overflow-hidden ${selectedModel === "sdxl" ? "bg-purple-900/40 border-purple-500 text-purple-400" : "bg-gray-900 border-gray-800"}`}>
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

              {selectedModel === "schnell" && (
                <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4 space-y-4">
                  <div className="text-xs font-bold text-blue-400 mb-2">SCHNELL ENGINE CONTROLS</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                      <select onChange={(e) => { const val = Number(e.target.value); setSchWidth(val); setSchHeight(val); }} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm">
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

              <button onClick={runImaginePipeline} disabled={isTesting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 disabled:opacity-50 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {isTesting ? "Synthesizing..." : `Instant Generate (${selectedModel === "schnell" ? "Free" : "Locked"})`}
              </button>
            </div>
          )}

          {activeTab === "collab" && (
            /* ===== COLLAB / FACE TRANSFER — FIRERED EDIT 1.1 ===== */
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">

              {/* Upload cards with live preview */}
              <div className="grid grid-cols-2 gap-4">
                <UploadCard
                  label="Input Face"
                  sublabel="Your selfie or source face"
                  accentColor="text-purple-400"
                  preview={collabInputPreview}
                  onChange={handleCollabInputChange}
                />
                <UploadCard
                  label="Target Scene"
                  sublabel="The image to place face into"
                  accentColor="text-pink-400"
                  preview={collabTargetPreview}
                  onChange={handleCollabTargetChange}
                />
              </div>

              {/* Lighting mode selector */}
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4">
                <div className="text-xs font-bold text-purple-400 mb-3">LIGHTING MODE</div>
                <div className="grid grid-cols-2 gap-2">
                  {(["natural", "cinematic", "studio", "golden"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCollabLightingStyle(mode)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border capitalize transition-all ${
                        collabLightingStyle === mode
                          ? "bg-purple-900/40 border-purple-500 text-purple-300"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                      }`}
                    >
                      {mode === "natural" && "🌤 "}
                      {mode === "cinematic" && "🎬 "}
                      {mode === "studio" && "💡 "}
                      {mode === "golden" && "🌅 "}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Face fidelity strength */}
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-4">
                <div className="text-xs font-bold text-pink-400 mb-3">FACE FIDELITY STRENGTH</div>
                <label className="flex justify-between mb-2 text-xs text-gray-400">
                  <span>Scene blend ←→ Identity lock</span>
                  <span className="text-pink-400 font-bold">{collabFidelity.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0.5" max="1.0" step="0.05"
                  value={collabFidelity}
                  onChange={(e) => setCollabFidelity(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>More scene</span>
                  <span>Lock face</span>
                </div>
              </div>

              {/* Auto-built prompt preview (read-only, informational) */}
              <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] overflow-hidden">
                <div className="bg-gray-900 px-4 py-2 text-xs font-bold text-gray-500 border-b border-gray-800 flex justify-between">
                  <span>FIRERED PROMPT (AUTO-BUILT)</span>
                  <span className="text-green-500">LIVE</span>
                </div>
                <p className="p-3 text-[11px] text-gray-400 leading-relaxed font-mono">
                  {buildCollabPrompt()}
                </p>
              </div>

              {/* Readiness indicator */}
              <div className="flex gap-3 text-xs">
                <span className={`px-3 py-1 rounded-full font-bold ${collabInputPreview ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-600"}`}>
                  {collabInputPreview ? "✓ Face ready" : "○ No face"}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold ${collabTargetPreview ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-600"}`}>
                  {collabTargetPreview ? "✓ Scene ready" : "○ No scene"}
                </span>
              </div>

              <button
                onClick={runCollabPipeline}
                disabled={isTesting || !collabInputPreview || !collabTargetPreview}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 disabled:opacity-50 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all"
              >
                {isTesting
                  ? "Transferring Face..."
                  : !collabInputPreview || !collabTargetPreview
                  ? "Upload Both Images to Continue"
                  : "Run Face Transfer (FireRed 1.1)"}
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
              <div
                key={i}
                className={`${log.includes("❌") || log.includes("🛑") || log.includes("ERROR") ? "text-red-400" : ""} ${log.includes("✅") || log.includes("🎉") ? "text-blue-400" : ""}`}
              >
                {log}
              </div>
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
        {activeTab === "collab" && finalCollabImage && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h3 className="text-sm font-bold text-purple-500 mb-2 uppercase text-center tracking-widest">Face Transfer Output</h3>
            <img src={finalCollabImage} alt="Collab" className="w-full rounded-xl border border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.2)]" />
          </div>
        )}
      </div>
    </div>
  );
}
