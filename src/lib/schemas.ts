import { z } from "zod";
import { EQUIPOS, type EquipoId } from "@/lib/consumo";

export const SEGMENTOS = ["HOGAR", "COMERCIO", "INDUSTRIA", "AGRO"] as const;
export const TIPOS_TECHO = ["CHAPA", "LOSA", "TEJA", "SUELO"] as const;
export const ORIENTACIONES = ["norte", "este-oeste", "no-se"] as const;
export const MODOS_CONSUMO = ["factura", "importe", "estimar"] as const;

export type Segmento = (typeof SEGMENTOS)[number];
export type TipoTecho = (typeof TIPOS_TECHO)[number];

/** Datos que el cotizador necesita de la base, ya serializados (sin Decimal ni Date). */
export interface DatosCotizador {
  config: {
    empresaNombre: string;
    logoUrl: string | null;
    colorPrimario: string;
    colorAcento: string;
    whatsapp: string;
    performanceRatio: number;
    degradacionAnual: number;
    aumentoTarifaAnual: number;
    valorUVA: number;
    valorUVAFecha: string;
    factorCO2KgKwh: number;
    kgCO2PorArbol: number;
    margenPrecio: number;
  };
  localidades: {
    id: string;
    provincia: string;
    nombre: string;
    hspMensual: number[];
    distribuidora: string;
    precioInyeccion: number;
    tarifas: { segmento: Segmento; categoria: string; precioKwh: number; cargoFijo: number }[];
  }[];
  panel: { marca: string; modelo: string; wp: number; m2: number };
  inversores: { modelo: string; kw: number; fases: 1 | 3 }[];
  baterias: { id: string; modelo: string; kwh: number; precio: number }[];
  estructuras: Partial<Record<TipoTecho, number>>;
  escalas: Record<Segmento, { kwpDesde: number; kwpHasta: number; precioPorKwp: number; costoFijoInst: number }[]>;
  lineas: {
    id: string;
    nombre: string;
    destinatario: "PERSONA" | "EMPRESA";
    tna: number;
    tea: number | null;
    cft: number | null;
    plazos: number[];
    montoMaximo: number;
    esUVA: boolean;
    ivaSobreIntereses: boolean;
    textoLegal: string;
    requisitos: string | null;
  }[];
}

const coberturaSchema = z.union([z.literal(0.5), z.literal(0.75), z.literal(1), z.literal("max")]);

export const respuestasSchema = z.object({
  tipoCliente: z.enum(SEGMENTOS),
  localidadId: z.string().min(1),
  consumo: z.object({
    modo: z.enum(MODOS_CONSUMO),
    kwhPeriodo: z.number().min(0).max(10_000_000),
    diasPeriodo: z.number().int().min(1).max(366),
    importe: z.number().min(0).max(10_000_000_000),
    estimacion: z.object({
      m2: z.number().min(0).max(1_000_000),
      personas: z.number().int().min(0).max(100_000),
      equipos: z.partialRecord(z.enum(Object.keys(EQUIPOS) as [EquipoId, ...EquipoId[]]), z.number().int().min(0).max(1000)),
      maquinas: z.array(z.object({ nombre: z.string().max(80), kw: z.number().min(0).max(10_000), horasDia: z.number().min(0).max(24) })).max(50),
      diasSemana: z.number().int().min(1).max(7),
      horario: z.string().max(80),
    }),
  }),
  techo: z.object({
    tipo: z.enum(TIPOS_TECHO),
    m2: z.number().min(0).max(1_000_000).nullable(),
    orientacion: z.enum(ORIENTACIONES),
    sombras: z.boolean(),
  }),
  objetivo: z.object({
    cobertura: coberturaSchema,
    bateriaId: z.string().nullable(),
  }),
  credito: z.object({
    lineaId: z.string().nullable(),
    plazo: z.number().int().min(1).max(240),
    anticipo: z.number().min(0),
  }),
});

export type Respuestas = z.infer<typeof respuestasSchema>;

export const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(120),
  telefono: z.string().trim().regex(/^[\d\s()+-]{8,20}$/, "Ingresá un teléfono válido"),
  email: z.string().trim().email("Ingresá un email válido").max(160),
  localidad: z.string().trim().min(2, "Ingresá tu localidad").max(120),
});

export type DatosLead = z.infer<typeof leadSchema>;

export const envioCotizacionSchema = z.object({
  respuestas: respuestasSchema,
  lead: leadSchema,
  origen: z.enum(["WEB", "EMBED"]).default("WEB"),
});

export function respuestasIniciales(datos: DatosCotizador): Respuestas {
  const cordoba = datos.localidades.find((l) => l.nombre === "Córdoba") ?? datos.localidades[0];
  const linea = datos.lineas.find((l) => l.destinatario === "PERSONA") ?? datos.lineas[0];
  return {
    tipoCliente: "HOGAR",
    localidadId: cordoba?.id ?? "",
    consumo: {
      modo: "importe",
      kwhPeriodo: 0,
      diasPeriodo: 60,
      importe: 0,
      estimacion: { m2: 100, personas: 3, equipos: { heladera: 1 }, maquinas: [], diasSemana: 5, horario: "" },
    },
    techo: { tipo: "CHAPA", m2: null, orientacion: "norte", sombras: false },
    objetivo: { cobertura: 1, bateriaId: null },
    credito: { lineaId: linea?.id ?? null, plazo: linea ? Math.max(...linea.plazos.filter((p) => p <= 48), linea.plazos[0]) : 48, anticipo: 0 },
  };
}
