import { CourtCard } from "@/components/CourtCard";
import { PageHeader } from "@/components/PageHeader";
import { courts } from "@/lib/placeholders";

export default function AdminCourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Courts"
        description="Placeholder court review surface for future platform administration."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court.name} {...court} />
        ))}
      </section>
    </div>
  );
}
