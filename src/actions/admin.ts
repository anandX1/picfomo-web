"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- EXISTING STYLE SCHEMAS ---
const styleSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50, "Name must be under 50 characters"),
  description: z.string().min(5, "Description is required").max(500, "Description is too long"),
  preview_image_url: z.string().url("Must be a valid URL"),
  badge: z.string().max(10).optional().nullable(),
});

// --- NEW TASK/BOUNTY SCHEMA ---
const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  reward_amount: z.coerce.number().min(1, "Reward must be at least 1").max(500, "Reward too high"),
  task_type: z.string(), // e.g., 'survey', 'link'
  action_url: z.string().optional().nullable(),
});

async function verifyAdmin() {
  const user = await currentUser();
  const isAdmin = user?.emailAddresses.some(e => e.emailAddress === "everykart.help@gmail.com");
  if (!isAdmin) throw new Error("Unauthorized Access");
}

// ==========================================
// 1. STYLE MANAGEMENT (Your Existing Code)
// ==========================================

export async function addStyle(formData: FormData) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      preview_image_url: formData.get("preview_image_url") as string,
      badge: formData.get("badge") as string,
    };

    const validatedData = styleSchema.parse(rawData);
    
    const id = `style_${Date.now()}`;
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    await db.prepare(`
      INSERT INTO styles (id, slug, name, description, preview_image_url, badge) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id, 
      slug, 
      validatedData.name, 
      validatedData.description, 
      validatedData.preview_image_url, 
      validatedData.badge || null
    ).run();

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add style:", error);
    if (error instanceof z.ZodError) return { success: false, error: (error as any).errors[0].message }; 
    return { success: false, error: "Failed to add style." };
  }
}

export async function toggleStyleActive(id: string, currentStatus: number) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    const newStatus = currentStatus === 1 ? 0 : 1;
    await db.prepare("UPDATE styles SET is_active = ? WHERE id = ?").bind(newStatus, id).run();
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to toggle status", error);
  }
}

export async function deleteStyle(id: string) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    await db.prepare("DELETE FROM styles WHERE id = ?").bind(id).run();
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete style", error);
  }
}

// ==========================================
// 2. TASK / BOUNTY MANAGEMENT (NEW ENGINE)
// ==========================================

export async function addTask(formData: FormData) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      reward_amount: formData.get("reward_amount"),
      task_type: formData.get("task_type") as string,
      action_url: formData.get("action_url") as string,
    };

    const validatedData = taskSchema.parse(rawData);
    const id = `task_${Date.now()}`;
    
    await db.prepare(`
      INSERT INTO tasks (id, title, description, reward_amount, task_type, action_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id, 
      validatedData.title, 
      validatedData.description, 
      validatedData.reward_amount, 
      validatedData.task_type, 
      validatedData.action_url || null
    ).run();

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add task:", error);
    if (error instanceof z.ZodError) return { success: false, error: (error as any).errors[0].message }; 
    return { success: false, error: "Failed to add task." };
  }
}

export async function toggleTaskActive(id: string, currentStatus: number) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    const newStatus = currentStatus === 1 ? 0 : 1;
    await db.prepare("UPDATE tasks SET is_active = ? WHERE id = ?").bind(newStatus, id).run();
    
    // We revalidate both Admin (to see changes) and Sparks Hub (so users instantly see/lose the bounty)
    revalidatePath("/admin");
    revalidatePath("/dashboard/sparks"); 
  } catch (error) {
    console.error("Failed to toggle task status", error);
  }
}

export async function deleteTask(id: string) {
  try {
    await verifyAdmin();
    const db = getRequestContext().env.DB;
    // Deleting the task automatically cascades and deletes user_tasks linked to it
    await db.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
    
    revalidatePath("/admin");
    revalidatePath("/dashboard/sparks");
  } catch (error) {
    console.error("Failed to delete task", error);
  }
}