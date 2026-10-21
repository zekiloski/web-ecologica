import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { EMPRESA } from "@/content/sitio";

export function Footer({ nombre, logoUrl }: { nombre: string; logoUrl?: string | null }) {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-10 pb-24 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:pb-10">
        <div className="space-y-2">
          <Logo logoUrl={logoUrl} />
          <p>{nombre} · Energía solar para hogares, comercios, industrias y campo</p>
          <p>
            {EMPRESA.direccion} · {EMPRESA.telefono} · {EMPRESA.email}
          </p>
        </div>
        <div className="-mx-2 flex flex-wrap">
          <Link href="/cotizador" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
            Cotizador
          </Link>
          <Link href="/proyectos" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
            Proyectos
          </Link>
          <a href={EMPRESA.redes.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
            Instagram
          </a>
          <a href={EMPRESA.redes.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
            Facebook
          </a>
          <Link href="/#contacto" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
