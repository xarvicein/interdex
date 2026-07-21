import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/Toaster";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} InterDex. All questions curated by
            the community.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
