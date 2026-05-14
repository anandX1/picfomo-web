"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunnelStore } from '@/store/useFunnelStore';
import { 
  X, Zap, Sparkles, Loader2, CheckCircle2 
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PublicFunnelModalProps {
  isOpen: boolean;
  initialFile: File | null;
  dynamicStyles: any[];
  onClose: () => void;
}

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

const PublicFunnelModal: React.FC<PublicFunnelModalProps> = ({ isOpen, initialFile, dynamicStyles, onClose }) => {
  const router = useRouter();
  const [view, setView] = useState<'styles' | 'generating' | 'result'>('styles');
  const { setGuestImageResult, setGuestPostId, setHasUsedFreePass } = useFunnelStore();

  // --- FUNNEL STATE ---
  const [selectedStyleId, setSelectedStyleId] = useState<string>(dynamicStyles[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🌟 PROGRESS BAR LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "generating") {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev; 
          return prev + Math.floor(Math.random() * 3) + 1; 
        });
      }, 1000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [view]);

  // 🌟 PAYWALL AUTO-TRIGGER (INSTANT)
  useEffect(() => {
    if (view === 'result' && outputImage) {
      setShowPaywall(true);
    }
  }, [view, outputImage]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!initialFile || !selectedStyleId) return;
    
    setIsGenerating(true);
    setError(null);
    setView('generating');

    try {
      const base64 = await fileToBase64(initialFile);
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          styleId: selectedStyleId,
          sourceImage: base64
        })
      });

      const data = await res.json() as any;

      if (res.status === 429) {
        setError('Free pass already used! Please sign in to continue generating.');
        setView('styles');
        return;
      }

      if (!res.ok) throw new Error(data.error || 'Generation failed');

      if (data.output) {
        setOutputImage(data.output);
        setGuestImageResult(data.output);
        setGuestPostId(data.post_id);
        setHasUsedFreePass(true);
        setView('result');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setView('styles');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-start text-white"
        >
          {/* Ad Injection */}
          {view === 'generating' && <SocialBarAd />}

          {/* Header */}
          <div className="w-full max-w-4xl flex justify-between items-center px-4 py-4 md:px-8 md:py-8 shrink-0 relative z-[60]">
            {view === 'generating' ? <div /> : (
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Zap className="text-[var(--color-gold)] fill-[var(--color-gold)]" size={20} />
              <span className="font-bold tracking-widest text-xs uppercase">Guest Pass Active</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center overflow-hidden">
            
            {/* VIEW: STYLES */}
            {view === 'styles' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 overflow-y-auto w-full flex flex-col items-center px-4 pb-32"
              >
                <h2 className="text-3xl md:text-5xl font-black mb-2 text-center">Pick Your Vibe</h2>
                <p className="text-white/60 mb-8 text-center text-sm md:text-base">One free generation. Make it count.</p>

                {error && (
                  <div className="mb-6 p-4 w-full max-w-3xl bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2">
                    <X size={16} /> {error}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mt-2 mb-6">
                  {dynamicStyles.map((style) => (
                    <button 
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${selectedStyleId === style.id ? 'border-4 border-[var(--color-gold)] scale-105 shadow-2xl z-10' : 'border-4 border-transparent hover:border-white/30'}`}
                    >
                      <img 
                        src={style.preview_image_url} 
                        alt={style.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <p className="font-black text-xs md:text-sm uppercase tracking-wider text-white drop-shadow-md">{style.name}</p>
                      </div>
                      {selectedStyleId === style.id && (
                        <div className="absolute top-2 right-2 bg-[var(--color-gold)] text-black p-1 rounded-full shadow-lg">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* 🌟 NEW PROMPT INPUT FOR CUSTOMIZATION */}
                <div className="w-full max-w-3xl mb-8">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[2px] text-white/60 mb-3">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., make it dark and cinematic..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none h-24 shadow-inner"
                  />
                </div>

                {/* Sticky Button Container */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-50">
                  <button 
                    onClick={handleGenerate}
                    className="w-full max-w-md py-5 bg-[var(--color-gold)] text-black font-black text-lg rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                  >
                    <Sparkles size={22} /> Generate For Free
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW: GENERATING */}
            {view === 'generating' && (
              <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-gold)] opacity-10 blur-3xl rounded-full" />
                  
                  <div className="relative mb-8">
                    <motion.div 
                      animate={{ 
                        rotate: 360,
                        boxShadow: ["0 0 20px rgba(212,175,55,0.1)", "0 0 40px rgba(212,175,55,0.3)", "0 0 20px rgba(212,175,55,0.1)"]
                      }}
                      transition={{ 
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative w-20 h-20 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-2xl"
                    >
                      <Zap size={40} className="text-[var(--color-gold)] fill-[var(--color-gold)] animate-pulse" />
                    </motion.div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Synthesizing...</h2>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[var(--color-gold)] to-white"
                    />
                  </div>
                  
                  <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
                    {progress}% Neural Link
                  </p>

                  <div className="w-full pt-6 border-t border-white/10">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Secure Synthesis Sponsored By</p>
                    <NativeAd />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: RESULT */}
            {view === 'result' && outputImage && (
              <div className="flex-1 w-full flex flex-col items-center justify-center relative p-4">
                <div className="w-full max-w-lg aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <Image 
                    src={outputImage} 
                    alt="Result" 
                    fill 
                    className="object-cover transition-all duration-1000"
                    style={{ filter: 'blur(20px)' }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="text-white/20 animate-spin" size={48} />
                  </div>
                </div>

                <AnimatePresence>
                  {showPaywall && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 flex items-center justify-center p-4 z-50"
                    >
                      <div className="bg-white text-black p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] max-w-md w-full text-center relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-gold)] opacity-20 blur-3xl rounded-full" />
                        
                        <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                          <CheckCircle2 size={32} className="text-[var(--color-gold)]" />
                        </div>

                        <h3 className="text-3xl font-black mb-4 leading-tight">Masterpiece Ready!</h3>
                        <p className="text-black/60 text-sm md:text-base mb-8 leading-relaxed">
                          Your synthesis is complete and looks incredible. Sign up now to unblur your image and save it to your permanent vault.
                        </p>

                        <button 
                          onClick={() => router.push('/sign-up')}
                          className="w-full py-5 bg-black text-white font-black text-lg rounded-2xl hover:bg-[var(--color-gold)] hover:text-black transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest mb-4"
                        >
                          Create Free Account
                        </button>
                        
                        <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
                          Join 10,000+ creators on PicFOMO
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublicFunnelModal;