"use client";

import {
  AirVent,
  Battery,
  Camera,
  Compass,
  CookingPot,
  Droplets,
  Factory,
  FileText,
  Gauge,
  Home,
  Layers,
  MapPin,
  Mountain,
  Plus,
  Refrigerator,
  ShowerHead,
  Snowflake,
  Sparkles,
  Store,
  Sun,
  SunDim,
  Tractor,
  Trash2,
  TreePine,
  Wallet,
  Zap,
  Warehouse,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { EQUIPOS, type EquipoId } from "@/lib/consumo";
import type { ResultadoCotizacion } from "@/lib/cotizador";
import { localidadDe, tarifaDe } from "@/lib/cotizador";
import { numero, pesos } from "@/lib/format";
import type { DatosCotizador, Respuestas, Segmento, TipoTecho } from "@/lib/schemas";
import { hspPromedio } from "@/lib/solar";
import { Chips, NumberField, OptionCard, Stepper, TituloPaso } from "@/components/wizard/controles";

export interface PropsPaso {
  datos: DatosCotizador;
  r: Respuestas;
  actualizar: (fn: (r: Respuestas) => void) => void;
  res: ResultadoCotizacion | null;
  siguiente: () => void;
}

const TIPOS: { id: Segmento; titulo: string; desc: string; icono: LucideIcon }[] = [
  { id: "HOGAR", titulo: "Hogar", desc: "Casa, departamento o casa de fin de semana", icono: Home },
  { id: "COMERCIO", titulo: "Comercio", desc: "Local, oficina, consultorio o estudio", icono: Store },
  { id: "INDUSTRIA", titulo: "Industria / Pyme", desc: "Planta, taller o depósito", icono: Factory },
  { id: "AGRO", titulo: "Campo / Agro", desc: "Bombeo, galpones, tambo", icono: Tractor },
];

export function PasoTipo({ datos, r, actualizar, siguiente }: PropsPaso) {
  return (
    <div>
      <TituloPaso titulo="¿Para dónde es el sistema?" ayuda="Así usamos la tarifa y los precios que corresponden." />
      <div role="radiogroup" aria-label="Tipo de cliente" className="grid gap-3 sm:grid-cols-2">
        {TIPOS.map((t) => (
          <OptionCard
            key={t.id}
            icono={t.icono}
            titulo={t.titulo}
            descripcion={t.desc}
            seleccionada={r.tipoCliente === t.id}
            onClick={() => {
              actualizar((x) => {
                x.tipoCliente = t.id;
                const destinatario = t.id === "HOGAR" ? "PERSONA" : "EMPRESA";
                const linea = datos.lineas.find((l) => l.destinatario === destinatario);
                if (linea && x.credito.lineaId !== null) x.credito.lineaId = linea.id;
              });
              setTimeout(siguiente, 220);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PasoUbicacion({ datos, r, actualizar }: PropsPaso) {
  const provincias = useMemo(() => [...new Set(datos.localidades.map((l) => l.provincia))], [datos]);
  const actual = localidadDe(datos, r.localidadId);
  const [provincia, setProvincia] = useState(actual?.provincia ?? provincias[0]);
  const [busqueda, setBusqueda] = useState("");
  const lista = datos.localidades.filter(
    (l) => l.provincia === provincia && l.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );
  const tarifa = actual ? tarifaDe(actual, r.tipoCliente) : null;

  return (
    <div>
      <TituloPaso titulo="¿Dónde está?" ayuda="La radiación solar y la tarifa dependen de tu localidad y de tu distribuidora." />
      {provincias.length > 1 && (
        <div className="mb-4">
          <Chips etiqueta="Provincia" opciones={provincias} valor={provincia} onChange={setProvincia} />
        </div>
      )}
      {datos.localidades.length > 8 && (
        <input
          type="search"
          placeholder="Buscar localidad…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar localidad"
          className="mb-4 h-12 w-full rounded-xl border border-input bg-background/60 px-4 outline-none focus:border-primary focus:ring-3 focus:ring-primary/25"
        />
      )}
      <div role="radiogroup" aria-label="Localidad" className="grid gap-2 sm:grid-cols-2">
        {lista.map((l) => (
          <OptionCard
            key={l.id}
            compacta
            icono={MapPin}
            titulo={l.nombre}
            descripcion={l.distribuidora}
            seleccionada={r.localidadId === l.id}
            onClick={() => actualizar((x) => void (x.localidadId = l.id))}
          />
        ))}
        {lista.length === 0 && <p className="text-sm text-muted-foreground">No encontramos esa localidad. Elegí la más cercana.</p>}
      </div>
      {actual && tarifa && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Dato icono={Sun} titulo="Sol promedio" valor={`${numero(hspPromedio(actual.hspMensual), 1)} h/día`} />
          <Dato icono={Gauge} titulo={`Tarifa ${tarifa.categoria}`} valor={`${pesos(tarifa.precioKwh)}/kWh`} />
          <Dato icono={Layers} titulo="Distribuidora" valor={actual.distribuidora} />
        </div>
      )}
    </div>
  );
}

function Dato({ icono: Icono, titulo, valor }: { icono: LucideIcon; titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icono className="size-3.5" /> {titulo}
      </p>
      <p className="mt-1 font-heading text-lg font-semibold">{valor}</p>
    </div>
  );
}

const ICONOS_EQUIPO: Record<EquipoId, LucideIcon> = {
  aire: AirVent,
  heladera: Refrigerator,
  freezer: Snowflake,
  bomba: Droplets,
  termotanque: ShowerHead,
  horno: CookingPot,
  pileta: Waves,
};

export function PasoConsumo({ datos, r, actualizar, res }: PropsPaso) {
  const c = r.consumo;
  const loc = localidadDe(datos, r.localidadId);
  const tarifa = loc ? tarifaDe(loc, r.tipoCliente) : null;
  const empresa = r.tipoCliente !== "HOGAR";
  const [fotoMsg, setFotoMsg] = useState<string | null>(null);

  async function subirFoto(archivo: File) {
    setFotoMsg("Analizando la factura…");
    try {
      const fd = new FormData();
      fd.append("factura", archivo);
      const resp = await fetch("/api/factura/ocr", { method: "POST", body: fd });
      const json = (await resp.json()) as { kwhPeriodo?: number; diasPeriodo?: number; mensaje?: string };
      if (resp.ok && json.kwhPeriodo) {
        actualizar((x) => {
          x.consumo.kwhPeriodo = json.kwhPeriodo!;
          if (json.diasPeriodo) x.consumo.diasPeriodo = json.diasPeriodo;
        });
        setFotoMsg("Listo: revisá que los datos coincidan con tu factura.");
      } else {
        setFotoMsg(json.mensaje ?? "No pudimos leer la factura. Cargá los datos a mano.");
      }
    } catch {
      setFotoMsg("No pudimos leer la factura. Cargá los datos a mano.");
    }
  }

  return (
    <div>
      <TituloPaso titulo="¿Cuánta energía usás?" ayuda="Elegí cómo preferís contarnos tu consumo." />
      <div role="radiogroup" aria-label="Forma de cargar el consumo" className="grid gap-3 sm:grid-cols-3">
        <OptionCard compacta icono={FileText} titulo="Tengo mi factura" descripcion="Lo más preciso" seleccionada={c.modo === "factura"} onClick={() => actualizar((x) => void (x.consumo.modo = "factura"))} />
        <OptionCard compacta icono={Wallet} titulo="Sé cuánto pago" descripcion="Monto mensual" seleccionada={c.modo === "importe"} onClick={() => actualizar((x) => void (x.consumo.modo = "importe"))} />
        <OptionCard compacta icono={Sparkles} titulo="No sé, estimame" descripcion="Por equipos" seleccionada={c.modo === "estimar"} onClick={() => actualizar((x) => void (x.consumo.modo = "estimar"))} />
      </div>

      <div className="mt-6">
        {c.modo === "factura" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Consumo del período" sufijo="kWh" value={c.kwhPeriodo || null} onChange={(v) => actualizar((x) => void (x.consumo.kwhPeriodo = v ?? 0))} placeholder="Ej: 680" ayuda="Figura como «Energía consumida» o «Consumo kWh»." />
              <div>
                <p className="mb-1.5 text-sm font-medium">Días del período</p>
                <Chips etiqueta="Días del período" opciones={[30, 60]} valor={[30, 60].includes(c.diasPeriodo) ? c.diasPeriodo : 0} onChange={(v) => actualizar((x) => void (x.consumo.diasPeriodo = v))} render={(v) => `${v} días`} />
                <div className="mt-3">
                  <NumberField label="Otro (días)" value={[30, 60].includes(c.diasPeriodo) ? null : c.diasPeriodo} onChange={(v) => actualizar((x) => void (x.consumo.diasPeriodo = Math.min(366, Math.max(1, v ?? 60))))} placeholder="Ej: 62" />
                </div>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-glass-border p-4 text-sm text-muted-foreground transition hover:border-primary/50">
              <Camera className="size-5 text-primary" />
              <span className="flex-1">
                Subir una foto de la factura <span className="text-xs">(opcional)</span>
                {fotoMsg && <span className="mt-1 block text-xs text-foreground">{fotoMsg}</span>}
              </span>
              <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && subirFoto(e.target.files[0])} />
            </label>
          </div>
        )}

        {c.modo === "importe" && (
          <div>
            <NumberField grande label="¿Cuánto pagás por mes?" prefijo="$" value={c.importe || null} onChange={(v) => actualizar((x) => void (x.consumo.importe = v ?? 0))} placeholder="80.000" />
            {tarifa && loc && (
              <p className="mt-2 text-xs text-muted-foreground">
                Lo convertimos a kWh con la tarifa {tarifa.categoria} de {loc.distribuidora}: {pesos(tarifa.precioKwh)}/kWh más un cargo fijo de {pesos(tarifa.cargoFijo)}. Si la factura es bimestral, ingresá la mitad.
              </p>
            )}
          </div>
        )}

        {c.modo === "estimar" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Metros cuadrados cubiertos" sufijo="m²" value={c.estimacion.m2 || null} onChange={(v) => actualizar((x) => void (x.consumo.estimacion.m2 = v ?? 0))} />
              <NumberField
                label={empresa ? "Cantidad de empleados" : "Personas que viven"}
                value={c.estimacion.personas || null}
                onChange={(v) => actualizar((x) => void (x.consumo.estimacion.personas = Math.round(v ?? 0)))}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Equipos</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(EQUIPOS) as EquipoId[]).map((id) => (
                  <Stepper
                    key={id}
                    icono={ICONOS_EQUIPO[id]}
                    label={EQUIPOS[id].nombre}
                    value={c.estimacion.equipos[id] ?? 0}
                    onChange={(v) => actualizar((x) => void (x.consumo.estimacion.equipos[id] = v))}
                  />
                ))}
              </div>
            </div>
            <Maquinaria r={r} actualizar={actualizar} />
            {empresa && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-sm font-medium">Días de trabajo por semana</p>
                  <Chips etiqueta="Días por semana" opciones={[5, 6, 7]} valor={c.estimacion.diasSemana} onChange={(v) => actualizar((x) => void (x.consumo.estimacion.diasSemana = v))} />
                </div>
                <div>
                  <label htmlFor="horario" className="mb-1.5 block text-sm font-medium">
                    Horario de trabajo
                  </label>
                  <input
                    id="horario"
                    placeholder="Ej: 8 a 17 h"
                    value={c.estimacion.horario}
                    maxLength={80}
                    onChange={(e) => actualizar((x) => void (x.consumo.estimacion.horario = e.target.value))}
                    className="h-12 w-full rounded-xl border border-input bg-background/60 px-3.5 outline-none focus:border-primary focus:ring-3 focus:ring-primary/25"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-4 text-center" aria-live="polite">
        {[
          ["Por día", res ? res.consumoMensualKwh / 30 : 0, 1],
          ["Por mes", res?.consumoMensualKwh ?? 0, 0],
          ["Por año", (res?.consumoMensualKwh ?? 0) * 12, 0],
        ].map(([t, v, d]) => (
          <div key={t as string}>
            <p className="text-xs text-muted-foreground">{t}</p>
            <p className="font-heading text-lg font-semibold sm:text-xl">{res ? `${numero(v as number, d as number)} kWh` : "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Maquinaria({ r, actualizar }: Pick<PropsPaso, "r" | "actualizar">) {
  const maquinas = r.consumo.estimacion.maquinas;
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Maquinaria u otros equipos de potencia</p>
      <div className="space-y-2">
        {maquinas.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] items-end gap-2 rounded-xl border border-glass-border p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium" htmlFor={`maq-${i}`}>
                Equipo
              </label>
              <input
                id={`maq-${i}`}
                value={m.nombre}
                maxLength={80}
                placeholder="Ej: compresor"
                onChange={(e) => actualizar((x) => void (x.consumo.estimacion.maquinas[i].nombre = e.target.value))}
                className="h-12 w-full rounded-xl border border-input bg-background/60 px-3.5 outline-none focus:border-primary"
              />
            </div>
            <NumberField label="Potencia" sufijo="kW" decimales={1} value={m.kw || null} onChange={(v) => actualizar((x) => void (x.consumo.estimacion.maquinas[i].kw = v ?? 0))} />
            <NumberField label="Uso" sufijo="h/día" decimales={1} value={m.horasDia || null} onChange={(v) => actualizar((x) => void (x.consumo.estimacion.maquinas[i].horasDia = Math.min(24, v ?? 0)))} />
            <button
              type="button"
              aria-label="Quitar equipo"
              onClick={() => actualizar((x) => void x.consumo.estimacion.maquinas.splice(i, 1))}
              className="grid size-12 place-items-center rounded-xl border border-glass-border text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => actualizar((x) => void x.consumo.estimacion.maquinas.push({ nombre: "", kw: 0, horasDia: 0 }))}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
      >
        <Plus className="size-4" /> Agregar equipo
      </button>
    </div>
  );
}

const TECHOS: { id: TipoTecho; titulo: string; icono: LucideIcon }[] = [
  { id: "CHAPA", titulo: "Chapa", icono: Warehouse },
  { id: "LOSA", titulo: "Losa", icono: Layers },
  { id: "TEJA", titulo: "Teja", icono: Home },
  { id: "SUELO", titulo: "Sobre suelo", icono: Mountain },
];

export function PasoTecho({ datos, r, actualizar, res }: PropsPaso) {
  const t = r.techo;
  const s = res?.sistema;
  return (
    <div>
      <TituloPaso titulo="¿Dónde van los paneles?" ayuda="Si no sabés los metros, dejalo vacío: lo medimos en la visita técnica." />
      <div role="radiogroup" aria-label="Tipo de techo" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TECHOS.map((x) => (
          <OptionCard key={x.id} compacta icono={x.icono} titulo={x.titulo} seleccionada={t.tipo === x.id} onClick={() => actualizar((y) => void (y.techo.tipo = x.id))} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Superficie libre disponible"
          sufijo="m²"
          value={t.m2}
          onChange={(v) => actualizar((y) => void (y.techo.m2 = v && v > 0 ? v : null))}
          placeholder="No sé"
          ayuda={`Cada panel ocupa ${numero(datos.panel.m2, 2)} m².`}
        />
        <div className="flex items-center justify-between gap-4 rounded-xl border border-glass-border p-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <TreePine className="size-4 text-muted-foreground" /> ¿Hay sombras?
            </p>
            <p className="text-xs text-muted-foreground">Árboles, edificios o tanques que tapen el sol.</p>
          </div>
          <Switch checked={t.sombras} onCheckedChange={(v) => actualizar((y) => void (y.techo.sombras = v))} aria-label="Hay sombras" />
        </div>
      </div>

      <p className="mt-6 mb-2 text-sm font-medium">Orientación</p>
      <div role="radiogroup" aria-label="Orientación" className="grid gap-2 sm:grid-cols-3">
        <OptionCard compacta icono={Compass} titulo="Norte" descripcion="Ideal" seleccionada={t.orientacion === "norte"} onClick={() => actualizar((y) => void (y.techo.orientacion = "norte"))} />
        <OptionCard compacta icono={SunDim} titulo="Este / Oeste" descripcion="Rinde un 15 % menos" seleccionada={t.orientacion === "este-oeste"} onClick={() => actualizar((y) => void (y.techo.orientacion = "este-oeste"))} />
        <OptionCard compacta icono={Sparkles} titulo="No sé" descripcion="Estimamos un 5 % menos" seleccionada={t.orientacion === "no-se"} onClick={() => actualizar((y) => void (y.techo.orientacion = "no-se"))} />
      </div>

      {s?.limitadoPorEspacio && (
        <div role="status" className="mt-6 rounded-2xl border border-primary/50 bg-primary/10 p-4 text-sm">
          <p className="font-semibold">El espacio no alcanza para el sistema ideal.</p>
          <p className="mt-1 text-muted-foreground">
            Necesitarías {Math.ceil((s.kwpNecesario * 1000) / datos.panel.wp)} paneles y entran {s.panelesMaxEspacio}. Te proponemos el máximo posible: {s.paneles} paneles
            ({numero(s.kwpReal, 2)} kWp), que cubren el {numero(s.coberturaReal * 100)} % de tu consumo.
          </p>
        </div>
      )}
    </div>
  );
}

export function PasoObjetivo({ datos, r, actualizar, res }: PropsPaso) {
  const o = r.objetivo;
  const opciones = [
    { v: 0.5 as const, t: "Cubrir el 50 %", d: "Inversión menor, ahorro parcial" },
    { v: 0.75 as const, t: "Cubrir el 75 %", d: "Buen equilibrio" },
    { v: 1 as const, t: "Cubrir el 100 %", d: "Tu factura de energía casi en cero" },
    { v: "max" as const, t: "Lo máximo que entre", d: r.techo.m2 ? `Llenar los ${numero(r.techo.m2)} m² disponibles` : "Indicá los m² en el paso anterior" },
  ];
  return (
    <div>
      <TituloPaso titulo="¿Cuánto querés cubrir?" ayuda="Podés cambiarlo y ver el resultado en vivo." />
      <div role="radiogroup" aria-label="Cobertura" className="grid gap-3 sm:grid-cols-2">
        {opciones.map((x) => (
          <OptionCard key={String(x.v)} icono={x.v === "max" ? Sun : Gauge} titulo={x.t} descripcion={x.d} seleccionada={o.cobertura === x.v} onClick={() => actualizar((y) => void (y.objetivo.cobertura = x.v))} />
        ))}
      </div>

      {datos.baterias.length > 0 && (
        <>
          <p className="mt-8 mb-1 text-sm font-medium">¿Querés respaldo ante cortes de luz?</p>
          <p className="mb-3 text-xs text-muted-foreground">Las baterías guardan energía para usarla cuando se corta la red. No aumentan el ahorro.</p>
          <div role="radiogroup" aria-label="Baterías" className="grid gap-2 sm:grid-cols-3">
            <OptionCard compacta icono={Zap} titulo="Sin baterías" seleccionada={o.bateriaId === null} onClick={() => actualizar((y) => void (y.objetivo.bateriaId = null))} />
            {datos.baterias.map((b) => (
              <OptionCard key={b.id} compacta icono={Battery} titulo={`${numero(b.kwh)} kWh`} descripcion={`+ ${pesos(b.precio)}`} seleccionada={o.bateriaId === b.id} onClick={() => actualizar((y) => void (y.objetivo.bateriaId = b.id))} />
            ))}
          </div>
        </>
      )}

      {res && (
        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Con esta elección: <span className="font-semibold text-foreground">{res.sistema.paneles} paneles</span> que cubren el{" "}
          <span className="font-semibold text-foreground">{numero(res.sistema.coberturaReal * 100)} %</span> de tu consumo anual.
        </p>
      )}
    </div>
  );
}
