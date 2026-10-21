"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Barra de progreso con forma de recorrido del sol: amanece en el paso 1 y se pone en el último. */
export function SunProgress({ paso, pasos, onIr, maxAlcanzado }: { paso: number; pasos: string[]; onIr: (p: number) => void; maxAlcanzado: number }) {
  const reducir = useReducedMotion();
  const W = 600;
  const H = 120;
  const cx = W / 2;
  const base = 104;
  const rx = 270;
  const ry = 84;
  const enAngulo = (t: number) => ({ x: cx - rx * Math.cos(Math.PI * t), y: base - ry * Math.sin(Math.PI * t) });
  // Posición por fracción del largo del arco, para que el sol coincida con el trazo pintado.
  const punto = (f: number) => {
    const N = 120;
    const pts = Array.from({ length: N + 1 }, (_, i) => enAngulo(i / N));
    const acum = [0];
    for (let i = 1; i <= N; i++) acum.push(acum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const objetivo = f * acum[N];
    const i = Math.max(1, acum.findIndex((a) => a >= objetivo));
    const k = (objetivo - acum[i - 1]) / (acum[i] - acum[i - 1] || 1);
    // Redondeo para que servidor y navegador generen exactamente el mismo SVG.
    const r2 = (v: number) => Math.round(v * 100) / 100;
    return { x: r2(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k), y: r2(pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k) };
  };
  const n = pasos.length - 1;
  const sol = punto(paso / n);
  const arco = `M ${cx - rx} ${base} A ${rx} ${ry} 0 0 1 ${cx + rx} ${base}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block max-h-[min(8rem,20dvh)] w-full" aria-hidden>
        <defs>
          <linearGradient id="arco-sol" x1="0" x2="1">
            <stop offset="0" stopColor="var(--sun-1)" />
            <stop offset="1" stopColor="var(--sun-2)" />
          </linearGradient>
          <radialGradient id="halo-sol">
            <stop offset="0" stopColor="var(--sun-1)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--sun-1)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="10" x2={W - 10} y1={base} y2={base} stroke="var(--glass-border)" strokeWidth="2" />
        <path d={arco} fill="none" stroke="var(--glass-border)" strokeWidth="2" strokeDasharray="4 6" />
        <motion.path
          d={arco}
          fill="none"
          stroke="url(#arco-sol)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          initial={false}
          animate={{ strokeDashoffset: 1 - paso / n }}
          transition={{ duration: reducir ? 0 : 0.6, ease: "easeInOut" }}
        />
        {pasos.map((_, i) => {
          const p = punto(i / n);
          return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={i <= paso ? "var(--sun-1)" : "var(--muted-foreground)"} opacity={i <= paso ? 1 : 0.35} />;
        })}
        <motion.g initial={false} animate={{ x: sol.x, y: sol.y }} transition={{ duration: reducir ? 0 : 0.6, ease: "easeInOut" }}>
          <circle r="26" fill="url(#halo-sol)" />
          <circle r="11" fill="url(#arco-sol)" />
        </motion.g>
      </svg>
      <ol className="mt-1 hidden grid-cols-8 gap-1 text-center text-xs sm:grid">
        {pasos.map((nombre, i) => (
          <li key={nombre}>
            <button
              type="button"
              onClick={() => onIr(i)}
              disabled={i > maxAlcanzado}
              aria-current={i === paso ? "step" : undefined}
              className={i === paso ? "font-semibold text-foreground" : i <= maxAlcanzado ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40"}
            >
              {nombre}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-1 text-center text-sm text-muted-foreground sm:hidden">
        Paso {paso + 1} de {pasos.length} · <span className="font-medium text-foreground">{pasos[paso]}</span>
      </p>
    </div>
  );
}
