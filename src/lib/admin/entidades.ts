/**
 * Definición de lo que se edita en el panel admin. Cada entidad declara sus campos una sola vez:
 * de acá salen el formulario, las columnas de la tabla y la validación del servidor.
 * Sin dependencias de servidor: lo usan tanto los componentes cliente como las acciones.
 */
import { z } from "zod";
import { SEGMENTOS, TIPOS_TECHO } from "@/lib/schemas";

export type Opcion = { value: string; label: string };

export type Campo = {
  name: string;
  label: string;
  ayuda?: string;
  opcional?: boolean;
  enTabla?: boolean;
} & (
  | { tipo: "texto" | "textarea" | "email" | "url" | "color" }
  | { tipo: "numero"; decimales?: number; sufijo?: string; min?: number; max?: number; entero?: boolean }
  | { tipo: "dinero" }
  | { tipo: "pct"; decimales?: number } // se guarda como fracción (0,12) y se edita como 12 %
  | { tipo: "bool" }
  | { tipo: "select"; opciones?: Opcion[]; numerico?: boolean } // sin opciones fijas: las pasa la página (ej. distribuidoras)
  | { tipo: "plazos" }
  | { tipo: "hsp" }
  | { tipo: "fecha" }
);

const SEGMENTO_LABEL: Record<(typeof SEGMENTOS)[number], string> = { HOGAR: "Hogar", COMERCIO: "Comercio", INDUSTRIA: "Industria", AGRO: "Agro" };
const opcionesSegmento: Opcion[] = SEGMENTOS.map((s) => ({ value: s, label: SEGMENTO_LABEL[s] }));
const opcionesTecho: Opcion[] = TIPOS_TECHO.map((t) => ({ value: t, label: t[0] + t.slice(1).toLowerCase() }));

export const ENTIDADES = {
  linea: {
    titulo: "Líneas de crédito",
    singular: "línea",
    orden: { nombre: "asc" },
    campos: [
      { name: "nombre", label: "Nombre", tipo: "texto", enTabla: true },
      { name: "destinatario", label: "Destinatario", tipo: "select", opciones: [{ value: "PERSONA", label: "Personas" }, { value: "EMPRESA", label: "Empresas" }], enTabla: true },
      { name: "tna", label: "TNA", tipo: "pct", decimales: 2, enTabla: true },
      { name: "tea", label: "TEA", tipo: "pct", decimales: 2, opcional: true, ayuda: "Vacío: se calcula desde la TNA.", enTabla: true },
      { name: "cft", label: "CFT", tipo: "pct", decimales: 2, opcional: true, ayuda: "Vacío: se calcula. Conviene cargar el informado por Bancor.", enTabla: true },
      { name: "plazos", label: "Plazos (meses)", tipo: "plazos", ayuda: "Separados por coma: 12, 24, 36", enTabla: true },
      { name: "montoMaximo", label: "Monto máximo", tipo: "dinero" },
      { name: "esUVA", label: "En UVA", tipo: "bool", enTabla: true },
      { name: "ivaSobreIntereses", label: "IVA sobre intereses", tipo: "bool" },
      { name: "vigenciaDesde", label: "Vigente desde", tipo: "fecha" },
      { name: "vigenciaHasta", label: "Vigente hasta", tipo: "fecha", opcional: true },
      { name: "activa", label: "Activa", tipo: "bool", enTabla: true },
      { name: "requisitos", label: "Requisitos", tipo: "textarea", opcional: true },
      { name: "textoLegal", label: "Texto legal", tipo: "textarea" },
    ],
  },
  distribuidora: {
    titulo: "Distribuidoras",
    singular: "distribuidora",
    orden: { nombre: "asc" },
    campos: [
      { name: "nombre", label: "Nombre", tipo: "texto", enTabla: true },
      { name: "precioInyeccion", label: "Precio de inyección ($/kWh)", tipo: "dinero", enTabla: true, ayuda: "Lo que reconoce por cada kWh excedente." },
    ],
  },
  tarifa: {
    titulo: "Tarifas",
    singular: "tarifa",
    orden: [{ distribuidoraId: "asc" }, { segmento: "asc" }],
    campos: [
      { name: "distribuidoraId", label: "Distribuidora", tipo: "select", enTabla: true },
      { name: "segmento", label: "Tipo de cliente", tipo: "select", opciones: opcionesSegmento, enTabla: true },
      { name: "categoria", label: "Categoría", tipo: "texto", enTabla: true },
      { name: "precioKwh", label: "Precio ($/kWh)", tipo: "dinero", enTabla: true, ayuda: "Con impuestos incluidos." },
      { name: "cargoFijo", label: "Cargo fijo mensual", tipo: "dinero", enTabla: true },
      { name: "vigenteDesde", label: "Vigente desde", tipo: "fecha", enTabla: true },
      { name: "activa", label: "Activa", tipo: "bool", enTabla: true },
    ],
  },
  localidad: {
    titulo: "Localidades",
    singular: "localidad",
    orden: [{ provincia: "asc" }, { nombre: "asc" }],
    campos: [
      { name: "provincia", label: "Provincia", tipo: "texto", enTabla: true },
      { name: "nombre", label: "Localidad", tipo: "texto", enTabla: true },
      { name: "distribuidoraId", label: "Distribuidora", tipo: "select", enTabla: true },
      { name: "hspMensual", label: "Horas solares pico por mes", tipo: "hsp", enTabla: true, ayuda: "kWh/m²/día sobre el plano inclinado, de enero a diciembre." },
    ],
  },
  panel: {
    titulo: "Paneles",
    singular: "panel",
    orden: { wp: "asc" },
    campos: [
      { name: "marca", label: "Marca", tipo: "texto", enTabla: true },
      { name: "modelo", label: "Modelo", tipo: "texto", enTabla: true },
      { name: "wp", label: "Potencia", tipo: "numero", entero: true, sufijo: "Wp", min: 50, max: 1000, enTabla: true },
      { name: "m2", label: "Superficie", tipo: "numero", decimales: 2, sufijo: "m²", min: 0.5, max: 5, enTabla: true },
      { name: "precio", label: "Precio", tipo: "dinero", enTabla: true },
      { name: "predeterminado", label: "Usar en el cotizador", tipo: "bool", enTabla: true, ayuda: "El cotizador calcula con este panel." },
      { name: "activo", label: "Activo", tipo: "bool", enTabla: true },
    ],
  },
  inversor: {
    titulo: "Inversores",
    singular: "inversor",
    orden: [{ fases: "asc" }, { kw: "asc" }],
    campos: [
      { name: "marca", label: "Marca", tipo: "texto", enTabla: true },
      { name: "modelo", label: "Modelo", tipo: "texto", enTabla: true },
      { name: "kw", label: "Potencia", tipo: "numero", decimales: 1, sufijo: "kW", min: 0.5, max: 2000, enTabla: true },
      { name: "fases", label: "Fases", tipo: "select", numerico: true, opciones: [{ value: "1", label: "Monofásico" }, { value: "3", label: "Trifásico" }], enTabla: true },
      { name: "hibrido", label: "Híbrido (para baterías)", tipo: "bool", enTabla: true },
      { name: "precio", label: "Precio", tipo: "dinero", enTabla: true },
      { name: "activo", label: "Activo", tipo: "bool", enTabla: true },
    ],
  },
  bateria: {
    titulo: "Baterías",
    singular: "batería",
    orden: { kwh: "asc" },
    campos: [
      { name: "marca", label: "Marca", tipo: "texto", enTabla: true },
      { name: "modelo", label: "Modelo", tipo: "texto", enTabla: true },
      { name: "kwh", label: "Capacidad", tipo: "numero", decimales: 1, sufijo: "kWh", min: 0.5, max: 5000, enTabla: true },
      { name: "precio", label: "Precio instalada", tipo: "dinero", enTabla: true },
      { name: "activo", label: "Activa", tipo: "bool", enTabla: true },
    ],
  },
  estructura: {
    titulo: "Estructuras",
    singular: "estructura",
    orden: { tipoTecho: "asc" },
    campos: [
      { name: "tipoTecho", label: "Tipo de techo", tipo: "select", opciones: opcionesTecho, enTabla: true },
      { name: "precioPorPanel", label: "Precio por panel", tipo: "dinero", enTabla: true },
      { name: "activo", label: "Activa", tipo: "bool", enTabla: true },
    ],
  },
  escala: {
    titulo: "Precio por kWp según escala",
    singular: "escala",
    orden: [{ segmento: "asc" }, { kwpDesde: "asc" }],
    campos: [
      { name: "segmento", label: "Tipo de cliente", tipo: "select", opciones: opcionesSegmento, enTabla: true },
      { name: "kwpDesde", label: "Desde", tipo: "numero", decimales: 1, sufijo: "kWp", min: 0, enTabla: true },
      { name: "kwpHasta", label: "Hasta", tipo: "numero", decimales: 1, sufijo: "kWp", min: 0, enTabla: true },
      { name: "precioPorKwp", label: "Precio por kWp instalado", tipo: "dinero", enTabla: true, ayuda: "Equipos + mano de obra + margen." },
      { name: "costoFijoInst", label: "Costo fijo de instalación", tipo: "dinero", enTabla: true, ayuda: "Tableros, protecciones, trámites." },
    ],
  },
  usuario: {
    titulo: "Usuarios del panel",
    singular: "usuario",
    orden: { email: "asc" },
    campos: [
      { name: "email", label: "Email", tipo: "email", enTabla: true },
      { name: "name", label: "Nombre", tipo: "texto", opcional: true, enTabla: true },
      { name: "role", label: "Rol", tipo: "select", opciones: [{ value: "ADMIN", label: "Administrador" }, { value: "VENDEDOR", label: "Vendedor (solo leads)" }], enTabla: true },
    ],
  },
} as const satisfies Record<string, { titulo: string; singular: string; orden: unknown; campos: readonly Campo[] }>;

export type EntidadId = keyof typeof ENTIDADES;

/** Campos de la fila única de Configuración, agrupados por página. */
export const CAMPOS_CONFIG = {
  uva: [
    { name: "valorUVA", label: "Valor UVA", tipo: "dinero", ayuda: "Publicado diariamente por el BCRA." },
    { name: "valorUVAFecha", label: "Fecha del valor", tipo: "fecha" },
  ],
  precios: [{ name: "margenPrecio", label: "Rango de precio mostrado (±)", tipo: "pct", ayuda: "El cotizador muestra el precio ± este porcentaje." }],
  empresa: [
    { name: "empresaNombre", label: "Nombre de la empresa", tipo: "texto" },
    { name: "logoUrl", label: "URL del logo", tipo: "url", opcional: true, ayuda: "Imagen PNG o SVG. Vacío: se usa el logo por defecto." },
    { name: "whatsapp", label: "WhatsApp", tipo: "texto", ayuda: "Con código de país, sin + ni espacios: 5493572123456" },
    { name: "emailNotificaciones", label: "Email para avisos de nuevos leads", tipo: "email" },
    { name: "colorPrimario", label: "Color principal", tipo: "color" },
    { name: "colorAcento", label: "Color de ahorro (modo oscuro)", tipo: "color" },
  ],
  calculo: [
    { name: "performanceRatio", label: "Performance ratio", tipo: "numero", decimales: 2, min: 0.5, max: 0.95, ayuda: "Pérdidas totales del sistema. Típico: 0,78–0,80." },
    { name: "degradacionAnual", label: "Degradación anual de paneles", tipo: "pct", decimales: 2 },
    { name: "aumentoTarifaAnual", label: "Aumento real de tarifa por año", tipo: "pct", decimales: 1, ayuda: "Por encima de la inflación. Todo se proyecta en pesos de hoy." },
    { name: "factorCO2KgKwh", label: "Factor de emisión", tipo: "numero", decimales: 3, sufijo: "kg CO₂/kWh", min: 0, max: 2 },
    { name: "kgCO2PorArbol", label: "CO₂ que absorbe un árbol por año", tipo: "numero", decimales: 1, sufijo: "kg", min: 1, max: 100 },
  ],
} as const satisfies Record<string, readonly Campo[]>;

const textoCorto = z.string().trim().max(200);

/** Esquema Zod del formulario a partir de la definición de campos. */
export function schemaDe(campos: readonly Campo[]) {
  const forma: Record<string, z.ZodType> = {};
  for (const c of campos) {
    let s: z.ZodType;
    switch (c.tipo) {
      case "texto":
        s = textoCorto.min(c.opcional ? 0 : 1, `${c.label}: obligatorio`);
        break;
      case "textarea":
        s = z.string().trim().max(4000).min(c.opcional ? 0 : 1, `${c.label}: obligatorio`);
        break;
      case "email":
        s = z.string().trim().toLowerCase().email(`${c.label}: email inválido`);
        break;
      case "url":
        s = z.union([z.literal(""), z.string().trim().url(`${c.label}: URL inválida`)]).transform((v) => v || null);
        break;
      case "color":
        s = z.string().regex(/^#[0-9a-fA-F]{6}$/, `${c.label}: color inválido`);
        break;
      case "numero": {
        let n = z.number({ error: `${c.label}: número inválido` });
        if (c.entero) n = n.int();
        if (c.min != null) n = n.min(c.min, `${c.label}: mínimo ${c.min}`);
        if (c.max != null) n = n.max(c.max, `${c.label}: máximo ${c.max}`);
        s = n;
        break;
      }
      case "dinero":
        s = z.number({ error: `${c.label}: monto inválido` }).min(0, `${c.label}: no puede ser negativo`);
        break;
      case "pct":
        s = z.number({ error: `${c.label}: porcentaje inválido` }).min(0).max(10);
        break;
      case "bool":
        s = z.boolean();
        break;
      case "select":
        if (c.opciones) {
          const e = z.enum(c.opciones.map((o) => o.value) as [string, ...string[]], { error: `${c.label}: elegí una opción` });
          s = "numerico" in c && c.numerico ? e.transform(Number) : e;
        } else {
          s = z.string().min(1, `${c.label}: elegí una opción`);
        }
        break;
      case "plazos":
        s = z.array(z.number().int().min(1).max(240)).min(1, `${c.label}: al menos un plazo`).max(30);
        break;
      case "hsp":
        s = z.array(z.number().min(0).max(12)).length(12, `${c.label}: faltan meses`);
        break;
      case "fecha":
        s = z.coerce.date({ error: `${c.label}: fecha inválida` });
        break;
    }
    forma[c.name] = c.opcional ? s.nullable() : s;
  }
  return z.object(forma);
}
