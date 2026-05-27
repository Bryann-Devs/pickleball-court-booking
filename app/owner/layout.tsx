import { AuthGuard } from "@/components/AuthGuard";

export default function OwnerLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard allowedRoles={["court_owner", "admin"]}>{children}</AuthGuard>;
}
