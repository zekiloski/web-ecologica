/**
 * Estimación de consumo cuando el cliente no tiene la factura (camino C del wizard).
 * Valores promedio anuales en kWh/mes por equipo; son orientativos.
 */

export const EQUIPOS = {
  aire: { nombre: "Aire acondicionado", kwhMes: 150, icono: "AirVent" },
  heladera: { nombre: "Heladera", kwhMes: 35, icono: "Refrigerator" },
  freezer: { nombre: "Freezer", kwhMes: 45, icono: "Snowflake" },
  bomba: { nombre: "Bomba de agua", kwhMes: 30, icono: "Droplets" },
  termotanque: { nombre: "Termotanque eléctrico", kwhMes: 150, icono: "ShowerHead" },
  horno: { nombre: "Horno eléctrico", kwhMes: 30, icono: "CookingPot" },
  pileta: { nombre: "Pileta (filtrado)", kwhMes: 80, icono: "Waves" },
} as const;

export type EquipoId = keyof typeof EQUIPOS;

export interface Maquina {
  nombre: string;
  kw: number;
  horasDia: number;
}

export interface EntradaEstimacion {
  m2: number;
  personas: number;
  equipos: Partial<Record<EquipoId, number>>;
  maquinas: Maquina[];
  /** Días de uso por semana para maquinaria (empresas/campo). Por defecto 7. */
  diasSemana?: number;
}

const KWH_POR_PERSONA = 45; // iluminación, electrónica, cocina chica
const KWH_POR_M2 = 0.25; // iluminación y standby de superficie
const SEMANAS_MES = 52 / 12;

export function estimarConsumoMensual(e: EntradaEstimacion): number {
  const base = Math.max(0, e.personas) * KWH_POR_PERSONA + Math.max(0, e.m2) * KWH_POR_M2;
  const equipos = (Object.keys(e.equipos) as EquipoId[]).reduce((acc, id) => acc + (e.equipos[id] ?? 0) * EQUIPOS[id].kwhMes, 0);
  const dias = e.diasSemana ?? 7;
  const maquinas = e.maquinas.reduce((acc, m) => acc + Math.max(0, m.kw) * Math.max(0, m.horasDia) * dias * SEMANAS_MES, 0);
  return base + equipos + maquinas;
}
