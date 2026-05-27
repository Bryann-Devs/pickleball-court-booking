import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const roles = ["player", "court_owner", "admin"];

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Create account"
        description="Role selection is included now, with real auth and permissions to come later."
      />

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Role
          <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500">
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="w-full rounded-lg bg-court-600 px-4 py-3 text-sm font-semibold text-white">
          Register
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-court-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
