"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LivePanel } from "@/components/wizard/LivePanel";
import { PasoConsumo, PasoObjetivo, PasoTecho, PasoTipo, PasoUbicacion, type PropsPaso } from "@/components/wizard/pasos-entrada";
import { PasoContacto, PasoFinanciacion, PasoResultado } from "@/components/wizard/pasos-resultado";
import { SunProgress } from "@/components/wizard/SunProgress";
import { useWizardStore } from "@/hooks/useWizardStore";
import { calcularCotizacion } from "@/lib/cotizador";
import type { DatosCotizador } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const PASOS = ["Tipo", "Ubicación", "Consumo", "Techo", "Objetivo", "Resultado", "Financiación", "Contacto"];

export function Wizard({ datos, importeInicial, origen = "WEB" }: { datos: DatosCotizador; importeInicial?: number; origen?: "WEB" | "EMBED" }) {
  const store = useWizardStore(datos, importeInicial);
  const { paso, respuestas: r, actualizar, irA } = store;
  const reducir = useReducedMotion();
  const [direccion, setDireccion] = useState(1);
  const [maxAlcanzado, setMaxAlcanzado] = useState(0);
  const tarjeta = useRef<HTMLDivElement>(null);

  const res = useMemo(() => {
    try {
      return calcularCotizacion(datos, r);
    } catch {
      return null;
    }
  }, [datos, r]);

  useEffect(() => setMaxAlcanzado((m) => Math.max(m, paso)), [paso]);

  // Qué falta para poder avanzar desde cada paso.
  const faltante = (() => {
    if (paso === 1 && !datos.localidades.some((l) => l.id === r.localidadId)) return "Elegí tu localidad";
    if (paso === 2 && !res) return "Completá tu consumo para seguir";
    if (paso >= 3 && paso <= 6 && (!res || res.sistema.paneles === 0)) return "Revisá la superficie: no entra ningún panel";
    return null;
  })();

  function mover(destino: number) {
    setDireccion(destino > paso ? 1 : -1);
    irA(destino);
    // Vuelve arriba para que se vea el progreso y el título del paso nuevo.
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" }));
  }

  const props: PropsPaso = { datos, r, actualizar, res, siguiente: () => mover(paso + 1) };
  const contenido = [
    <PasoTipo key="0" {...props} />,
    <PasoUbicacion key="1" {...props} />,
    <PasoConsumo key="2" {...props} />,
    <PasoTecho key="3" {...props} />,
    <PasoObjetivo key="4" {...props} />,
    <PasoResultado key="5" {...props} />,
    <PasoFinanciacion key="6" {...props} />,
    <PasoContacto key="7" {...props} enviadoId={store.enviadoId} onEnviado={store.marcarEnviado} onReiniciar={() => (store.reiniciar(), setMaxAlcanzado(0))} origen={origen} />,
  ][paso];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-32 sm:px-6 lg:pb-16">
      <div className="mx-auto max-w-3xl">
        <SunProgress paso={paso} pasos={PASOS} onIr={(p) => p <= maxAlcanzado && mover(p)} maxAlcanzado={maxAlcanzado} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div ref={tarjeta} className="glass scroll-mt-24 overflow-hidden rounded-3xl">
          <div className={cn("p-5 sm:p-8", !store.listo && "opacity-0")}>
            <AnimatePresence mode="wait" initial={false} custom={direccion}>
              <motion.div
                key={paso}
                custom={direccion}
                initial={reducir ? { opacity: 0 } : { opacity: 0, x: 40 * direccion }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducir ? { opacity: 0 } : { opacity: 0, x: -40 * direccion }}
                transition={{ duration: reducir ? 0.1 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {contenido}
              </motion.div>
            </AnimatePresence>
          </div>

          {!(paso === 7 && store.enviadoId) && (
            <div className="flex items-center justify-between gap-3 border-t border-glass-border px-5 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => mover(paso - 1)}
                disabled={paso === 0}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-glass-border px-4 text-sm font-medium transition hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="size-4" /> Atrás
              </button>
              {faltante && <p className="hidden text-sm text-muted-foreground sm:block">{faltante}</p>}
              {paso < 7 && (
                <button
                  type="button"
                  onClick={() => mover(paso + 1)}
                  disabled={!!faltante}
                  className="btn-sun inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paso === 4 ? "Ver mi sistema" : paso === 5 ? "Ver financiación" : paso === 6 ? "Pedir presupuesto" : "Siguiente"} <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <LivePanel res={res} paso={paso} />
      </div>
    </div>
  );
}
