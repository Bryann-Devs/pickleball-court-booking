import { CourtCard } from "@/components/CourtCard";
import { PageHeader } from "@/components/PageHeader";
import { courts } from "@/lib/placeholders";

export default function CourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Player"
        title="Courts"
        description="Browse placeholder court listings prepared for future availability and booking flows."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court.name} {...court} />
        ))}
      </section>
    </div>
  );
}
