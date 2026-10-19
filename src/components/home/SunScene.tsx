/** Ilustración del hero: sol con rayos, reflejo que recorre los paneles. Solo CSS, respeta reduced-motion. */
export function SunScene({ className }: { className?: string }) {
  const filas = 3;
  const cols = 5;
  return (
    <svg viewBox="0 0 480 400" className={className} role="img" aria-label="Sol iluminando un techo con paneles solares">
      <defs>
        <radialGradient id="sun-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.45" stopColor="var(--sun-1)" />
          <stop offset="1" stopColor="var(--sun-2)" />
        </radialGradient>
        <radialGradient id="sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--sun-1)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--sun-2)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panel-cell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#0b1534" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="panels-clip">
          <polygon points="70,330 150,200 430,200 410,330" />
        </clipPath>
      </defs>

      {/* Sol */}
      <g transform="translate(330 110)">
        <circle r="120" fill="url(#sun-glow)" className="anim-sun-pulse" />
        <g className="anim-rays" opacity="0.6">
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x="-2" y="-96" width="4" height="22" rx="2" fill="var(--sun-1)" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle r="54" fill="url(#sun-core)" />
      </g>

      {/* Haz de luz */}
      <polygon points="300,150 360,150 410,200 150,200" fill="var(--sun-1)" opacity="0.08" />

      {/* Techo con paneles en perspectiva */}
      <g>
        <polygon points="50,340 140,190 440,190 425,340" fill="var(--card)" stroke="var(--glass-border)" strokeWidth="2" />
        {Array.from({ length: filas * cols }, (_, k) => {
          const f = Math.floor(k / cols);
          const c = k % cols;
          // Interpolación sobre el trapecio
          const y0 = 205 + f * 42;
          const y1 = y0 + 36;
          const lerpX = (y: number, t: number) => {
            const izq = 150 - ((y - 200) / 130) * 80;
            const der = 430 - ((y - 200) / 130) * 20;
            return izq + (der - izq) * t;
          };
          const t0 = c / cols + 0.008;
          const t1 = (c + 1) / cols - 0.008;
          const pts = [
            [lerpX(y0, t0), y0],
            [lerpX(y0, t1), y0],
            [lerpX(y1, t1), y1],
            [lerpX(y1, t0), y1],
          ];
          return <polygon key={k} points={pts.map((p) => p.join(",")).join(" ")} fill="url(#panel-cell)" stroke="#3b5bdb" strokeOpacity="0.35" strokeWidth="1" />;
        })}
        <g clipPath="url(#panels-clip)">
          <rect x="40" y="190" width="140" height="160" fill="url(#shine)" className="anim-shine" />
        </g>
      </g>

      {/* Casa */}
      <rect x="70" y="340" width="340" height="44" rx="4" fill="var(--secondary)" />
      <rect x="120" y="352" width="34" height="32" rx="3" fill="var(--sun-1)" opacity="0.35" />
      <rect x="300" y="352" width="60" height="22" rx="3" fill="var(--sun-1)" opacity="0.25" />
    </svg>
  );
}
