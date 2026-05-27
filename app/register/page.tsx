import { RegisterForm } from "@/components/RegisterForm";
import { PageHeader } from "@/components/PageHeader";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Create account"
        description="Create a player or court owner account. Admin accounts are managed privately."
      />

      <RegisterForm />
    </div>
  );
}
