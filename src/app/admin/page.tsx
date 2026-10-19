import Link from "next/link";
import { requerirSesion } from "@/auth";
import { Encabezado } from "@/components/admin/Encabezado";
import { ESTADOS } from "@/lib/admin/leads";
import { prisma } from "@/lib/db";
import { numero, pesos } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function ResumenPage() {
  await requerirSesion();
  const hace30 = new Date(Date.now() - 30 * 864e5);
  const [porEstado, nuevos30, cot30, ultimos] = await Promise.all([
    prisma.lead.groupBy({ by: ["estado"], _count: true }),
    prisma.lead.count({ where: { createdAt: { gte: hace30 } } }),
    prisma.cotizacion.aggregate({ where: { createdAt: { gte: hace30 } }, _count: true, _sum: { precioTotal: true, kwp: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { cotizaciones: { take: 1, orderBy: { createdAt: "desc" }, select: { kwp: true, precioTotal: true } } } }),
  ]);
  const cuenta = (id: string) => porEstado.find((p) => p.estado === id)?._count ?? 0;
  const vendidos = cuenta("VENDIDO");
  const total = porEstado.reduce((a, p) => a + p._count, 0);

  return (
    <>
      <Encabezado titulo="Resumen" descripcion="Actividad del cotizador en los últimos 30 días." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Leads nuevos", numero(nuevos30)],
          ["Cotizaciones", numero(cot30._count)],
          ["kWp cotizados", numero(cot30._sum.kwp ?? 0, 1)],
          ["Monto cotizado", pesos(Number(cot30._sum.precioTotal ?? 0))],
        ].map(([t, v]) => (
          <div key={t} className="glass rounded-2xl p-5">
            <p className="text-xs text-muted-foreground">{t}</p>
            <p className="mt-1 font-heading text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <section className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Embudo</h2>
        <p className="text-sm text-muted-foreground">
          {total} leads en total · conversión a venta {total ? numero((vendidos / total) * 100, 1) : 0} %
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ESTADOS.map((e) => (
            <Link key={e.id} href={`/admin/leads?estado=${e.id}`} className="rounded-2xl border border-glass-border p-4 transition hover:border-primary/50">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", e.clase)}>{e.label}</span>
              <p className="mt-2 font-heading text-3xl font-semibold">{cuenta(e.id)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Últimos leads</h2>
          <Link href="/admin/leads" className="text-sm text-primary">
            Ver todos
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-glass-border">
          {ultimos.map((l) => {
            const est = ESTADOS.find((e) => e.id === l.estado)!;
            const c = l.cotizaciones[0];
            return (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 py-3 text-sm hover:text-primary">
                  <span className="flex-1 truncate font-medium">{l.nombre}</span>
                  <span className="hidden text-muted-foreground sm:inline">{l.localidad}</span>
                  {c && <span className="tabular-nums">{numero(c.kwp, 1)} kWp</span>}
                  <span className={cn("rounded-full px-2 py-0.5 text-xs", est.clase)}>{est.label}</span>
                </Link>
              </li>
            );
          })}
          {ultimos.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Todavía no hay leads.</li>}
        </ul>
      </section>
    </>
  );
}
