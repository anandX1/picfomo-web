"use client";

import { useRef, useTransition, useState } from "react";
import { addTask } from "@/actions/admin";
import { Loader2, Plus, Target } from "lucide-react";
import { toast } from "sonner";

export default function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [taskType, setTaskType] = useState("survey");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addTask(formData);
      if (result.success) {
        formRef.current?.reset();
        toast.success("Bounty Deployed!");
      } else {
        setErrorMsg(result.error || "Something went wrong");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-[var(--rule)] bg-[var(--color-white)] p-6 shadow-sm sticky top-6 transition-shadow hover:shadow-md">
      <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-6 flex items-center gap-2">
        <Target size={16} className="text-blue-500" /> Add New Bounty
      </h2>
      
      {errorMsg && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-[12px] font-bold text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div>
          <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Bounty Title</label>
          <input required name="title" type="text" placeholder="e.g. Help price the Pro Tier" className="w-full mt-2 rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-3.5 text-[13px] text-[var(--color-ink)] focus:border-blue-500 focus:bg-[var(--color-white)] transition-colors focus:outline-none" />
        </div>

        <div>
          <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Description & Rules</label>
          <textarea required name="description" placeholder="Explain what the user needs to do..." className="w-full mt-2 h-24 resize-none rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-3.5 text-[13px] text-[var(--color-ink)] focus:border-blue-500 focus:bg-[var(--color-white)] transition-colors focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Reward (⚡)</label>
            <input required name="reward_amount" type="number" min="1" max="500" defaultValue="12" className="w-full mt-2 rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-3.5 text-[13px] text-[var(--color-ink)] focus:border-blue-500 focus:bg-[var(--color-white)] transition-colors focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Action Type</label>
            <select 
              name="task_type" 
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full mt-2 rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-3.5 text-[13px] text-[var(--color-ink)] focus:border-blue-500 focus:bg-[var(--color-white)] transition-colors focus:outline-none cursor-pointer"
            >
              <option value="survey">Slider Survey</option>
              <option value="link">External Link</option>
            </select>
          </div>
        </div>

        {taskType === "link" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1px] text-[var(--color-ink3)]">Target URL</label>
            <input required name="action_url" type="url" placeholder="https://twitter.com/..." className="w-full mt-2 rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-3.5 text-[13px] text-[var(--color-ink)] focus:border-blue-500 focus:bg-[var(--color-white)] transition-colors focus:outline-none" />
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-4 font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[1.5px] text-white transition-all hover:bg-blue-700 disabled:opacity-50 active:scale-95 shadow-md hover:shadow-lg"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16}/> Deploy Bounty</>}
        </button>
      </form>
    </div>
  );
}