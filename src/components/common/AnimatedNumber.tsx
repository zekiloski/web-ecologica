"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { numero, pct, pesos } from "@/lib/format";

const FORMATOS = {
  pesos,
  numero: (x: number) => numero(x),
  decimal1: (x: number) => numero(x, 1),
  decimal2: (x: number) => numero(x, 2),
  pct: (x: number) => pct(x),
} as const;

export type FormatoNumero = keyof typeof FORMATOS;

/** Número que cuenta hacia arriba al entrar en pantalla y anima entre valores. */
export function AnimatedNumber({ value, formato = "numero", className }: { value: number; formato?: FormatoNumero; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-40px" });
  const reducir = useReducedMotion();
  const anterior = useRef(0);
  // Arranca siempre en 0 para que el HTML del servidor y el del navegador coincidan.
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    if (reducir) {
      setMostrado(value);
      anterior.current = value;
      return;
    }
    if (!visto) return;
    const control = animate(anterior.current, value, {
      duration: anterior.current === 0 ? 1.2 : 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setMostrado,
    });
    anterior.current = value;
    return () => control.stop();
  }, [value, visto, reducir]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {FORMATOS[formato](mostrado)}
    </span>
  );
}
