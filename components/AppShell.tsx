"use client";

import { usePathname } from "next/navigation";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Navbar } from "@/components/Navbar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isDashboardPage = pathname.startsWith("/owner") || pathname.startsWith("/admin");

  if (isLandingPage || isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      <BottomNavigation />
    </div>
  );
}
