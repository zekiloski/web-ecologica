import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requerirSesion, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requerirSesion();

  async function salir() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">
              Ver la web
            </Link>
            <span className="hidden max-w-48 truncate text-sm text-muted-foreground md:block">{session.user.email}</span>
            <ThemeToggle />
            <form action={salir}>
              <button type="submit" aria-label="Cerrar sesión" className="grid size-10 place-items-center rounded-full border border-glass-border text-muted-foreground hover:text-foreground">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-22 lg:self-start">
          <AdminNav esAdmin={session.user.role === "ADMIN"} />
        </aside>
        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  );
}
