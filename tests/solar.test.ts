import { describe, expect, it } from "vitest";
import {
  balanceMensual,
  consumoMensualDesdeFactura,
  consumoMensualDesdeImporte,
  cotizarSistema,
  dimensionar,
  elegirInversor,
  escalaPara,
  generacionMensual,
  hspPromedio,
  impactoAmbiental,
  proyeccionAhorro,
  serieAhorroMensual,
  type ParametrosSolares,
} from "@/lib/solar";

// HSP plano para que las cuentas a mano sean simples.
const params: ParametrosSolares = {
  hspMensual: Array(12).fill(5),
  performanceRatio: 0.8,
  panel: { wp: 580, m2: 2.6 },
  inversores: [
    { modelo: "3K", kw: 3, fases: 1 },
    { modelo: "5K", kw: 5, fases: 1 },
    { modelo: "10K-T", kw: 10, fases: 3 },
    { modelo: "15K-T", kw: 15, fases: 3 },
    { modelo: "20K-T", kw: 20, fases: 3 },
  ],
  escalas: [
    { kwpDesde: 0, kwpHasta: 10, precioPorKwp: 1_000_000, costoFijoInst: 500_000 },
    { kwpDesde: 10, kwpHasta: 100, precioPorKwp: 800_000, costoFijoInst: 1_000_000 },
  ],
  tarifa: { precioKwh: 100, cargoFijo: 0, precioInyeccion: 50 },
  degradacionAnual: 0.005,
  aumentoTarifaAnual: 0.1,
  factorCO2KgKwh: 0.4,
  kgCO2PorArbol: 20,
  margenPrecio: 0.1,
};

describe("consumo", () => {
  it("normaliza la factura a 30 días", () => {
    expect(consumoMensualDesdeFactura(450, 60)).toBe(225);
  });
  it("convierte importe a kWh descontando el cargo fijo", () => {
    expect(consumoMensualDesdeImporte(50_000, { precioKwh: 150, cargoFijo: 5_000 })).toBe(300);
  });
  it("no devuelve consumo negativo", () => {
    expect(consumoMensualDesdeImporte(1_000, { precioKwh: 150, cargoFijo: 5_000 })).toBe(0);
  });
});

describe("hspPromedio", () => {
  it("pondera por días del mes", () => {
    expect(hspPromedio(Array(12).fill(5))).toBeCloseTo(5, 10);
    const verano = [7, 6, 5, 4, 3, 3, 3, 4, 5, 6, 7, 7];
    const esperado = (7 * 31 + 6 * 28 + 5 * 31 + 4 * 30 + 3 * 31 + 3 * 30 + 3 * 31 + 4 * 31 + 5 * 30 + 6 * 31 + 7 * 30 + 7 * 31) / 365;
    expect(hspPromedio(verano)).toBeCloseTo(esperado, 10);
  });
  it("exige 12 valores", () => {
    expect(() => hspPromedio([5, 5])).toThrow();
  });
});

describe("dimensionar", () => {
  it("hogar de 400 kWh/mes al 100 %", () => {
    const d = dimensionar({ consumoMensualKwh: 400, cobertura: 1 }, params);
    // 13,33 kWh/día / (5 × 0,8) = 3,333 kWp → 5,75 paneles → 6
    expect(d.kwpNecesario).toBeCloseTo(3.3333, 4);
    expect(d.paneles).toBe(6);
    expect(d.kwpReal).toBeCloseTo(3.48, 10);
    expect(d.superficieM2).toBeCloseTo(15.6, 10);
    expect(d.limitadoPorEspacio).toBe(false);
  });

  it("cobertura 50 %", () => {
    expect(dimensionar({ consumoMensualKwh: 400, cobertura: 0.5 }, params).paneles).toBe(3);
  });

  it("no suma un panel extra por error de punto flotante en un ajuste exacto", () => {
    // 4 paneles = 2,32 kWp → 2,32 × 5 × 0,8 × 30 = 278,4 kWh/mes
    expect(dimensionar({ consumoMensualKwh: 278.4, cobertura: 1 }, params).paneles).toBe(4);
  });

  it("si el techo no alcanza propone el máximo y avisa", () => {
    const d = dimensionar({ consumoMensualKwh: 400, cobertura: 1, m2Disponibles: 10 }, params);
    expect(d.paneles).toBe(3);
    expect(d.panelesMaxEspacio).toBe(3);
    expect(d.limitadoPorEspacio).toBe(true);
  });

  it("'lo máximo que entre' llena el techo sin marcarlo como limitación", () => {
    const d = dimensionar({ consumoMensualKwh: 400, cobertura: "max", m2Disponibles: 40 }, params);
    expect(d.paneles).toBe(15);
    expect(d.limitadoPorEspacio).toBe(false);
  });

  it("orientación Este/Oeste y sombras aumentan la potencia necesaria", () => {
    const base = dimensionar({ consumoMensualKwh: 400, cobertura: 1 }, params);
    const peor = dimensionar({ consumoMensualKwh: 400, cobertura: 1, orientacion: "este-oeste", haySombras: true }, params);
    expect(peor.kwpNecesario).toBeCloseTo(base.kwpNecesario / (0.85 * 0.9), 6);
  });
});

describe("elegirInversor", () => {
  it("toma la potencia comercial inmediata superior", () => {
    expect(elegirInversor(3.48, params.inversores)).toMatchObject({ inversor: { kw: 5 }, cantidad: 1, sugerirTrifasico: false });
  });
  it("sugiere trifásico por encima de 10 kWp", () => {
    expect(elegirInversor(12, params.inversores)).toMatchObject({ inversor: { kw: 15, fases: 3 }, cantidad: 1, sugerirTrifasico: true });
  });
  it("combina varios equipos si ninguno alcanza solo", () => {
    expect(elegirInversor(50, params.inversores)).toMatchObject({ inversor: { kw: 20 }, cantidad: 3 });
  });
});

describe("generación y ahorro", () => {
  it("generación mensual = kWp × HSP × días × PR", () => {
    const g = generacionMensual(3.48, params);
    expect(g[0]).toBeCloseTo(3.48 * 5 * 31 * 0.8, 10);
    expect(g[1]).toBeCloseTo(3.48 * 5 * 28 * 0.8, 10);
    expect(g.reduce((a, b) => a + b)).toBeCloseTo(3.48 * 5 * 365 * 0.8, 8);
  });

  it("valora autoconsumo a tarifa y excedente a precio de inyección", () => {
    const [ene] = balanceMensual(generacionMensual(3.48, params), 400, params.tarifa);
    const consumo = (400 / 30) * 31;
    const gen = 3.48 * 5 * 31 * 0.8;
    expect(ene.autoconsumoKwh).toBeCloseTo(consumo, 8);
    expect(ene.excedenteKwh).toBeCloseTo(gen - consumo, 8);
    expect(ene.ahorro).toBeCloseTo(consumo * 100 + (gen - consumo) * 50, 6);
  });

  it("proyección con degradación y aumento de tarifa", () => {
    const p = proyeccionAhorro(1000, 5000, params);
    expect(p).toHaveLength(25);
    expect(p[1].ahorro).toBeCloseTo(1000 * 0.995 * 1.1, 8);
    expect(p[1].ahorroAcumulado).toBeCloseTo(1000 + 1094.5, 8);
    expect(p[1].generacionKwh).toBeCloseTo(4975, 8);
  });

  it("serie mensual cambia de año cada 12 meses", () => {
    const balance = balanceMensual(generacionMensual(3.48, params), 400, params.tarifa);
    const serie = serieAhorroMensual(balance, params, 24);
    expect(serie[12]).toBeCloseTo(serie[0] * 0.995 * 1.1, 8);
  });
});

describe("precio e impacto", () => {
  it("elige la escala por kWp", () => {
    expect(escalaPara(3.48, params.escalas).precioPorKwp).toBe(1_000_000);
    expect(escalaPara(10, params.escalas).precioPorKwp).toBe(800_000);
    expect(escalaPara(500, params.escalas).precioPorKwp).toBe(800_000);
  });

  it("precio = kWp × $/kWp + instalación + estructura + baterías, con rango ±10 %", () => {
    const c = cotizarSistema({ consumoMensualKwh: 400, cobertura: 1, estructuraPorPanel: 50_000, costoBaterias: 0 }, params);
    expect(c.precio.total).toBeCloseTo(3.48 * 1_000_000 + 500_000 + 6 * 50_000, 6);
    expect(c.precio.minimo).toBeCloseTo(4_280_000 * 0.9, 6);
    expect(c.precio.maximo).toBeCloseTo(4_280_000 * 1.1, 6);
  });

  it("CO₂ y árboles", () => {
    const i = impactoAmbiental(5000, params);
    expect(i.toneladasCO2Anual).toBeCloseTo(2, 10);
    expect(i.arbolesEquivalentes).toBe(100);
  });
});

describe("cotizarSistema", () => {
  it("devuelve un resultado coherente de punta a punta", () => {
    const c = cotizarSistema({ consumoMensualKwh: 400, cobertura: 1 }, params);
    expect(c.paneles).toBe(6);
    expect(c.inversor?.inversor.kw).toBe(5);
    expect(c.generacionAnualKwh).toBeCloseTo(5080.8, 6);
    expect(c.coberturaReal).toBeCloseTo(5080.8 / 4800, 8);
    expect(c.proyeccion).toHaveLength(25);
    expect(c.ahorro25Anios).toBeGreaterThan(c.ahorroAnual * 25 * 0.88);
  });
});
