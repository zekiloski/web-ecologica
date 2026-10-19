"use client";

import { Check, Minus, Plus, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useId, useState, useEffect } from "react";
import { numero } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TituloPaso({ titulo, ayuda }: { titulo: string; ayuda?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold sm:text-4xl">{titulo}</h2>
      {ayuda && <p className="mt-2 text-muted-foreground">{ayuda}</p>}
    </div>
  );
}

/** Tarjeta grande seleccionable con ícono (reemplaza a los selects). */
export function OptionCard({
  icono: Icono,
  titulo,
  descripcion,
  seleccionada,
  onClick,
  compacta,
}: {
  icono?: LucideIcon;
  titulo: string;
  descripcion?: string;
  seleccionada: boolean;
  onClick: () => void;
  compacta?: boolean;
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={seleccionada}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5",
        compacta && "items-center p-3.5 sm:p-4",
        seleccionada ? "border-primary bg-primary/10" : "border-glass-border bg-glass hover:border-primary/50",
      )}
    >
      {Icono && (
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl transition-colors",
            compacta && "size-9",
            seleccionada ? "bg-sun text-[#1c1203]" : "bg-secondary text-foreground group-hover:text-primary",
          )}
        >
          <Icono className={compacta ? "size-4" : "size-5"} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{titulo}</span>
        {descripcion && <span className="mt-0.5 block text-sm text-muted-foreground">{descripcion}</span>}
      </span>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition",
          seleccionada ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
        aria-hidden
      >
        {seleccionada && <Check className="size-3" strokeWidth={3} />}
      </span>
    </motion.button>
  );
}

/** Campo numérico con separador de miles y prefijo/sufijo. */
export function NumberField({
  label,
  value,
  onChange,
  prefijo,
  sufijo,
  decimales = 0,
  placeholder,
  ayuda,
  grande,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  prefijo?: string;
  sufijo?: string;
  decimales?: number;
  placeholder?: string;
  ayuda?: string;
  grande?: boolean;
}) {
  const id = useId();
  const formatear = (v: number | null) => (v == null || v === 0 ? "" : numero(v, decimales));
  const [texto, setTexto] = useState(formatear(value));

  // Sincroniza si el valor cambia desde afuera (por ejemplo al restaurar el progreso).
  useEffect(() => {
    const actual = parsear(texto, decimales);
    if (actual !== value && !(actual == null && value === 0)) setTexto(formatear(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-input bg-background/60 px-3.5 transition focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/25",
          grande ? "h-16" : "h-12",
        )}
      >
        {prefijo && <span className="text-muted-foreground">{prefijo}</span>}
        <input
          id={id}
          inputMode={decimales ? "decimal" : "numeric"}
          autoComplete="off"
          placeholder={placeholder}
          value={texto}
          onChange={(e) => {
            const limpio = decimales ? e.target.value.replace(/[^\d,]/g, "") : e.target.value.replace(/\D/g, "");
            const n = parsear(limpio, decimales);
            // Mantiene la coma decimal mientras se escribe.
            setTexto(decimales && limpio.endsWith(",") ? limpio : n == null ? "" : numero(n, decimales));
            onChange(n);
          }}
          className={cn("w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground/50", grande && "font-heading text-2xl font-semibold")}
        />
        {sufijo && <span className="shrink-0 text-sm text-muted-foreground">{sufijo}</span>}
      </div>
      {ayuda && <p className="mt-1.5 text-xs text-muted-foreground">{ayuda}</p>}
    </div>
  );
}

function parsear(texto: string, decimales: number): number | null {
  const limpio = decimales ? texto.replace(/\./g, "").replace(",", ".") : texto.replace(/\D/g, "");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

/** Contador +/− para cantidades de equipos. */
export function Stepper({ label, value, onChange, icono: Icono }: { label: string; value: number; onChange: (v: number) => void; icono?: LucideIcon }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border p-3 transition", value > 0 ? "border-primary/60 bg-primary/5" : "border-glass-border")}>
      {Icono && <Icono className={cn("size-5 shrink-0", value > 0 ? "text-primary" : "text-muted-foreground")} />}
      <span className="flex-1 text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Quitar ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="grid size-8 place-items-center rounded-lg bg-secondary disabled:opacity-40"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-7 text-center font-semibold tabular-nums" aria-live="polite">
          {value}
        </span>
        <button type="button" aria-label={`Agregar ${label}`} onClick={() => onChange(value + 1)} className="grid size-8 place-items-center rounded-lg bg-secondary">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Grupo de chips (plazos, etc.). */
export function Chips<T extends string | number>({
  opciones,
  valor,
  onChange,
  etiqueta,
  render,
}: {
  opciones: T[];
  valor: T;
  onChange: (v: T) => void;
  etiqueta: string;
  render?: (v: T) => string;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={String(o)}
          type="button"
          role="radio"
          aria-checked={o === valor}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            o === valor ? "border-primary bg-sun text-[#1c1203]" : "border-glass-border hover:border-primary/50",
          )}
        >
          {render ? render(o) : String(o)}
        </button>
      ))}
    </div>
  );
}
