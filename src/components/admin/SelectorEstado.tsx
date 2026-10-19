"use client";

import { useState, useTransition } from "react";
import { actualizarLead } from "@/app/admin/acciones";
import { ESTADOS } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export function SelectorEstado({ id, estado }: { id: string; estado: string }) {
  const [actual, setActual] = useState(estado);
  const [pendiente, iniciar] = useTransition();
  const clase = ESTADOS.find((e) => e.id === actual)?.clase;
  return (
    <select
      aria-label="Estado del lead"
      value={actual}
      disabled={pendiente}
      onChange={(e) => {
        const nuevo = e.target.value;
        const anterior = actual;
        setActual(nuevo);
        iniciar(async () => {
          const r = await actualizarLead(id, { estado: nuevo });
          if (!r.ok) setActual(anterior);
        });
      }}
      className={cn("h-8 cursor-pointer rounded-full border-0 px-3 text-xs font-medium outline-none focus:ring-3 focus:ring-ring/40", clase)}
    >
      {ESTADOS.map((e) => (
        <option key={e.id} value={e.id} className="bg-popover text-foreground">
          {e.label}
        </option>
      ))}
    </select>
  );
}

export function NotasLead({ id, notas }: { id: string; notas: string }) {
  const [texto, setTexto] = useState(notas);
  const [guardado, setGuardado] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();
  return (
    <div>
      <label htmlFor="notas" className="mb-1.5 block text-sm font-medium">
        Notas internas
      </label>
      <textarea
        id="notas"
        rows={5}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setGuardado(null);
        }}
        className="w-full rounded-xl border border-input bg-background/60 p-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/25"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          disabled={pendiente}
          onClick={() => iniciar(async () => setGuardado((await actualizarLead(id, { notas: texto })).ok ? "Guardado" : "No se pudo guardar"))}
          className="h-9 rounded-full border border-glass-border px-4 text-sm hover:bg-secondary disabled:opacity-60"
        >
          Guardar notas
        </button>
        {guardado && <span className="text-sm text-muted-foreground">{guardado}</span>}
      </div>
    </div>
  );
}
