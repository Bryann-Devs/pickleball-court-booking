"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type PublicCourt = {
  id: string;
  address: string;
  city: string;
  court_count: number;
  description: string | null;
  name: string;
  price_per_hour: number;
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  style: "currency"
});

export function PublicCourtsList() {
  const [courts, setCourts] = useState<PublicCourt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourts() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured yet.");
        setIsLoading(false);
        return;
      }

      const { data, error: courtsError } = await supabase
        .from("courts")
        .select("id, name, address, city, description, price_per_hour, court_count")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (courtsError) {
        if (courtsError.message.toLowerCase().includes("permission denied")) {
          setCourts([]);
          setIsLoading(false);
          return;
        }

        setError(courtsError.message);
        setIsLoading(false);
        return;
      }

      setCourts((data ?? []) as PublicCourt[]);
      setIsLoading(false);
    }

    loadCourts();
  }, []);

  if (isLoading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading courts...</div>;
  }

  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>;
  }

  if (courts.length === 0) {
    return (
      <EmptyState
        title="No approved courts yet"
        description="Approved pickleball courts will appear here once court owners submit listings and admins approve them. If you expected courts here, run the Supabase courts RLS SQL fix."
      />
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courts.map((court) => (
        <article key={court.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">{court.name}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {court.address}, {court.city}
          </p>
          {court.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{court.description}</p> : null}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</p>
              <p className="mt-1 font-medium text-slate-800">{pesoFormatter.format(court.price_per_hour)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Courts</p>
              <p className="mt-1 font-medium text-slate-800">{court.court_count}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
