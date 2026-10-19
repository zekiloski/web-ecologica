"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Techo visto desde arriba con los paneles calculados dibujados en grilla. */
export function RoofGrid({ paneles, panelesMax }: { paneles: number; panelesMax: number | null }) {
  const reducir = useReducedMotion();
  const total = Math.max(paneles, panelesMax ?? 0, 1);
  const cols = Math.max(2, Math.min(24, Math.ceil(Math.sqrt(total * 2.4))));
  const filas = Math.ceil(total / cols);
  const pw = 20;
  const ph = 34;
  const gap = 4;
  const pad = 16;
  const W = pad * 2 + cols * pw + (cols - 1) * gap;
  const H = pad * 2 + filas * ph + (filas - 1) * gap;
  const animar = !reducir && paneles <= 150;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="max-h-72 w-full" role="img" aria-label={`Vista del techo con ${paneles} paneles`}>
      <defs>
        <linearGradient id="celda" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2546a8" />
          <stop offset="1" stopColor="#0c1838" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="10" fill="var(--secondary)" stroke="var(--glass-border)" strokeWidth="2" strokeDasharray={panelesMax != null ? "0" : "6 5"} />
      {Array.from({ length: total }, (_, k) => {
        const x = pad + (k % cols) * (pw + gap);
        const y = pad + Math.floor(k / cols) * (ph + gap);
        const activo = k < paneles;
        if (!activo) return <rect key={k} x={x} y={y} width={pw} height={ph} rx="2" fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.25" strokeDasharray="3 3" />;
        return (
          <motion.g
            key={k}
            initial={animar ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animar ? k * 0.025 : 0, duration: 0.3 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={x} y={y} width={pw} height={ph} rx="2" fill="url(#celda)" stroke="#5b7cff" strokeOpacity="0.5" />
            <line x1={x} x2={x + pw} y1={y + ph / 3} y2={y + ph / 3} stroke="#5b7cff" strokeOpacity="0.3" />
            <line x1={x} x2={x + pw} y1={y + (2 * ph) / 3} y2={y + (2 * ph) / 3} stroke="#5b7cff" strokeOpacity="0.3" />
            <line x1={x + pw / 2} x2={x + pw / 2} y1={y} y2={y + ph} stroke="#5b7cff" strokeOpacity="0.3" />
          </motion.g>
        );
      })}
    </svg>
  );
}
