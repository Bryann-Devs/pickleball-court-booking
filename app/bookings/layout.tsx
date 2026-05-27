import { AuthGuard } from "@/components/AuthGuard";

export default function BookingsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard>{children}</AuthGuard>;
}
