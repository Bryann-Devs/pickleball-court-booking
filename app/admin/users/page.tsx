import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Placeholder area for future player, court owner, and admin user management."
      />

      <EmptyState
        title="No user records connected"
        description="Supabase auth and profile queries will be added in a later implementation step."
      />
    </div>
  );
}
