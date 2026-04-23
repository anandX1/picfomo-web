"use client";

import { useState, useTransition } from "react";
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, Settings, Save, X, EyeOff, Eye, Loader2, Images, ImagePlus } from "lucide-react";
import { addStyle, updateStyle, updateStylesOrder, toggleStyleActive, deleteStyle } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminClient({ initialStyles }: { initialStyles: any[] }) {
  const router = useRouter();
  const [styles, setStyles] = useState(initialStyles);
  const [isPending, startTransition] = useTransition();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<any>(null);
  
  // Form State for FOMO Timer
  const [hasTimer, setHasTimer] = useState(false);

  // 🌟 REORDER LOGIC (Optimistic UI)
  const moveStyle = (index: number, direction: 1 | -1) => {
    const newStyles = [...styles];
    if (direction === -1 && index > 0) {
      [newStyles[index], newStyles[index - 1]] = [newStyles[index - 1], newStyles[index]];
    } else if (direction === 1 && index < newStyles.length - 1) {
      [newStyles[index], newStyles[index + 1]] = [newStyles[index + 1], newStyles[index]];
    } else {
      return; 
    }
    
    setStyles(newStyles); // Update UI instantly
    
    // Sync to DB in background
    startTransition(async () => {
      const ids = newStyles.map(s => s.id);
      await updateStylesOrder(ids);
    });
  };

  const handleToggleActive = (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setStyles(styles.map(s => s.id === id ? { ...s, is_active: newStatus } : s));
    startTransition(async () => {
      await toggleStyleActive(id, currentStatus);
      toast.success(newStatus === 1 ? "Style Activated" : "Style Hidden");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure? This might break posts that already use this style.")) return;
    
    startTransition(async () => {
      await deleteStyle(id);
      setStyles(styles.filter(s => s.id !== id));
      toast.success("Style permanently deleted.");
    });
  };

  const openModal = (style: any = null) => {
    setEditingStyle(style);
    setHasTimer(!!style?.expires_at);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let res;
      if (editingStyle) {
        res = await updateStyle(editingStyle.id, formData);
      } else {
        res = await addStyle(formData);
      }

      if (res?.success) {
        toast.success(editingStyle ? "Style updated successfully!" : "New style deployed!");
        setIsModalOpen(false);
        // Force hard refresh to pull the new exact DB data/IDs
        window.location.reload(); 
      } else {
        toast.error(res?.error || "Failed to save style");
      }
    });
  };

  return (
    <div className="w-full text-[var(--color-ink)] animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-2 flex items-center gap-2">
            <Settings size={16} /> Style Catalog ({styles.length})
          </h2>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[var(--color-ink)] text-[var(--color-white)] hover:bg-[var(--color-gold)] hover:text-black transition-all flex items-center gap-2 px-5 py-2.5 rounded-xl font-[family-name:var(--mono)] font-bold text-[11px] uppercase tracking-widest shadow-md active:scale-95"
        >
          <Plus size={16} /> New Style
        </button>
      </div>

      {/* 🌟 THE STYLES LIST */}
      <div className="bg-[var(--color-white)] rounded-xl border border-[var(--rule)] shadow-sm overflow-hidden mb-12">
        {styles.length === 0 ? (
          <div className="p-16 text-center text-[var(--color-ink3)] font-[family-name:var(--mono)] text-[12px]">No styles found. Add one above!</div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--rule)]">
            {styles.map((style, index) => {
              // Parse the legacy JSON array safely
              let images: string[] = [];
              try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
              const mainImage = images[0] || style.preview_image_url;

              return (
                <div key={style.id} className={`flex items-center gap-4 p-4 transition-colors hover:bg-[var(--color-cream)] ${style.is_active === 0 ? 'opacity-50' : ''}`}>
                  
                  {/* Reorder Arrows */}
                  <div className="flex flex-col gap-1 pr-3 border-r border-[var(--rule)]">
                    <button onClick={() => moveStyle(index, -1)} disabled={index === 0 || isPending} className="p-1 text-[var(--color-ink3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream2)] rounded disabled:opacity-30 transition-colors">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveStyle(index, 1)} disabled={index === styles.length - 1 || isPending} className="p-1 text-[var(--color-ink3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream2)] rounded disabled:opacity-30 transition-colors">
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-[var(--rule)] shadow-sm relative">
                    {mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mainImage} alt={style.name} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center"><ImagePlus size={20} className="text-gray-400" /></div>}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-[family-name:var(--display)] text-[16px] truncate">{style.name}</h3>
                      {style.badge && <span className="bg-[var(--color-ink)] text-[var(--color-gold)] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">{style.badge}</span>}
                      {style.is_active === 0 && <span className="bg-red-50 text-red-600 border border-red-200 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-1"><EyeOff size={10}/> Hidden</span>}
                      {style.expires_at && <span className="bg-orange-50 border border-orange-200 text-orange-600 text-[8px] px-2 py-0.5 rounded-sm font-bold tracking-widest">TIMER SET</span>}
                    </div>
                    <p className="font-[family-name:var(--mono)] text-[11px] text-[var(--color-ink3)] truncate w-full mt-1.5">
                      <span className="font-bold text-[var(--color-ink)]">Cost:</span> {style.spark_cost}⚡ &nbsp;|&nbsp; 
                      <span className="font-bold text-[var(--color-ink)]">Images:</span> {images.length > 0 ? images.length : 1} &nbsp;|&nbsp; 
                      {style.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pl-4">
                    <button onClick={() => openModal(style)} className="p-2.5 bg-[var(--color-white)] border border-[var(--rule)] rounded-xl text-[var(--color-ink)] hover:bg-[var(--color-cream2)] shadow-sm transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleToggleActive(style.id, style.is_active)} className={`p-2.5 rounded-xl border transition-colors shadow-sm ${style.is_active ? 'border-green-200 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
                      {style.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => handleDelete(style.id)} className="p-2.5 bg-white hover:bg-red-50 border border-[var(--rule)] hover:border-red-200 text-gray-400 hover:text-red-600 rounded-xl shadow-sm transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🌟 ADD / EDIT MODAL (Preserves your exact URL input architecture!) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--color-white)] w-full max-w-2xl rounded-2xl border border-[var(--rule)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-[var(--rule)] bg-[var(--color-cream)]">
              <h2 className="font-[family-name:var(--display)] text-2xl tracking-tight">
                {editingStyle ? "Edit Style" : "Create New Style"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-[var(--color-white)] border border-[var(--rule)] text-[var(--color-ink3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream2)] transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form id="styleForm" onSubmit={handleSave} className="flex flex-col gap-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Display Name *</label>
                    <input required name="name" type="text" defaultValue={editingStyle?.name || ""} placeholder="e.g. Studio Ghibli" className="w-full mt-1 rounded-lg border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[13px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Spark Cost *</label>
                    <input required name="spark_cost" type="number" min="0" max="500" defaultValue={editingStyle?.spark_cost || 10} className="w-full mt-1 rounded-lg border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[13px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                  </div>
                </div>
                
                {/* FireRed Secret Prompt */}
                <div>
                  <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)] flex items-center gap-2 mb-1">
                    <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-sm font-bold tracking-widest text-[9px]">Secret Prompt (Hidden)</span>
                  </label>
                  <p className="text-[11px] text-[var(--color-ink3)] mb-2">This is the text prompt sent to the AI to construct the background and outfit.</p>
                  <textarea required name="description" defaultValue={editingStyle?.description || ""} placeholder="e.g. A futuristic neon cyberpunk city street at night. The person is wearing a glowing high-tech leather jacket..." className="w-full h-24 resize-none rounded-lg border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[13px] focus:border-[var(--color-gold)] focus:outline-none transition-colors leading-relaxed" />
                </div>

                {/* Legacy 5 Image URLs (Preview Gallery) */}
                <div className="rounded-xl border border-[var(--rule)] bg-[var(--color-cream)] p-5">
                  <label className="text-[11px] font-[family-name:var(--mono)] font-bold uppercase tracking-[1.5px] text-[var(--color-ink)] flex items-center gap-2 mb-4">
                    <Images size={16} /> Preview Gallery (URLs)
                  </label>
                  <div className="space-y-3">
                    {(() => {
                      let urls: string[] = [];
                      try { urls = JSON.parse(editingStyle?.preview_urls || '[]'); } catch(e) {}
                      return (
                        <>
                          <input required name="url_1" type="url" defaultValue={urls[0] || editingStyle?.preview_image_url || ""} placeholder="Main Image URL (Required)" className="w-full rounded-lg border border-[var(--rule)] bg-white p-2.5 text-[12px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                          <input name="url_2" type="url" defaultValue={urls[1] || ""} placeholder="Image URL 2 (Optional)" className="w-full rounded-lg border border-[var(--rule)] bg-white p-2.5 text-[12px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                          <input name="url_3" type="url" defaultValue={urls[2] || ""} placeholder="Image URL 3 (Optional)" className="w-full rounded-lg border border-[var(--rule)] bg-white p-2.5 text-[12px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                          <input name="url_4" type="url" defaultValue={urls[3] || ""} placeholder="Image URL 4 (Optional)" className="w-full rounded-lg border border-[var(--rule)] bg-white p-2.5 text-[12px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                          <input name="url_5" type="url" defaultValue={urls[4] || ""} placeholder="Image URL 5 (Optional)" className="w-full rounded-lg border border-[var(--rule)] bg-white p-2.5 text-[12px] focus:border-[var(--color-gold)] focus:outline-none transition-colors" />
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Badge and FOMO Timer Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)]">Badge (Optional)</label>
                    <select name="badge" defaultValue={editingStyle?.badge || ""} className="w-full mt-1 rounded-lg border border-[var(--rule)] bg-[var(--color-cream)] p-3 text-[13px] focus:border-[var(--color-gold)] focus:outline-none cursor-pointer">
                      <option value="">None</option>
                      <option value="HOT">HOT</option>
                      <option value="NEW">NEW</option>
                      <option value="PRO">PRO</option>
                      <option value="SALE">SALE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px] text-[var(--color-ink3)] flex justify-between items-center mb-1">
                      <span>FOMO Timer</span>
                      <input type="checkbox" checked={hasTimer} onChange={() => setHasTimer(!hasTimer)} className="cursor-pointer accent-[var(--color-gold)]" />
                    </label>
                    {hasTimer ? (
                      <input name="expires_at" type="datetime-local" defaultValue={editingStyle?.expires_at ? new Date(editingStyle.expires_at).toISOString().slice(0, 16) : ""} className="w-full rounded-lg border border-orange-300 bg-orange-50 p-2.5 text-[13px] text-orange-900 focus:outline-none focus:border-orange-500" />
                    ) : (
                      <div className="w-full rounded-lg border border-[var(--rule)] bg-[var(--color-cream2)] p-2.5 text-[13px] text-[var(--color-ink3)] text-center select-none font-[family-name:var(--mono)] uppercase tracking-widest font-bold">
                        No Timer Set
                      </div>
                    )}
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[var(--rule)] bg-[var(--color-cream)] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink3)] hover:text-[var(--color-ink)] transition-colors hover:bg-[var(--color-cream2)] rounded-xl">
                Cancel
              </button>
              <button 
                type="submit" 
                form="styleForm"
                disabled={isPending}
                className="bg-[var(--color-ink)] text-[var(--color-white)] hover:bg-[var(--color-gold)] hover:text-black transition-all flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-[family-name:var(--mono)] font-bold text-[11px] uppercase tracking-widest shadow-md disabled:opacity-50 active:scale-95"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                {isPending ? "Processing..." : (editingStyle ? "Update Style" : "Deploy Style")}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}