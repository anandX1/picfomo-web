"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunnelStore } from '@/store/useFunnelStore';
import { X, Zap, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs'; 

interface PublicFunnelModalProps {
  isOpen: boolean;
  initialFile: File | null;
  dynamicStyles: any[];
  onClose: () => void;
}

// 🌟 ADSTERRA INJECTIONS
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
  const { userId } = useAuth(); 
  
  const [view, setView] = useState<'styles' | 'generating' | 'result'>('styles');
  const { setGuestImageResult, setGuestPostId, setHasUsedFreePass } = useFunnelStore();

  const [selectedStyleId, setSelectedStyleId] = useState<string>(dynamicStyles[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  // 🌟 THE "LIVE" PROGRESS BAR TRICK
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "generating") {
      setProgress(12); // Initial jump
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95; // Hang at 95%
          // Random jump between 5% and 15% to feel like real network packets
          const jump = Math.floor(Math.random() * 11) + 5; 
          const next = prev + jump;
          return next > 95 ? 95 : next;
        });
      }, 1200); 
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [view]);

  useEffect(() => {
    if (view === 'result' && outputImage) {
      setShowPaywall(true); // Instant paywall
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
        body: JSON.stringify({ prompt, styleId: selectedStyleId, sourceImage: base64 })
      });

      const data = await res.json() as any;

      if (res.status === 429) {
        setError('Free pass already used! Please sign in to continue.');
        setView('styles');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      if (data.output) {
        setProgress(100); 
        setTimeout(() => {
          setOutputImage(data.output);
          setGuestImageResult(data.output);
          setGuestPostId(data.post_id);
          setHasUsedFreePass(true);
          
          if (userId) {
             router.push('/dashboard/vault');
          } else {
             setView('result');
          }
        }, 500); 
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setView('styles');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl h-[100dvh] w-full overflow-hidden flex flex-col items-center text-white"
        >
          {view === 'generating' && <SocialBarAd />}

          {/* HEADER */}
          <div className="w-full max-w-4xl flex justify-between items-center p-4 md:p-8 shrink-0 z-[60]">
            {view === 'generating' ? <div /> : (
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5 border border-white/10">
                <X size={24} />
              </button>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${userId ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/20'}`}>
              <Zap size={16} className="fill-current" />
              <span className="font-bold tracking-widest text-[10px] uppercase">{userId ? 'Account Linked' : 'Guest Pass Active'}</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center overflow-hidden relative">
            
            {/* VIEW: STYLES */}
            {view === 'styles' && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto w-full px-4 pb-40">
                  <h2 className="text-3xl md:text-5xl font-black mb-2 text-center">Pick Your Vibe</h2>
                  <p className="text-white/60 mb-6 text-center text-sm">{userId ? 'You are logged in. Standard generation rates apply.' : 'One free generation. Make it count.'}</p>

                  {error && (
                    <div className="mb-6 p-4 w-full bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center justify-center gap-2">
                      <X size={16} /> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mt-2 mb-6">
                    {dynamicStyles.map((style) => (
                      <button 
                        key={style.id} onClick={() => setSelectedStyleId(style.id)}
                        className={`relative aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-300 group ${selectedStyleId === style.id ? 'border-4 border-[var(--color-gold)] scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10' : 'border-4 border-transparent hover:border-white/20'}`}
                      >
                        <img src={style.preview_image_url} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-left">
                          <p className="font-black text-xs uppercase text-white drop-shadow-md">{style.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="w-full mb-8">
                    <label className="block font-mono text-[10px] font-bold uppercase text-white/60 mb-2">Additional Details (Optional)</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., cinematic lighting..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] resize-none h-20" />
                  </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center z-50">
                  <button onClick={handleGenerate} className="w-full max-w-md py-4 bg-[var(--color-gold)] text-black font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Sparkles size={20} /> {userId ? 'Generate (2 Sparks)' : 'Generate For Free'}
                  </button>
                </div>
              </>
            )}

            {/* VIEW: GENERATING */}
            {view === 'generating' && (
              <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[var(--color-gold)] opacity-20 blur-[50px] rounded-full animate-pulse" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-20 h-20 bg-black border border-[var(--color-gold)]/30 rounded-2xl flex items-center justify-center">
                      <Zap size={32} className="text-[var(--color-gold)] fill-current animate-pulse" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-3">Synthesizing...</h2>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[var(--color-gold)]" />
                  </div>
                  <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest mb-6">
                    {progress < 95 ? 'Establishing Neural Link' : 'Finalizing Details...'}
                  </p>

                  <div className="w-full pt-4 border-t border-white/10">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 text-center">Sponsored</p>
                    <NativeAd />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: RESULT */}
            {view === 'result' && outputImage && (
              <div className="flex-1 w-full flex items-center justify-center p-4 relative">
                <div className="w-full max-w-sm aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 opacity-70">
                  <Image src={outputImage} alt="Result" fill className="object-cover" style={{ filter: 'blur(18px) saturate(1.2)' }} />
                </div>

                <AnimatePresence>
                  {showPaywall && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center z-50 p-4">
                      <div className="bg-black/90 backdrop-blur-md text-white p-8 rounded-[2rem] border border-[var(--color-gold)]/40 shadow-[0_0_80px_rgba(212,175,55,0.2)] max-w-sm w-full text-center">
                        <div className="mx-auto w-14 h-14 bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Masterpiece Ready!</h3>
                        <p className="text-white/60 text-sm mb-8">Sign up now to unblur your image and permanently save it to your Vault.</p>

                        <button onClick={() => router.push('/sign-up')} className="w-full py-4 bg-[var(--color-gold)] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest mb-3">
                          Create Free Account
                        </button>
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