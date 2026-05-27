import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Log in"
        description="Authentication wiring will be added after the initial app structure is ready."
      />

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
            placeholder="Password"
          />
        </label>
        <button type="submit" className="w-full rounded-lg bg-court-600 px-4 py-3 text-sm font-semibold text-white">
          Log in
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link href="/register" className="font-semibold text-court-700">
          Register
        </Link>
      </p>
    </div>
  );
}
