import Link from "next/link";

const navItems = [
  { href: "/courts", label: "Courts" },
  { href: "/bookings", label: "Bookings" },
  { href: "/owner/dashboard", label: "Owner" },
  { href: "/admin/dashboard", label: "Admin" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-court-900">
          PickleBook
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-court-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-court-200 hover:text-court-700"
        >
          Log in
        </Link>
      </div>
    </header>
  );
}
