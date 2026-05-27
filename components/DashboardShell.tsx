"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type DashboardRole = "owner" | "admin";

type DashboardLink = {
  disabled?: boolean;
  href: string;
  label: string;
};

const linksByRole: Record<DashboardRole, DashboardLink[]> = {
  owner: [
    { href: "/owner/dashboard", label: "Dashboard" },
    { href: "/owner/courts", label: "My Courts" },
    { href: "/owner/bookings", label: "Bookings" },
    { href: "/owner/schedule", label: "Schedule" }
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/courts", label: "Courts" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/settings", label: "Settings" }
  ]
};

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

export function DashboardShell({ children, role }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const links = linksByRole[role];
  const title = role === "admin" ? "Admin" : "Owner";

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-5">
          <Link href="/" className="text-xl font-bold text-court-900">
            PickleBook
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{title} dashboard</p>
          <DashboardLinks links={links} pathname={pathname} />
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:border-court-200 hover:text-court-700"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:hidden">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold text-court-900">
              PickleBook
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Menu
            </button>
          </div>
          {isOpen ? (
            <div className="border-t border-slate-200 px-4 py-3">
              <DashboardLinks links={links} pathname={pathname} onNavigate={() => setIsOpen(false)} />
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Log out
              </button>
            </div>
          ) : null}
        </header>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

type DashboardLinksProps = {
  links: DashboardLink[];
  onNavigate?: () => void;
  pathname: string;
};

function DashboardLinks({ links, onNavigate, pathname }: DashboardLinksProps) {
  return (
    <nav aria-label="Dashboard navigation" className="mt-6 space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const className = `block rounded-lg px-4 py-3 text-sm font-semibold ${
          isActive ? "bg-court-50 text-court-700" : "text-slate-600 hover:bg-slate-50 hover:text-court-700"
        }`;

        if (link.disabled) {
          return (
            <span key={link.href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-400">
              {link.label}
            </span>
          );
        }

        return (
          <Link key={link.href} href={link.href} onClick={onNavigate} className={className}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
