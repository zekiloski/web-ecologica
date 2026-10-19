/**
 * Une los datos de la base con las respuestas del wizard y corre los cálculos de solar.ts y credito.ts.
 * Puro y sin dependencias de UI: lo usan el panel en vivo (cliente) y la API (servidor).
 */
import { comparativaCuotaAhorro, periodoRepago, simularCredito } from "@/lib/credito";
import { estimarConsumoMensual } from "@/lib/consumo";
import type { DatosCotizador, Respuestas, Segmento } from "@/lib/schemas";
import {
  consumoMensualDesdeFactura,
  consumoMensualDesdeImporte,
  cotizarSistema,
  serieAhorroMensual,
  type ParametrosSolares,
  type Tarifa,
} from "@/lib/solar";

type Localidad = DatosCotizador["localidades"][number];

export function localidadDe(datos: DatosCotizador, id: string): Localidad | undefined {
  return datos.localidades.find((l) => l.id === id) ?? datos.localidades[0];
}

export function tarifaDe(loc: Localidad, segmento: Segmento): Tarifa & { categoria: string } {
  const t = loc.tarifas.find((x) => x.segmento === segmento) ?? loc.tarifas[0];
  if (!t) throw new Error(`La distribuidora ${loc.distribuidora} no tiene tarifas cargadas`);
  return { precioKwh: t.precioKwh, cargoFijo: t.cargoFijo, precioInyeccion: loc.precioInyeccion, categoria: t.categoria };
}

export function consumoMensualDe(r: Respuestas, tarifa: Tarifa): number {
  const c = r.consumo;
  switch (c.modo) {
    case "factura":
      return c.kwhPeriodo > 0 ? consumoMensualDesdeFactura(c.kwhPeriodo, c.diasPeriodo) : 0;
    case "importe":
      return consumoMensualDesdeImporte(c.importe, tarifa);
    case "estimar":
      return estimarConsumoMensual({
        m2: c.estimacion.m2,
        personas: c.estimacion.personas,
        equipos: c.estimacion.equipos,
        maquinas: c.estimacion.maquinas,
        diasSemana: r.tipoCliente === "HOGAR" ? 7 : c.estimacion.diasSemana,
      });
  }
}

export function parametrosSolares(datos: DatosCotizador, loc: Localidad, segmento: Segmento): ParametrosSolares {
  const { config } = datos;
  return {
    hspMensual: loc.hspMensual,
    performanceRatio: config.performanceRatio,
    panel: { wp: datos.panel.wp, m2: datos.panel.m2 },
    inversores: datos.inversores,
    escalas: datos.escalas[segmento].length ? datos.escalas[segmento] : datos.escalas.COMERCIO,
    tarifa: tarifaDe(loc, segmento),
    degradacionAnual: config.degradacionAnual,
    aumentoTarifaAnual: config.aumentoTarifaAnual,
    factorCO2KgKwh: config.factorCO2KgKwh,
    kgCO2PorArbol: config.kgCO2PorArbol,
    margenPrecio: config.margenPrecio,
  };
}

/** Si el plazo elegido no existe en la línea, toma el más cercano. */
export function plazoValido(plazos: number[], plazo: number): number {
  return plazos.includes(plazo) ? plazo : plazos.reduce((a, b) => (Math.abs(b - plazo) < Math.abs(a - plazo) ? b : a));
}

const HORIZONTE_MESES = 25 * 12;

export function calcularCotizacion(datos: DatosCotizador, r: Respuestas) {
  const loc = localidadDe(datos, r.localidadId);
  if (!loc) return null;
  const tarifa = tarifaDe(loc, r.tipoCliente);
  const consumoMensualKwh = consumoMensualDe(r, tarifa);
  if (!(consumoMensualKwh > 0)) return null;

  const params = parametrosSolares(datos, loc, r.tipoCliente);
  const bateria = datos.baterias.find((b) => b.id === r.objetivo.bateriaId) ?? null;
  const sistema = cotizarSistema(
    {
      consumoMensualKwh,
      cobertura: r.objetivo.cobertura,
      m2Disponibles: r.techo.m2 && r.techo.m2 > 0 ? r.techo.m2 : undefined,
      orientacion: r.techo.orientacion,
      haySombras: r.techo.sombras,
      estructuraPorPanel: datos.estructuras[r.techo.tipo] ?? 0,
      costoBaterias: bateria?.precio ?? 0,
    },
    params,
  );

  const ahorroMensual = serieAhorroMensual(sistema.balance, params, HORIZONTE_MESES);
  const repagoContado = sistema.paneles > 0 ? periodoRepago(sistema.precio.total, [], ahorroMensual) : null;

  const linea = datos.lineas.find((l) => l.id === r.credito.lineaId) ?? null;
  let credito = null;
  if (linea && sistema.precio.total > 0) {
    const plazo = plazoValido(linea.plazos, r.credito.plazo);
    // Todo se proyecta en pesos de hoy: la cuota UVA se ajusta por inflación, así que en moneda
    // constante queda fija; la tarifa sube solo su aumento real (aumentoTarifaAnual).
    const sim = simularCredito({
      precioSistema: sistema.precio.total,
      anticipo: r.credito.anticipo,
      plazo,
      linea: { ...linea, tea: linea.tea ?? undefined, cft: linea.cft ?? undefined },
      valorUVA: datos.config.valorUVA,
    });
    const repago = periodoRepago(sim.anticipoNecesario, sim.cuotasEnPesos, ahorroMensual);
    const horizonteGrafico = Math.min(HORIZONTE_MESES, Math.max(plazo + 24, Math.ceil((repago ?? 0) * 1.25)));
    credito = {
      linea,
      ...sim,
      repago,
      // Promedio del primer año (el ahorro de un mes puntual varía mucho entre verano e invierno).
      ahorroMensualAnio1: ahorroMensual.slice(0, 12).reduce((a, b) => a + b, 0) / 12,
      comparativa: comparativaCuotaAhorro(sim.cuotasEnPesos, ahorroMensual.slice(0, horizonteGrafico)),
    };
  }

  return {
    localidad: loc,
    tarifa,
    consumoMensualKwh,
    sistema,
    bateria,
    repagoContado,
    credito,
  };
}

export type ResultadoCotizacion = NonNullable<ReturnType<typeof calcularCotizacion>>;

/** Mensaje de WhatsApp con el resumen de la cotización. */
export function mensajeWhatsApp(res: ResultadoCotizacion, nombre?: string, extra?: string): string {
  const s = res.sistema;
  const partes = [
    `Hola${nombre ? `, soy ${nombre}` : ""}. Quiero un sistema solar de ${s.kwpReal.toFixed(2).replace(".", ",")} kWp`,
    `${s.paneles} paneles`,
    `en ${res.localidad.nombre}`,
  ];
  if (res.credito) partes.push(`financiado en ${res.credito.plazo} cuotas con ${res.credito.linea.nombre}`);
  return `${partes.join(", ")}.${extra ? ` ${extra}` : ""}`;
}

export function linkWhatsApp(numero: string, mensaje: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}
