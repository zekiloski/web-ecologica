import { ArrowRight, BadgePercent, Calculator, ClipboardCheck, Clock, Droplets, Landmark, Leaf, Mail, MapPin, Phone, Sun, Waves, Wrench } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Impacto } from "@/components/home/Impacto";
import { MiniCotizador } from "@/components/home/MiniCotizador";
import { SunScene } from "@/components/home/SunScene";
import { ProyectosExplorer } from "@/components/proyectos/ProyectosExplorer";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { EMPRESA, FAQ, NOSOTROS, PASOS_COMO_FUNCIONA } from "@/content/sitio";
import { linkWhatsApp } from "@/lib/cotizador";
import { numero } from "@/lib/format";
import { obtenerDatosCotizador } from "@/lib/params";
import { totalesProyectos } from "@/lib/proyectos";

const ICONOS_PASOS = [Calculator, ClipboardCheck, Wrench];
const ICONOS_SERVICIOS = [Sun, Droplets, Waves];

export default async function Home() {
  const datos = await obtenerDatosCotizador();
  const plazoMax = Math.max(...datos.lineas.flatMap((l) => l.plazos), 0);
  const totales = totalesProyectos();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-sun opacity-[0.12] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-20%] left-[-15%] size-[520px] rounded-full bg-eco opacity-[0.12] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-eco/30 bg-eco/10 px-3 py-1 text-xs text-foreground/80">
              <Leaf className="size-3.5 text-eco" /> Energía solar en Córdoba · Financiación Bancor
            </p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
              Tu techo puede pagar tu <span className="text-sun">factura de luz</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Calculá en minutos cuántos paneles necesitás, cuánto vas a ahorrar y cuánto pagás de cuota con crédito Bancor. Sin vueltas y sin compromiso.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <span className="font-heading text-lg font-semibold text-eco">{totales.cantidad}</span> <span className="text-muted-foreground">proyectos instalados</span>
              </li>
              <li>
                <span className="font-heading text-lg font-semibold text-eco">{numero(totales.kw / 1000, 1)} MW</span> <span className="text-muted-foreground">de potencia solar</span>
              </li>
              <li>
                <span className="font-heading text-lg font-semibold text-eco">+10 años</span> <span className="text-muted-foreground">en Oncativo</span>
              </li>
            </ul>
            <SunScene className="mt-8 hidden w-full max-w-lg lg:block" />
          </div>
          <div className="w-full max-w-md md:max-w-xl lg:max-w-none">
            <MiniCotizador datos={datos} />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="max-w-2xl text-4xl font-semibold sm:text-5xl">Cómo funciona</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">De la cotización online a tu techo generando energía, en tres pasos.</p>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {PASOS_COMO_FUNCIONA.map((p, i) => {
            const Icono = ICONOS_PASOS[i];
            return (
              <li key={p.titulo} className="glass relative rounded-3xl p-6 sm:p-7">
                <span className="font-heading text-sm text-muted-foreground">0{i + 1}</span>
                <Icono className="mt-6 size-8 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-eco">
              <Leaf className="size-4" /> Casos de éxito
            </p>
            <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Nuestros proyectos</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              De una casa de 3 kW a una planta industrial de 300 kW: {totales.cantidad} instalaciones funcionando en Córdoba, Buenos Aires y Uruguay. Tocá un proyecto para ver las fotos.
            </p>
          </div>
          <Link href="/proyectos" className="inline-flex items-center gap-2 rounded-full border border-eco/40 px-5 py-2.5 text-sm font-medium transition hover:bg-eco/10">
            Ver los {totales.cantidad} proyectos <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8">
          <ProyectosExplorer modo="carrusel" />
        </div>
      </section>

      {/* IMPACTO */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
        <Impacto factorCO2={datos.config.factorCO2KgKwh} kgPorArbol={datos.config.kgCO2PorArbol} />
      </section>

      {/* BANCOR */}
      <section id="financiacion" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-night p-6 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-sun opacity-25 blur-3xl" />
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-eco opacity-20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm text-amber-300">
                <Landmark className="size-4" /> Financiación con Bancor
              </p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Pagá en cuotas lo que hoy pagás de luz.</h2>
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

      {/* NOSOTROS */}
      <section id="nosotros" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-eco">
              <Leaf className="size-4" /> Nosotros
            </p>
            <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">{NOSOTROS.titulo}</h2>
            <p className="mt-4 text-muted-foreground">{NOSOTROS.texto}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-l-4 border-eco bg-eco/5 p-5">
                <dt className="text-sm font-semibold text-eco">Misión</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{NOSOTROS.mision}</dd>
              </div>
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-5">
                <dt className="text-sm font-semibold text-primary">Visión</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{NOSOTROS.vision}</dd>
              </div>
            </dl>
          </div>
          <ul className="grid gap-3">
            {NOSOTROS.servicios.map((s, i) => {
              const Icono = ICONOS_SERVICIOS[i];
              return (
                <li key={s.titulo} className="glass flex items-start gap-4 rounded-3xl p-6">
                  <span className={i === 0 ? "grid size-12 shrink-0 place-items-center rounded-2xl bg-sun text-[#1c1203]" : "grid size-12 shrink-0 place-items-center rounded-2xl bg-eco text-white"}>
                    <Icono className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
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
      <section id="contacto" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-4xl font-semibold">Hablemos</h2>
            <p className="mt-3 text-muted-foreground">Escribinos y coordinamos una visita técnica para medir tu techo y darte el presupuesto final.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-eco" /> {EMPRESA.direccion}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-eco" />
                <a href={`tel:+5493572445884`} className="-my-2 inline-flex min-h-10 items-center hover:underline">
                  {EMPRESA.telefono}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-eco" />
                <a href={`mailto:${EMPRESA.email}`} className="-my-2 inline-flex min-h-10 items-center break-all hover:underline">
                  {EMPRESA.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-eco" />
                <span>
                  {EMPRESA.horarios.map((h) => (
                    <span key={h} className="block">
                      {h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
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
            <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
              <a href={EMPRESA.redes.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
                Instagram
              </a>
              <a href={EMPRESA.redes.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
                Facebook
              </a>
            </p>
          </div>
          <div className="min-h-80 overflow-hidden rounded-3xl border border-glass-border">
            <iframe
              title={`Mapa: ${EMPRESA.direccion}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(EMPRESA.mapaQuery)}&output=embed`}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
