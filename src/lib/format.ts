const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const num = (dec: number) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: dec, minimumFractionDigits: 0 });

export const pesos = (x: number) => ars.format(Math.round(x));
export const numero = (x: number, dec = 0) => num(dec).format(x);
export const kwh = (x: number) => `${numero(x)} kWh`;
export const kwp = (x: number) => `${numero(x, 2)} kWp`;
export const pct = (x: number, dec = 0) => `${numero(x * 100, dec)} %`;

/** Formato compacto para gráficos: $1,2 M, $350 k. */
export function pesosCorto(x: number) {
  const abs = Math.abs(x);
  if (abs >= 1e6) return `$${numero(x / 1e6, 1)} M`;
  if (abs >= 1e3) return `$${numero(x / 1e3, 0)} k`;
  return `$${numero(x)}`;
}

export function meses(n: number) {
  if (n < 12) return `${n} ${n === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(n / 12);
  const resto = n % 12;
  return `${anios} ${anios === 1 ? "año" : "años"}${resto ? ` y ${resto} ${resto === 1 ? "mes" : "meses"}` : ""}`;
}
