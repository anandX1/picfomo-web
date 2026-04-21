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
      
      {/* LEFT COLUMN: PicFOMO Custom Identity Form */}
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

      {/* RIGHT COLUMN: Clerk Native UI (Themed dynamically!) */}
      <div className="w-full xl:w-2/3">
        <div className="bg-[var(--color-cream)] rounded-[24px] border border-[var(--rule)] shadow-[var(--shadow-sm)] overflow-hidden flex justify-center p-4 md:p-8 transition-shadow hover:shadow-[var(--shadow-md)]">
          <UserProfile routing="hash" appearance={{
            variables: {
              colorPrimary: 'var(--color-gold)',
              colorBackground: 'transparent',
              colorText: 'var(--color-ink)',
              colorTextSecondary: 'var(--color-ink3)',
              colorInputBackground: 'var(--color-white)',
              colorInputText: 'var(--color-ink)',
              colorDanger: 'var(--color-red)',
              colorSuccess: 'var(--color-grn)',
              borderRadius: '12px',
            },
            elements: {
              card: "shadow-none w-full bg-transparent border-none",
              navbar: "hidden md:flex border-r border-[var(--rule)]",
              rootBox: "w-full max-w-full flex justify-center",
              headerTitle: "font-[family-name:var(--display)] text-2xl text-[var(--color-ink)] tracking-wide",
              headerSubtitle: "font-[family-name:var(--mono)] text-[11px] uppercase tracking-[1px] text-[var(--color-ink3)]",
              profileSectionTitleText: "font-[family-name:var(--mono)] text-[11px] font-bold text-[var(--color-ink2)] uppercase tracking-wider",
              profileSectionPrimaryButton: "text-[var(--color-gold)] font-[family-name:var(--mono)] uppercase tracking-widest text-[10px] font-bold",
              badge: "text-[var(--color-ink)] bg-[var(--rule)] border border-[var(--rule)]",
              formButtonPrimary: "bg-[var(--color-ink)] text-[var(--color-white)] hover:bg-[var(--color-gold)] hover:text-black font-[family-name:var(--mono)] uppercase tracking-widest text-[11px] font-bold shadow-sm transition-all",
              button: "font-[family-name:var(--mono)] uppercase tracking-widest text-[11px] font-bold text-[var(--color-ink2)] hover:bg-[var(--rule)]",
              avatarImageActionsUpload: "text-[var(--color-gold)]",
              profileSectionContent: "border-b border-[var(--rule)] pb-4",
              formFieldInput: "border-[var(--rule)] focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]",
            }
          }} />
        </div>
      </div>

    </div>
  );
}