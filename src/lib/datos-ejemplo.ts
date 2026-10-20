import type { DatosCotizador, Segmento } from "@/lib/schemas";

/**
 * Copia de los valores de prisma/seed.ts para desarrollo local sin base de datos y para tests.
 * En producción los datos siempre salen de la base.
 */
const HSP_CORDOBA = [6.4, 6.0, 5.3, 4.5, 3.8, 3.4, 3.7, 4.5, 5.2, 5.8, 6.3, 6.5];

const tarifasEpec: DatosCotizador["localidades"][number]["tarifas"] = [
  { segmento: "HOGAR", categoria: "Residencial", precioKwh: 210, cargoFijo: 8000 },
  { segmento: "COMERCIO", categoria: "General", precioKwh: 235, cargoFijo: 15000 },
  { segmento: "INDUSTRIA", categoria: "Grandes consumos", precioKwh: 190, cargoFijo: 60000 },
  { segmento: "AGRO", categoria: "Rural", precioKwh: 220, cargoFijo: 12000 },
];
const tarifasCoop: DatosCotizador["localidades"][number]["tarifas"] = [
  { segmento: "HOGAR", categoria: "Residencial", precioKwh: 225, cargoFijo: 9000 },
  { segmento: "COMERCIO", categoria: "General", precioKwh: 245, cargoFijo: 16000 },
  { segmento: "INDUSTRIA", categoria: "Grandes consumos", precioKwh: 200, cargoFijo: 60000 },
  { segmento: "AGRO", categoria: "Rural", precioKwh: 230, cargoFijo: 12000 },
];

const LOCALIDADES: [string, "EPEC" | "Cooperativa local"][] = [
  ["Córdoba", "EPEC"],
  ["Jesús María", "Cooperativa local"],
  ["Laguna Larga", "Cooperativa local"],
  ["Oncativo", "Cooperativa local"],
  ["Pilar", "Cooperativa local"],
  ["Río Cuarto", "EPEC"],
  ["Río Tercero", "Cooperativa local"],
  ["San Francisco", "EPEC"],
  ["Villa Carlos Paz", "EPEC"],
  ["Villa María", "EPEC"],
];

const escalaComercial = [
  { kwpDesde: 0, kwpHasta: 20, precioPorKwp: 1300000, costoFijoInst: 900000 },
  { kwpDesde: 20, kwpHasta: 100, precioPorKwp: 1150000, costoFijoInst: 1500000 },
  { kwpDesde: 100, kwpHasta: 10000, precioPorKwp: 1000000, costoFijoInst: 3000000 },
];

const LEGAL =
  "Simulación orientativa. Las cuotas en UVA se ajustan por inflación. Sujeto a calificación crediticia y aprobación de Bancor. Las condiciones pueden variar.";

export const DATOS_EJEMPLO: DatosCotizador = {
  config: {
    empresaNombre: "Eco Lógica S.A.S",
    logoUrl: null,
    colorPrimario: "#F5A524",
    colorAcento: "#A3E635",
    whatsapp: "5493572445884",
    performanceRatio: 0.79,
    degradacionAnual: 0.005,
    aumentoTarifaAnual: 0.03,
    valorUVA: 1650,
    valorUVAFecha: "2026-10-19T00:00:00.000Z",
    factorCO2KgKwh: 0.4,
    kgCO2PorArbol: 22,
    margenPrecio: 0.1,
  },
  localidades: LOCALIDADES.map(([nombre, dist], i) => ({
    id: `loc-${i}`,
    provincia: "Córdoba",
    nombre,
    hspMensual: HSP_CORDOBA,
    distribuidora: dist,
    precioInyeccion: dist === "EPEC" ? 95 : 90,
    tarifas: dist === "EPEC" ? tarifasEpec : tarifasCoop,
  })),
  panel: { marca: "Genérico Tier 1", modelo: "Mono N-Type 580 W", wp: 580, m2: 2.58 },
  inversores: [
    ...[3, 5, 6, 8, 10].map((kw) => ({ modelo: `On-grid ${kw} kW monofásico`, kw, fases: 1 as const })),
    ...[10, 15, 20, 25, 30, 50, 60, 100].map((kw) => ({ modelo: `On-grid ${kw} kW trifásico`, kw, fases: 3 as const })),
  ],
  baterias: [
    { id: "bat-5", modelo: "Litio LFP 5 kWh", kwh: 5, precio: 2800000 },
    { id: "bat-10", modelo: "Litio LFP 10 kWh", kwh: 10, precio: 5200000 },
  ],
  estructuras: { CHAPA: 35000, LOSA: 60000, TEJA: 55000, SUELO: 110000 },
  escalas: {
    HOGAR: [
      { kwpDesde: 0, kwpHasta: 5, precioPorKwp: 1500000, costoFijoInst: 600000 },
      { kwpDesde: 5, kwpHasta: 10, precioPorKwp: 1350000, costoFijoInst: 700000 },
      { kwpDesde: 10, kwpHasta: 10000, precioPorKwp: 1250000, costoFijoInst: 900000 },
    ],
    COMERCIO: escalaComercial,
    AGRO: escalaComercial,
    INDUSTRIA: [
      { kwpDesde: 0, kwpHasta: 100, precioPorKwp: 1100000, costoFijoInst: 2000000 },
      { kwpDesde: 100, kwpHasta: 10000, precioPorKwp: 950000, costoFijoInst: 4000000 },
    ],
  } satisfies Record<Segmento, unknown>,
  lineas: [
    {
      id: "linea-empresas",
      nombre: "Empresas – Línea pyme con tasa bonificada",
      destinatario: "EMPRESA",
      tna: 0.35,
      tea: null,
      cft: null,
      plazos: [12, 24, 36, 48],
      montoMaximo: 300000000,
      esUVA: false,
      ivaSobreIntereses: true,
      textoLegal: LEGAL,
      requisitos: "Requiere proveedor con convenio Bancor y adherido a CADIEC.",
    },
    {
      id: "linea-personas",
      nombre: "Personas – Préstamo personal ecosustentable UVA",
      destinatario: "PERSONA",
      tna: 0.12,
      tea: null,
      cft: null,
      plazos: [12, 24, 36, 48, 60, 72],
      montoMaximo: 40000000,
      esUVA: true,
      ivaSobreIntereses: false,
      textoLegal: LEGAL,
      requisitos: "Solo en comercios vinculados con Bancor.",
    },
  ],
};
