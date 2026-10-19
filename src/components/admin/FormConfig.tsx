"use client";

import { useState, useTransition } from "react";
import { guardarConfig } from "@/app/admin/acciones";
import { aDatos, CampoInput, valoresIniciales, type ValorForm } from "@/components/admin/campos";
import { CAMPOS_CONFIG, type Campo } from "@/lib/admin/entidades";

/** Formulario de un grupo de campos de la fila única de Configuración. */
export function FormConfig({ grupo, titulo, descripcion, config }: { grupo: keyof typeof CAMPOS_CONFIG; titulo: string; descripcion?: string; config: Record<string, unknown> }) {
  const campos = CAMPOS_CONFIG[grupo] as readonly Campo[];
  const [valores, setValores] = useState<Record<string, ValorForm>>(() => valoresIniciales(campos, config));
  const [estado, setEstado] = useState<{ ok: boolean; texto: string } | null>(null);
  const [pendiente, iniciar] = useTransition();

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const { datos, error } = aDatos(campos, valores);
    if (error) return setEstado({ ok: false, texto: error });
    iniciar(async () => {
      const r = await guardarConfig(grupo, datos);
      setEstado(r.ok ? { ok: true, texto: "Cambios guardados." } : { ok: false, texto: r.error });
    });
  }

  return (
    <form onSubmit={guardar} className="glass rounded-3xl p-5 sm:p-6">
      <h2 className="text-xl font-semibold">{titulo}</h2>
      {descripcion && <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campos.map((c) => (
          <CampoInput key={c.name} campo={c} valor={valores[c.name]} onChange={(v) => setValores((x) => ({ ...x, [c.name]: v }))} />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pendiente} className="btn-sun h-10 rounded-full px-5 text-sm disabled:opacity-60">
          {pendiente ? "Guardando…" : "Guardar"}
        </button>
        {estado && (
          <p role={estado.ok ? "status" : "alert"} className={estado.ok ? "text-sm text-ahorro" : "text-sm text-destructive"}>
            {estado.texto}
          </p>
        )}
      </div>
    </form>
  );
}
