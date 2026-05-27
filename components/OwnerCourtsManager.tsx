"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type OwnerCourt = {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  description: string | null;
  price_per_hour: number;
  court_count: number;
  status: CourtStatus;
};

type CourtFormState = {
  name: string;
  address: string;
  city: string;
  description: string;
  price_per_hour: string;
  court_count: string;
};

const initialFormState: CourtFormState = {
  name: "",
  address: "",
  city: "Ozamiz City",
  description: "",
  price_per_hour: "",
  court_count: "1"
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  style: "currency"
});

const statusStyles: Record<CourtStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-court-50 text-court-700",
  rejected: "bg-red-50 text-red-700",
  inactive: "bg-slate-100 text-slate-600"
};

export function OwnerCourtsManager() {
  const [courts, setCourts] = useState<OwnerCourt[]>([]);
  const [form, setForm] = useState<CourtFormState>(initialFormState);
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<CourtFormState>(initialFormState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourts = useCallback(async (ownerId: string) => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      setIsLoading(false);
      return;
    }

    const { data, error: courtsError } = await supabase
      .from("courts")
      .select("id, owner_id, name, address, city, description, price_per_hour, court_count, status")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (courtsError) {
      setError(courtsError.message);
      setIsLoading(false);
      return;
    }

    setCourts((data ?? []) as OwnerCourt[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOwner() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        if (isMounted) {
          setError("Supabase is not configured yet.");
          setIsLoading(false);
        }
        return;
      }

      const { data, error: userError } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (userError || !data.user) {
        setError("Please log in to manage courts.");
        setIsLoading(false);
        return;
      }

      setCurrentUserId(data.user.id);
      await loadCourts(data.user.id);
    }

    loadOwner();

    return () => {
      isMounted = false;
    };
  }, [loadCourts]);

  function updateForm(field: keyof CourtFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateEditingForm(field: keyof CourtFormState, value: string) {
    setEditingForm((current) => ({ ...current, [field]: value }));
  }

  function buildPayload(values: CourtFormState) {
    return {
      address: values.address.trim(),
      city: values.city.trim() || "Ozamiz City",
      court_count: Number(values.court_count),
      description: values.description.trim() || null,
      name: values.name.trim(),
      price_per_hour: Number(values.price_per_hour)
    };
  }

  function validate(values: CourtFormState) {
    if (!values.name.trim() || !values.address.trim()) {
      return "Court name and address are required.";
    }

    if (Number(values.price_per_hour) <= 0) {
      return "Price per hour must be greater than 0.";
    }

    if (!Number.isInteger(Number(values.court_count)) || Number(values.court_count) <= 0) {
      return "Number of courts must be a whole number greater than 0.";
    }

    return null;
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validate(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase || !currentUserId) {
      setError("Please log in to create a court.");
      return;
    }

    setIsSaving(true);

    const { error: createError } = await supabase.from("courts").insert({
      ...buildPayload(form),
      owner_id: currentUserId,
      status: "pending"
    });

    if (createError) {
      setError(createError.message);
      setIsSaving(false);
      return;
    }

    setForm(initialFormState);
    setMessage("Court created and submitted as pending.");
    await loadCourts(currentUserId);
    setIsSaving(false);
  }

  function startEditing(court: OwnerCourt) {
    setError(null);
    setMessage(null);
    setEditingCourtId(court.id);
    setEditingForm({
      address: court.address,
      city: court.city,
      court_count: String(court.court_count),
      description: court.description ?? "",
      name: court.name,
      price_per_hour: String(court.price_per_hour)
    });
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>, courtId: string) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validate(editingForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase || !currentUserId) {
      setError("Please log in to update a court.");
      return;
    }

    setIsSaving(true);

    const { error: updateError } = await supabase
      .from("courts")
      .update(buildPayload(editingForm))
      .eq("id", courtId)
      .eq("owner_id", currentUserId);

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    setEditingCourtId(null);
    setMessage("Court updated.");
    await loadCourts(currentUserId);
    setIsSaving(false);
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleCreate} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Add a court</h2>

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

        <CourtFields values={form} onChange={updateForm} />

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-court-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {isSaving ? "Saving..." : "Add court"}
        </button>
      </form>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Loading your courts...
        </div>
      ) : courts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
          <h2 className="text-base font-semibold text-slate-950">No courts yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            No courts yet. Add your first court so players can discover your available slots.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {courts.map((court) => (
            <article key={court.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              {editingCourtId === court.id ? (
                <form onSubmit={(event) => handleUpdate(event, court.id)} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-950">Edit court</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[court.status]}`}>
                      {court.status}
                    </span>
                  </div>

                  <CourtFields values={editingForm} onChange={updateEditingForm} />

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-lg bg-court-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCourtId(null)}
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-950">{court.name}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {court.address}, {court.city}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[court.status]}`}>
                      {court.status}
                    </span>
                  </div>

                  {court.description ? <p className="text-sm leading-6 text-slate-600">{court.description}</p> : null}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
                      <p className="mt-1 font-medium text-slate-800">{pesoFormatter.format(court.price_per_hour)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Courts</p>
                      <p className="mt-1 font-medium text-slate-800">{court.court_count}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEditing(court)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-court-200 hover:text-court-700 sm:w-auto"
                  >
                    Edit court
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

type CourtFieldsProps = {
  onChange: (field: keyof CourtFormState, value: string) => void;
  values: CourtFormState;
};

function CourtFields({ onChange, values }: CourtFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-medium text-slate-700">
        Court name
        <input
          type="text"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          placeholder="Riverside Pickleball Courts"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        City
        <input
          type="text"
          value={values.city}
          onChange={(event) => onChange("city", event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          placeholder="Ozamiz City"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700 md:col-span-2">
        Address
        <input
          type="text"
          value={values.address}
          onChange={(event) => onChange("address", event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          placeholder="Street, barangay, or facility address"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700 md:col-span-2">
        Description
        <textarea
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          placeholder="Short notes about the facility, surface, lighting, or amenities"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Price per hour
        <input
          type="number"
          min="1"
          step="1"
          value={values.price_per_hour}
          onChange={(event) => onChange("price_per_hour", event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          placeholder="300"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Number of courts
        <input
          type="number"
          min="1"
          step="1"
          value={values.court_count}
          onChange={(event) => onChange("court_count", event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
          required
        />
      </label>
    </div>
  );
}
