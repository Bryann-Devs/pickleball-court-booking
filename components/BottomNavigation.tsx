import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/courts", label: "Courts" },
  { href: "/bookings", label: "Bookings" },
  { href: "/login", label: "Login" }
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white md:hidden"
    >
      <div className="grid h-16 grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-court-50 hover:text-court-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
