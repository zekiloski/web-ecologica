"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { respuestasIniciales, respuestasSchema, type DatosCotizador, type Respuestas } from "@/lib/schemas";

const CLAVE = "cotizador-solar-v1";

interface Estado {
  paso: number;
  respuestas: Respuestas;
  enviadoId: string | null;
}

/** Restaura lo guardado solo si sigue siendo válido con los datos actuales (localidades y líneas pueden cambiar). */
function restaurar(datos: DatosCotizador, crudo: string | null): Estado | null {
  if (!crudo) return null;
  try {
    const guardado = JSON.parse(crudo) as Partial<Estado>;
    const r = respuestasSchema.safeParse(guardado.respuestas);
    if (!r.success) return null;
    const respuestas = r.data;
    const base = respuestasIniciales(datos);
    if (!datos.localidades.some((l) => l.id === respuestas.localidadId)) respuestas.localidadId = base.localidadId;
    if (respuestas.credito.lineaId && !datos.lineas.some((l) => l.id === respuestas.credito.lineaId)) respuestas.credito = base.credito;
    if (respuestas.objetivo.bateriaId && !datos.baterias.some((b) => b.id === respuestas.objetivo.bateriaId)) respuestas.objetivo.bateriaId = null;
    return { paso: Math.max(0, Math.min(7, Number(guardado.paso) || 0)), respuestas, enviadoId: guardado.enviadoId ?? null };
  } catch {
    return null;
  }
}

export function useWizardStore(datos: DatosCotizador, importeInicial?: number) {
  const [estado, setEstado] = useState<Estado>(() => ({ paso: 0, respuestas: respuestasIniciales(datos), enviadoId: null }));
  const [listo, setListo] = useState(false);
  const cargado = useRef(false);

  // Hidratar desde localStorage después del primer render (evita diferencias con el HTML del servidor).
  useEffect(() => {
    if (cargado.current) return;
    cargado.current = true;
    let previo: Estado | null = null;
    try {
      previo = restaurar(datos, localStorage.getItem(CLAVE));
    } catch {}
    if (importeInicial && importeInicial > 0) {
      const base = previo ?? { paso: 0, respuestas: respuestasIniciales(datos), enviadoId: null };
      base.respuestas.consumo.modo = "importe";
      base.respuestas.consumo.importe = importeInicial;
      base.enviadoId = null;
      previo = base;
    }
    if (previo) setEstado(previo);
    setListo(true);
  }, [datos, importeInicial]);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {}
  }, [estado, listo]);

  const actualizar = useCallback((fn: (r: Respuestas) => void) => {
    setEstado((e) => {
      const respuestas = structuredClone(e.respuestas);
      fn(respuestas);
      return { ...e, respuestas, enviadoId: null };
    });
  }, []);

  const irA = useCallback((paso: number) => setEstado((e) => ({ ...e, paso: Math.max(0, Math.min(7, paso)) })), []);
  const marcarEnviado = useCallback((id: string) => setEstado((e) => ({ ...e, enviadoId: id })), []);
  const reiniciar = useCallback(() => setEstado({ paso: 0, respuestas: respuestasIniciales(datos), enviadoId: null }), [datos]);

  return { ...estado, listo, actualizar, irA, marcarEnviado, reiniciar };
}
