"use client";

import { ArrowLeft, ArrowRight, Factory, Sprout } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CASOS } from "@/content/sitio";
import { cn } from "@/lib/utils";

/** Carrusel con scroll-snap: deslizable en el celular y con flechas en escritorio. */
export function Casos() {
  const pista = useRef<HTMLDivElement>(null);
  const mover = (dir: 1 | -1) => pista.current?.scrollBy({ left: dir * pista.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        <button type="button" onClick={() => mover(-1)} aria-label="Anterior" className="grid size-10 place-items-center rounded-full border border-glass-border hover:bg-secondary">
          <ArrowLeft className="size-4" />
        </button>
        <button type="button" onClick={() => mover(1)} aria-label="Siguiente" className="grid size-10 place-items-center rounded-full border border-glass-border hover:bg-secondary">
          <ArrowRight className="size-4" />
        </button>
      </div>
      <div ref={pista} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {CASOS.map((c, i) => (
          <article key={c.titulo} className={cn("glass relative flex min-h-80 w-[85%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl p-6 sm:w-[46%] lg:w-[38%]")}>
            <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", c.tono)} />
            <PanelesDecor filas={i === 0 ? 4 : 2} />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-xs">
                {i === 0 ? <Factory className="size-3.5" /> : <Sprout className="size-3.5" />}
                {c.segmento}
              </span>
            </div>
            <div className="relative">
              <p className="font-heading text-6xl font-semibold">
                {c.kw}
                <span className="ml-1 text-2xl text-muted-foreground">kW</span>
              </p>
              <h3 className="mt-2 text-xl font-semibold">{c.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.descripcion}</p>
            </div>
          </article>
        ))}
        <article className="flex min-h-80 w-[85%] shrink-0 snap-start flex-col justify-center rounded-3xl border border-dashed border-primary/40 p-6 sm:w-[46%] lg:w-[38%]">
          <p className="font-heading text-3xl font-semibold">Tu proyecto puede ser el próximo.</p>
          <p className="mt-2 text-muted-foreground">Cotizalo en 3 minutos y vé cuánto ahorrás desde el primer mes.</p>
          <Link href="/cotizador" className="btn-sun mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3">
            Cotizar ahora <ArrowRight className="size-4" />
          </Link>
        </article>
      </div>
    </div>
  );
}

function PanelesDecor({ filas }: { filas: number }) {
  return (
    <div className="pointer-events-none absolute -top-4 -right-6 grid rotate-[-8deg] grid-cols-5 gap-1 opacity-50" aria-hidden>
      {Array.from({ length: filas * 5 }, (_, k) => (
        <div key={k} className="h-9 w-6 rounded-sm border border-blue-400/30 bg-gradient-to-br from-blue-800 to-blue-950" />
      ))}
    </div>
  );
}
