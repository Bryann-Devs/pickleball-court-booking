import { AdminAnalyticsSummary } from "@/components/AdminAnalyticsSummary";
import { PageHeader } from "@/components/PageHeader";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Analytics"
        description="Simple platform counts from current users and court listings."
      />

      <AdminAnalyticsSummary />
    </div>
  );
}
