type BookingCardProps = {
  court: string;
  date: string;
  time: string;
  status: string;
};

export function BookingCard({ court, date, time, status }: BookingCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{court}</h2>
          <p className="mt-1 text-sm text-slate-600">{date}</p>
        </div>
        <span className="rounded-full bg-rally/30 px-3 py-1 text-xs font-semibold text-slate-800">{status}</span>
      </div>
      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-800">{time}</p>
    </article>
  );
}
