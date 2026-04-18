export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🌟 FIX: This is now a completely transparent pass-through wrapper!
  // It stops the Dashboard header from doubling up and stops it from leaking onto Sign-In.
  return <>{children}</>;
}