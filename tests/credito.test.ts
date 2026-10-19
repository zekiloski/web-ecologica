import { describe, expect, it } from "vitest";
import {
  cftAnual,
  comparativaCuotaAhorro,
  cuotaFrancesa,
  periodoRepago,
  simularCredito,
  tablaAmortizacion,
  teaDesdeTna,
  type LineaCredito,
} from "@/lib/credito";

const lineaPesos: LineaCredito = {
  nombre: "Empresas",
  tna: 0.12,
  plazos: [12, 24, 36],
  montoMaximo: 3_000_000,
  esUVA: false,
  ivaSobreIntereses: false,
};

const lineaUVA: LineaCredito = {
  nombre: "Personas UVA",
  tna: 0.08,
  plazos: [12, 24, 36, 48, 60, 72],
  montoMaximo: 50_000_000,
  esUVA: true,
  ivaSobreIntereses: false,
};

describe("sistema francés", () => {
  it("cuota de $1.000.000 al 12 % TNA en 12 meses", () => {
    expect(cuotaFrancesa(1_000_000, 0.12, 12)).toBeCloseTo(88_848.79, 2);
  });

  it("tasa cero divide el capital en partes iguales", () => {
    expect(cuotaFrancesa(1_200, 0, 12)).toBe(100);
  });

  it("la tabla amortiza todo el capital y cierra en saldo 0", () => {
    const t = tablaAmortizacion(1_000_000, 0.12, 12);
    expect(t).toHaveLength(12);
    expect(t[0].interes).toBeCloseTo(10_000, 6);
    expect(t[0].capital).toBeCloseTo(78_848.79, 2);
    expect(t.reduce((a, f) => a + f.capital, 0)).toBeCloseTo(1_000_000, 4);
    expect(t[11].saldo).toBe(0);
    t.forEach((f) => expect(f.cuota).toBeCloseTo(88_848.79, 2));
  });

  it("agrega IVA sobre intereses cuando corresponde", () => {
    const t = tablaAmortizacion(1_000_000, 0.12, 12, { ivaSobreIntereses: true });
    expect(t[0].iva).toBeCloseTo(2_100, 6);
    expect(t[0].cuotaTotal).toBeCloseTo(88_848.79 + 2_100, 2);
  });
});

describe("tasas", () => {
  it("TEA desde TNA", () => {
    expect(teaDesdeTna(0.12)).toBeCloseTo(0.126825, 6);
  });

  it("sin gastos ni IVA, el CFT coincide con la TEA", () => {
    const t = tablaAmortizacion(1_000_000, 0.12, 12);
    expect(cftAnual(1_000_000, t.map((f) => f.cuotaTotal))).toBeCloseTo(teaDesdeTna(0.12), 6);
  });

  it("el IVA sobre intereses sube el CFT", () => {
    const t = tablaAmortizacion(1_000_000, 0.12, 12, { ivaSobreIntereses: true });
    expect(cftAnual(1_000_000, t.map((f) => f.cuotaTotal))).toBeGreaterThan(teaDesdeTna(0.12));
  });
});

describe("simularCredito", () => {
  it("línea en pesos con anticipo y tope de monto", () => {
    const s = simularCredito({ precioSistema: 5_000_000, anticipo: 1_000_000, plazo: 12, linea: lineaPesos });
    expect(s.montoFinanciado).toBe(3_000_000);
    expect(s.excedeMaximo).toBe(true);
    expect(s.anticipoNecesario).toBe(2_000_000);
    expect(s.cuotaInicial).toBeCloseTo(cuotaFrancesa(3_000_000, 0.12, 12), 6);
    expect(s.totalAPagar).toBeCloseTo(s.cuotaInicial * 12, 4);
    expect(s.tea).toBeCloseTo(0.126825, 6);
  });

  it("respeta TEA y CFT informados por el banco", () => {
    const s = simularCredito({ precioSistema: 1_000_000, plazo: 12, linea: { ...lineaPesos, tea: 0.13, cft: 0.2 } });
    expect(s.tea).toBe(0.13);
    expect(s.cft).toBe(0.2);
  });

  it("rechaza un plazo no habilitado", () => {
    expect(() => simularCredito({ precioSistema: 1_000_000, plazo: 48, linea: lineaPesos })).toThrow();
  });

  it("línea UVA: cuota en UVAs y en pesos al valor del día", () => {
    const s = simularCredito({ precioSistema: 2_000_000, plazo: 12, linea: lineaUVA, valorUVA: 1_000 });
    const cuotaUVA = cuotaFrancesa(2_000, 0.08, 12);
    expect(s.montoUVA).toBe(2_000);
    expect(s.cuotaUVA).toBeCloseTo(cuotaUVA, 8);
    expect(s.cuotaInicial).toBeCloseTo(cuotaUVA * 1_000, 6);
  });

  it("línea UVA: la cuota en pesos sube con la inflación estimada", () => {
    const s = simularCredito({ precioSistema: 2_000_000, plazo: 12, linea: lineaUVA, valorUVA: 1_000, inflacionMensualEstimada: 0.02 });
    const cuotaUVA = cuotaFrancesa(2_000, 0.08, 12);
    expect(s.cuotasEnPesos[1]).toBeCloseTo(cuotaUVA * 1_000 * 1.02 ** 2, 6);
    expect(s.cuotasEnPesos[11]).toBeGreaterThan(s.cuotasEnPesos[0]);
  });

  it("línea UVA sin valor UVA es un error", () => {
    expect(() => simularCredito({ precioSistema: 2_000_000, plazo: 12, linea: lineaUVA })).toThrow();
  });
});

describe("repago", () => {
  it("mes en que el ahorro acumulado supera lo pagado", () => {
    expect(periodoRepago(0, [100, 100, 100], Array(10).fill(80))).toBe(4);
  });
  it("repago al contado", () => {
    expect(periodoRepago(1_000, [], Array(24).fill(100))).toBe(10);
  });
  it("null si no se repaga dentro del horizonte", () => {
    expect(periodoRepago(10_000, [], Array(12).fill(100))).toBeNull();
  });
  it("comparativa cuota vs. ahorro", () => {
    const c = comparativaCuotaAhorro([100, 100], [80, 80, 80]);
    expect(c[0]).toMatchObject({ cuota: 100, ahorro: 80, neto: -20 });
    expect(c[2]).toMatchObject({ cuota: 0, pagadoAcumulado: 200, ahorroAcumulado: 240 });
  });
});
