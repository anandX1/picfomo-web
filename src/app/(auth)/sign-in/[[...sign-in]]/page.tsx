import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-cream)] p-6">
      <Link href="/" className="mb-8 flex items-center gap-2 outline-none hover:opacity-80 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-ink)] font-[family-name:var(--display)] text-[14px] tracking-[1px] text-[var(--color-gold-light)]">
          PF
        </div>
        <div className="font-[family-name:var(--display)] text-[24px] tracking-[2px] text-[var(--color-ink)]">
          PICFOMO
        </div>
      </Link>
      
      {/* Clerk Component */}
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: '#111009',
            colorBackground: '#FAFAF8',
            colorText: '#111009',
            borderRadius: '0px',
          },
          elements: {
            card: "shadow-[var(--shadow-lg)] border border-[var(--rule)]",
            formButtonPrimary: "bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] text-[14px] tracking-[1px] font-bold uppercase border border-[var(--color-ink)]",
            footerActionLink: "text-[var(--color-gold)] hover:text-[var(--color-ink)]",
          }
        }}
      />
    </div>
  );
}