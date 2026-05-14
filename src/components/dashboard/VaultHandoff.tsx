"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFunnelStore } from "@/store/useFunnelStore";
import { toast } from "sonner";

/**
 * VaultHandoff: An invisible component that listens for guest sessions
 * and claims pending guest generations once a user authenticates.
 */
export default function VaultHandoff() {
  const router = useRouter();
  const { guestPostId, clearGuestSession } = useFunnelStore();
  const isClaiming = useRef(false);

  useEffect(() => {
    // Only proceed if there's a guest post ID and we're not already claiming it
    if (!guestPostId || isClaiming.current) return;

    const claimPost = async () => {
      isClaiming.current = true;
      
      try {
        const res = await fetch("/api/claim-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: guestPostId }),
        });

        if (res.ok) {
          toast.success("Your masterpiece has been secured in your Vault!");
          // Clear session first to prevent any re-firing
          clearGuestSession();
          // Send user to the vault to see their claimed image
          router.push("/dashboard/vault");
        } else {
          // If the post isn't found or already claimed, we should still clear to stop loops
          const data = await res.json();
          console.warn("Claim post failed:", data.error);
          clearGuestSession();
        }
      } catch (error) {
        console.error("Vault Handoff error:", error);
        toast.error("Failed to secure your guest masterpiece.");
        clearGuestSession();
      } finally {
        isClaiming.current = false;
      }
    };

    claimPost();
  }, [guestPostId, clearGuestSession, router]);

  return null;
}
