"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/auth";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type ProfileRow = {
  role: UserRole | null;
};

type CourtRow = {
  status: CourtStatus;
};

type Stats = {
  admins: number;
  approvedCourts: number;
  courtOwners: number;
  inactiveCourts: number;
  pendingCourts: number;
  players: number;
  rejectedCourts: number;
  totalCourts: number;
  totalUsers: number;
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

export function AdminAnalyticsSummary() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [courts, setCourts] = useState<CourtRow[]>([]);
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

      setProfiles((profilesResult.data ?? []) as ProfileRow[]);
      setCourts((courtsResult.data ?? []) as CourtRow[]);
      setIsLoading(false);
    }

    loadAnalytics();
  }, []);

  const stats = useMemo<Stats>(() => {
    return {
      admins: profiles.filter((profile) => profile.role === "admin").length,
      approvedCourts: courts.filter((court) => court.status === "approved").length,
      courtOwners: profiles.filter((profile) => profile.role === "court_owner").length,
      inactiveCourts: courts.filter((court) => court.status === "inactive").length,
      pendingCourts: courts.filter((court) => court.status === "pending").length,
      players: profiles.filter((profile) => profile.role === "player").length,
      rejectedCourts: courts.filter((court) => court.status === "rejected").length,
      totalCourts: courts.length,
      totalUsers: profiles.length
    };
  }, [courts, profiles]);

  if (error) {
    return <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
            <p className="text-sm font-black text-slate-600">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-[#071832]">{isLoading ? "..." : stats[card.key as StatKey]}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <DistributionCard
          data={[
            { color: "#10b981", label: "Players", value: stats.players },
            { color: "#84cc16", label: "Court owners", value: stats.courtOwners },
            { color: "#082f26", label: "Admins", value: stats.admins }
          ]}
          isLoading={isLoading}
          title="User role distribution"
        />
        <BarSummaryCard
          data={[
            { color: "bg-amber-400", label: "Pending", value: stats.pendingCourts },
            { color: "bg-emerald-500", label: "Approved", value: stats.approvedCourts },
            { color: "bg-rose-500", label: "Rejected", value: stats.rejectedCourts },
            { color: "bg-slate-400", label: "Inactive", value: stats.inactiveCourts }
          ]}
          isLoading={isLoading}
          title="Court status distribution"
        />
      </section>

      <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800 shadow-sm">
        Detailed booking analytics will be available after reservations are implemented.
      </p>
    </div>
  );
}

function DistributionCard({
  data,
  isLoading,
  title
}: {
  data: Array<{ color: string; label: string; value: number }>;
  isLoading: boolean;
  title: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let current = 0;
  const gradient =
    total > 0
      ? data
          .map((item) => {
            const start = current;
            current += (item.value / total) * 100;

            return `${item.color} ${start}% ${current}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)] sm:p-5">
      <h2 className="text-base font-black text-[#071832]">{title}</h2>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
        <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-white text-2xl font-black text-[#071832]">
            {isLoading ? "..." : total}
          </div>
        </div>
        <div className="w-full space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-black text-slate-950">{isLoading ? "..." : item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function BarSummaryCard({
  data,
  isLoading,
  title
}: {
  data: Array<{ color: string; label: string; value: number }>;
  isLoading: boolean;
  title: string;
}) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)] sm:p-5">
      <h2 className="text-base font-black text-[#071832]">{title}</h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700">{item.label}</span>
              <span className="font-black text-slate-950">{isLoading ? "..." : item.value}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
