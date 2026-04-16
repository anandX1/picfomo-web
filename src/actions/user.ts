"use server";

import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Extract data from the form
  const displayName = formData.get("displayName") as string;
  const bio = formData.get("bio") as string;
  const website = formData.get("website") as string; 

  const db = getRequestContext().env.DB;

  try {
    // Save the identity and the website link to D1
    await db.prepare("UPDATE users SET display_name = ?, bio = ?, website = ? WHERE id = ?")
      .bind(displayName, bio, website, userId)
      .run();

    // Force Next.js to clear the cache so the profile page updates instantly
    revalidatePath(`/u/[username]`, 'page');
    revalidatePath("/dashboard/settings");
    
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, message: "Failed to update profile." };
  }
}