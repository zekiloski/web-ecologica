import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { calcularCotizacion } from "@/lib/cotizador";
import { prisma } from "@/lib/db";
import { obtenerDatosCotizador } from "@/lib/params";
import { envioCotizacionSchema } from "@/lib/schemas";

/** Convierte a JSON plano (sin undefined ni clases) para guardar en columnas Json. */
function json(x: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(x));
}

export async function POST(req: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const parsed = envioCotizacionSchema.safeParse(cuerpo);
  if (!parsed.success) return NextResponse.json({ error: "Revisá los datos ingresados" }, { status: 400 });
  const { respuestas, lead, origen } = parsed.data;

  // Se recalcula en el servidor con los parámetros vigentes: no se confía en los números del navegador.
  const datos = await obtenerDatosCotizador();
  const res = calcularCotizacion(datos, respuestas);
  if (!res || res.sistema.paneles === 0) return NextResponse.json({ error: "No pudimos calcular el sistema con esos datos" }, { status: 422 });

  if (!process.env.DATABASE_URL) {
    // Desarrollo local sin base: se simula el guardado.
    return NextResponse.json({ id: `demo-${Date.now()}` });
  }

  const s = res.sistema;
  const c = res.credito;

  const cotizacion = await prisma.cotizacion.create({
    data: {
      origen,
      tipoCliente: respuestas.tipoCliente,
      respuestas,
      resultado: json({
        consumoMensualKwh: res.consumoMensualKwh,
        sistema: {
          kwpNecesario: s.kwpNecesario,
          kwpReal: s.kwpReal,
          paneles: s.paneles,
          superficieM2: s.superficieM2,
          limitadoPorEspacio: s.limitadoPorEspacio,
          inversor: s.inversor,
          generacionMensual: s.generacionMensual,
          generacionAnualKwh: s.generacionAnualKwh,
          coberturaReal: s.coberturaReal,
          ahorroMensualPromedio: s.ahorroMensualPromedio,
          ahorroAnual: s.ahorroAnual,
          ahorro25Anios: s.ahorro25Anios,
          precio: { ...s.precio },
          impacto: s.impacto,
        },
        repagoContado: res.repagoContado,
        credito: c && {
          lineaNombre: c.linea.nombre,
          plazo: c.plazo,
          montoFinanciado: c.montoFinanciado,
          anticipo: c.anticipoNecesario,
          esUVA: c.esUVA,
          cuotaUVA: c.cuotaUVA,
          cuotaInicial: c.cuotaInicial,
          totalAPagar: c.totalAPagar,
          tna: c.tna,
          tea: c.tea,
          cft: c.cft,
          repago: c.repago,
        },
      }),
      parametros: json({
        config: datos.config,
        localidad: res.localidad,
        tarifa: res.tarifa,
        panel: datos.panel,
        linea: c?.linea ?? null,
        bateria: res.bateria,
      }),
      kwp: s.kwpReal,
      paneles: s.paneles,
      precioTotal: Math.round(s.precio.total),
      lineaCredito: c ? { connect: { id: c.linea.id } } : undefined,
      plazoMeses: c?.plazo ?? null,
      cuotaInicial: c ? Math.round(c.cuotaInicial) : null,
      lead: { create: lead },
    },
    select: { id: true },
  });

  // La notificación por email al vendedor se agrega en la etapa 5 (Resend).
  return NextResponse.json({ id: cotizacion.id });
}
