"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useReducedMotion } from "framer-motion";
import { AlertTriangle, CalendarCheck, CheckCircle2, Cpu, Leaf, Loader2, PiggyBank, RotateCcw, Ruler, Sun, TreePine, Wallet, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatedNumber, type FormatoNumero } from "@/components/common/AnimatedNumber";
import { AmortizacionTable } from "@/components/results/AmortizacionTable";
import { CuotaVsAhorroChart } from "@/components/results/CuotaVsAhorroChart";
import { GeneracionChart } from "@/components/results/GeneracionChart";
import { RoofGrid } from "@/components/results/RoofGrid";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { Slider } from "@/components/ui/slider";
import { Chips, OptionCard, TituloPaso } from "@/components/wizard/controles";
import type { PropsPaso } from "@/components/wizard/pasos-entrada";
import { linkWhatsApp, mensajeWhatsApp, plazoValido, type ResultadoCotizacion } from "@/lib/cotizador";
import { meses, numero, pct, pesos } from "@/lib/format";
import { leadSchema, type DatosLead } from "@/lib/schemas";
import { cn } from "@/lib/utils";

function Tarjeta({
  icono: Icono,
  titulo,
  valor,
  formato,
  sufijo,
  nota,
  destacada,
  ahorro,
}: {
  icono: typeof Sun;
  titulo: string;
  valor: number;
  formato?: FormatoNumero;
  sufijo?: string;
  nota?: string;
  destacada?: boolean;
  ahorro?: boolean;
}) {
  return (
    <div className={cn("glass rounded-2xl p-4 sm:p-5", destacada && "border-primary/40 bg-primary/5")}>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icono className="size-3.5" /> {titulo}
      </p>
      <p className={cn("mt-1.5 font-heading text-2xl font-semibold sm:text-3xl", ahorro && "text-ahorro")}>
        <AnimatedNumber value={valor} formato={formato} />
        {sufijo && <span className="ml-1 text-base font-normal text-muted-foreground">{sufijo}</span>}
      </p>
      {nota && <p className="mt-1 text-xs text-muted-foreground">{nota}</p>}
    </div>
  );
}

export function PasoResultado({ datos, res }: PropsPaso) {
  if (!res) return <SinDatos />;
  const s = res.sistema;
  const inv = s.inversor;
  return (
    <div>
      <TituloPaso titulo="Tu sistema solar" ayuda={`Calculado para ${res.localidad.nombre} con la tarifa ${res.tarifa.categoria} de ${res.localidad.distribuidora}.`} />

      <div className="relative overflow-hidden rounded-3xl bg-night p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-sun opacity-30 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-white/60">Potencia recomendada</p>
            <p className="font-heading text-5xl font-semibold">
              <AnimatedNumber value={s.kwpReal} formato="decimal2" />
              <span className="ml-1 text-xl text-white/60">kWp</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-white/60">Paneles</p>
            <p className="font-heading text-5xl font-semibold">
              <AnimatedNumber value={s.paneles} />
              <span className="ml-1 text-xl text-white/60">× {datos.panel.wp} Wp</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-white/60">Precio estimado instalado</p>
            <p className="font-heading text-3xl font-semibold text-amber-300">
              <AnimatedNumber value={s.precio.total} formato="pesos" />
            </p>
            <p className="text-xs text-white/60">
              Entre {pesos(s.precio.minimo)} y {pesos(s.precio.maximo)}
            </p>
          </div>
        </div>
        {inv && (
          <p className="relative mt-6 flex items-center gap-2 text-sm text-white/70">
            <Cpu className="size-4" /> Inversor: {inv.cantidad > 1 ? `${inv.cantidad} × ` : ""}
            {inv.inversor.modelo}
            {inv.sugerirTrifasico && " · se recomienda conexión trifásica"}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta icono={PiggyBank} titulo="Ahorro por mes" valor={s.ahorroMensualPromedio} formato="pesos" ahorro destacada nota="Promedio del primer año" />
        <Tarjeta icono={Wallet} titulo="Ahorro por año" valor={s.ahorroAnual} formato="pesos" ahorro />
        <Tarjeta icono={Leaf} titulo="Ahorro en 25 años" valor={s.ahorro25Anios} formato="pesos" ahorro nota={`En pesos de hoy, con la tarifa subiendo un ${pct(datos.config.aumentoTarifaAnual)} anual por encima de la inflación`} />
        <Tarjeta icono={Zap} titulo="Cubre tu consumo" valor={Math.min(s.coberturaReal, 9.99)} formato="pct" />
        <Tarjeta icono={Sun} titulo="Generación anual" valor={s.generacionAnualKwh} sufijo="kWh" />
        <Tarjeta icono={Ruler} titulo="Superficie" valor={s.superficieM2} formato="decimal1" sufijo="m²" />
        <Tarjeta icono={Leaf} titulo="CO₂ evitado" valor={s.impacto.toneladasCO2Anual} formato="decimal1" sufijo="t/año" />
        <Tarjeta icono={TreePine} titulo="Equivale a plantar" valor={s.impacto.arbolesEquivalentes} sufijo="árboles" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold">Generación estimada por mes</h3>
          <p className="mb-3 text-xs text-muted-foreground">Barras: generación · Línea punteada: tu consumo</p>
          <GeneracionChart balance={s.balance} />
        </div>
        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold">Así quedaría tu techo</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            {s.paneles} paneles · {numero(s.superficieM2, 1)} m²
            {s.panelesMaxEspacio != null && ` de ${s.panelesMaxEspacio} posibles`}
          </p>
          <RoofGrid paneles={s.paneles} panelesMax={s.panelesMaxEspacio} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-secondary/60 p-4">
          <p className="font-medium">Qué incluye el precio</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li className="flex justify-between gap-4">
              <span>Equipos e instalación</span> <span>{pesos(s.precio.equiposEInstalacion)}</span>
            </li>
            {s.precio.estructura > 0 && (
              <li className="flex justify-between gap-4">
                <span>Estructura</span> <span>{pesos(s.precio.estructura)}</span>
              </li>
            )}
            {s.precio.baterias > 0 && (
              <li className="flex justify-between gap-4">
                <span>Baterías {res.bateria?.modelo}</span> <span>{pesos(s.precio.baterias)}</span>
              </li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl bg-secondary/60 p-4">
          <p className="font-medium">Recuperás la inversión</p>
          <p className="mt-2 text-muted-foreground">
            {res.repagoContado ? (
              <>
                Pagando de contado, el ahorro acumulado iguala la inversión en <span className="font-semibold text-foreground">{meses(res.repagoContado)}</span>. Después,
                todo lo que ahorrás es ganancia.
              </>
            ) : (
              "Con estos valores la inversión no se recupera en 25 años. Revisá la cobertura o consultanos."
            )}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Estimación preliminar con radiación promedio de la zona, performance ratio {numero(datos.config.performanceRatio, 2)} y degradación de paneles del {pct(datos.config.degradacionAnual, 1)}{" "}
        anual. El presupuesto final se confirma con la visita técnica.
      </p>
    </div>
  );
}

export function PasoFinanciacion({ datos, r, actualizar, res }: PropsPaso) {
  if (!res) return <SinDatos />;
  const precio = res.sistema.precio.total;
  const c = res.credito;
  const linea = c?.linea ?? null;

  return (
    <div>
      <TituloPaso titulo="Financiación Bancor" ayuda="Elegí la línea y el plazo. La cuota se compara con lo que ahorrás en la factura." />

      <div role="radiogroup" aria-label="Línea de crédito" className="grid gap-2 sm:grid-cols-2">
        {datos.lineas.map((l) => (
          <OptionCard
            key={l.id}
            compacta
            icono={Wallet}
            titulo={l.nombre}
            descripcion={`${l.esUVA ? "UVA" : "Pesos"} · ${l.plazos[0]}–${l.plazos[l.plazos.length - 1]} meses${l.destinatario === "EMPRESA" ? " · Empresas" : " · Personas"}`}
            seleccionada={r.credito.lineaId === l.id}
            onClick={() =>
              actualizar((x) => {
                x.credito.lineaId = l.id;
                x.credito.plazo = plazoValido(l.plazos, x.credito.plazo);
              })
            }
          />
        ))}
        <OptionCard compacta icono={PiggyBank} titulo="Pago de contado" descripcion="Sin financiación" seleccionada={r.credito.lineaId === null} onClick={() => actualizar((x) => void (x.credito.lineaId = null))} />
      </div>

      {!c && (
        <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
          <p className="text-lg">
            Pagás <span className="font-semibold">{pesos(precio)}</span> y ahorrás <span className="font-semibold text-ahorro">{pesos(res.sistema.ahorroMensualPromedio)}</span> por mes en promedio.
          </p>
          {res.repagoContado && <p className="mt-1 text-muted-foreground">Recuperás la inversión en {meses(res.repagoContado)}.</p>}
        </div>
      )}

      {c && linea && (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Plazo</p>
              <Chips etiqueta="Plazo en meses" opciones={linea.plazos} valor={c.plazo} onChange={(v) => actualizar((x) => void (x.credito.plazo = v))} render={(v) => `${v} meses`} />
            </div>
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-sm font-medium">Anticipo</p>
                <p className="text-sm text-muted-foreground">
                  {pesos(r.credito.anticipo)} · {numero((r.credito.anticipo / precio) * 100)} %
                </p>
              </div>
              <Slider
                min={0}
                max={Math.round(precio * 0.9)}
                step={Math.max(1000, Math.round(precio / 200 / 1000) * 1000)}
                value={[Math.min(r.credito.anticipo, Math.round(precio * 0.9))]}
                onValueChange={(v) => actualizar((x) => void (x.credito.anticipo = Array.isArray(v) ? v[0] : (v as number)))}
                aria-label="Anticipo"
                className="py-3 [&_[data-slot=slider-range]]:bg-sun [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-track]]:h-2"
              />
              <p className="mt-2 text-sm">
                Monto a financiar: <span className="font-semibold">{pesos(c.montoFinanciado)}</span>
              </p>
            </div>
          </div>

          {c.excedeMaximo && (
            <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-primary/50 bg-primary/10 p-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
              El monto máximo de esta línea es {pesos(linea.montoMaximo)}. Para este sistema necesitás un anticipo de {pesos(c.anticipoNecesario)}.
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-night p-6 text-white">
              <div className="pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-sun opacity-25 blur-3xl" />
              <p className="relative text-sm text-white/60">{c.esUVA ? "Cuota inicial (al valor UVA de hoy)" : "Cuota mensual"}</p>
              <p className="relative font-heading text-5xl font-semibold text-amber-300">
                <AnimatedNumber value={c.cuotaInicial} formato="pesos" />
              </p>
              {c.esUVA && c.cuotaUVA != null && (
                <p className="relative mt-1 text-sm text-white/70">
                  {numero(c.cuotaUVA, 2)} UVA por mes · 1 UVA = {pesos(datos.config.valorUVA)}
                </p>
              )}
              <p className="relative mt-4 text-sm text-white/70">
                Total a pagar{c.esUVA ? " (en pesos de hoy)" : ""}: <span className="font-semibold text-white">{pesos(c.totalAPagar + c.anticipoNecesario)}</span>
                {c.anticipoNecesario > 0 && ` (incluye ${pesos(c.anticipoNecesario)} de anticipo)`}
              </p>
            </div>
            {/* TNA, TEA y CFT se muestran juntos y con el mismo peso visual. */}
            <dl className="grid grid-cols-3 gap-2 sm:grid-cols-1">
              {[
                ["TNA", c.tna],
                ["TEA", c.tea],
                ["CFT", c.cft],
              ].map(([k, v]) => (
                <div key={k as string} className="glass flex flex-col justify-center rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
                  <dd className="font-heading text-xl font-semibold">{pct(v as number, 2)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <MensajeCuota res={res} />

          <div className="glass mt-4 rounded-3xl p-5">
            <h3 className="mb-3 font-semibold">Cuota vs. ahorro</h3>
            <CuotaVsAhorroChart datos={c.comparativa} anticipo={c.anticipoNecesario} repago={c.repago} />
            {c.esUVA && <p className="mt-2 text-xs text-muted-foreground">Valores en pesos de hoy: la cuota UVA sube con la inflación igual que tu factura de luz, por eso se comparan en moneda constante.</p>}
          </div>

          <div className="mt-4">
            <AmortizacionTable filas={c.tabla} esUVA={c.esUVA} valorUVA={datos.config.valorUVA} />
          </div>

          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            {linea.requisitos && <p>{linea.requisitos}</p>}
            <p>{linea.textoLegal}</p>
          </div>
        </>
      )}
    </div>
  );
}

function MensajeCuota({ res }: { res: ResultadoCotizacion }) {
  const c = res.credito!;
  const cuota = c.cuotaInicial;
  const ahorro = c.ahorroMensualAnio1;
  const cubre = ahorro >= cuota * 0.9;
  return (
    <div className={cn("mt-4 rounded-2xl p-5", cubre ? "border border-ahorro/40 bg-ahorro/10" : "bg-secondary/60")}>
      <p className="text-lg leading-snug">
        Tu cuota es <span className="font-semibold">{pesos(cuota)}</span> y ahorrás <span className="font-semibold text-ahorro">{pesos(ahorro)}</span> por mes en promedio
        {cubre ? ": el sistema se paga prácticamente solo." : "."}
      </p>
      {!cubre && (
        <p className="mt-1 text-sm text-muted-foreground">
          La diferencia al principio es de {pesos(cuota - ahorro)} por mes. Al terminar el crédito, en el mes {c.plazo}, todo el ahorro queda para vos.
        </p>
      )}
      {c.repago && <p className="mt-1 text-sm text-muted-foreground">Lo ahorrado supera lo pagado en {meses(c.repago)}.</p>}
    </div>
  );
}

function SinDatos() {
  return (
    <div className="rounded-2xl bg-secondary/60 p-6 text-muted-foreground">
      Necesitamos tu consumo para calcular el sistema. Volvé al paso «Consumo» y completalo.
    </div>
  );
}

export function PasoContacto({
  datos,
  r,
  res,
  enviadoId,
  onEnviado,
  onReiniciar,
  origen,
}: PropsPaso & { enviadoId: string | null; onEnviado: (id: string) => void; onReiniciar: () => void; origen: "WEB" | "EMBED" }) {
  const reducir = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | undefined>();
  const localidad = datos.localidades.find((l) => l.id === r.localidadId)?.nombre ?? "";
  const form = useForm<DatosLead>({ resolver: zodResolver(leadSchema), defaultValues: { nombre: "", telefono: "", email: "", localidad } });

  if (!res) return <SinDatos />;

  async function enviar(lead: DatosLead) {
    setError(null);
    try {
      const resp = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas: r, lead, origen }),
      });
      const json = (await resp.json()) as { id?: string; error?: string };
      if (!resp.ok || !json.id) throw new Error(json.error ?? "No pudimos guardar la cotización");
      setNombre(lead.nombre.split(" ")[0]);
      onEnviado(json.id);
      if (!reducir) {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.7 }, colors: ["#fbbf24", "#f97316", "#a3e635", "#ffffff"], disableForReducedMotion: true });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar la cotización");
    }
  }

  const msj = mensajeWhatsApp(res, nombre);

  if (enviadoId) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-ahorro" />
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">¡Listo{nombre ? `, ${nombre}` : ""}!</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">Guardamos tu cotización. Un asesor te va a contactar para coordinar la visita técnica y el presupuesto final.</p>
        <div className="mx-auto mt-8 grid max-w-md gap-3">
          <a href={linkWhatsApp(datos.config.whatsapp, msj)} target="_blank" rel="noopener noreferrer" className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#25D366] font-semibold text-white">
            <WhatsAppIcon className="size-5" /> Seguir por WhatsApp
          </a>
          <a
            href={linkWhatsApp(datos.config.whatsapp, mensajeWhatsApp(res, nombre, "Quiero agendar la visita técnica."))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sun flex h-13 items-center justify-center gap-2 rounded-2xl"
          >
            <CalendarCheck className="size-5" /> Agendar visita técnica
          </a>
          <button type="button" onClick={onReiniciar} className="mt-2 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-4" /> Hacer otra cotización
          </button>
        </div>
      </div>
    );
  }

  const campos: { name: keyof DatosLead; label: string; type: string; autoComplete: string }[] = [
    { name: "nombre", label: "Nombre y apellido", type: "text", autoComplete: "name" },
    { name: "telefono", label: "Teléfono / WhatsApp", type: "tel", autoComplete: "tel" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "localidad", label: "Localidad", type: "text", autoComplete: "address-level2" },
  ];

  return (
    <div>
      <TituloPaso titulo="¿A dónde te enviamos el presupuesto?" ayuda="Guardamos tu cotización y un asesor te contacta para la visita técnica. No compartimos tus datos." />
      <form onSubmit={form.handleSubmit(enviar)} noValidate className="grid gap-4 sm:grid-cols-2">
        {campos.map((c) => {
          const err = form.formState.errors[c.name];
          return (
            <div key={c.name}>
              <label htmlFor={`lead-${c.name}`} className="mb-1.5 block text-sm font-medium">
                {c.label}
              </label>
              <input
                id={`lead-${c.name}`}
                type={c.type}
                autoComplete={c.autoComplete}
                aria-invalid={!!err}
                aria-describedby={err ? `lead-${c.name}-error` : undefined}
                {...form.register(c.name)}
                className="h-12 w-full rounded-xl border border-input bg-background/60 px-3.5 outline-none focus:border-primary focus:ring-3 focus:ring-primary/25 aria-invalid:border-destructive"
              />
              {err && (
                <p id={`lead-${c.name}-error`} className="mt-1 text-xs text-destructive">
                  {err.message}
                </p>
              )}
            </div>
          );
        })}
        <div className="sm:col-span-2">
          {error && (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {error}. Podés escribirnos directo por{" "}
              <a className="underline" href={linkWhatsApp(datos.config.whatsapp, msj)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          )}
          <button type="submit" disabled={form.formState.isSubmitting} className="btn-sun flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-base disabled:opacity-70">
            {form.formState.isSubmitting && <Loader2 className="size-5 animate-spin" />}
            Quiero mi presupuesto
          </button>
          <a href={linkWhatsApp(datos.config.whatsapp, msj)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <WhatsAppIcon className="size-4" /> Prefiero hablar por WhatsApp ahora
          </a>
        </div>
      </form>
      {/* Resumen corto de lo que se envía */}
      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-4 text-center text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Sistema</p>
          <p className="font-semibold">{numero(res.sistema.kwpReal, 2)} kWp</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="font-semibold">{pesos(res.sistema.precio.total)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{res.credito ? `${res.credito.plazo} cuotas` : "Contado"}</p>
          <p className="font-semibold">{res.credito ? pesos(res.credito.cuotaInicial) : "—"}</p>
        </div>
      </div>
    </div>
  );
}
