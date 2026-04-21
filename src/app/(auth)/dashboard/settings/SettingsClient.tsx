"use client";

import { useTransition } from "react";
import { UserProfile } from "@clerk/nextjs";
import { updateProfile } from "@/actions/user";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialData: {
    username: string;
    display_name: string;
    bio: string;
    website?: string;
  };
}

export default function SettingsClient({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      
      {/* LEFT COLUMN: PicFOMO Custom Identity Form (Fully Adaptive to Light/Dark Mode) */}
      <div className="w-full xl:w-1/3 flex-shrink-0">
        <div className="bg-[var(--color-cream)] rounded-[24px] border border-[var(--rule)] p-6 md:p-8 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
          <h2 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)] mb-2">Public Profile</h2>
          <p className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[1px] text-[var(--color-ink3)] mb-8 leading-relaxed">
            This is how you appear on the Feed and your public aesthetic portfolio.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Display Name */}
            <div>
              <label className="block text-[11px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink2)] uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input 
                type="text" 
                name="displayName"
                defaultValue={initialData.display_name}
                placeholder="How should we call you?"
                maxLength={30}
                className="w-full bg-[var(--color-white)] border border-[var(--rule)] text-[var(--color-ink)] text-[14px] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all placeholder-[var(--color-ink3)] shadow-sm"
              />
            </div>

            {/* Website / Social Link */}
            <div>
              <label className="block text-[11px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink2)] uppercase tracking-wider mb-2">
                Link in Bio
              </label>
              <input 
                type="url" 
                name="website"
                defaultValue={initialData.website || ""}
                placeholder="https://instagram.com/yourhandle"
                className="w-full bg-[var(--color-white)] border border-[var(--rule)] text-[var(--color-ink)] text-[14px] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all placeholder-[var(--color-ink3)] shadow-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] font-[family-name:var(--mono)] font-bold text-[var(--color-ink2)] uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea 
                name="bio"
                defaultValue={initialData.bio}
                placeholder="Digital creator exploring AI aesthetics..."
                rows={4}
                maxLength={160}
                className="w-full bg-[var(--color-white)] border border-[var(--rule)] text-[var(--color-ink)] text-[14px] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] outline-none transition-all resize-none placeholder-[var(--color-ink3)] shadow-sm"
              />
              <p className="mt-2 font-[family-name:var(--mono)] text-[10px] text-[var(--color-ink3)] text-right uppercase tracking-widest">
                Max 160 characters
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-gold)] text-[var(--color-white)] hover:text-black font-[family-name:var(--mono)] font-bold uppercase tracking-[1.5px] text-[12px] rounded-xl px-6 py-4 transition-all shadow-md disabled:opacity-70 active:scale-[0.98]"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Save Profile
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Clerk Native UI (Forced to Light Mode Fallback for guaranteed visibility) */}
      <div className="w-full xl:w-2/3">
        {/* 🌟 FIX: Locked container to a bright white background and standard border so Clerk doesn't vanish in Dark Mode */}
        <div className="bg-[#ffffff] rounded-[24px] border border-[#e5e7eb] shadow-sm overflow-hidden flex justify-center p-4 md:p-8">
          <UserProfile routing="hash" appearance={{
            variables: {
              // 🌟 FIX: Using strict Hex codes instead of CSS variables to bypass the bug
              colorPrimary: '#D97706', // Amber 600
              colorBackground: '#ffffff',
              colorText: '#111827', // Gray 900
              colorTextSecondary: '#6B7280', // Gray 500
              colorInputBackground: '#F9FAFB', // Gray 50
              colorInputText: '#111827',
              colorDanger: '#EF4444',
              colorSuccess: '#10B981',
              borderRadius: '12px',
            },
            elements: {
              card: "shadow-none w-full bg-transparent border-none",
              navbar: "hidden md:flex border-r border-[#e5e7eb]",
              rootBox: "w-full max-w-full flex justify-center",
              headerTitle: "font-[family-name:var(--display)] text-2xl text-[#111827] tracking-wide",
              headerSubtitle: "font-[family-name:var(--mono)] text-[11px] uppercase tracking-[1px] text-[#6B7280]",
              profileSectionTitleText: "font-[family-name:var(--mono)] text-[11px] font-bold text-[#374151] uppercase tracking-wider",
              profileSectionPrimaryButton: "text-[#D97706] font-[family-name:var(--mono)] uppercase tracking-widest text-[10px] font-bold",
              badge: "text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB]",
              formButtonPrimary: "bg-[#111827] text-white hover:bg-[#D97706] font-[family-name:var(--mono)] uppercase tracking-widest text-[11px] font-bold shadow-sm transition-all",
              button: "font-[family-name:var(--mono)] uppercase tracking-widest text-[11px] font-bold text-[#4B5563] hover:bg-[#F3F4F6]",
              avatarImageActionsUpload: "text-[#D97706]",
              profileSectionContent: "border-b border-[#e5e7eb] pb-4",
              formFieldInput: "border-[#e5e7eb] bg-[#f9fafb] focus:border-[#D97706] focus:ring-[#D97706] text-[#111827]",
            }
          }} />
        </div>
      </div>

    </div>
  );
}