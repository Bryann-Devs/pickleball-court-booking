import { CourtCard } from "@/components/CourtCard";
import { PageHeader } from "@/components/PageHeader";
import { courts } from "@/lib/placeholders";

export default function OwnerCourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Owner courts"
        description="Placeholder court inventory for future owner-managed listings."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court.name} {...court} />
        ))}
      </section>
    </div>
  );
}
