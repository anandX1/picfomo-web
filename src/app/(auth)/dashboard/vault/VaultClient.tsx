"use client";

import { useTransition } from "react";
import { Globe, Lock, Trash2, Shield, Loader2 } from "lucide-react";
import { purchasePrivacy, deletePost } from "@/actions/economy";

interface VaultPost {
  id: string;
  image_url: string;
  is_public: number;
  created_at: string;
}

export default function VaultClient({ initialPosts }: { initialPosts: VaultPost[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMakePrivate = (postId: string) => {
    if (!confirm("Lock this asset? It will cost 22 Sparks and remove it from the public feed.")) return;
    
    startTransition(async () => {
      const res = await purchasePrivacy(postId);
      if (res.success) alert("Asset Locked! 🔒");
      else alert(res.message);
    });
  };

  const handleDelete = (postId: string) => {
    if (!confirm("Are you sure you want to permanently delete this asset?")) return;
    
    startTransition(async () => {
      const res = await deletePost(postId);
      if (res.success) alert("Asset Deleted 🗑️");
      else alert(res.message);
    });
  };

  if (initialPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
        <span className="mb-4 text-4xl opacity-50">🗄️</span>
        <p className="font-medium text-[13px] text-[var(--color-ink2)]">Your vault is empty.</p>
        <p className="text-[12px] text-[var(--color-ink3)] mt-1">Head to the Studio to create your first aesthetic.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
      {initialPosts.map((post) => {
        const isPublic = post.is_public === 1;

        return (
          <div key={post.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[12px] bg-[var(--rule)] shadow-sm">
            
            {/* The Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.image_url} 
              alt="Vault Asset" 
              className={`w-full object-cover transition-transform duration-500 ${isPending ? 'opacity-50' : 'group-hover:scale-105'}`} 
              loading="lazy" 
            />

            {/* Top Right Status Indicator (Always Visible) */}
            <div className="absolute top-2 right-2">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md ${isPublic ? 'bg-black/30 text-white' : 'bg-[var(--color-gold)] text-[var(--color-ink)]'}`}>
                {isPublic ? <Globe size={14} /> : <Lock size={14} />}
              </div>
            </div>

            {/* Hover Control Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 group-hover:opacity-100">
              
              {isPublic && (
                <button 
                  onClick={() => handleMakePrivate(post.id)}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-4 py-2 text-[12px] font-bold text-[var(--color-ink)] shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Shield size={14} className="fill-[var(--color-ink)]" />
                  MAKE PRIVATE (22 ⚡)
                </button>
              )}

              <button 
                onClick={() => handleDelete(post.id)}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-red-500/90 backdrop-blur-sm px-4 py-2 text-[12px] font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-600 disabled:opacity-50"
              >
                <Trash2 size={14} />
                DELETE
              </button>

            </div>

            {/* Loading Spinner Overlay */}
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}