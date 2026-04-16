"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function JoinTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) {
      // Save it to their browser, so the Sparks Hub finds it after they sign up!
      localStorage.setItem("picfomo_ref", refCode);
    }
    // Instantly send them to the sign up page
    router.push("/sign-up");
  }, [refCode, router]);

  return null;
}

export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="font-[family-name:var(--mono)] text-[12px] uppercase tracking-widest text-gray-500">
          Preparing your invite...
        </p>
      </div>
      <Suspense fallback={null}>
        <JoinTracker />
      </Suspense>
    </div>
  );
}