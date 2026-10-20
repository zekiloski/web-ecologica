/**
 * Textos del sitio. Editá acá para cambiar contenido sin tocar componentes.
 * Datos de contacto y "Nosotros" tomados de www.ecologica.com.ar. Los proyectos están en content/proyectos.ts.
 */

export const EMPRESA = {
  nombreCorto: "Eco Lógica",
  calle: "Tomás Garzón 1065",
  localidad: "Oncativo",
  provincia: "Córdoba",
  direccion: "Tomás Garzón 1065, Oncativo, Córdoba",
  mapaQuery: "Tomás Garzón 1065, Oncativo, Córdoba, Argentina",
  telefono: "(03572) 15 445884",
  email: "info@ecologica.com.ar",
  horarios: ["Lunes a viernes: 9 a 13 h y 16:30 a 19:30 h", "Sábados: 10 a 12 h"],
  redes: {
    facebook: "https://www.facebook.com/ecologicaOK/",
    instagram: "https://www.instagram.com/ecologicasas",
  },
};

export const NOSOTROS = {
  titulo: "Más de una década en Oncativo",
  texto:
    "Empezamos brindando servicios de telecomunicaciones en Oncativo y la zona. Con el tiempo incorporamos las energías renovables y hoy son nuestro centro: hacemos asesoramiento y diagnóstico energético para encontrar la mejor solución para cada hogar, comercio e industria.",
  mision: "Crear conciencia en el uso de energías alternativas para mejorar el medio ambiente y construir un futuro sustentable desde hoy.",
  vision: "Ser una empresa líder de Argentina en la instalación de equipos de energía solar.",
  servicios: [
    { titulo: "Solar eléctrica", texto: "Sistemas on-grid, off-grid e híbridos para hogares, comercios, industrias y campo." },
    { titulo: "Solar térmica", texto: "Termotanques solares: hasta un 80 % menos de gas para el agua caliente." },
    { titulo: "Climatización de piscinas", texto: "Climatización solar y bombas de calor de bajo consumo." },
  ],
};

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
