"use client";

import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { CASOS, KWH_POR_KWP_ANIO } from "@/content/sitio";

/** Contador de impacto calculado a partir de los proyectos cargados en content/sitio.ts. */
export function Impacto({ factorCO2, kgPorArbol }: { factorCO2: number; kgPorArbol: number }) {
  const kw = CASOS.reduce((a, c) => a + c.kw, 0);
  const mwhAnio = (kw * KWH_POR_KWP_ANIO) / 1000;
  const tCO2 = mwhAnio * factorCO2;
  const arboles = (tCO2 * 1000) / kgPorArbol;

  const items = [
    { valor: kw, unidad: "kW", texto: "instalados en los proyectos destacados" },
    { valor: mwhAnio, unidad: "MWh", texto: "de energía limpia por año" },
    { valor: tCO2, unidad: "t CO₂", texto: "evitadas por año" },
    { valor: arboles, unidad: "árboles", texto: "equivalentes plantados" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-glass-border bg-glass-border lg:grid-cols-4">
      {items.map((i) => (
        <div key={i.unidad} className="bg-background p-6 sm:p-8">
          <p className="font-heading text-4xl font-semibold sm:text-5xl">
            <AnimatedNumber value={i.valor} className="text-sun" />
            <span className="ml-2 text-lg text-muted-foreground">{i.unidad}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{i.texto}</p>
        </div>
      ))}
    </div>
  );
}
