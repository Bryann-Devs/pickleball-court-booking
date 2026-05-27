"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/auth";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type ProfileRow = {
  role: UserRole | null;
};

type CourtRow = {
  status: CourtStatus;
};

const cards = [
  { key: "totalUsers", label: "Total users" },
  { key: "players", label: "Players" },
  { key: "courtOwners", label: "Court owners" },
  { key: "admins", label: "Admins" },
  { key: "totalCourts", label: "Total courts" },
  { key: "pendingCourts", label: "Pending courts" },
  { key: "approvedCourts", label: "Approved courts" },
  { key: "rejectedCourts", label: "Rejected courts" }
] as const;

type StatKey = (typeof cards)[number]["key"];
type Stats = Record<StatKey, number>;

const emptyStats: Stats = {
  admins: 0,
  approvedCourts: 0,
  courtOwners: 0,
  pendingCourts: 0,
  players: 0,
  rejectedCourts: 0,
  totalCourts: 0,
  totalUsers: 0
};

export function AdminAnalyticsSummary() {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured yet.");
        setIsLoading(false);
        return;
      }

      const [profilesResult, courtsResult] = await Promise.all([
        supabase.from("profiles").select("role"),
        supabase.from("courts").select("status")
      ]);

      if (profilesResult.error) {
        setError(profilesResult.error.message);
        setIsLoading(false);
        return;
      }

      if (courtsResult.error) {
        setError(courtsResult.error.message);
        setIsLoading(false);
        return;
      }

      const profiles = (profilesResult.data ?? []) as ProfileRow[];
      const courts = (courtsResult.data ?? []) as CourtRow[];

      setStats({
        admins: profiles.filter((profile) => profile.role === "admin").length,
        approvedCourts: courts.filter((court) => court.status === "approved").length,
        courtOwners: profiles.filter((profile) => profile.role === "court_owner").length,
        pendingCourts: courts.filter((court) => court.status === "pending").length,
        players: profiles.filter((profile) => profile.role === "player").length,
        rejectedCourts: courts.filter((court) => court.status === "rejected").length,
        totalCourts: courts.length,
        totalUsers: profiles.length
      });
      setIsLoading(false);
    }

    loadAnalytics();
  }, []);

  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-court-700">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{isLoading ? "..." : stats[card.key]}</p>
          </article>
        ))}
      </section>
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
        Detailed booking analytics will be available after reservations are implemented.
      </p>
    </div>
  );
}
