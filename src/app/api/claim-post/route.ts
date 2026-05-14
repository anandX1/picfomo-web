import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * API Route: Claim Post
 * logic: Transfers a 'guest_user' post to a registered user's vault.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // 3. Get Cloudflare D1 Database context
    const envCtx = (await getCloudflareContext({ async: true })).env as any;
    const db = envCtx.DB;

    if (!db) {
      throw new Error("Database context not found");
    }

    // 4. Update the post: Transfer from 'guest_user' to the authenticated userId
    const result = await db
      .prepare("UPDATE posts SET user_id = ? WHERE id = ? AND user_id = 'guest_user'")
      .bind(userId, postId)
      .run();

    // 5. Verify the update
    if (result.meta.changes > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Post not found or already claimed" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Claim Post API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
