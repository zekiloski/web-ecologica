"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Galeria } from "@/components/proyectos/Galeria";
import { ProyectoCard } from "@/components/proyectos/ProyectoCard";
import { PROYECTOS, type Proyecto } from "@/content/proyectos";
import { SEGMENTO_LABEL } from "@/lib/admin/leads";
import { SEGMENTOS, type Segmento } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Filtro = Segmento | "TODOS";

/**
 * Proyectos con filtro por tipo de cliente y galería.
 * "carrusel" (home): destacados primero, deslizable. "grilla" (página /proyectos): todos.
 */
export function ProyectosExplorer({ modo }: { modo: "carrusel" | "grilla" }) {
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [abierto, setAbierto] = useState<Proyecto | null>(null);
  const pista = useRef<HTMLDivElement>(null);

  const lista = useMemo(() => {
    const base = filtro === "TODOS" ? PROYECTOS : PROYECTOS.filter((p) => p.segmento === filtro);
    const ordenada = [...base].sort((a, b) => b.kw - a.kw);
    if (modo === "carrusel" && filtro === "TODOS") return [...ordenada.filter((p) => p.destacado), ...ordenada.filter((p) => !p.destacado)].slice(0, 12);
    return modo === "carrusel" ? ordenada.slice(0, 12) : ordenada;
  }, [filtro, modo]);

  const cuenta = (s: Filtro) => (s === "TODOS" ? PROYECTOS.length : PROYECTOS.filter((p) => p.segmento === s).length);
  const mover = (dir: 1 | -1) => pista.current?.scrollBy({ left: dir * pista.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Filtrar proyectos por tipo de cliente" className="flex flex-wrap gap-2">
          {(["TODOS", ...SEGMENTOS] as Filtro[]).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={filtro === s}
              onClick={() => {
                setFiltro(s);
                pista.current?.scrollTo({ left: 0 });
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                filtro === s ? "border-transparent bg-eco text-white" : "border-glass-border text-muted-foreground hover:border-eco/60 hover:text-foreground",
              )}
            >
              {s === "TODOS" ? "Todos" : SEGMENTO_LABEL[s]} <span className="opacity-70">{cuenta(s)}</span>
            </button>
          ))}
        </div>
        {modo === "carrusel" && (
          <div className="flex gap-2">
            <button type="button" onClick={() => mover(-1)} aria-label="Anteriores" className="grid size-10 place-items-center rounded-full border border-glass-border hover:bg-secondary">
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Siguientes" className="grid size-10 place-items-center rounded-full border border-glass-border hover:bg-secondary">
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {modo === "carrusel" ? (
        <div ref={pista} className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {lista.map((p, k) => (
            <ProyectoCard key={p.slug} proyecto={p} onAbrir={() => setAbierto(p)} prioridad={k < 2} className="w-[82%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, k) => (
            <ProyectoCard key={p.slug} proyecto={p} onAbrir={() => setAbierto(p)} prioridad={k < 3} />
          ))}
        </div>
      )}

      <AnimatePresence>{abierto && <Galeria proyecto={abierto} onCerrar={() => setAbierto(null)} />}</AnimatePresence>
    </div>
  );
}
