import { describe, expect, it } from "vitest";
import { estimarConsumoMensual } from "@/lib/consumo";
import { calcularCotizacion, mensajeWhatsApp, plazoValido } from "@/lib/cotizador";
import { DATOS_EJEMPLO } from "@/lib/datos-ejemplo";
import { respuestasIniciales, respuestasSchema, type Respuestas } from "@/lib/schemas";

function respuestas(cambios: (r: Respuestas) => void): Respuestas {
  const r = structuredClone(respuestasIniciales(DATOS_EJEMPLO));
  cambios(r);
  return r;
}

describe("estimarConsumoMensual", () => {
  it("suma base por personas y m², equipos y maquinaria", () => {
    const kwh = estimarConsumoMensual({
      m2: 100,
      personas: 3,
      equipos: { aire: 2, heladera: 1 },
      maquinas: [{ nombre: "Compresor", kw: 2, horasDia: 4 }],
      diasSemana: 6,
    });
    expect(kwh).toBeCloseTo(3 * 45 + 100 * 0.25 + 2 * 150 + 35 + 2 * 4 * 6 * (52 / 12), 8);
  });
});

describe("calcularCotizacion", () => {
  it("las respuestas iniciales son válidas para el esquema", () => {
    expect(respuestasSchema.safeParse(respuestasIniciales(DATOS_EJEMPLO)).success).toBe(true);
  });

  it("sin consumo no hay cotización", () => {
    expect(calcularCotizacion(DATOS_EJEMPLO, respuestasIniciales(DATOS_EJEMPLO))).toBeNull();
  });

  it("hogar que paga $80.000 por mes en Córdoba", () => {
    const r = respuestas((r) => {
      r.consumo.importe = 80_000;
    });
    const c = calcularCotizacion(DATOS_EJEMPLO, r)!;
    // (80.000 − 8.000) / 210 = 342,86 kWh/mes
    expect(c.consumoMensualKwh).toBeCloseTo(342.857, 2);
    expect(c.sistema.paneles).toBeGreaterThan(3);
    expect(c.sistema.coberturaReal).toBeGreaterThanOrEqual(0.99);
    expect(c.credito).not.toBeNull();
    expect(c.credito!.esUVA).toBe(true);
    expect(c.credito!.plazo).toBe(48);
    expect(c.repagoContado).toBeGreaterThan(12);
  });

  it("empresa con factura de 12.000 kWh en 60 días usa tarifa y escala comercial", () => {
    const r = respuestas((r) => {
      r.tipoCliente = "COMERCIO";
      r.consumo.modo = "factura";
      r.consumo.kwhPeriodo = 12_000;
      r.consumo.diasPeriodo = 60;
      r.credito.lineaId = "linea-empresas";
      r.credito.plazo = 72; // no existe en la línea: se ajusta a 48
    });
    const c = calcularCotizacion(DATOS_EJEMPLO, r)!;
    expect(c.consumoMensualKwh).toBe(6_000);
    expect(c.tarifa.precioKwh).toBe(235);
    expect(c.sistema.inversor?.sugerirTrifasico).toBe(true);
    expect(c.credito!.plazo).toBe(48);
  });

  it("techo chico limita el sistema", () => {
    const r = respuestas((r) => {
      r.consumo.importe = 300_000;
      r.techo.m2 = 20;
    });
    const c = calcularCotizacion(DATOS_EJEMPLO, r)!;
    expect(c.sistema.limitadoPorEspacio).toBe(true);
    expect(c.sistema.paneles).toBe(Math.floor(20 / 2.58));
  });

  it("baterías suman al precio", () => {
    const sin = calcularCotizacion(DATOS_EJEMPLO, respuestas((r) => (r.consumo.importe = 80_000)))!;
    const con = calcularCotizacion(DATOS_EJEMPLO, respuestas((r) => {
      r.consumo.importe = 80_000;
      r.objetivo.bateriaId = "bat-5";
    }))!;
    expect(con.sistema.precio.total - sin.sistema.precio.total).toBe(2_800_000);
  });

  it("arma el mensaje de WhatsApp", () => {
    const c = calcularCotizacion(DATOS_EJEMPLO, respuestas((r) => (r.consumo.importe = 80_000)))!;
    expect(mensajeWhatsApp(c, "Ana")).toMatch(/^Hola, soy Ana\. Quiero un sistema solar de \d+,\d{2} kWp, \d+ paneles, en Córdoba, financiado en 48 cuotas/);
  });
});

describe("plazoValido", () => {
  it("toma el plazo más cercano", () => {
    expect(plazoValido([12, 24, 36], 30)).toBe(24);
    expect(plazoValido([12, 24, 36], 36)).toBe(36);
  });
});
