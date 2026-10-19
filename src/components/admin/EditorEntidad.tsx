"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { eliminarEntidad, guardarEntidad } from "@/app/admin/acciones";
import { aDatos, CampoInput, formatoCelda, valoresIniciales, type ValorForm } from "@/components/admin/campos";
import { ENTIDADES, type Campo, type EntidadId, type Opcion } from "@/lib/admin/entidades";
import { cn } from "@/lib/utils";

type Fila = Record<string, unknown> & { id: string };

/** Tabla + formulario para crear, editar y borrar registros de una entidad del panel. */
export function EditorEntidad({ entidad, filas, opciones = {} }: { entidad: EntidadId; filas: Fila[]; opciones?: Record<string, Opcion[]> }) {
  const def = ENTIDADES[entidad];
  const campos = def.campos as readonly Campo[];
  const columnas = campos.filter((c) => c.enTabla);
  const [editando, setEditando] = useState<Fila | "nuevo" | null>(null);
  const [valores, setValores] = useState<Record<string, ValorForm>>({});
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();

  function abrir(fila: Fila | "nuevo") {
    setEditando(fila);
    setValores(valoresIniciales(campos, fila === "nuevo" ? null : fila));
    setError(null);
    setAviso(null);
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const { datos, error } = aDatos(campos, valores);
    if (error) return setError(error);
    iniciar(async () => {
      const r = await guardarEntidad(entidad, editando === "nuevo" || !editando ? null : editando.id, datos);
      if (!r.ok) return setError(r.error);
      setEditando(null);
      setAviso("Cambios guardados. El cotizador ya usa los valores nuevos.");
    });
  }

  function borrar(fila: Fila) {
    if (!confirm(`¿Borrar este registro de ${def.titulo.toLowerCase()}? No se puede deshacer.`)) return;
    iniciar(async () => {
      const r = await eliminarEntidad(entidad, fila.id);
      setAviso(r.ok ? "Registro borrado." : null);
      setError(r.ok ? null : r.error);
      if (r.ok && editando !== "nuevo" && editando?.id === fila.id) setEditando(null);
    });
  }

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{def.titulo}</h2>
        <button type="button" onClick={() => abrir("nuevo")} className="btn-sun inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm">
          <Plus className="size-4" /> Agregar {def.singular}
        </button>
      </div>

      {aviso && !editando && (
        <p role="status" className="mt-4 rounded-xl bg-ahorro/10 p-3 text-sm">
          {aviso}
        </p>
      )}
      {error && !editando && (
        <p role="alert" className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {editando && (
        <form onSubmit={guardar} className="mt-5 rounded-2xl border border-primary/40 bg-primary/5 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editando === "nuevo" ? `Nueva ${def.singular}`.replace(/^Nueva (panel|inversor|usuario)/, "Nuevo $1") : `Editar ${def.singular}`}</h3>
            <button type="button" onClick={() => setEditando(null)} aria-label="Cancelar" className="grid size-8 place-items-center rounded-full hover:bg-secondary">
              <X className="size-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campos.map((c) => (
              <CampoInput key={c.name} campo={c} valor={valores[c.name]} opciones={opciones[c.name]} onChange={(v) => setValores((x) => ({ ...x, [c.name]: v }))} />
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={pendiente} className="btn-sun h-10 rounded-full px-5 text-sm disabled:opacity-60">
              {pendiente ? "Guardando…" : "Guardar"}
            </button>
            <button type="button" onClick={() => setEditando(null)} className="h-10 rounded-full border border-glass-border px-5 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-glass-border text-left text-xs text-muted-foreground">
              {columnas.map((c) => (
                <th key={c.name} className="px-3 py-2 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="w-24 px-3 py-2">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id} className={cn("border-b border-glass-border last:border-0", editando !== "nuevo" && editando?.id === f.id && "bg-primary/5")}>
                {columnas.map((c) => (
                  <td key={c.name} className={cn("px-3 py-2.5 tabular-nums", c.tipo !== "texto" && c.tipo !== "textarea" && c.tipo !== "plazos" && "whitespace-nowrap")}>
                    {formatoCelda(c, f[c.name], opciones[c.name])}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => abrir(f)} aria-label="Editar" className="grid size-8 place-items-center rounded-lg hover:bg-secondary">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" onClick={() => borrar(f)} disabled={pendiente} aria-label="Borrar" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="px-3 py-6 text-center text-muted-foreground">
                  Todavía no hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
