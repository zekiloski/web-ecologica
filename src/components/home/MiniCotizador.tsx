"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { calcularCotizacion } from "@/lib/cotizador";
import { numero } from "@/lib/format";
import { respuestasIniciales, type DatosCotizador } from "@/lib/schemas";

/** Un solo campo: cuánto pagás de luz. Muestra el ahorro al instante y lleva al wizard completo. */
export function MiniCotizador({ datos }: { datos: DatosCotizador }) {
  const [texto, setTexto] = useState("");
  const importe = Number(texto.replace(/\D/g, "")) || 0;

  const res = useMemo(() => {
    if (importe < 10_000) return null;
    const r = respuestasIniciales(datos);
    r.consumo.importe = importe;
    return calcularCotizacion(datos, r);
  }, [datos, importe]);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <label htmlFor="mini-importe" className="block text-sm font-medium text-muted-foreground">
        ¿Cuánto pagás de luz por mes?
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-input bg-background/60 px-4 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/25">
        <span className="font-heading text-2xl text-muted-foreground">$</span>
        <input
          id="mini-importe"
          inputMode="numeric"
          autoComplete="off"
          placeholder="80.000"
          value={texto}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            setTexto(n ? numero(n) : "");
          }}
          className="h-16 w-full bg-transparent font-heading text-3xl font-semibold outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3" aria-live="polite">
        <div className="rounded-2xl bg-secondary/60 p-4">
          <p className="text-xs text-muted-foreground">Ahorro estimado por mes</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-ahorro">
            {res ? <AnimatedNumber value={res.sistema.ahorroMensualPromedio} formato="pesos" /> : "—"}
          </p>
        </div>
        <div className="rounded-2xl bg-secondary/60 p-4">
          <p className="text-xs text-muted-foreground">Sistema sugerido</p>
          <p className="mt-1 font-heading text-2xl font-semibold">
            {res ? (
              <>
                <AnimatedNumber value={res.sistema.paneles} /> <span className="text-base font-normal text-muted-foreground">paneles</span>
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>
      <p className="mt-3 min-h-5 text-xs text-muted-foreground">
        {res
          ? `${numero(res.sistema.kwpReal, 2)} kWp · en 25 años ahorrás cerca de $${numero(res.sistema.ahorro25Anios / 1e6, 0)} millones (en pesos de hoy)`
          : "Estimación para un hogar en Córdoba. Afinala en el cotizador completo."}
      </p>

      <Link
        href={importe ? `/cotizador?importe=${importe}` : "/cotizador"}
        className="btn-sun mt-4 flex h-13 items-center justify-center gap-2 rounded-2xl text-base"
      >
        Ver mi cotización completa <ArrowRight className="size-5" />
      </Link>
    </div>
  );
}
