import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { MenuMovil } from "@/components/site/MenuMovil";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#financiacion", label: "Financiación" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-glass-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo logoUrl={logoUrl} />
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex xl:gap-7" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/cotizador" className="btn-sun hidden rounded-full px-4 py-2.5 text-sm min-[360px]:inline-flex">
            Cotizar
          </Link>
          <MenuMovil items={NAV} />
        </div>
      </div>
    </header>
  );
}
