"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUserProfile, type UserRole } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type BottomItem = {
  href: string;
  label: string;
};

const itemsByRole: Record<"logged_out" | UserRole, BottomItem[]> = {
  logged_out: [
    { href: "/", label: "Home" },
    { href: "/courts", label: "Courts" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" }
  ],
  player: [
    { href: "/courts", label: "Courts" },
    { href: "/bookings", label: "Bookings" },
    { href: "/", label: "Home" }
  ],
  court_owner: [
    { href: "/owner/dashboard", label: "Dashboard" },
    { href: "/owner/courts", label: "Courts" },
    { href: "/owner/bookings", label: "Bookings" },
    { href: "/owner/schedule", label: "Schedule" }
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/courts", label: "Courts" },
    { href: "/admin/bookings", label: "Bookings" }
  ]
};

export function BottomNavigation() {
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

  const items = isLoggedIn && role ? itemsByRole[role] : itemsByRole.logged_out;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white md:hidden"
    >
      <div className="grid h-16 grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-court-50 hover:text-court-700"
          >
            {item.label}
          </Link>
        ))}
        {isLoggedIn && role === "player" ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-court-50 hover:text-court-700"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}
