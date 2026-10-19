"use client";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BalanceMes } from "@/lib/solar";
import { numero } from "@/lib/format";

export function GeneracionChart({ balance }: { balance: BalanceMes[] }) {
  const data = balance.map((b) => ({ mes: b.mes, generacion: Math.round(b.generacionKwh), consumo: Math.round(b.consumoKwh) }));
  return (
    <div className="h-64 w-full" role="img" aria-label="Generación estimada por mes comparada con el consumo">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="barra-gen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sun-1)" />
              <stop offset="1" stopColor="var(--sun-2)" stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--glass-border)" />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(v) => numero(v)} width={56} />
          <Tooltip
            cursor={{ fill: "var(--glass-border)" }}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--glass-border)", borderRadius: 12, color: "var(--foreground)" }}
            formatter={(v, nombre) => [`${numero(Number(v))} kWh`, nombre === "generacion" ? "Generación" : "Consumo"]}
          />
          <Bar dataKey="generacion" fill="url(#barra-gen)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Line dataKey="consumo" stroke="var(--foreground)" strokeOpacity={0.6} strokeDasharray="5 5" dot={false} strokeWidth={2} type="monotone" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
