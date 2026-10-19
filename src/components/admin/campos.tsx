"use client";

import type { Campo, Opcion } from "@/lib/admin/entidades";
import { MESES } from "@/lib/solar";
import { numero, pesos } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Valor de un campo mientras se edita (los números se editan como texto con coma decimal). */
export type ValorForm = string | boolean | string[];

const aTexto = (n: unknown, dec = 2) => (n == null || n === "" ? "" : numero(Number(n), dec).replace(/\./g, ""));
const aNumero = (t: string): number | null => {
  const limpio = t.trim().replace(/\./g, "").replace(",", ".");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : NaN;
};

export function valoresIniciales(campos: readonly Campo[], fila: Record<string, unknown> | null): Record<string, ValorForm> {
  const v: Record<string, ValorForm> = {};
  for (const c of campos) {
    const x = fila?.[c.name];
    switch (c.tipo) {
      case "bool":
        v[c.name] = fila ? Boolean(x) : c.name.startsWith("activ");
        break;
      case "numero":
        v[c.name] = aTexto(x, c.decimales ?? 2);
        break;
      case "dinero":
        v[c.name] = aTexto(x, 2);
        break;
      case "pct":
        v[c.name] = x == null ? "" : aTexto(Number(x) * 100, (c.decimales ?? 1) + 2);
        break;
      case "plazos":
        v[c.name] = Array.isArray(x) ? x.join(", ") : "";
        break;
      case "hsp":
        v[c.name] = Array.isArray(x) ? x.map((h) => aTexto(h, 2)) : Array(12).fill("");
        break;
      case "fecha":
        v[c.name] = typeof x === "string" ? x.slice(0, 10) : fila ? "" : new Date().toISOString().slice(0, 10);
        break;
      case "color":
        v[c.name] = typeof x === "string" ? x : "#f59e0b";
        break;
      default:
        v[c.name] = x == null ? "" : String(x);
    }
  }
  return v;
}

/** Convierte los valores del formulario al formato que valida el servidor. */
export function aDatos(campos: readonly Campo[], valores: Record<string, ValorForm>): { datos: Record<string, unknown>; error?: string } {
  const datos: Record<string, unknown> = {};
  for (const c of campos) {
    const v = valores[c.name];
    const vacio = v === "" || (Array.isArray(v) && v.every((x) => x === ""));
    if (vacio && c.opcional) {
      datos[c.name] = null;
      continue;
    }
    switch (c.tipo) {
      case "numero":
      case "dinero":
      case "pct": {
        const n = aNumero(String(v));
        if (n == null || Number.isNaN(n)) return { datos, error: `${c.label}: ingresá un número` };
        datos[c.name] = c.tipo === "pct" ? n / 100 : n;
        break;
      }
      case "plazos": {
        const lista = String(v).split(/[,;\s]+/).filter(Boolean).map(Number);
        if (lista.some((n) => !Number.isInteger(n))) return { datos, error: `${c.label}: usá números enteros separados por coma` };
        datos[c.name] = [...new Set(lista)].sort((a, b) => a - b);
        break;
      }
      case "hsp": {
        const lista = (v as string[]).map((t) => aNumero(t));
        if (lista.some((n) => n == null || Number.isNaN(n))) return { datos, error: `${c.label}: completá los 12 meses` };
        datos[c.name] = lista;
        break;
      }
      default:
        datos[c.name] = v;
    }
  }
  return { datos };
}

const inputCls =
  "h-11 w-full rounded-xl border border-input bg-background/60 px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/25";

export function CampoInput({ campo: c, valor, onChange, opciones }: { campo: Campo; valor: ValorForm; onChange: (v: ValorForm) => void; opciones?: Opcion[] }) {
  const id = `campo-${c.name}`;
  const etiqueta = (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
      {c.label}
      {c.opcional && <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>}
    </label>
  );
  const ayuda = c.ayuda && <p className="mt-1 text-xs text-muted-foreground">{c.ayuda}</p>;

  switch (c.tipo) {
    case "bool":
      return (
        <label className="flex h-full min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-glass-border px-3 py-2 text-sm">
          <input type="checkbox" checked={valor as boolean} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--sun-2)]" />
          <span>
            {c.label}
            {c.ayuda && <span className="block text-xs text-muted-foreground">{c.ayuda}</span>}
          </span>
        </label>
      );
    case "select": {
      const ops = c.opciones ?? opciones ?? [];
      return (
        <div>
          {etiqueta}
          <select id={id} value={valor as string} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            <option value="">Elegí…</option>
            {ops.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {ayuda}
        </div>
      );
    }
    case "textarea":
      return (
        <div className="sm:col-span-2">
          {etiqueta}
          <textarea id={id} value={valor as string} onChange={(e) => onChange(e.target.value)} rows={3} className={cn(inputCls, "h-auto py-2")} />
          {ayuda}
        </div>
      );
    case "hsp":
      return (
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-medium">{c.label}</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {MESES.map((m, i) => (
              <label key={m} className="text-xs text-muted-foreground">
                {m}
                <input
                  inputMode="decimal"
                  value={(valor as string[])[i] ?? ""}
                  onChange={(e) => {
                    const nuevo = [...(valor as string[])];
                    nuevo[i] = e.target.value;
                    onChange(nuevo);
                  }}
                  className={cn(inputCls, "mt-1 px-2 text-center")}
                />
              </label>
            ))}
          </div>
          {ayuda}
        </div>
      );
    case "color":
      return (
        <div>
          {etiqueta}
          <div className="flex items-center gap-2">
            <input type="color" value={valor as string} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-input bg-transparent" />
            <input id={id} value={valor as string} onChange={(e) => onChange(e.target.value)} className={inputCls} />
          </div>
          {ayuda}
        </div>
      );
    default: {
      const tipoHtml = c.tipo === "fecha" ? "date" : c.tipo === "email" ? "email" : c.tipo === "url" ? "url" : "text";
      const numerico = c.tipo === "numero" || c.tipo === "dinero" || c.tipo === "pct";
      const prefijo = c.tipo === "dinero" ? "$" : null;
      const sufijo = c.tipo === "pct" ? "%" : c.tipo === "numero" ? c.sufijo : null;
      return (
        <div>
          {etiqueta}
          <div className="relative">
            {prefijo && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">{prefijo}</span>}
            <input
              id={id}
              type={tipoHtml}
              inputMode={numerico ? "decimal" : undefined}
              value={valor as string}
              onChange={(e) => onChange(e.target.value)}
              className={cn(inputCls, prefijo && "pl-7", sufijo && "pr-16")}
            />
            {sufijo && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">{sufijo}</span>}
          </div>
          {ayuda}
        </div>
      );
    }
  }
}

/** Formato de una celda en la tabla de listado. */
export function formatoCelda(c: Campo, v: unknown, opciones?: Opcion[]): string {
  if (v == null || v === "") return "—";
  switch (c.tipo) {
    case "dinero":
      return pesos(Number(v));
    case "pct":
      return `${numero(Number(v) * 100, c.decimales ?? 1)} %`;
    case "numero":
      return `${numero(Number(v), c.decimales ?? 2)}${c.sufijo ? ` ${c.sufijo}` : ""}`;
    case "bool":
      return v ? "Sí" : "No";
    case "select":
      return (c.opciones ?? opciones ?? []).find((o) => o.value === String(v))?.label ?? String(v);
    case "plazos":
      return (v as number[]).join(", ");
    case "hsp": {
      const xs = v as number[];
      return `${numero(xs.reduce((a, b) => a + b, 0) / xs.length, 1)} h/día prom.`;
    }
    case "fecha":
      return new Date(String(v)).toLocaleDateString("es-AR", { timeZone: "UTC" });
    default:
      return String(v);
  }
}
