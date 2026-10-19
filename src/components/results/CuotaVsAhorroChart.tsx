"use client";

import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pesos, pesosCorto } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Punto {
  mes: number;
  cuota: number;
  ahorro: number;
  pagadoAcumulado: number;
  ahorroAcumulado: number;
}

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--glass-border)", borderRadius: 12, color: "var(--foreground)" };
const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

/** Cuota mensual vs. ahorro mensual, y la vista acumulada con el mes de repago resaltado. */
export function CuotaVsAhorroChart({ datos, anticipo, repago }: { datos: Punto[]; anticipo: number; repago: number | null }) {
  const [vista, setVista] = useState<"mensual" | "acumulado">("mensual");
  const serie = datos.map((d) => ({ ...d, pagadoAcumulado: d.pagadoAcumulado + anticipo }));

  return (
    <div>
      <div role="tablist" aria-label="Vista del gráfico" className="mb-4 inline-flex rounded-full border border-glass-border p-1 text-sm">
        {(["mensual", "acumulado"] as const).map((v) => (
          <button
            key={v}
            role="tab"
            type="button"
            aria-selected={vista === v}
            onClick={() => setVista(v)}
            className={cn("rounded-full px-4 py-1.5 transition", vista === v ? "bg-secondary font-medium" : "text-muted-foreground")}
          >
            {v === "mensual" ? "Por mes" : "Acumulado"}
          </button>
        ))}
      </div>
      <div className="h-72 w-full" role="img" aria-label={vista === "mensual" ? "Cuota mensual comparada con el ahorro mensual" : "Total pagado comparado con el ahorro acumulado"}>
        <ResponsiveContainer>
          <ComposedChart data={serie} margin={{ top: 16, right: 8, left: -4, bottom: 0 }}>
            <defs>
              <linearGradient id="area-ahorro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--ahorro)" stopOpacity={0.45} />
                <stop offset="1" stopColor="var(--ahorro)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--glass-border)" />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={tick} tickFormatter={(m) => (m % 12 === 0 ? `Año ${m / 12}` : "")} interval={0} minTickGap={0} />
            <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={pesosCorto} width={64} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(m) => `Mes ${m}`}
              formatter={(v, nombre) => {
                const etiquetas: Record<string, string> = {
                  cuota: "Cuota",
                  ahorro: "Ahorro en la factura",
                  pagadoAcumulado: "Total pagado",
                  ahorroAcumulado: "Ahorro acumulado",
                };
                return [pesos(Number(v)), etiquetas[String(nombre)] ?? String(nombre)];
              }}
            />
            {vista === "mensual" ? (
              <>
                <Area dataKey="ahorro" type="monotone" stroke="var(--ahorro)" strokeWidth={2} fill="url(#area-ahorro)" />
                <Line dataKey="cuota" type="stepAfter" stroke="var(--sun-2)" strokeWidth={2.5} dot={false} />
              </>
            ) : (
              <>
                <Area dataKey="ahorroAcumulado" type="monotone" stroke="var(--ahorro)" strokeWidth={2} fill="url(#area-ahorro)" />
                <Line dataKey="pagadoAcumulado" type="monotone" stroke="var(--sun-2)" strokeWidth={2.5} dot={false} />
                {repago && (
                  <ReferenceLine
                    x={repago}
                    stroke="var(--sun-1)"
                    strokeDasharray="4 4"
                    label={{ value: `Repago: mes ${repago}`, position: "insideTopLeft", fill: "var(--foreground)", fontSize: 12 }}
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[var(--sun-2)]" /> {vista === "mensual" ? "Cuota del crédito" : "Total pagado (anticipo + cuotas)"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-[var(--ahorro)]/50" /> {vista === "mensual" ? "Ahorro en la factura" : "Ahorro acumulado"}
        </span>
      </div>
    </div>
  );
}
