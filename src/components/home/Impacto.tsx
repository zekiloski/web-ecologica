"use client";

import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { KWH_POR_KWP_ANIO } from "@/content/sitio";
import { totalesProyectos } from "@/lib/proyectos";

/** Contador de impacto calculado a partir de los proyectos de content/proyectos.ts. */
export function Impacto({ factorCO2, kgPorArbol }: { factorCO2: number; kgPorArbol: number }) {
  const { cantidad, kw } = totalesProyectos();
  const mwhAnio = (kw * KWH_POR_KWP_ANIO) / 1000;
  const tCO2 = mwhAnio * factorCO2;
  const arboles = (tCO2 * 1000) / kgPorArbol;

  const items = [
    { valor: kw, unidad: "kW", texto: `instalados en ${cantidad} proyectos` },
    { valor: mwhAnio, unidad: "MWh", texto: "de energía limpia por año" },
    { valor: tCO2, unidad: "t CO₂", texto: "evitadas por año" },
    { valor: arboles, unidad: "árboles", texto: "equivalentes por año" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-eco/25 bg-eco/5">
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-eco opacity-15 blur-3xl" />
      <div className="relative grid grid-cols-2 lg:grid-cols-4">
        {items.map((i, k) => (
          <div key={i.unidad} className={k > 0 ? "border-eco/20 p-6 sm:p-8 lg:border-l" : "p-6 sm:p-8"}>
            <p className="font-heading text-4xl font-semibold sm:text-5xl">
              <AnimatedNumber value={i.valor} className="text-eco-grad" />
              <span className="ml-2 text-lg text-muted-foreground">{i.unidad}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{i.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
