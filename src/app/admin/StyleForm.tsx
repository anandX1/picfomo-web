"use client";

import { useRef, useTransition, useState } from "react";
import { addStyle } from "@/actions/admin";
import { Loader2, Plus, Images } from "lucide-react"; // Added Images icon

export default function StyleForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  
  // NEW: State to toggle the FOMO timer input
  const [hasTimer, setHasTimer] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addStyle(formData);
      if (result.success) {
        formRef.current?.reset(); // Clear the form on success
        setHasTimer(false); // Reset the timer UI
      } else {
        setErrorMsg(result.error || "Something went wrong");
      }
    });
  };

  return (
    <div className="rounded-xl border border-[var(--rule)] bg-white p-6 shadow-sm sticky top-6">
      <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-6 flex items-center gap-2">
        <Plus size={16} /> Add New Style
      </h2>
      
      {errorMsg && (
        <div className="mb-4 rounded bg-red-50 p-3 text-[11px] text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* 2-Column Grid for Name and Spark Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Display Name</label>
            <input required name="name" type="text" placeholder="e.g. Studio Ghibli" className="w-full mt-1 rounded-md border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Spark Cost</label>
            <input required name="spark_cost" type="number" min="0" max="500" defaultValue="10" className="w-full mt-1 rounded-md border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)] flex items-center gap-2">
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-sm">Secret Prompt (Hidden)</span>
          </label>
          <textarea required name="description" placeholder="e.g. in the style of Hayao Miyazaki, anime, highly detailed..." className="w-full mt-1 h-24 resize-none rounded-md border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
        </div>

        {/* NEW: 5 Image URLs (Preview Gallery) */}
        <div className="rounded-md border border-[var(--rule)] bg-[var(--color-cream)] p-4">
          <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink)] flex items-center gap-2 mb-3">
            <Images size={14} /> Preview Gallery (Min 1, Up to 5)
          </label>
          <div className="space-y-2">
            <input required name="url_1" type="url" placeholder="Main Image URL (Required)" className="w-full rounded-md border border-[var(--rule)] bg-white p-2 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
            <input name="url_2" type="url" placeholder="Image URL 2 (Optional)" className="w-full rounded-md border border-[var(--rule)] bg-white p-2 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
            <input name="url_3" type="url" placeholder="Image URL 3 (Optional)" className="w-full rounded-md border border-[var(--rule)] bg-white p-2 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
            <input name="url_4" type="url" placeholder="Image URL 4 (Optional)" className="w-full rounded-md border border-[var(--rule)] bg-white p-2 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
            <input name="url_5" type="url" placeholder="Image URL 5 (Optional)" className="w-full rounded-md border border-[var(--rule)] bg-white p-2 text-[12px] focus:border-[var(--color-ink)] focus:outline-none" />
          </div>
        </div>

        {/* NEW: Badge and FOMO Timer Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Badge (Optional)</label>
            <select name="badge" className="w-full mt-1 rounded-md border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[12px] focus:border-[var(--color-ink)] focus:outline-none">
              <option value="">None</option>
              <option value="HOT">HOT</option>
              <option value="NEW">NEW</option>
              <option value="PRO">PRO</option>
              <option value="SALE">SALE</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)] flex justify-between items-center">
              <span>FOMO Timer</span>
              <input type="checkbox" checked={hasTimer} onChange={() => setHasTimer(!hasTimer)} className="cursor-pointer" />
            </label>
            {hasTimer ? (
              <input name="expires_at" type="datetime-local" className="w-full mt-1 rounded-md border border-red-300 bg-red-50 p-3 text-[12px] text-red-900 focus:outline-none" />
            ) : (
              <div className="w-full mt-1 rounded-md border border-[var(--rule)] bg-gray-50 p-3 text-[12px] text-gray-400 text-center select-none">
                No Timer Set
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="mt-4 flex items-center justify-center gap-2 w-full rounded-full bg-[var(--color-ink)] py-3 font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-gold)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : "Deploy Style"}
        </button>
      </form>
    </div>
  );
}