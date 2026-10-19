import type { FilaAmortizacion } from "@/lib/credito";
import { numero, pesos } from "@/lib/format";

/** Tabla de amortización. En líneas UVA los montos de la tabla están en UVAs. */
export function AmortizacionTable({ filas, esUVA, valorUVA }: { filas: FilaAmortizacion[]; esUVA: boolean; valorUVA: number }) {
  const fmt = (x: number) => (esUVA ? numero(x, 2) : pesos(x));
  const conIva = filas.some((f) => f.iva > 0);
  return (
    <details className="group rounded-2xl border border-glass-border">
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium marker:hidden">
        <span className="group-open:hidden">Ver tabla de amortización ({filas.length} cuotas)</span>
        <span className="hidden group-open:inline">Ocultar tabla de amortización</span>
      </summary>
      <div className="max-h-96 overflow-auto border-t border-glass-border">
        <table className="w-full text-right text-sm tabular-nums">
          <caption className="px-5 py-2 text-left text-xs text-muted-foreground">
            {esUVA ? `Valores en UVA. Al valor de hoy (1 UVA = ${pesos(valorUVA)}); en pesos se ajustan con la inflación.` : "Valores en pesos."}
          </caption>
          <thead className="sticky top-0 bg-popover text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Mes</th>
              <th className="px-3 py-2 font-medium">Capital</th>
              <th className="px-3 py-2 font-medium">Interés</th>
              {conIva && <th className="px-3 py-2 font-medium">IVA</th>}
              <th className="px-3 py-2 font-medium">Cuota</th>
              <th className="px-3 py-2 font-medium">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.mes} className="border-t border-glass-border">
                <td className="px-3 py-1.5 text-left">{f.mes}</td>
                <td className="px-3 py-1.5">{fmt(f.capital)}</td>
                <td className="px-3 py-1.5">{fmt(f.interes)}</td>
                {conIva && <td className="px-3 py-1.5">{fmt(f.iva)}</td>}
                <td className="px-3 py-1.5 font-medium">{fmt(f.cuotaTotal)}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{fmt(f.saldo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
