import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#financiacion", label: "Financiación" },
  { href: "/#casos", label: "Proyectos" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-glass-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/cotizador" className="btn-sun rounded-full px-4 py-2.5 text-sm">
            Cotizar
          </Link>
        </div>
      </div>
    </header>
  );
}
