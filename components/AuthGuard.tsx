"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUserProfile, getDashboardPathForRole, type UserRole } from "@/lib/auth";

type AuthGuardProps = {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
};

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const auth = await getCurrentUserProfile();

      if (!isMounted) {
        return;
      }

      if (!auth.user) {
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${next}`);
        return;
      }

      const role = auth.profile?.role ?? null;

      if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        router.replace(getDashboardPathForRole(role));
        return;
      }

      setStatus("allowed");
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, pathname, router]);

  if (status === "checking") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}
