"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUserProfile, type UserRole } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type NavItem = {
  href: string;
  label: string;
};

const navItemsByRole: Record<"logged_out" | UserRole, NavItem[]> = {
  logged_out: [
    { href: "/courts", label: "Courts" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" }
  ],
  player: [
    { href: "/courts", label: "Courts" },
    { href: "/bookings", label: "Bookings" }
  ],
  court_owner: [
    { href: "/courts", label: "Courts" },
    { href: "/owner/dashboard", label: "Owner Dashboard" },
    { href: "/owner/courts", label: "My Courts" },
    { href: "/owner/bookings", label: "Owner Bookings" },
    { href: "/owner/schedule", label: "Schedule" }
  ],
  admin: [
    { href: "/admin/dashboard", label: "Admin Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/courts", label: "Courts" },
    { href: "/admin/bookings", label: "Bookings" }
  ]
};

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    getCurrentUserProfile().then(({ user, profile }) => {
      if (isMounted) {
        setIsLoggedIn(Boolean(user));
        setRole(profile?.role ?? null);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = session?.user ? await getCurrentUserProfile() : null;

      if (!isMounted) {
        return;
      }

      setIsLoggedIn(Boolean(session?.user));
      setRole(profile?.profile?.role ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setIsLoggedIn(false);
    setRole(null);
    router.replace("/login");
    router.refresh();
  }

  const navItems = isLoggedIn && role ? navItemsByRole[role] : navItemsByRole.logged_out;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-court-900">
          PickleBook
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-court-700">
              {item.label}
            </Link>
          ))}
        </nav>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-court-200 hover:text-court-700"
          >
            Log out
          </button>
        ) : (
          <div className="hidden w-20 md:block" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
