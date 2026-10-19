import { Download, Search } from "lucide-react";
import Link from "next/link";
import { requerirSesion } from "@/auth";
import { Encabezado } from "@/components/admin/Encabezado";
import { SelectorEstado } from "@/components/admin/SelectorEstado";
import { ESTADOS, SEGMENTO_LABEL, filtroLeads, incluirUltimaCotizacion } from "@/lib/admin/leads";
import { prisma } from "@/lib/db";
import { numero, pesos } from "@/lib/format";
import { cn } from "@/lib/utils";

const POR_PAGINA = 25;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string; pagina?: string }> }) {
  await requerirSesion();
  const { estado, q, pagina } = await searchParams;
  const where = filtroLeads(estado, q);
  const p = Math.max(1, Number(pagina) || 1);
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (p - 1) * POR_PAGINA, take: POR_PAGINA, include: incluirUltimaCotizacion }),
    prisma.lead.count({ where }),
  ]);
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const url = (cambios: Record<string, string | undefined>) => {
    const params = new URLSearchParams(Object.entries({ estado, q, ...cambios }).filter(([, v]) => v) as [string, string][]);
    return `/admin/leads${params.size ? `?${params}` : ""}`;
  };
  const exportar = `/api/leads/export?${new URLSearchParams(Object.entries({ estado, q }).filter(([, v]) => v) as [string, string][])}`;

  return (
    <>
      <Encabezado titulo="Leads" descripcion={`${total} ${total === 1 ? "lead" : "leads"}${estado ? ` en estado «${ESTADOS.find((e) => e.id === estado)?.label}»` : ""}.`}>
        <a href={exportar} className="inline-flex h-10 items-center gap-2 rounded-full border border-glass-border px-4 text-sm hover:bg-secondary">
          <Download className="size-4" /> Exportar a Excel
        </a>
      </Encabezado>

      <div className="flex flex-wrap items-center gap-2">
        <form className="relative min-w-60 flex-1" action="/admin/leads">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, email, teléfono o localidad"
            aria-label="Buscar leads"
            className="h-10 w-full rounded-full border border-input bg-background/60 pr-4 pl-10 text-sm outline-none focus:border-primary"
          />
        </form>
        <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-1">
          <Link href={url({ estado: undefined, pagina: undefined })} className={cn("rounded-full px-3 py-1.5 text-sm", !estado ? "bg-secondary font-medium" : "text-muted-foreground hover:text-foreground")}>
            Todos
          </Link>
          {ESTADOS.map((e) => (
            <Link key={e.id} href={url({ estado: e.id, pagina: undefined })} className={cn("rounded-full px-3 py-1.5 text-sm", estado === e.id ? "bg-secondary font-medium" : "text-muted-foreground hover:text-foreground")}>
              {e.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="glass overflow-x-auto rounded-3xl">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-glass-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Localidad</th>
              <th className="px-4 py-3 font-medium">Sistema</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Financiación</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const c = l.cotizaciones[0];
              return (
                <tr key={l.id} className="border-b border-glass-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{l.createdAt.toLocaleDateString("es-AR", { timeZone: "America/Argentina/Cordoba" })}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium hover:text-primary">
                      {l.nombre}
                    </Link>
                    <p className="text-xs text-muted-foreground">{l.telefono}</p>
                  </td>
                  <td className="px-4 py-3">{l.localidad}</td>
                  <td className="px-4 py-3 tabular-nums">{c ? `${numero(c.kwp, 2)} kWp · ${c.paneles} pan. · ${SEGMENTO_LABEL[c.tipoCliente]}` : "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{c ? pesos(Number(c.precioTotal)) : "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{c?.plazoMeses ? `${c.plazoMeses} × ${pesos(Number(c.cuotaInicial))}` : c ? "Contado" : "—"}</td>
                  <td className="px-4 py-3">
                    <SelectorEstado id={l.id} estado={l.estado} />
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No hay leads con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginas > 1 && (
        <nav aria-label="Páginas" className="flex items-center justify-center gap-3 text-sm">
          {p > 1 && <Link href={url({ pagina: String(p - 1) })} className="rounded-full border border-glass-border px-4 py-2">Anterior</Link>}
          <span className="text-muted-foreground">
            Página {p} de {paginas}
          </span>
          {p < paginas && <Link href={url({ pagina: String(p + 1) })} className="rounded-full border border-glass-border px-4 py-2">Siguiente</Link>}
        </nav>
      )}
    </>
  );
}
