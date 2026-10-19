import { BadgePercent, Calculator, ClipboardCheck, Landmark, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Casos } from "@/components/home/Casos";
import { Impacto } from "@/components/home/Impacto";
import { MiniCotizador } from "@/components/home/MiniCotizador";
import { SunScene } from "@/components/home/SunScene";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { EMPRESA, FAQ, PASOS_COMO_FUNCIONA } from "@/content/sitio";
import { linkWhatsApp } from "@/lib/cotizador";
import { obtenerDatosCotizador } from "@/lib/params";

const ICONOS_PASOS = [Calculator, ClipboardCheck, Wrench];

export default async function Home() {
  const datos = await obtenerDatosCotizador();
  const plazoMax = Math.max(...datos.lineas.flatMap((l) => l.plazos), 0);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-sun opacity-[0.12] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-ahorro" /> Energía solar en Córdoba · Financiación Bancor
            </p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
              Tu techo puede pagar tu <span className="text-sun">factura de luz</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Calculá en minutos cuántos paneles necesitás, cuánto vas a ahorrar y cuánto pagás de cuota con crédito Bancor. Sin vueltas y sin compromiso.
            </p>
            <SunScene className="mt-10 hidden w-full max-w-lg lg:block" />
          </div>
          <div className="w-full max-w-md lg:max-w-none">
            <MiniCotizador datos={datos} />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl text-4xl font-semibold sm:text-5xl">Cómo funciona</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">De la cotización online a tu techo generando energía, en tres pasos.</p>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {PASOS_COMO_FUNCIONA.map((p, i) => {
            const Icono = ICONOS_PASOS[i];
            return (
              <li key={p.titulo} className="glass relative rounded-3xl p-7">
                <span className="font-heading text-sm text-muted-foreground">0{i + 1}</span>
                <Icono className="mt-6 size-8 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* IMPACTO */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Impacto factorCO2={datos.config.factorCO2KgKwh} kgPorArbol={datos.config.kgCO2PorArbol} />
      </section>

      {/* CASOS */}
      <section id="casos" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-4xl font-semibold sm:text-5xl">Proyectos</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">Hogares, comercios, campo e industria: el mismo cálculo, a la escala de cada uno.</p>
        <div className="mt-6">
          <Casos />
        </div>
      </section>

      {/* BANCOR */}
      <section id="financiacion" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-night p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-sun opacity-25 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm text-amber-300">
                <Landmark className="size-4" /> Financiación con Bancor
              </p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
                Pagá en cuotas lo que hoy pagás de luz.
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                Simulá tu crédito {plazoMax ? `hasta en ${plazoMax} cuotas ` : ""}y compará la cuota con lo que ahorrás en la factura. Te mostramos TNA, TEA y CFT, sin letra chica.
              </p>
              <Link href="/cotizador" className="btn-sun mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5">
                Simular mi crédito
              </Link>
            </div>
            <ul className="space-y-3">
              {datos.lineas.map((l) => (
                <li key={l.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="flex items-center gap-2 font-semibold">
                    <BadgePercent className="size-4 text-amber-300" /> {l.nombre}
                  </p>
                  <p className="mt-1 text-sm text-white/65">
                    {l.esUVA ? "En UVA · " : "En pesos · "}
                    {l.plazos[0]} a {l.plazos[l.plazos.length - 1]} meses{l.requisitos ? ` · ${l.requisitos}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <p className="relative mt-8 text-xs text-white/50">
            Simulación orientativa. Sujeto a calificación crediticia y aprobación de Bancor. Las condiciones pueden variar.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-4xl font-semibold sm:text-5xl">Preguntas frecuentes</h2>
        <Accordion className="mt-8">
          {FAQ.map((f) => (
            <AccordionItem key={f.p} value={f.p} className="border-glass-border">
              <AccordionTrigger className="py-5 text-base hover:no-underline">{f.p}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <h2 className="text-4xl font-semibold">Hablemos</h2>
            <p className="mt-3 text-muted-foreground">Escribinos y coordinamos una visita técnica sin cargo para medir tu techo.</p>
            <p className="mt-6 flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-primary" /> {EMPRESA.direccion}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={linkWhatsApp(datos.config.whatsapp, "Hola, quiero coordinar una visita técnica.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white"
              >
                <WhatsAppIcon className="size-5" /> WhatsApp
              </a>
              <Link href="/cotizador" className="btn-sun inline-flex items-center rounded-full px-5 py-3">
                Cotizar online
              </Link>
            </div>
          </div>
          <div className="min-h-80 overflow-hidden rounded-3xl border border-glass-border">
            <iframe
              title={`Mapa: ${EMPRESA.direccion}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(EMPRESA.mapaQuery)}&output=embed`}
              className="h-full min-h-80 w-full grayscale-[0.3]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
