"use client";

import { useTransition } from "react";
import { UserProfile } from "@clerk/nextjs";
import { updateProfile } from "@/actions/user";
import { Loader2, CheckCircle2 } from "lucide-react";

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
        alert(res.message);
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      
      {/* LEFT COLUMN: PicFOMO Custom Identity Form */}
      <div className="w-full xl:w-1/3 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Public Profile</h2>
          <p className="text-xs text-gray-500 mb-6">This is how you appear on the Feed and your public aesthetic portfolio.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Display Name
              </label>
              <input 
                type="text" 
                name="displayName"
                defaultValue={initialData.display_name}
                placeholder="How should we call you?"
                maxLength={30}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Website / Social Link */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Link in Bio
              </label>
              <input 
                type="url" 
                name="website"
                defaultValue={initialData.website || ""}
                placeholder="https://instagram.com/yourhandle"
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Bio
              </label>
              <textarea 
                name="bio"
                defaultValue={initialData.bio}
                placeholder="Digital creator exploring AI aesthetics..."
                rows={4}
                maxLength={160}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
              <p className="mt-1.5 text-[10px] text-gray-500 text-right">Max 160 characters</p>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg px-5 py-3 transition-colors disabled:opacity-70"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Save Profile
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Clerk Native UI */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex justify-center py-6">
          <UserProfile routing="hash" appearance={{
            elements: {
              card: "shadow-none w-full",
              navbar: "hidden md:flex",
              rootBox: "w-full max-w-full flex justify-center"
            }
          }} />
        </div>
      </div>

    </div>
  );
}