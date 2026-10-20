import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { DATOS_EJEMPLO } from "@/lib/datos-ejemplo";
import { SEGMENTOS, type DatosCotizador, type Segmento } from "@/lib/schemas";

/** Los arrays se guardan como JSON en MySQL; se validan al leer. */
function numeros(valor: unknown): number[] {
  return Array.isArray(valor) ? valor.map(Number).filter(Number.isFinite) : [];
}

async function cargarDatos(): Promise<DatosCotizador> {
  const [config, localidades, panel, inversores, baterias, estructuras, escalas, lineas] = await Promise.all([
    prisma.configuracion.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.localidad.findMany({
      orderBy: [{ provincia: "asc" }, { nombre: "asc" }],
      include: { distribuidora: { include: { tarifas: { where: { activa: true }, orderBy: { vigenteDesde: "desc" } } } } },
    }),
    prisma.panel.findFirst({ where: { activo: true }, orderBy: [{ predeterminado: "desc" }, { wp: "asc" }] }),
    prisma.inversor.findMany({ where: { activo: true, hibrido: false }, orderBy: { kw: "asc" } }),
    prisma.bateria.findMany({ where: { activo: true }, orderBy: { kwh: "asc" } }),
    prisma.estructura.findMany({ where: { activo: true } }),
    prisma.escalaPrecio.findMany({ orderBy: { kwpDesde: "asc" } }),
    prisma.lineaCredito.findMany({
      where: {
        activa: true,
        vigenciaDesde: { lte: new Date() },
        OR: [{ vigenciaHasta: null }, { vigenciaHasta: { gte: new Date() } }],
      },
      orderBy: { nombre: "asc" },
    }),
  ]);
  if (!panel) throw new Error("No hay paneles activos en el catálogo");

  const escalasPorSegmento = Object.fromEntries(SEGMENTOS.map((s) => [s, [] as DatosCotizador["escalas"][Segmento]])) as DatosCotizador["escalas"];
  for (const e of escalas) {
    escalasPorSegmento[e.segmento].push({
      kwpDesde: e.kwpDesde,
      kwpHasta: e.kwpHasta,
      precioPorKwp: Number(e.precioPorKwp),
      costoFijoInst: Number(e.costoFijoInst),
    });
  }

  return {
    config: {
      empresaNombre: config.empresaNombre,
      logoUrl: config.logoUrl,
      colorPrimario: config.colorPrimario,
      colorAcento: config.colorAcento,
      whatsapp: config.whatsapp,
      performanceRatio: config.performanceRatio,
      degradacionAnual: config.degradacionAnual,
      aumentoTarifaAnual: config.aumentoTarifaAnual,
      valorUVA: Number(config.valorUVA),
      valorUVAFecha: config.valorUVAFecha.toISOString(),
      factorCO2KgKwh: config.factorCO2KgKwh,
      kgCO2PorArbol: config.kgCO2PorArbol,
      margenPrecio: config.margenPrecio,
    },
    localidades: localidades.map((l) => {
      // Una tarifa por segmento: la vigente más reciente.
      const vistas = new Set<string>();
      const tarifas = l.distribuidora.tarifas.filter((t) => !vistas.has(t.segmento) && vistas.add(t.segmento));
      return {
        id: l.id,
        provincia: l.provincia,
        nombre: l.nombre,
        hspMensual: numeros(l.hspMensual),
        distribuidora: l.distribuidora.nombre,
        precioInyeccion: Number(l.distribuidora.precioInyeccion),
        tarifas: tarifas.map((t) => ({ segmento: t.segmento, categoria: t.categoria, precioKwh: Number(t.precioKwh), cargoFijo: Number(t.cargoFijo) })),
      };
    }),
    panel: { marca: panel.marca, modelo: panel.modelo, wp: panel.wp, m2: panel.m2 },
    inversores: inversores.map((i) => ({ modelo: i.modelo, kw: i.kw, fases: i.fases === 3 ? 3 : 1 })),
    baterias: baterias.map((b) => ({ id: b.id, modelo: b.modelo, kwh: b.kwh, precio: Number(b.precio) })),
    estructuras: Object.fromEntries(estructuras.map((e) => [e.tipoTecho, Number(e.precioPorPanel)])),
    escalas: escalasPorSegmento,
    lineas: lineas.map((l) => ({
      id: l.id,
      nombre: l.nombre,
      destinatario: l.destinatario,
      tna: l.tna,
      tea: l.tea,
      cft: l.cft,
      plazos: numeros(l.plazos).sort((a, b) => a - b),
      montoMaximo: Number(l.montoMaximo),
      esUVA: l.esUVA,
      ivaSobreIntereses: l.ivaSobreIntereses,
      textoLegal: l.textoLegal,
      requisitos: l.requisitos,
    })),
  };
}

const cargarConCache = unstable_cache(cargarDatos, ["datos-cotizador"], { revalidate: 300, tags: ["parametros"] });

/** Parámetros del cotizador con caché de 5 minutos; el admin la invalida con revalidateTag("parametros"). */
export async function obtenerDatosCotizador(): Promise<DatosCotizador> {
  // En desarrollo sin base configurada se usan los datos de ejemplo.
  if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") return DATOS_EJEMPLO;
  return cargarConCache();
}
