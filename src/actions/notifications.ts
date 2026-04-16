"use server";

import { auth } from "@clerk/nextjs/server";


export async function getNotifications() {
  const { userId } = await auth();
  if (!userId) return { success: false, notifications: [], unreadCount: 0 };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 1. Fetch the raw notifications with the user details attached
  const { results } = await db.prepare(`
    SELECT 
      n.id, n.type, n.post_id, n.is_read, n.created_at,
      u.username as actor_username, 
      u.profile_image_url as actor_image
    FROM notifications n
    JOIN users u ON n.actor_id = u.id
    WHERE n.recipient_id = ?
    ORDER BY n.created_at DESC
    LIMIT 50
  `).bind(userId).all();

  // 2. Count how many are unread for the Red Dot
  const unreadCount = results.filter((n: any) => n.is_read === 0).length;

  // 3. The Instagram Grouping Logic (Group by action type + post ID)
  const groupedMap = new Map();

  results.forEach((notif: any) => {
    const key = `${notif.type}_${notif.post_id}`;
    
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        id: notif.id, // Use the most recent ID for keys
        type: notif.type,
        post_id: notif.post_id,
        is_read: notif.is_read,
        created_at: notif.created_at,
        actors: [],
      });
    }
    
    const group = groupedMap.get(key);
    
    // Only add unique actors to the array so we don't show the same face twice
    if (!group.actors.some((a: any) => a.username === notif.actor_username)) {
      group.actors.push({
        username: notif.actor_username,
        image: notif.actor_image
      });
    }
  });

  const groupedNotifications = Array.from(groupedMap.values());

  return { success: true, notifications: groupedNotifications, unreadCount };
}

export async function markNotificationsAsRead() {
  const { userId } = await auth();
  if (!userId) return { success: false };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  // Wipe the red dots clean!
  await db.prepare("UPDATE notifications SET is_read = 1 WHERE recipient_id = ? AND is_read = 0").bind(userId).run();

  return { success: true };
}