"use client";

import { useState, useTransition } from "react";
import { Bell, X, Heart, Share2 } from "lucide-react";
import { markNotificationsAsRead } from "@/actions/notifications";
import Link from "next/link";

interface NotificationGroup {
  id: string;
  type: string;
  post_id: string;
  is_read: number;
  created_at: string;
  actors: { username: string; image: string }[];
}

export default function NotificationBell({ 
  initialNotifications, 
  initialUnreadCount 
}: { 
  initialNotifications: NotificationGroup[], 
  initialUnreadCount: number 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setIsOpen(true);
    
    // Optimistically clear the red dot instantly for a snappy UI
    if (unread > 0) {
      setUnread(0);
      // Fire the server action in the background to update the database
      startTransition(async () => {
        await markNotificationsAsRead();
      });
    }
  };

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button 
        onClick={handleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[var(--color-ink)] shadow-sm transition-colors hover:bg-gray-50"
      >
        <Bell size={18} />
        {/* THE RED DOT */}
        {unread > 0 && (
          <span className="absolute right-2.5 top-2 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {/* THE SLIDE-OVER TRAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Panel */}
          <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right-full duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--rule)] px-6 py-4">
              <h2 className="font-[family-name:var(--display)] text-xl text-[var(--color-ink)]">Notifications</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4">
              {initialNotifications.length === 0 ? (
                <div className="mt-12 flex flex-col items-center text-center text-gray-500">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <Bell size={24} className="opacity-40" />
                  </div>
                  <p className="text-sm font-medium">No notifications yet.</p>
                  <p className="mt-1 max-w-[200px] text-[11px] text-gray-400">
                    When someone interacts with your styles, it will show up here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {initialNotifications.map((notif) => {
                    const isLike = notif.type === 'like';
                    const Icon = isLike ? Heart : Share2;
                    const iconColor = isLike ? "text-red-500 bg-red-50" : "text-blue-500 bg-blue-50";
                    
                    const actors = notif.actors || [];
                    const count = actors.length;
                    const firstActor = actors[0]?.username || "Someone";

                    // THE INSTAGRAM GROUPING LOGIC
                    let textRender;
                    if (count === 1) {
                      textRender = <><span className="font-bold text-[var(--color-ink)]">{firstActor}</span> {isLike ? "liked" : "remixed"} your post.</>;
                    } else if (count === 2) {
                      textRender = <><span className="font-bold text-[var(--color-ink)]">{firstActor}</span> and <span className="font-bold text-[var(--color-ink)]">{actors[1].username}</span> {isLike ? "liked" : "remixed"} your post.</>;
                    } else {
                      textRender = <><span className="font-bold text-[var(--color-ink)]">{firstActor}</span>, <span className="font-bold text-[var(--color-ink)]">{actors[1].username}</span> and <span className="font-bold text-[var(--color-ink)]">{count - 2} others</span> {isLike ? "liked" : "remixed"} your post.</>;
                    }

                    return (
                      <Link 
                        key={notif.id} 
                        href={`/post/${notif.post_id}`} 
                        onClick={() => setIsOpen(false)} 
                        className={`flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50 ${notif.is_read === 0 ? 'bg-blue-50/30' : ''}`}
                      >
                        
                        {/* STACKED AVATARS */}
                        <div className="flex shrink-0 -space-x-2 pt-1">
                          {actors.slice(0, 3).map((actor, i) => (
                            <img 
                              key={i} 
                              src={actor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${actor.username}`} 
                              alt={actor.username} 
                              className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 object-cover" 
                            />
                          ))}
                        </div>

                        <div className="flex flex-1 flex-col">
                          <span className="text-[13px] text-gray-600">
                            {textRender}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <div className={`flex h-4 w-4 items-center justify-center rounded-full ${iconColor}`}>
                              <Icon size={8} />
                            </div>
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                        </div>

                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}