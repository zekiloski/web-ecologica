import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { EMPRESA } from "@/content/sitio";

export function Footer({ nombre, logoUrl }: { nombre: string; logoUrl?: string | null }) {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Logo logoUrl={logoUrl} />
          <p>{nombre} · Energía solar para hogares, comercios, industrias y campo</p>
          <p>
            {EMPRESA.direccion} · {EMPRESA.telefono} · {EMPRESA.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/cotizador" className="hover:text-foreground">
            Cotizador
          </Link>
          <Link href="/proyectos" className="hover:text-foreground">
            Proyectos
          </Link>
          <a href={EMPRESA.redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Instagram
          </a>
          <a href={EMPRESA.redes.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Facebook
          </a>
          <Link href="/#contacto" className="hover:text-foreground">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
