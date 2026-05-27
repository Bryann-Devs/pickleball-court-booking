"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type AdminCourt = {
  id: string;
  address: string;
  city: string;
  court_count: number;
  created_at: string;
  description: string | null;
  name: string;
  price_per_hour: number;
  status: CourtStatus;
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  style: "currency"
});

const statusStyles: Record<CourtStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-court-50 text-court-700",
  rejected: "bg-red-50 text-red-700",
  inactive: "bg-slate-100 text-slate-600"
};

export function AdminCourtsManager() {
  const [courts, setCourts] = useState<AdminCourt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingId, setIsSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourts = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      setIsLoading(false);
      return;
    }

    const { data, error: courtsError } = await supabase
      .from("courts")
      .select("id, name, address, city, description, price_per_hour, court_count, status, created_at")
      .order("created_at", { ascending: false });

    if (courtsError) {
      setError(courtsError.message);
      setIsLoading(false);
      return;
    }

    setCourts((data ?? []) as AdminCourt[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCourts();
  }, [loadCourts]);

  async function updateStatus(courtId: string, status: Extract<CourtStatus, "approved" | "rejected">) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsSavingId(courtId);

    const { error: updateError } = await supabase.from("courts").update({ status }).eq("id", courtId);

    if (updateError) {
      setError(updateError.message);
      setIsSavingId(null);
      return;
    }

    setMessage(`Court ${status}.`);
    await loadCourts();
    setIsSavingId(null);
  }

  if (isLoading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading courts...</div>;
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-lg bg-court-50 px-3 py-2 text-sm font-medium text-court-700" role="status">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {courts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
          <h2 className="text-base font-semibold text-slate-950">No courts submitted yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Court submissions will appear here for review.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {courts.map((court) => (
            <article
              key={court.id}
              className={`rounded-lg border bg-white p-4 shadow-sm ${
                court.status === "pending" ? "border-amber-200" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">{court.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {court.address}, {court.city}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Submitted {new Date(court.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[court.status]}`}>
                  {court.status}
                </span>
              </div>

              {court.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{court.description}</p> : null}

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
                  <p className="mt-1 font-medium text-slate-800">{pesoFormatter.format(court.price_per_hour)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Courts</p>
                  <p className="mt-1 font-medium text-slate-800">{court.court_count}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => updateStatus(court.id, "approved")}
                  disabled={isSavingId === court.id || court.status === "approved"}
                  className="rounded-lg bg-court-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(court.id, "rejected")}
                  disabled={isSavingId === court.id || court.status === "rejected"}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
