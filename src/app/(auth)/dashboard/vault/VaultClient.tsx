"use client";

import { useTransition } from "react";
import { Globe, Lock, Trash2, Shield, Loader2, DatabaseBackup } from "lucide-react";
import { purchasePrivacy, deletePost } from "@/actions/economy";
import { toast } from "sonner"; // 🌟 ADDED: Smooth toast notifications!

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
      if (res.success) toast.success("Asset successfully locked! 🔒");
      else toast.error(res.message);
    });
  };

  const handleDelete = (postId: string) => {
    if (!confirm("Are you sure you want to permanently delete this asset?")) return;
    
    startTransition(async () => {
      const res = await deletePost(postId);
      if (res.success) toast.success("Asset permanently deleted. 🗑️");
      else toast.error(res.message);
    });
  };

  if (initialPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center text-[var(--color-ink3)]">
        <DatabaseBackup size={64} className="mb-6 opacity-20" />
        <h3 className="font-[family-name:var(--display)] text-3xl tracking-wide text-[var(--color-ink)] mb-2">VAULT IS EMPTY</h3>
        <p className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-widest">Head to the Studio to create your first aesthetic.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 md:gap-5 pb-20">
      {initialPosts.map((post) => {
        const isPublic = post.is_public === 1;

        return (
          <div key={post.id} className="break-inside-avoid mb-4 md:mb-6">
            <div className="group relative overflow-hidden rounded-[20px] bg-[var(--color-cream)] border border-[var(--rule)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col">
              
              {/* 🌟 IMAGE SECTION */}
              <div className="relative aspect-auto w-full bg-[var(--color-cream2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image_url} 
                  alt="Vault Asset" 
                  className={`w-full h-auto object-cover transition-transform duration-700 ${isPending ? 'opacity-50' : 'group-hover:scale-[1.02]'}`} 
                  loading="lazy" 
                />

                {/* 🌟 STATUS BADGE: Floating Frost Glass */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  {isPublic ? (
                    <div className="flex items-center gap-1.5 bg-[#000000]/60 backdrop-blur-md border border-[#FFFFFF]/20 text-[#FFFFFF] px-3 py-1.5 rounded-full text-[9px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest shadow-lg">
                      <Globe size={12} /> Public
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-[var(--color-gold)] text-black border border-yellow-300/30 px-3 py-1.5 rounded-full text-[9px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest shadow-lg">
                      <Lock size={12} /> Private
                    </div>
                  )}
                </div>

                {/* Loading Overlay */}
                {isPending && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-[var(--color-gold)]" size={32} />
                  </div>
                )}
              </div>

              {/* 🌟 MOBILE-OPTIMIZED ACTION BAR: Permanently visible beneath the image! */}
              <div className="flex items-center justify-between p-3 bg-[var(--color-cream)] border-t border-[var(--rule)]">
                {isPublic ? (
                  <button 
                    onClick={() => handleMakePrivate(post.id)}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-gold-pale)] hover:bg-[var(--color-gold)] text-[var(--color-gold)] hover:text-black border border-[var(--color-gold-border)] rounded-xl py-2.5 px-2 text-[9px] md:text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 mr-2 shadow-sm"
                  >
                    <Shield size={14} /> Make Private (22 ⚡)
                  </button>
                ) : (
                  <div className="flex-1 flex items-center gap-2 text-[var(--color-ink3)] text-[10px] font-[family-name:var(--mono)] font-bold uppercase tracking-widest px-2">
                    <Lock size={14} /> Asset Secured
                  </div>
                )}

                <button 
                  onClick={() => handleDelete(post.id)}
                  disabled={isPending}
                  className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all disabled:opacity-50 active:scale-95 group/del shadow-sm"
                >
                  <Trash2 size={16} className="transition-transform group-hover/del:scale-110" />
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}