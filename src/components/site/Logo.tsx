import Link from "next/link";

export function Logo({ nombre = "Eco Lógica" }: { nombre?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <defs>
          <linearGradient id="logo-sun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--sun-1)" />
            <stop offset="1" stopColor="var(--sun-2)" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="13" r="6.5" fill="url(#logo-sun)" />
        <path d="M4 26 L10 18 H22 L28 26 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M13 18 L11.5 26 M19 18 L20.5 26 M7 22 H25" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      </svg>
      <span>{nombre}</span>
    </Link>
  );
}
