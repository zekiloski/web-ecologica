"use client";

import { Building2, Calculator, Gauge, Landmark, LayoutDashboard, MapPin, Package, Tags, Users, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Resumen", icono: LayoutDashboard, soloAdmin: false },
  { href: "/admin/leads", label: "Leads", icono: Users, soloAdmin: false },
  { href: "/admin/creditos", label: "Créditos y UVA", icono: Landmark, soloAdmin: true },
  { href: "/admin/tarifas", label: "Tarifas", icono: Zap, soloAdmin: true },
  { href: "/admin/localidades", label: "Localidades", icono: MapPin, soloAdmin: true },
  { href: "/admin/catalogo", label: "Catálogo", icono: Package, soloAdmin: true },
  { href: "/admin/precios", label: "Precios", icono: Tags, soloAdmin: true },
  { href: "/admin/calculo", label: "Cálculo", icono: Calculator, soloAdmin: true },
  { href: "/admin/empresa", label: "Empresa", icono: Building2, soloAdmin: true },
  { href: "/admin/usuarios", label: "Usuarios", icono: Gauge, soloAdmin: true },
];

export function AdminNav({ esAdmin }: { esAdmin: boolean }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Panel" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {ITEMS.filter((i) => esAdmin || !i.soloAdmin).map((i) => {
        const activo = i.href === "/admin" ? ruta === "/admin" : ruta.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={activo ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
              activo ? "bg-primary/15 font-medium text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <i.icono className={cn("size-4", activo && "text-primary")} /> {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
