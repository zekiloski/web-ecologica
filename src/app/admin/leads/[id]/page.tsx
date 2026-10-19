import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requerirSesion } from "@/auth";
import { eliminarLead } from "@/app/admin/acciones";
import { NotasLead, SelectorEstado } from "@/components/admin/SelectorEstado";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { SEGMENTO_LABEL } from "@/lib/admin/leads";
import { linkWhatsApp } from "@/lib/cotizador";
import { prisma } from "@/lib/db";
import { meses, numero, pct, pesos } from "@/lib/format";

/** Resumen guardado en Cotizacion.resultado (ver api/cotizaciones). */
interface ResultadoGuardado {
  consumoMensualKwh: number;
  sistema: { kwpReal: number; paneles: number; superficieM2: number; generacionAnualKwh: number; coberturaReal: number; ahorroMensualPromedio: number; limitadoPorEspacio: boolean; inversor: { inversor: { modelo: string }; cantidad: number } | null };
  repagoContado: number | null;
  credito: { lineaNombre: string; plazo: number; anticipo: number; cuotaInicial: number; cuotaUVA: number | null; totalAPagar: number; tna: number; tea: number; cft: number; repago: number | null } | null;
}

/** Teléfono argentino a formato internacional para WhatsApp (549 + área + número). */
function telefonoWhatsApp(tel: string) {
  const d = tel.replace(/\D/g, "").replace(/^0/, "");
  return d.startsWith("54") ? d : `549${d.replace(/^15/, "")}`;
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requerirSesion();
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { cotizaciones: { orderBy: { createdAt: "desc" } } } });
  if (!lead) notFound();
  const borrar = eliminarLead.bind(null, lead.id);

  return (
    <>
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold">{lead.nombre}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {lead.localidad} · desde el {lead.createdAt.toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba", dateStyle: "long", timeStyle: "short" })}
              </p>
            </div>
            <SelectorEstado id={lead.id} estado={lead.estado} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={linkWhatsApp(telefonoWhatsApp(lead.telefono), `Hola ${lead.nombre.split(" ")[0]}, te escribo por la cotización de paneles solares que hiciste en nuestra web.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <a href={`tel:${lead.telefono.replace(/[^\d+]/g, "")}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-glass-border px-4 text-sm">
              <Phone className="size-4" /> {lead.telefono}
            </a>
            <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-glass-border px-4 text-sm">
              <Mail className="size-4" /> {lead.email}
            </a>
          </div>

          <h2 className="mt-8 text-xl font-semibold">Cotizaciones</h2>
          <div className="mt-3 space-y-3">
            {lead.cotizaciones.map((c) => {
              const r = c.resultado as unknown as ResultadoGuardado;
              const s = r.sistema;
              const cr = r.credito;
              return (
                <article key={c.id} className="rounded-2xl border border-glass-border p-4 text-sm">
                  <p className="text-xs text-muted-foreground">
                    {c.createdAt.toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba", dateStyle: "short", timeStyle: "short" })} · {SEGMENTO_LABEL[c.tipoCliente]} · {c.origen === "EMBED" ? "Cotizador embebido" : "Web"}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                    {[
                      ["Consumo", `${numero(r.consumoMensualKwh)} kWh/mes`],
                      ["Sistema", `${numero(s.kwpReal, 2)} kWp · ${s.paneles} paneles`],
                      ["Inversor", s.inversor ? `${s.inversor.cantidad > 1 ? `${s.inversor.cantidad} × ` : ""}${s.inversor.inversor.modelo}` : "—"],
                      ["Superficie", `${numero(s.superficieM2, 1)} m²${s.limitadoPorEspacio ? " (limitado por espacio)" : ""}`],
                      ["Cobertura", pct(s.coberturaReal)],
                      ["Ahorro", `${pesos(s.ahorroMensualPromedio)}/mes`],
                      ["Precio", pesos(Number(c.precioTotal))],
                      ["Repago contado", r.repagoContado ? meses(r.repagoContado) : "—"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground">{k}</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {cr && (
                    <p className="mt-3 rounded-xl bg-secondary/60 p-3">
                      <span className="font-medium">{cr.lineaNombre}</span>: {cr.plazo} cuotas de {pesos(cr.cuotaInicial)}
                      {cr.cuotaUVA != null && ` (${numero(cr.cuotaUVA, 2)} UVA)`}
                      {cr.anticipo > 0 && ` · anticipo ${pesos(cr.anticipo)}`} · TNA {pct(cr.tna, 2)} · CFT {pct(cr.cft, 2)}
                      {cr.repago && ` · repago en ${meses(cr.repago)}`}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <NotasLead id={lead.id} notas={lead.notas ?? ""} />
          </div>
          {session.user.role === "ADMIN" && (
            <form action={borrar} className="glass rounded-3xl p-5">
              <p className="text-sm text-muted-foreground">Borra el lead y sus cotizaciones. No se puede deshacer.</p>
              <button type="submit" className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-destructive/40 px-4 text-sm text-destructive hover:bg-destructive/10">
                <Trash2 className="size-4" /> Borrar lead
              </button>
            </form>
          )}
        </aside>
      </div>
    </>
  );
}
