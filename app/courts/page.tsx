import { PageHeader } from "@/components/PageHeader";
import { PublicCourtsList } from "@/components/PublicCourtsList";

export default function CourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Player"
        title="Courts"
        description="Browse approved pickleball courts."
      />

      <PublicCourtsList />
    </div>
  );
}
