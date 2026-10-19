/**
 * Textos y casos del home. Editá acá para cambiar contenido sin tocar componentes.
 * Los casos son los dos proyectos públicos de Eco Lógica; sumá los que quieras mostrar.
 */

export const EMPRESA = {
  nombreCorto: "Eco Lógica",
  localidad: "Oncativo",
  provincia: "Córdoba",
  direccion: "Oncativo, Córdoba, Argentina",
  mapaQuery: "Oncativo, Córdoba, Argentina",
};

export const CASOS = [
  {
    titulo: "Planta fabril",
    segmento: "Industria",
    kw: 300,
    descripcion: "Sistema on-grid sobre la cubierta de una planta industrial. Reduce el costo energético de la producción diurna.",
    tono: "from-amber-400/30 to-orange-600/10",
  },
  {
    titulo: "Sistema sobre piso",
    segmento: "Comercio / Agro",
    kw: 30,
    descripcion: "Estructura sobre suelo para aprovechar terreno libre sin intervenir techos existentes.",
    tono: "from-lime-400/25 to-emerald-600/10",
  },
];

/** Generación específica estimada para Córdoba (kWh por kWp por año) para el contador de impacto. */
export const KWH_POR_KWP_ANIO = 1450;

export const PASOS_COMO_FUNCIONA = [
  {
    titulo: "Cotizás online",
    texto: "Respondés unas preguntas simples sobre tu consumo y tu techo. En 3 minutos ves el sistema, el ahorro y la cuota.",
  },
  {
    titulo: "Visita técnica",
    texto: "Un técnico mide el espacio, revisa la instalación eléctrica y te entrega el presupuesto final.",
  },
  {
    titulo: "Instalamos y tramitamos",
    texto: "Instalamos el sistema y gestionamos la conexión como usuario-generador ante la distribuidora.",
  },
];

export const FAQ = [
  {
    p: "¿Qué pasa con la energía que genero y no consumo?",
    r: "Con la generación distribuida, el excedente se inyecta a la red y la distribuidora te lo reconoce en la factura. El cotizador ya incluye ese valor en el ahorro.",
  },
  {
    p: "¿Los paneles funcionan en días nublados o en invierno?",
    r: "Sí, generan menos pero siguen generando. Por eso calculamos la producción mes a mes con la radiación de tu localidad: en verano generás más y en invierno menos.",
  },
  {
    p: "¿Si se corta la luz, tengo energía?",
    r: "Un sistema on-grid se desconecta por seguridad cuando se corta la red. Si querés respaldo ante cortes, podés sumar baterías en el paso «Objetivo» del cotizador.",
  },
  {
    p: "¿Cuánto duran los paneles?",
    r: "Los paneles tienen una vida útil de 25 años o más, con una pérdida de rendimiento cercana al 0,5 % anual. El inversor suele requerir recambio una vez en ese período.",
  },
  {
    p: "¿Cómo funciona el crédito Bancor?",
    r: "Bancor tiene líneas para personas (préstamo ecosustentable en UVA) y para empresas (tasa bonificada). El simulador te muestra la cuota, la TNA, la TEA y el CFT. La aprobación depende de la calificación crediticia del banco.",
  },
  {
    p: "¿Qué mantenimiento necesita?",
    r: "Muy poco: limpieza de los paneles un par de veces al año y un control visual del sistema. El inversor te muestra la generación en tiempo real.",
  },
];
