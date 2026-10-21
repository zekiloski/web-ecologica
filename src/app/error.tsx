"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

/** Error general (por ejemplo, la base todavía no está configurada). */
export default function ErrorGeneral({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="max-w-md">
        <p className="font-heading text-6xl font-semibold text-sun">Uy.</p>
        <h1 className="mt-4 text-2xl font-semibold">No pudimos cargar la página</h1>
        <p className="mt-2 text-muted-foreground">Estamos actualizando la web. Probá de nuevo en unos minutos.</p>
        <button type="button" onClick={reset} className="btn-sun mt-6 inline-flex h-11 items-center gap-2 rounded-full px-5">
          <RotateCcw className="size-4" /> Reintentar
        </button>
        {error.digest && <p className="mt-6 text-xs text-muted-foreground">Código: {error.digest}</p>}
      </div>
    </main>
  );
}
