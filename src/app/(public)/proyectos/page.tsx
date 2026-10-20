import { Leaf } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProyectosExplorer } from "@/components/proyectos/ProyectosExplorer";
import { numero } from "@/lib/format";
import { totalesProyectos } from "@/lib/proyectos";

const { cantidad, kw, fotos } = totalesProyectos();

export const metadata: Metadata = {
  title: "Proyectos de energía solar en Córdoba",
  description: `${cantidad} instalaciones solares realizadas por Eco Lógica: hogares, comercios, industrias y campo. ${numero(kw / 1000, 1)} MW instalados.`,
};

export default function ProyectosPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-[-10%] size-[520px] rounded-full bg-eco opacity-[0.12] blur-3xl" />
      <section className="relative mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-eco">
          <Leaf className="size-4" /> Casos de éxito
        </p>
        <h1 className="mt-2 max-w-3xl text-5xl leading-[1.05] font-semibold sm:text-6xl">
          {cantidad} proyectos generando <span className="text-eco-grad">energía limpia</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {numero(kw, 0)} kW instalados en hogares, comercios, industrias y campos de Córdoba, Buenos Aires y Uruguay. {fotos} fotos de obra, de la estructura al inversor.
        </p>
        <div className="mt-10">
          <ProyectosExplorer modo="grilla" />
        </div>
        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-eco/30 bg-eco/5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-semibold">¿Querés que tu proyecto sea el próximo?</p>
            <p className="mt-1 text-muted-foreground">Cotizalo online en 3 minutos y mirá cuánto ahorrás.</p>
          </div>
          <Link href="/cotizador" className="btn-sun inline-flex items-center rounded-full px-6 py-3.5">
            Cotizar mi sistema
          </Link>
        </div>
      </section>
    </div>
  );
}
