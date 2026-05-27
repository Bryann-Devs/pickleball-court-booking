import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/courts", label: "COURTS" },
  { href: "/register?role=court_owner", label: "FOR OWNERS" },
  { href: "/login", label: "SIGN IN" }
];

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-[#e9e6d7]">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/landing-bg.jpg"
          alt="Pickleball court background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/[0.52]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25" />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold text-[#e9e6d7]">
              PickleBook
            </Link>

            <nav aria-label="Landing navigation" className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-[#e9e6d7] transition hover:text-lime-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="/login" className="text-sm font-semibold text-[#e9e6d7] transition hover:text-lime-300 md:hidden">
              SIGN IN
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-normal text-[#e9e6d7] sm:text-6xl lg:text-7xl">
              Your Next Game Starts With an Open Slot.
            </h1>
            <p className="mx-auto max-w-6xl whitespace-nowrap text-[clamp(0.58rem,2.6vw,1.25rem)] leading-7 text-[#e9e6d7]">
              Find available pickleball courts, choose a time that works, and reserve your spot.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 pt-2 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                href="/courts"
                className="rounded-full bg-lime-400 px-8 py-4 text-center text-sm font-bold text-white shadow-soft transition duration-200 hover:bg-lime-300 hover:text-slate-950 hover:shadow-[0_0_28px_rgba(163,230,53,0.55)]"
              >
                Book a Court
              </Link>
              <Link
                href="/register?role=court_owner"
                className="rounded-full border border-lime-300/80 bg-slate-950/30 px-8 py-4 text-center text-sm font-bold text-[#e9e6d7] backdrop-blur-sm transition duration-200 hover:border-lime-300 hover:bg-lime-300 hover:text-slate-950 hover:shadow-[0_0_28px_rgba(163,230,53,0.55)]"
              >
                For Court Owners
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
