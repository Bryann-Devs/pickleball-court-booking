"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type DashboardRole = "owner" | "admin";

type IconName = "analytics" | "bookings" | "courts" | "dashboard" | "logout" | "menu" | "settings" | "users";

type DashboardLink = {
  href: string;
  icon: IconName;
  label: string;
};

const linksByRole: Record<DashboardRole, DashboardLink[]> = {
  owner: [
    { href: "/owner/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/owner/courts", icon: "courts", label: "My Courts" },
    { href: "/owner/bookings", icon: "bookings", label: "Bookings" },
    { href: "/owner/schedule", icon: "analytics", label: "Schedule" }
  ],
  admin: [
    { href: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/admin/courts", icon: "courts", label: "Courts" },
    { href: "/admin/users", icon: "users", label: "Users" },
    { href: "/admin/bookings", icon: "bookings", label: "Bookings" },
    { href: "/admin/analytics", icon: "analytics", label: "Analytics" },
    { href: "/admin/settings", icon: "settings", label: "Settings" }
  ]
};

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

export function DashboardShell({ children, role }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const links = linksByRole[role];
  const title = role === "admin" ? "Admin Portal" : "Owner Portal";

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-slate-950 lg:flex">
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen shrink-0 overflow-hidden bg-[#002a20] text-white shadow-[8px_0_28px_rgba(15,23,42,0.08)] transition-all duration-300 lg:block ${
          isCollapsed ? "w-[70px]" : "w-[200px]"
        }`}
      >
        <div className={`relative z-10 flex h-screen flex-col ${isCollapsed ? "items-center px-3 py-9" : "px-4 py-7"}`}>
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="mb-4 flex h-5 w-8 items-center justify-center text-white/90 transition hover:text-white"
              aria-label="Expand sidebar"
            >
              <CollapseIcon collapsed={isCollapsed} />
            </button>
          ) : (
            <div className="flex items-start gap-2">
              <Link href="/" className="flex min-w-0 flex-1 items-start gap-2">
                <Image
                  src="/images/admin-pickleball-ball.png"
                  alt=""
                  width={34}
                  height={34}
                  className="h-8 w-8 shrink-0 object-contain"
                  priority
                />
                <span>
                  <span className="block text-[16px] font-semibold leading-5 tracking-tight text-white">PickleBook</span>
                  <span className="mt-0.5 block text-[12px] font-medium leading-4 tracking-wide text-[#8be667]">{title}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="flex h-7 w-7 shrink-0 items-center justify-center text-white/90 transition hover:text-white"
                aria-label="Collapse sidebar"
              >
                <CollapseIcon collapsed={isCollapsed} />
              </button>
            </div>
          )}

          <DashboardLinks collapsed={isCollapsed} links={links} pathname={pathname} variant="dark" />
          <div className={`border-t border-white/30 ${isCollapsed ? "mt-5 w-10 pt-5" : "mx-3 mt-6 pt-6"}`}>
            <LogoutButton collapsed={isCollapsed} onClick={handleLogout} variant="dark" />
          </div>
        </div>
      </aside>

      <MobileDashboardHeader
        handleLogout={handleLogout}
        isOpen={isMobileOpen}
        links={links}
        pathname={pathname}
        setIsOpen={setIsMobileOpen}
        subtitle={title}
        variant="dark"
      />

      <main
        className={`w-full min-w-0 px-4 py-5 transition-[padding] duration-300 sm:px-6 lg:px-8 lg:py-8 ${
          isCollapsed ? "lg:pl-[102px]" : "lg:pl-[232px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

type MobileDashboardHeaderProps = {
  handleLogout: () => void;
  isOpen: boolean;
  links: DashboardLink[];
  pathname: string;
  setIsOpen: (isOpen: boolean) => void;
  subtitle: string;
  variant: "dark" | "light";
};

function MobileDashboardHeader({
  handleLogout,
  isOpen,
  links,
  pathname,
  setIsOpen,
  subtitle,
  variant
}: MobileDashboardHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div className="lg:hidden">
      <header
        className={`sticky top-0 z-40 border-b ${
          isDark ? "border-white/10 bg-[#002a20] text-white" : "border-slate-200 bg-white text-slate-950"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="leading-tight">
            <span className="block text-lg font-black">PickleBook</span>
            <span className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-emerald-200" : "text-slate-500"}`}>
              {subtitle}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${
              isDark ? "border-white/10 bg-white/10 text-white" : "border-slate-200 text-slate-700"
            }`}
          >
            Menu
          </button>
        </div>
        {isOpen ? (
          <div className={`border-t px-4 py-3 ${isDark ? "border-white/10 bg-[#002a20]" : "border-slate-200 bg-white"}`}>
            <DashboardLinks links={links} pathname={pathname} variant={variant} onNavigate={() => setIsOpen(false)} />
            <LogoutButton onClick={handleLogout} variant={variant} />
          </div>
        ) : null}
      </header>
    </div>
  );
}

type DashboardLinksProps = {
  collapsed?: boolean;
  links: DashboardLink[];
  onNavigate?: () => void;
  pathname: string;
  variant: "dark" | "light";
};

function DashboardLinks({ collapsed = false, links, onNavigate, pathname, variant }: DashboardLinksProps) {
  return (
    <nav aria-label="Dashboard navigation" className={collapsed ? "mt-2 space-y-2.5" : "mt-7 space-y-1"}>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const className =
          variant === "dark"
            ? `flex items-center gap-3 rounded-xl text-[12px] font-medium transition ${
                isActive
                  ? "bg-white/[0.13] text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "h-10 w-10 justify-center" : "px-3.5 py-2.5"}`
            : `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                isActive ? "bg-court-50 text-court-700" : "text-slate-600 hover:bg-slate-50 hover:text-court-700"
              }`;

        return (
          <Link key={link.href} href={link.href} onClick={onNavigate} className={className} title={collapsed ? link.label : undefined}>
            <DashboardIcon name={link.icon} className="h-5 w-5 shrink-0" />
            <span className={collapsed ? "sr-only" : "truncate"}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

type LogoutButtonProps = {
  collapsed?: boolean;
  onClick: () => void;
  variant: "dark" | "light";
};

function LogoutButton({ collapsed = false, onClick, variant }: LogoutButtonProps) {
  const className =
    variant === "dark"
      ? `flex items-center gap-3 text-[12px] font-medium text-white/90 transition hover:text-white ${
          collapsed ? "h-8 w-10 justify-center" : "px-2 py-2"
        }`
      : "mt-auto flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:border-court-200 hover:text-court-700";

  return (
    <button type="button" onClick={onClick} className={className} title={collapsed ? "Log out" : undefined}>
      <DashboardIcon name="logout" className="h-5 w-5 shrink-0" />
      <span className={collapsed ? "sr-only" : ""}>Log out</span>
    </button>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d={collapsed ? "M15 6v12" : "M16 6v12"} />
      <path d={collapsed ? "m9 8 4 4-4 4" : "m12 8-4 4 4 4"} />
    </svg>
  );
}

function DashboardIcon({ className, name }: { className?: string; name: IconName }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24"
  };

  switch (name) {
    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-3 3 2 5-7" />
        </svg>
      );
    case "bookings":
      return (
        <svg {...common}>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect height="18" rx="3" width="18" x="3" y="4" />
          <path d="M3 10h18" />
          <path d="m9 16 2 2 4-5" />
        </svg>
      );
    case "courts":
      return (
        <svg {...common}>
          <rect height="16" rx="2" width="18" x="3" y="4" />
          <path d="M12 4v16" />
          <path d="M3 12h18" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <rect height="8" rx="2" width="8" x="3" y="3" />
          <rect height="8" rx="2" width="8" x="13" y="3" />
          <rect height="8" rx="2" width="8" x="3" y="13" />
          <rect height="8" rx="2" width="8" x="13" y="13" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M10 17 15 12 10 7" />
          <path d="M15 12H3" />
          <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
          <path d="M14 21h5a2 2 0 0 0 2-2" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2 2 0 1 1-4 0v-.09A1.8 1.8 0 0 0 8.75 19.25a1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.3 15a1.8 1.8 0 0 0-1.66-1.1H2.5a2 2 0 1 1 0-4h.14A1.8 1.8 0 0 0 4.3 8.75a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 1.98.36h.01A1.8 1.8 0 0 0 9.86 2.6V2.5a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 8.7v.05a1.8 1.8 0 0 0 1.66 1.1h.44a2 2 0 1 1 0 4h-.44A1.8 1.8 0 0 0 19.4 15Z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}
