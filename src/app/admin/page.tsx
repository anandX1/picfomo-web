import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldAlert, Settings2, Eye, EyeOff, Trash2, Target } from "lucide-react";
import StyleForm from "./StyleForm";
import TaskForm from "./TaskForm";
import { toggleStyleActive, deleteStyle, toggleTaskActive, deleteTask } from "@/actions/admin";

// 🌟 OPENNEXT FIX: Replaced next-on-pages with OpenNext
import { getCloudflareContext } from "@opennextjs/cloudflare";

// 🌟 MULTIPLE ADMINS CONFIGURATION
const ALLOWED_ADMINS = [
  "everykart.help@gmail.com",
  "anandkumar.3042008@gmail.com",
  "crafty9323@gmail.com", // Add your other emails here!
];

export default async function AdminDashboard() {
  const user = await currentUser();
  
  // GOD MODE SECURITY: Checks if the user's email is in the allowed list
  const isAdmin = user?.emailAddresses.some(e => ALLOWED_ADMINS.includes(e.emailAddress));
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // 🌟 OPENNEXT FIX: Correct DB Connection
  const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  // Fetch both Styles and Bounties
  const [stylesResult, tasksResult] = await db.batch([
    db.prepare("SELECT * FROM styles ORDER BY created_at DESC"),
    db.prepare("SELECT * FROM tasks ORDER BY created_at DESC")
  ]);
  
  const styles = stylesResult.results as any[];
  const tasks = tasksResult.results as any[];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] p-6 md:p-12">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between border-b border-[var(--rule)] pb-6">
          <div>
            <h1 className="font-[family-name:var(--display)] text-4xl text-[var(--color-ink)] flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={32} /> God Mode
            </h1>
            <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[1px] text-[var(--color-ink2)]">
              System Administration & Catalog Management
            </p>
          </div>
        </div>

        {/* SECTION 1: STYLE MANAGEMENT */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          <div className="lg:col-span-1">
            <StyleForm />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-2 flex items-center gap-2">
              <Settings2 size={16} /> Style Catalog ({styles.length})
            </h2>
            
            <div className="rounded-xl border border-[var(--rule)] bg-white overflow-hidden shadow-sm">
              {styles.length === 0 ? (
                <div className="p-12 text-center font-[family-name:var(--mono)] text-[12px] text-[var(--color-ink3)]">
                  No styles deployed yet. Use the form to add one.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--rule)]">
                  {styles.map((style: any) => {
                    // 🌟 NEW: Parse the JSON array of images safely
                    let images = [];
                    try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
                    const mainImage = images[0] || style.preview_image_url;

                    return (
                      <div key={style.id} className={`flex items-center justify-between p-4 transition-colors ${style.is_active ? 'hover:bg-[var(--color-cream)]' : 'bg-gray-50 opacity-60'}`}>
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {mainImage && <img src={mainImage} alt={style.name} className="h-16 w-16 rounded-md object-cover border border-[var(--rule)]" />}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-[family-name:var(--mono)] text-[14px] font-bold text-[var(--color-ink)]">{style.name}</span>
                              {style.badge && (
                                <span className="bg-[var(--color-ink)] text-[var(--color-gold)] text-[8px] px-2 py-0.5 rounded-sm font-bold tracking-widest">{style.badge}</span>
                              )}
                              {style.expires_at && (
                                <span className="bg-red-50 border border-red-200 text-red-600 text-[8px] px-2 py-0.5 rounded-sm font-bold tracking-widest">TIMER SET</span>
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--color-ink3)] font-[family-name:var(--mono)] mt-1">
                              {images.length > 0 ? `${images.length} Images` : '1 Image'} • {style.spark_cost} ⚡
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <form action={async () => { "use server"; await toggleStyleActive(style.id, style.is_active); }}>
                            <button type="submit" className={`p-2 rounded-full border transition-colors ${style.is_active ? 'border-green-200 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'border-gray-200 bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
                              {style.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </form>
                          <form action={async () => { "use server"; await deleteStyle(style.id); }}>
                            <button type="submit" className="p-2 rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VISUAL DIVIDER */}
        <hr className="border-[var(--rule)] mb-12" />

        {/* SECTION 2: BOUNTY MANAGEMENT (UNTOUCHED) */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TaskForm />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink)] mb-2 flex items-center gap-2">
              <Target size={16} className="text-blue-500" /> Active Bounties ({tasks.length})
            </h2>
            
            <div className="rounded-xl border border-[var(--rule)] bg-white overflow-hidden shadow-sm">
              {tasks.length === 0 ? (
                <div className="p-12 text-center font-[family-name:var(--mono)] text-[12px] text-[var(--color-ink3)]">
                  No bounties deployed yet. Use the form to add one.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--rule)]">
                  {tasks.map((task: any) => (
                    <div key={task.id} className={`flex items-center justify-between p-4 transition-colors ${task.is_active ? 'hover:bg-blue-50/30' : 'bg-gray-50 opacity-60'}`}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-[family-name:var(--mono)] text-[14px] font-bold text-[var(--color-ink)]">{task.title}</span>
                          <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase">{task.task_type}</span>
                        </div>
                        <span className="text-[11px] text-[var(--color-ink3)] mt-1 max-w-md truncate">{task.description}</span>
                        <span className="text-[10px] font-bold text-green-600 mt-2">Reward: +{task.reward_amount} ⚡</span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <form action={async () => { "use server"; await toggleTaskActive(task.id, task.is_active); }}>
                          <button type="submit" className={`p-2 rounded-full border transition-colors ${task.is_active ? 'border-green-200 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'border-gray-200 bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
                            {task.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </form>
                        <form action={async () => { "use server"; await deleteTask(task.id); }}>
                          <button type="submit" className="p-2 rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}