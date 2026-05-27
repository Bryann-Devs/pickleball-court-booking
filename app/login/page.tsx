import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Log in"
        description="Log in to manage bookings, courts, or platform administration."
      />

      <Suspense fallback={<div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
