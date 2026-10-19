import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { EMPRESA } from "@/content/sitio";

export function Footer({ nombre, logoUrl }: { nombre: string; logoUrl?: string | null }) {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Logo logoUrl={logoUrl} />
          <p>
            {nombre} · Energía solar on-grid para hogares, comercios, industrias y campo · {EMPRESA.direccion}
          </p>
        </div>
        <div className="flex gap-6">
          <Link href="/cotizador" className="hover:text-foreground">
            Cotizador
          </Link>
          <Link href="/#contacto" className="hover:text-foreground">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
