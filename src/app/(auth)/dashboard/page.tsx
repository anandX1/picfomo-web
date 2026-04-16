import { redirect } from "next/navigation";

export const runtime = "edge";

export default function DashboardPage() {
  // The moment a user lands on /dashboard, instantly teleport them to the Studio
  redirect("/dashboard/studio");
}