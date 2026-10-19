/**
 * Simulación de créditos (sistema francés, líneas en pesos o en UVA) y período de repago.
 * Módulo puro: las condiciones de cada línea llegan desde el panel admin.
 */

export const ALICUOTA_IVA = 0.21;

export interface LineaCredito {
  nombre: string;
  tna: number; // 0.45 = 45 %. En líneas UVA es la tasa sobre el capital en UVAs.
  tea?: number; // si no viene, se calcula desde la TNA
  cft?: number; // valor informado por el banco; si no viene, se calcula
  plazos: number[];
  montoMaximo: number;
  esUVA: boolean;
  ivaSobreIntereses: boolean;
}

export interface FilaAmortizacion {
  mes: number;
  cuota: number; // capital + interés
  capital: number;
  interes: number;
  iva: number;
  cuotaTotal: number; // cuota + IVA
  saldo: number;
}

export function teaDesdeTna(tna: number): number {
  return Math.pow(1 + tna / 12, 12) - 1;
}

/** cuota = P × i / (1 − (1 + i)^−n), con i = TNA / 12 */
export function cuotaFrancesa(capital: number, tna: number, n: number): number {
  if (n <= 0) throw new Error("El plazo debe ser mayor a 0");
  const i = tna / 12;
  if (i === 0) return capital / n;
  return (capital * i) / (1 - Math.pow(1 + i, -n));
}

export function tablaAmortizacion(capital: number, tna: number, n: number, opts: { ivaSobreIntereses?: boolean; alicuotaIva?: number } = {}): FilaAmortizacion[] {
  const i = tna / 12;
  const cuota = cuotaFrancesa(capital, tna, n);
  const alicuota = opts.ivaSobreIntereses ? opts.alicuotaIva ?? ALICUOTA_IVA : 0;
  let saldo = capital;
  const filas: FilaAmortizacion[] = [];
  for (let mes = 1; mes <= n; mes++) {
    const interes = saldo * i;
    const amortizado = mes === n ? saldo : cuota - interes; // la última cuota cierra el saldo exacto
    saldo = Math.max(0, saldo - amortizado);
    const iva = interes * alicuota;
    filas.push({ mes, cuota: amortizado + interes, capital: amortizado, interes, iva, cuotaTotal: amortizado + interes + iva, saldo });
  }
  return filas;
}

/**
 * CFT efectivo anual: TIR mensual de los flujos (monto recibido vs. pagos), anualizada.
 * Se resuelve por bisección, que converge siempre para flujos convencionales.
 */
export function cftAnual(montoRecibido: number, pagos: number[]): number {
  const vpn = (r: number) => pagos.reduce((acc, pago, k) => acc + pago / Math.pow(1 + r, k + 1), 0) - montoRecibido;
  let lo = 0;
  let hi = 1; // 100 % mensual
  if (vpn(lo) <= 0) return 0;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (vpn(mid) > 0) lo = mid;
    else hi = mid;
  }
  return Math.pow(1 + (lo + hi) / 2, 12) - 1;
}

export interface EntradaSimulacion {
  precioSistema: number;
  anticipo?: number;
  plazo: number;
  linea: LineaCredito;
  valorUVA?: number;
  /** Inflación mensual estimada para proyectar la cuota UVA en pesos (opcional). */
  inflacionMensualEstimada?: number;
}

export function simularCredito(e: EntradaSimulacion) {
  const { linea, plazo } = e;
  if (!linea.plazos.includes(plazo)) throw new Error(`El plazo ${plazo} no está habilitado para ${linea.nombre}`);

  const anticipo = Math.min(Math.max(0, e.anticipo ?? 0), e.precioSistema);
  const solicitado = e.precioSistema - anticipo;
  const montoFinanciado = Math.min(solicitado, linea.montoMaximo);
  const excedeMaximo = solicitado > linea.montoMaximo;

  let valorUVA = 1;
  if (linea.esUVA) {
    if (!e.valorUVA || e.valorUVA <= 0) throw new Error("Falta el valor UVA para una línea UVA");
    valorUVA = e.valorUVA;
  }
  // En UVA la tabla se arma en UVAs; en pesos, valorUVA = 1 y la tabla queda en pesos.
  const tabla = tablaAmortizacion(montoFinanciado / valorUVA, linea.tna, plazo, { ivaSobreIntereses: linea.ivaSobreIntereses });

  const infl = linea.esUVA ? e.inflacionMensualEstimada ?? 0 : 0;
  const cuotasEnPesos = tabla.map((f, k) => f.cuotaTotal * valorUVA * Math.pow(1 + infl, k + 1));
  const totalAPagar = cuotasEnPesos.reduce((a, b) => a + b, 0);

  return {
    montoFinanciado,
    anticipo,
    excedeMaximo,
    // Si el monto excede el máximo de la línea, la diferencia se suma al anticipo.
    anticipoNecesario: anticipo + (solicitado - montoFinanciado),
    plazo,
    esUVA: linea.esUVA,
    montoUVA: linea.esUVA ? montoFinanciado / valorUVA : null,
    cuotaUVA: linea.esUVA ? tabla[0].cuotaTotal : null,
    cuotaInicial: tabla[0].cuotaTotal * valorUVA,
    cuotasEnPesos,
    totalAPagar,
    tna: linea.tna,
    tea: linea.tea ?? teaDesdeTna(linea.tna),
    cft: linea.cft ?? cftAnual(montoFinanciado / valorUVA, tabla.map((f) => f.cuotaTotal)),
    tabla,
  };
}

export type SimulacionCredito = ReturnType<typeof simularCredito>;

/**
 * Mes (1-based) en que el ahorro acumulado supera lo pagado (anticipo + cuotas acumuladas).
 * Devuelve null si no ocurre dentro del horizonte de `ahorroMensual`.
 * Para el repago al contado: periodoRepago(precio, [], ahorro).
 */
export function periodoRepago(anticipo: number, cuotas: number[], ahorroMensual: number[]): number | null {
  let pagado = anticipo;
  let ahorrado = 0;
  for (let m = 0; m < ahorroMensual.length; m++) {
    pagado += cuotas[m] ?? 0;
    ahorrado += ahorroMensual[m];
    if (ahorrado >= pagado) return m + 1;
  }
  return null;
}

/** Serie para el gráfico "cuota vs. ahorro". */
export function comparativaCuotaAhorro(cuotas: number[], ahorroMensual: number[]) {
  let pagado = 0;
  let ahorrado = 0;
  return ahorroMensual.map((ahorro, m) => {
    const cuota = cuotas[m] ?? 0;
    pagado += cuota;
    ahorrado += ahorro;
    return { mes: m + 1, cuota, ahorro, pagadoAcumulado: pagado, ahorroAcumulado: ahorrado, neto: ahorro - cuota };
  });
}
