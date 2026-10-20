"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Proyecto } from "@/content/proyectos";
import { numero } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Galería a pantalla completa de un proyecto: flechas, teclado, deslizar en el celular y miniaturas. */
export function Galeria({ proyecto, onCerrar }: { proyecto: Proyecto; onCerrar: () => void }) {
  const [i, setI] = useState(0);
  const reducir = useReducedMotion();
  const cerrar = useRef<HTMLButtonElement>(null);
  const toque = useRef<number | null>(null);
  const n = proyecto.fotos.length;
  const ir = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  const foto = proyecto.fotos[i];

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
      previo?.focus();
    };
  }, [ir, onCerrar]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${proyecto.nombre}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/92 text-white backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs text-white/60">
            <span className="rounded-full bg-[var(--eco)]/25 px-2 py-0.5 font-medium text-[#a7e27a]">{numero(proyecto.kw, 1)} kW</span>
            {proyecto.tipo}
            {proyecto.localidad && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {proyecto.localidad}
              </span>
            )}
          </p>
          <h2 className="mt-1 truncate text-xl font-semibold sm:text-2xl">{proyecto.nombre}</h2>
          <p className="text-sm text-white/70">{foto.alt}</p>
        </div>
        <button ref={cerrar} type="button" onClick={onCerrar} aria-label="Cerrar galería" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X className="size-5" />
        </button>
      </div>

      <div
        className="relative flex-1"
        onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toque.current == null) return;
          const dx = e.changedTouches[0].clientX - toque.current;
          if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
          toque.current = null;
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={foto.src}
            initial={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 mx-4 sm:mx-20"
          >
            <Image src={foto.src} alt={foto.alt} fill sizes="100vw" className="object-contain" priority />
          </motion.div>
        </AnimatePresence>
        {n > 1 && (
          <>
            <button type="button" onClick={() => ir(-1)} aria-label="Foto anterior" className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-5">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => ir(1)} aria-label="Foto siguiente" className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-5">
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto p-4">
        {proyecto.fotos.map((f, k) => (
          <button
            key={f.src}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Ver foto ${k + 1} de ${n}`}
            aria-current={k === i}
            className={cn("relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition", k === i ? "ring-[var(--eco)]" : "opacity-50 ring-transparent hover:opacity-90")}
          >
            <Image src={f.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
