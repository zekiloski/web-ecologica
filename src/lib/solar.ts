/**
 * Cálculos de dimensionamiento, generación y ahorro de sistemas fotovoltaicos on-grid.
 * Módulo puro: todos los parámetros (HSP, tarifas, catálogo, precios) llegan por argumento.
 */

export const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
export const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] as const;
export const ANIOS_PROYECCION = 25;

export type Cobertura = 0.5 | 0.75 | 1 | "max";
export type Orientacion = "norte" | "este-oeste" | "no-se";

/** Pérdida de rendimiento por orientación (hemisferio sur: Norte es lo ideal). */
export const FACTOR_ORIENTACION: Record<Orientacion, number> = {
  norte: 1,
  "este-oeste": 0.85,
  "no-se": 0.95,
};
export const FACTOR_SOMBRAS = 0.9;

export interface Panel {
  wp: number;
  m2: number;
}

export interface Inversor {
  modelo: string;
  kw: number;
  fases: 1 | 3;
  precio?: number;
}

export interface EscalaPrecio {
  kwpDesde: number;
  kwpHasta: number;
  precioPorKwp: number;
  costoFijoInst: number;
}

export interface Tarifa {
  precioKwh: number;
  cargoFijo: number;
  precioInyeccion: number;
}

export interface ParametrosSolares {
  hspMensual: number[]; // 12 valores, enero a diciembre
  performanceRatio: number;
  panel: Panel;
  inversores: Inversor[];
  escalas: EscalaPrecio[];
  tarifa: Tarifa;
  degradacionAnual: number; // 0.005 = 0,5 %
  aumentoTarifaAnual: number; // 0.25 = 25 %
  factorCO2KgKwh: number;
  kgCO2PorArbol: number;
  margenPrecio: number; // 0.1 = rango ±10 %
}

export interface EntradaSistema {
  consumoMensualKwh: number;
  cobertura: Cobertura;
  m2Disponibles?: number;
  orientacion?: Orientacion;
  haySombras?: boolean;
  /** Costo de estructura por panel según el tipo de techo/suelo. */
  estructuraPorPanel?: number;
  /** Costo de baterías si el cliente pidió respaldo. */
  costoBaterias?: number;
}

// ---------- Consumo ----------

export function consumoMensualDesdeFactura(kwhPeriodo: number, diasPeriodo: number): number {
  if (diasPeriodo <= 0) throw new Error("Los días del período deben ser mayores a 0");
  return (kwhPeriodo / diasPeriodo) * 30;
}

export function consumoMensualDesdeImporte(importeMensual: number, tarifa: Pick<Tarifa, "precioKwh" | "cargoFijo">): number {
  if (tarifa.precioKwh <= 0) throw new Error("La tarifa debe ser mayor a 0");
  return Math.max(0, importeMensual - tarifa.cargoFijo) / tarifa.precioKwh;
}

export function resumenConsumo(consumoMensualKwh: number) {
  return {
    diario: consumoMensualKwh / 30,
    mensual: consumoMensualKwh,
    anual: consumoMensualKwh * 12,
  };
}

// ---------- Irradiación ----------

/** HSP promedio anual ponderado por los días de cada mes. */
export function hspPromedio(hspMensual: number[]): number {
  validarHsp(hspMensual);
  const total = hspMensual.reduce((acc, h, i) => acc + h * DIAS_MES[i], 0);
  return total / 365;
}

function validarHsp(hspMensual: number[]) {
  if (hspMensual.length !== 12) throw new Error("hspMensual debe tener 12 valores");
}

export function factorPerdidas(orientacion: Orientacion = "norte", haySombras = false): number {
  return FACTOR_ORIENTACION[orientacion] * (haySombras ? FACTOR_SOMBRAS : 1);
}

// ---------- Dimensionamiento ----------

export interface Dimensionamiento {
  kwpNecesario: number;
  paneles: number;
  kwpReal: number;
  superficieM2: number;
  /** El techo no alcanza para la cobertura pedida: se propone el máximo posible. */
  limitadoPorEspacio: boolean;
  panelesMaxEspacio: number | null;
}

export function dimensionar(entrada: EntradaSistema, p: ParametrosSolares): Dimensionamiento {
  const { consumoMensualKwh, cobertura, m2Disponibles } = entrada;
  const panelesMaxEspacio = m2Disponibles != null ? Math.floor(m2Disponibles / p.panel.m2) : null;

  const rendimiento = hspPromedio(p.hspMensual) * p.performanceRatio * factorPerdidas(entrada.orientacion, entrada.haySombras);
  // "Lo máximo que entre" sin dato de superficie equivale a cubrir el 100 %.
  const fraccion = cobertura === "max" ? 1 : cobertura;
  const kwpNecesario = ((consumoMensualKwh / 30) * fraccion) / rendimiento;
  const panelesIdeales = Math.ceil(round(kwpNecesario * 1000 / p.panel.wp, 6));

  let paneles = panelesIdeales;
  let limitadoPorEspacio = false;
  if (cobertura === "max" && panelesMaxEspacio != null) {
    paneles = panelesMaxEspacio;
  } else if (panelesMaxEspacio != null && panelesIdeales > panelesMaxEspacio) {
    paneles = panelesMaxEspacio;
    limitadoPorEspacio = true;
  }

  return {
    kwpNecesario,
    paneles,
    kwpReal: (paneles * p.panel.wp) / 1000,
    superficieM2: paneles * p.panel.m2,
    limitadoPorEspacio,
    panelesMaxEspacio,
  };
}

/** Potencia comercial inmediata superior; si kWp > 10 se prefiere trifásico. */
export function elegirInversor(kwpReal: number, inversores: Inversor[]): { inversor: Inversor; cantidad: number; sugerirTrifasico: boolean } {
  if (inversores.length === 0) throw new Error("No hay inversores cargados");
  const sugerirTrifasico = kwpReal > 10;
  const candidatos = sugerirTrifasico && inversores.some((i) => i.fases === 3)
    ? inversores.filter((i) => i.fases === 3)
    : inversores;
  const ordenados = [...candidatos].sort((a, b) => a.kw - b.kw);
  const unico = ordenados.find((i) => i.kw >= kwpReal);
  if (unico) return { inversor: unico, cantidad: 1, sugerirTrifasico };
  // Ninguno alcanza solo: varios del modelo más grande.
  const mayor = ordenados[ordenados.length - 1];
  return { inversor: mayor, cantidad: Math.ceil(kwpReal / mayor.kw), sugerirTrifasico };
}

// ---------- Generación y ahorro ----------

export function generacionMensual(kwpReal: number, p: Pick<ParametrosSolares, "hspMensual" | "performanceRatio">, perdidas = 1): number[] {
  validarHsp(p.hspMensual);
  return p.hspMensual.map((hsp, i) => kwpReal * hsp * DIAS_MES[i] * p.performanceRatio * perdidas);
}

export interface BalanceMes {
  mes: string;
  generacionKwh: number;
  consumoKwh: number;
  autoconsumoKwh: number;
  excedenteKwh: number;
  ahorro: number;
}

/** Balance mes a mes del primer año, con el consumo distribuido por días del mes. */
export function balanceMensual(generacion: number[], consumoMensualKwh: number, tarifa: Tarifa): BalanceMes[] {
  const consumoDiario = consumoMensualKwh / 30;
  return generacion.map((gen, i) => {
    const consumo = consumoDiario * DIAS_MES[i];
    const autoconsumo = Math.min(gen, consumo);
    const excedente = Math.max(0, gen - consumo);
    return {
      mes: MESES[i],
      generacionKwh: gen,
      consumoKwh: consumo,
      autoconsumoKwh: autoconsumo,
      excedenteKwh: excedente,
      ahorro: autoconsumo * tarifa.precioKwh + excedente * tarifa.precioInyeccion,
    };
  });
}

export interface AnioProyeccion {
  anio: number;
  generacionKwh: number;
  ahorro: number;
  ahorroAcumulado: number;
}

/** Proyección a 25 años con degradación de paneles y aumento de tarifa. */
export function proyeccionAhorro(ahorroAnio1: number, generacionAnio1: number, p: Pick<ParametrosSolares, "degradacionAnual" | "aumentoTarifaAnual">, anios = ANIOS_PROYECCION): AnioProyeccion[] {
  let acumulado = 0;
  return Array.from({ length: anios }, (_, k) => {
    const factorDeg = Math.pow(1 - p.degradacionAnual, k);
    const factorTarifa = Math.pow(1 + p.aumentoTarifaAnual, k);
    const ahorro = ahorroAnio1 * factorDeg * factorTarifa;
    acumulado += ahorro;
    return { anio: k + 1, generacionKwh: generacionAnio1 * factorDeg, ahorro, ahorroAcumulado: acumulado };
  });
}

/** Ahorro mes a mes durante `meses`, con estacionalidad, degradación y aumento de tarifa anual. */
export function serieAhorroMensual(balance: BalanceMes[], p: Pick<ParametrosSolares, "degradacionAnual" | "aumentoTarifaAnual">, meses: number): number[] {
  return Array.from({ length: meses }, (_, m) => {
    const k = Math.floor(m / 12);
    return balance[m % 12].ahorro * Math.pow(1 - p.degradacionAnual, k) * Math.pow(1 + p.aumentoTarifaAnual, k);
  });
}

// ---------- Precio e impacto ----------

export function escalaPara(kwp: number, escalas: EscalaPrecio[]): EscalaPrecio {
  if (escalas.length === 0) throw new Error("No hay escalas de precio cargadas");
  const ordenadas = [...escalas].sort((a, b) => a.kwpDesde - b.kwpDesde);
  return ordenadas.find((e) => kwp >= e.kwpDesde && kwp < e.kwpHasta)
    ?? (kwp < ordenadas[0].kwpDesde ? ordenadas[0] : ordenadas[ordenadas.length - 1]);
}

export interface PrecioSistema {
  equiposEInstalacion: number;
  estructura: number;
  baterias: number;
  total: number;
  minimo: number;
  maximo: number;
}

export function precioSistema(kwpReal: number, paneles: number, entrada: Pick<EntradaSistema, "estructuraPorPanel" | "costoBaterias">, p: Pick<ParametrosSolares, "escalas" | "margenPrecio">): PrecioSistema {
  const escala = escalaPara(kwpReal, p.escalas);
  const equiposEInstalacion = kwpReal * escala.precioPorKwp + escala.costoFijoInst;
  const estructura = paneles * (entrada.estructuraPorPanel ?? 0);
  const baterias = entrada.costoBaterias ?? 0;
  const total = equiposEInstalacion + estructura + baterias;
  return {
    equiposEInstalacion,
    estructura,
    baterias,
    total,
    minimo: total * (1 - p.margenPrecio),
    maximo: total * (1 + p.margenPrecio),
  };
}

export function impactoAmbiental(generacionAnualKwh: number, p: Pick<ParametrosSolares, "factorCO2KgKwh" | "kgCO2PorArbol">) {
  const kgCO2Anual = generacionAnualKwh * p.factorCO2KgKwh;
  return {
    toneladasCO2Anual: kgCO2Anual / 1000,
    toneladasCO2_25: (kgCO2Anual * ANIOS_PROYECCION) / 1000,
    arbolesEquivalentes: Math.round(kgCO2Anual / p.kgCO2PorArbol),
  };
}

// ---------- Cotización completa ----------

export function cotizarSistema(entrada: EntradaSistema, p: ParametrosSolares) {
  const dim = dimensionar(entrada, p);
  const perdidas = factorPerdidas(entrada.orientacion, entrada.haySombras);
  const generacion = generacionMensual(dim.kwpReal, p, perdidas);
  const balance = balanceMensual(generacion, entrada.consumoMensualKwh, p.tarifa);
  const generacionAnual = sum(generacion);
  const ahorroAnual = sum(balance.map((b) => b.ahorro));
  const consumoAnual = entrada.consumoMensualKwh * 12;
  const proyeccion = proyeccionAhorro(ahorroAnual, generacionAnual, p);

  return {
    ...dim,
    inversor: dim.paneles > 0 ? elegirInversor(dim.kwpReal, p.inversores) : null,
    generacionMensual: generacion,
    balance,
    generacionAnualKwh: generacionAnual,
    coberturaReal: consumoAnual > 0 ? generacionAnual / consumoAnual : 0,
    ahorroMensualPromedio: ahorroAnual / 12,
    ahorroAnual,
    ahorro25Anios: proyeccion[proyeccion.length - 1].ahorroAcumulado,
    proyeccion,
    precio: precioSistema(dim.kwpReal, dim.paneles, entrada, p),
    impacto: impactoAmbiental(generacionAnual, p),
  };
}

export type CotizacionSistema = ReturnType<typeof cotizarSistema>;

// ---------- utilidades ----------

function sum(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}

function round(x: number, decimales: number) {
  const f = 10 ** decimales;
  return Math.round(x * f) / f;
}
