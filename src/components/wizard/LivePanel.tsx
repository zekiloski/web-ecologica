"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import type { ResultadoCotizacion } from "@/lib/cotizador";
import { numero, pesos } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Fila {
  label: string;
  valor: React.ReactNode;
  desde: number; // paso a partir del cual se muestra
  ahorro?: boolean;
}

function filas(res: ResultadoCotizacion | null): Fila[] {
  if (!res) return [];
  const s = res.sistema;
  return [
    { label: "Consumo", valor: <><AnimatedNumber value={res.consumoMensualKwh} /> kWh/mes</>, desde: 2 },
    { label: "Potencia", valor: <><AnimatedNumber value={s.kwpReal} formato="decimal2" /> kWp</>, desde: 2 },
    { label: "Paneles", valor: <AnimatedNumber value={s.paneles} />, desde: 2 },
    { label: "Ahorro por mes", valor: <AnimatedNumber value={s.ahorroMensualPromedio} formato="pesos" />, desde: 2, ahorro: true },
    { label: "Precio estimado", valor: <AnimatedNumber value={s.precio.total} formato="pesos" />, desde: 4 },
    ...(res.credito ? [{ label: `Cuota (${res.credito.plazo} meses)`, valor: <AnimatedNumber value={res.credito.cuotaInicial} formato="pesos" />, desde: 6 }] : []),
  ];
}

/** Panel lateral "tu sistema en vivo" (escritorio) y barra inferior desplegable (celular). */
export function LivePanel({ res, paso }: { res: ResultadoCotizacion | null; paso: number }) {
  const visibles = filas(res).filter((f) => paso >= f.desde);
  const [abierto, setAbierto] = useState(false);

  const lista = (
    <dl className="space-y-3">
      <AnimatePresence initial={false}>
        {visibles.map((f) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-baseline justify-between gap-3 border-b border-glass-border pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-sm text-muted-foreground">{f.label}</dt>
            <dd className={cn("font-heading text-lg font-semibold tabular-nums", f.ahorro && "text-ahorro")}>{f.valor}</dd>
          </motion.div>
        ))}
      </AnimatePresence>
    </dl>
  );

  return (
    <>
      <aside className="glass sticky top-24 hidden rounded-3xl p-6 lg:block" aria-label="Tu sistema en vivo">
        <p className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ahorro opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-ahorro" />
          </span>
          Tu sistema en vivo
        </p>
        <div className="mt-5">{visibles.length ? lista : <p className="text-sm text-muted-foreground">A medida que respondas, acá vas a ver tu sistema, el ahorro y la cuota.</p>}</div>
      </aside>

      {/* Celular: barra fija abajo */}
      {res && paso >= 2 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-glass-border bg-background/90 backdrop-blur-xl lg:hidden">
          <button type="button" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} className="flex w-full items-center gap-3 px-4 py-3 pr-20 text-left">
            <span className="flex-1 text-sm">
              <span className="font-semibold">{numero(res.sistema.kwpReal, 2)} kWp</span>
              <span className="text-muted-foreground"> · {res.sistema.paneles} paneles · </span>
              <span className="font-semibold text-ahorro">{pesos(res.sistema.ahorroMensualPromedio)}/mes</span>
            </span>
            <ChevronUp className={cn("size-4 transition", abierto && "rotate-180")} />
          </button>
          <AnimatePresence>
            {abierto && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4">{lista}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
