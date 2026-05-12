import { redirect } from "next/navigation";

export const revalidate = 86400;

export default function HowItWorksRedirectPage() {
  redirect("/#how-it-works");
}

