"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type CourtRow = {
  status: CourtStatus;
};

const cards = [
  { key: "total", label: "Total courts" },
  { key: "pending", label: "Pending courts" },
  { key: "approved", label: "Approved courts" }
] as const;

type Stats = Record<(typeof cards)[number]["key"], number>;

export function OwnerDashboardStats() {
  const [stats, setStats] = useState<Stats>({ approved: 0, pending: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured yet.");
        setIsLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("Please log in to view your dashboard.");
        setIsLoading(false);
        return;
      }

      const { data, error: statsError } = await supabase
        .from("courts")
        .select("status")
        .eq("owner_id", userData.user.id);

      if (statsError) {
        setError(statsError.message);
        setIsLoading(false);
        return;
      }

      const rows = (data ?? []) as CourtRow[];

      setStats({
        approved: rows.filter((court) => court.status === "approved").length,
        pending: rows.filter((court) => court.status === "pending").length,
        total: rows.length
      });
      setIsLoading(false);
    }

    loadStats();
  }, []);

  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>;
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-court-700">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{isLoading ? "..." : stats[card.key]}</p>
        </article>
      ))}
    </section>
  );
}
