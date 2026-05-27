import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PickleBook",
  description: "A mobile-first pickleball court booking platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
