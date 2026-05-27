import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courts", label: "Courts" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/register?role=court_owner", label: "For Owners" },
  { href: "/login", label: "Sign In" }
];

const steps = [
  "Find an open court",
  "Choose your time slot",
  "Reserve and play"
];

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-white">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/landing-bg.avif"
          alt="Pickleball court background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/68" />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold text-white">
              PickleBook
            </Link>

            <nav aria-label="Landing navigation" className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-white/82 transition hover:text-lime-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="/login" className="text-sm font-semibold text-white transition hover:text-lime-300 md:hidden">
              Sign In
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
              Your Next Game Starts With an Open Slot.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
              Find available pickleball courts, choose a time that works, and reserve your spot.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 pt-2 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                href="/courts"
                className="rounded-lg bg-lime-400 px-6 py-3 text-center text-sm font-bold text-slate-950 shadow-soft transition hover:bg-lime-300"
              >
                Find a Slot
              </Link>
              <Link
                href="/register?role=court_owner"
                className="rounded-lg border border-lime-300/80 bg-slate-950/30 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10 hover:text-lime-100"
              >
                For Court Owners
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 px-4 py-14 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold text-court-600">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
