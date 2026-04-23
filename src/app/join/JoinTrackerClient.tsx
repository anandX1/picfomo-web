"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinTrackerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) {
      // Save it to their browser, so the Sparks Hub finds it after they sign up!
      localStorage.setItem("picfomo_ref", refCode);
    }
    
    // Slight delay so the user actually sees the premium loading UI before jumping to Clerk
    const timer = setTimeout(() => {
      router.push("/sign-up");
    }, 1500);

    return () => clearTimeout(timer);
  }, [refCode, router]);

  return null;
}