type CourtCardProps = {
  name: string;
  location: string;
  surface: string;
  price: string;
  status: string;
};

export function CourtCard({ name, location, surface, price, status }: CourtCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{name}</h2>
          <p className="mt-1 text-sm text-slate-600">{location}</p>
        </div>
        <span className="rounded-full bg-court-50 px-3 py-1 text-xs font-semibold text-court-700">{status}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Surface</p>
          <p className="mt-1 font-medium text-slate-800">{surface}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</p>
          <p className="mt-1 font-medium text-slate-800">{price}</p>
        </div>
      </div>
    </article>
  );
}
