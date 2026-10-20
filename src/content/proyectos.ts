/**
 * Proyectos realizados por Eco Lógica (fuente: www.ecologica.com.ar/proyectos).
 * Las fotos están en public/proyectos/<slug>/. Para sumar un proyecto, agregá un objeto y sus fotos.
 * Archivo generado a partir de la galería de la web anterior; se puede editar a mano.
 */
import type { Segmento } from "@/lib/schemas";

export interface FotoProyecto {
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  /** object-position para el recorte de portada (ej. "center 85%"). */
  posicion?: string;
}

export interface Proyecto {
  slug: string;
  nombre: string;
  kw: number;
  segmento: Segmento;
  tipo: "On-grid" | "Off-grid" | "Híbrido" | "Riego";
  detalle: string;
  descripcion: string;
  localidad?: string;
  destacado?: boolean;
  fotos: FotoProyecto[];
}

export const PROYECTOS: Proyecto[] = [
  {
    "slug": "macoser",
    "nombre": "Macoser S.A.",
    "kw": 300,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "5 inversores GoodWe de 60 kW · 580 paneles de 570 Wp",
    "descripcion": "Instalación de 300 kW con acople a la red sobre la cubierta de la planta fabril.",
    "fotos": [
      {
        "src": "/proyectos/macoser/1.webp",
        "alt": "Paneles sobre la cubierta de la planta Macoser",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/macoser/2.webp",
        "alt": "Planta Macoser con la obra terminada",
        "ancho": 1024,
        "alto": 768
      },
      {
        "src": "/proyectos/macoser/3.webp",
        "alt": "Montaje de paneles en Macoser",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/macoser/4.webp",
        "alt": "Instalación en curso en Macoser",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/macoser/5.webp",
        "alt": "Cinco inversores GoodWe de 60 kW",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/macoser/6.webp",
        "alt": "Inversores GoodWe de 60 kW",
        "ancho": 900,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "poly-bell",
    "nombre": "Poly Bell S.R.L.",
    "kw": 160,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "432 paneles de 450 Wp (194,4 kWp) · 2 inversores GoodWe de 80 kW",
    "descripcion": "Planta industrial con 160 kW de potencia de inyección.",
    "fotos": [
      {
        "src": "/proyectos/poly-bell/1.webp",
        "alt": "432 paneles de 450 Wp sobre la cubierta de Poly Bell",
        "ancho": 1599,
        "alto": 1200
      },
      {
        "src": "/proyectos/poly-bell/2.webp",
        "alt": "Vista de los paneles en Poly Bell",
        "ancho": 1599,
        "alto": 1200
      },
      {
        "src": "/proyectos/poly-bell/3.webp",
        "alt": "Paneles solares en Poly Bell",
        "ancho": 1599,
        "alto": 1200
      },
      {
        "src": "/proyectos/poly-bell/4.webp",
        "alt": "Dos inversores GoodWe de 80 kW",
        "ancho": 1280,
        "alto": 958
      },
      {
        "src": "/proyectos/poly-bell/5.webp",
        "alt": "Conexionado para 160 kW",
        "ancho": 958,
        "alto": 1280
      }
    ]
  },
  {
    "slug": "tasto",
    "nombre": "Tasto Ingeniería Plástica",
    "kw": 160,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "2 inversores GoodWe de 80 kW",
    "descripcion": "Instalación de 160 kW sobre la planta de inyección de plásticos.",
    "fotos": [
      {
        "src": "/proyectos/tasto/1.webp",
        "alt": "Instalación de Tasto al atardecer",
        "ancho": 1280,
        "alto": 606
      },
      {
        "src": "/proyectos/tasto/2.webp",
        "alt": "Instalación finalizada de 160 kW",
        "ancho": 1600,
        "alto": 685
      },
      {
        "src": "/proyectos/tasto/3.webp",
        "alt": "Vista de los paneles en Tasto",
        "ancho": 1280,
        "alto": 606
      },
      {
        "src": "/proyectos/tasto/4.webp",
        "alt": "Instalando los inversores GoodWe de 80 kW",
        "ancho": 685,
        "alto": 1600
      },
      {
        "src": "/proyectos/tasto/5.webp",
        "alt": "Instalación terminada en Tasto",
        "ancho": 960,
        "alto": 1280
      }
    ]
  },
  {
    "slug": "econovo",
    "nombre": "Econovo",
    "kw": 160,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "2 inversores Growatt de 80 kW",
    "descripcion": "160 kW sobre la planta industrial y el techo de la playa de estacionamiento.",
    "fotos": [
      {
        "src": "/proyectos/econovo/1.webp",
        "alt": "Frente de la planta Econovo con paneles sobre la playa de estacionamiento",
        "ancho": 1600,
        "alto": 685
      },
      {
        "src": "/proyectos/econovo/2.webp",
        "alt": "Paneles sobre la cochera de Econovo",
        "ancho": 1600,
        "alto": 685
      },
      {
        "src": "/proyectos/econovo/3.webp",
        "alt": "Inversores Growatt instalados",
        "ancho": 864,
        "alto": 1152
      },
      {
        "src": "/proyectos/econovo/4.webp",
        "alt": "Sala de inversores",
        "ancho": 864,
        "alto": 1152
      },
      {
        "src": "/proyectos/econovo/5.webp",
        "alt": "Tablero de conexiones",
        "ancho": 864,
        "alto": 1152
      }
    ]
  },
  {
    "slug": "ing-plastica-las-varillas",
    "nombre": "Ingeniería Plástica Las Varillas",
    "kw": 80,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "localidad": "Las Varillas",
    "detalle": "80 kWp · inversor GoodWe de 80 kW",
    "descripcion": "Instalación de 80 kWp sobre la planta industrial.",
    "fotos": [
      {
        "src": "/proyectos/ing-plastica-las-varillas/1.webp",
        "alt": "Paneles en la planta de Las Varillas",
        "ancho": 1032,
        "alto": 581
      },
      {
        "src": "/proyectos/ing-plastica-las-varillas/2.webp",
        "alt": "80 kWp de paneles",
        "ancho": 1032,
        "alto": 581
      },
      {
        "src": "/proyectos/ing-plastica-las-varillas/3.webp",
        "alt": "Inversor GoodWe de 80 kW",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/ing-plastica-las-varillas/4.webp",
        "alt": "Tablero de protecciones",
        "ancho": 1200,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "ovocor",
    "nombre": "OVOCOR",
    "kw": 80,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "200 paneles de 400 Wp · inversor GoodWe de 80 kW",
    "descripcion": "80 kW sobre el techo de la fábrica, con sala de generación y distribución.",
    "fotos": [
      {
        "src": "/proyectos/ovocor/1.webp",
        "alt": "Techo principal de la fábrica OVOCOR",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/ovocor/2.webp",
        "alt": "Paneles sobre el techo de OVOCOR",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/ovocor/3.webp",
        "alt": "Vista del techo de la fábrica",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/ovocor/4.webp",
        "alt": "200 paneles de 400 Wp",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/ovocor/5.webp",
        "alt": "Inversor GoodWe de 80 kW",
        "ancho": 864,
        "alto": 1152
      }
    ]
  },
  {
    "slug": "don-romualdo",
    "nombre": "Tambo Don Romualdo",
    "kw": 75,
    "segmento": "AGRO",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "75 kW sobre el tambo",
    "descripcion": "Tambo modelo que genera su propia energía para el ordeñe y el enfriado de leche.",
    "fotos": [
      {
        "src": "/proyectos/don-romualdo/1.webp",
        "alt": "Paneles sobre el tambo Don Romualdo al atardecer",
        "ancho": 960,
        "alto": 1280
      },
      {
        "src": "/proyectos/don-romualdo/2.webp",
        "alt": "Entrada al tambo Don Romualdo",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/don-romualdo/3.webp",
        "alt": "Tres inversores instalados en el tambo",
        "ancho": 1600,
        "alto": 685
      },
      {
        "src": "/proyectos/don-romualdo/4.webp",
        "alt": "Inversores y tablero de protecciones",
        "ancho": 1600,
        "alto": 685
      },
      {
        "src": "/proyectos/don-romualdo/5.webp",
        "alt": "Tablero de protecciones",
        "ancho": 685,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "san-rafael-del-rio",
    "nombre": "San Rafael del Río",
    "kw": 60,
    "segmento": "AGRO",
    "tipo": "Riego",
    "detalle": "2 inversores GoodWe de 30 kW · bomba de 60 HP",
    "descripcion": "Solarización de una bomba de riego de 60 HP.",
    "fotos": [
      {
        "src": "/proyectos/san-rafael-del-rio/1.webp",
        "alt": "Estructura con paneles para riego",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/san-rafael-del-rio/2.webp",
        "alt": "Estructura de paneles en el campo",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/san-rafael-del-rio/3.webp",
        "alt": "Paneles sobre estructura en el campo",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/san-rafael-del-rio/4.webp",
        "alt": "Inversores GoodWe de 30 kW",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/san-rafael-del-rio/5.webp",
        "alt": "Inversores para la bomba de riego",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "riego-oscar-manera",
    "nombre": "Riego Oscar Manera",
    "kw": 50,
    "segmento": "AGRO",
    "tipo": "Riego",
    "destacado": true,
    "detalle": "80 paneles bifaciales de 700 Wp · inversor GoodWe de 50 kW",
    "descripcion": "Cuatro mesas de aluminio de 20 paneles cada una, con cableado embutido en la estructura.",
    "fotos": [
      {
        "src": "/proyectos/riego-oscar-manera/1.webp",
        "alt": "Estructuras de aluminio con 20 paneles de 700 Wp por mesa",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/riego-oscar-manera/2.webp",
        "alt": "Estructura de aluminio en el campo",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/riego-oscar-manera/3.webp",
        "alt": "Inversor GoodWe de 50 kW",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/riego-oscar-manera/4.webp",
        "alt": "Tablero de protecciones del inversor",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/riego-oscar-manera/5.webp",
        "alt": "Llave de corte por string",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "grinovo",
    "nombre": "Grinovo",
    "kw": 50,
    "segmento": "AGRO",
    "tipo": "On-grid",
    "detalle": "Inversor GoodWe de 50 kW",
    "descripcion": "Instalación sobre la planta avícola.",
    "fotos": [
      {
        "src": "/proyectos/grinovo/1.webp",
        "alt": "Frente de la planta avícola Grinovo con paneles",
        "ancho": 1280,
        "alto": 673
      },
      {
        "src": "/proyectos/grinovo/2.webp",
        "alt": "Vista lateral de la planta Grinovo",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/grinovo/3.webp",
        "alt": "Inversor GoodWe de 50 kW",
        "ancho": 1152,
        "alto": 864
      }
    ]
  },
  {
    "slug": "paseo-de-la-estacion",
    "nombre": "Paseo de la Estación",
    "kw": 50,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "50 kW sobre centro comercial",
    "descripcion": "Instalación de 50 kW con acople a la red sobre un centro comercial.",
    "fotos": [
      {
        "src": "/proyectos/paseo-de-la-estacion/1.webp",
        "alt": "Panorámica de la instalación en Paseo de la Estación",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/paseo-de-la-estacion/2.webp",
        "alt": "Vista lateral de los paneles",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/paseo-de-la-estacion/3.webp",
        "alt": "Panorámica del techo",
        "ancho": 947,
        "alto": 947
      },
      {
        "src": "/proyectos/paseo-de-la-estacion/4.webp",
        "alt": "Montaje y protecciones eléctricas",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/paseo-de-la-estacion/5.webp",
        "alt": "Inversores solares",
        "ancho": 900,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "metalurgica-san-vicente",
    "nombre": "Metalúrgica San Vicente",
    "kw": 30,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "localidad": "Ferreyra, Córdoba",
    "detalle": "90 paneles · inversor GoodWe de 30 kW",
    "descripcion": "Fábrica de puentes grúa con 30 kW conectados a la red.",
    "fotos": [
      {
        "src": "/proyectos/metalurgica-san-vicente/1.webp",
        "alt": "90 paneles solares en Metalúrgica San Vicente",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/metalurgica-san-vicente/2.webp",
        "alt": "Estructura y paneles",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/metalurgica-san-vicente/3.webp",
        "alt": "Fachada de Metalúrgica San Vicente",
        "ancho": 852,
        "alto": 462
      },
      {
        "src": "/proyectos/metalurgica-san-vicente/4.webp",
        "alt": "Inversor GoodWe de 30 kW",
        "ancho": 1024,
        "alto": 1365
      }
    ]
  },
  {
    "slug": "shell-el-triunfo",
    "nombre": "Shell «El Triunfo»",
    "kw": 30,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "destacado": true,
    "detalle": "30 kWp sobre piso",
    "descripcion": "Estación de servicio con paneles montados sobre piso.",
    "fotos": [
      {
        "src": "/proyectos/shell-el-triunfo/1.webp",
        "alt": "Paneles sobre piso en la estación Shell El Triunfo",
        "ancho": 1600,
        "alto": 898
      },
      {
        "src": "/proyectos/shell-el-triunfo/2.webp",
        "alt": "Emplazamiento de paneles de 30 kWp",
        "ancho": 1600,
        "alto": 898
      },
      {
        "src": "/proyectos/shell-el-triunfo/3.webp",
        "alt": "Vista de la instalación",
        "ancho": 1331,
        "alto": 747
      }
    ]
  },
  {
    "slug": "sica",
    "nombre": "SICA S.A.",
    "kw": 30,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "detalle": "Paneles de 505 Wp · inversor GoodWe de 30 kW",
    "descripcion": "Instalación de 30 kWp con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/sica/1.webp",
        "alt": "Panorámica de los paneles en SICA",
        "ancho": 1600,
        "alto": 900
      },
      {
        "src": "/proyectos/sica/2.webp",
        "alt": "Instalación de paneles de 505 Wp",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/sica/3.webp",
        "alt": "Inversor GoodWe de 30 kW y protecciones",
        "ancho": 900,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "grupo-margaria",
    "nombre": "Grupo Margaría (Puma)",
    "kw": 30,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "Paneles TOPCon de 580 Wp · inversor GoodWe de 30 kW",
    "descripcion": "30 kWp con paneles de última generación.",
    "fotos": [
      {
        "src": "/proyectos/grupo-margaria/1.webp",
        "alt": "Paneles TOPCon de 580 Wp",
        "ancho": 960,
        "alto": 1280
      },
      {
        "src": "/proyectos/grupo-margaria/2.webp",
        "alt": "Vista de los paneles",
        "ancho": 720,
        "alto": 534
      },
      {
        "src": "/proyectos/grupo-margaria/3.webp",
        "alt": "Inversor GoodWe de 30 kW",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "barbuy-team",
    "nombre": "Barbuy Team Argentina",
    "kw": 30,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "Inversor de 30 kW",
    "descripcion": "Instalación de 30 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/barbuy-team/1.webp",
        "alt": "Vista frontal de la instalación en Barbuy Team",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/barbuy-team/2.webp",
        "alt": "Vista lateral de los paneles",
        "ancho": 960,
        "alto": 1280
      }
    ]
  },
  {
    "slug": "musicalisimo",
    "nombre": "Musicalísimo",
    "kw": 30,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "Inversor GoodWe de 30 kW",
    "descripcion": "Comercio con 30 kW de generación propia.",
    "fotos": [
      {
        "src": "/proyectos/musicalisimo/1.webp",
        "alt": "Paneles en Musicalísimo",
        "ancho": 1024,
        "alto": 768
      },
      {
        "src": "/proyectos/musicalisimo/2.webp",
        "alt": "Subiendo los paneles al techo",
        "ancho": 1200,
        "alto": 1600
      },
      {
        "src": "/proyectos/musicalisimo/3.webp",
        "alt": "Inversor GoodWe de 30 kW con tablero de protecciones",
        "ancho": 768,
        "alto": 1024
      }
    ]
  },
  {
    "slug": "nono-luigi",
    "nombre": "Hotel de campo Nono Luigi",
    "kw": 25,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "25 kWp + climatización de piscina con bomba de calor",
    "descripcion": "Hotel de campo con generación solar y piscina climatizada con bomba de calor.",
    "fotos": [
      {
        "src": "/proyectos/nono-luigi/1.webp",
        "alt": "Montaje de paneles en el hotel Nono Luigi",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/nono-luigi/2.webp",
        "alt": "Piscina climatizada con bomba de calor",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/nono-luigi/3.webp",
        "alt": "Bomba de calor por aerotermia",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/nono-luigi/4.webp",
        "alt": "Puesta en marcha del inversor",
        "ancho": 1280,
        "alto": 960
      }
    ]
  },
  {
    "slug": "san-isidro-maquinarias",
    "nombre": "San Isidro Maquinarias",
    "kw": 25,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "25 kW sobre techo comercial",
    "descripcion": "Instalación de 25 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/san-isidro-maquinarias/1.webp",
        "alt": "Panorámica de los paneles en San Isidro Maquinarias",
        "ancho": 816,
        "alto": 613
      },
      {
        "src": "/proyectos/san-isidro-maquinarias/2.webp",
        "alt": "Strings de paneles",
        "ancho": 868,
        "alto": 1156
      },
      {
        "src": "/proyectos/san-isidro-maquinarias/3.webp",
        "alt": "Vista de los paneles",
        "ancho": 868,
        "alto": 1156
      },
      {
        "src": "/proyectos/san-isidro-maquinarias/4.webp",
        "alt": "Inversor y tablero",
        "ancho": 1200,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "expreso-lancioni-cordoba",
    "nombre": "Expreso Lancioni (Córdoba)",
    "kw": 25,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "localidad": "Córdoba",
    "detalle": "25 kW",
    "descripcion": "Sucursal Córdoba de la empresa de transporte.",
    "fotos": [
      {
        "src": "/proyectos/expreso-lancioni-cordoba/1.webp",
        "alt": "Instalación de 25 kW en Expreso Lancioni Córdoba",
        "ancho": 1032,
        "alto": 581
      },
      {
        "src": "/proyectos/expreso-lancioni-cordoba/2.webp",
        "alt": "Vista trasera de la instalación",
        "ancho": 1032,
        "alto": 581
      },
      {
        "src": "/proyectos/expreso-lancioni-cordoba/3.webp",
        "alt": "Vista lateral de la instalación",
        "ancho": 1032,
        "alto": 581
      }
    ]
  },
  {
    "slug": "transcal",
    "nombre": "Transcal S.R.L.",
    "kw": 25,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "25 kWp · inversor GoodWe de 25 kW",
    "descripcion": "Instalación de 25 kWp con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/transcal/1.webp",
        "alt": "Paneles de 25 kWp en Transcal",
        "ancho": 1152,
        "alto": 864
      },
      {
        "src": "/proyectos/transcal/2.webp",
        "alt": "Inversor GoodWe de 25 kW",
        "ancho": 864,
        "alto": 1152
      }
    ]
  },
  {
    "slug": "4-soles",
    "nombre": "4 Soles",
    "kw": 25,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "localidad": "Villa de Soto",
    "detalle": "Inversor GoodWe de 25 kW",
    "descripcion": "Instalación de 25 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/4-soles/1.webp",
        "alt": "Instalación en 4 Soles",
        "ancho": 1600,
        "alto": 684
      },
      {
        "src": "/proyectos/4-soles/2.webp",
        "alt": "Vista posterior",
        "ancho": 1600,
        "alto": 684
      },
      {
        "src": "/proyectos/4-soles/3.webp",
        "alt": "Inversor GoodWe de 25 kW",
        "ancho": 684,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "verduleria-ghione",
    "nombre": "Verdulería Ghione",
    "kw": 15,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "localidad": "Oncativo",
    "detalle": "17,5 kWp · trifásico 15 kW · paneles monocristalinos PERC",
    "descripcion": "Comercio de Oncativo con instalación trifásica en baja tensión.",
    "fotos": [
      {
        "src": "/proyectos/verduleria-ghione/1.webp",
        "alt": "Panorámica de los paneles en Verdulería Ghione",
        "ancho": 1600,
        "alto": 647
      },
      {
        "src": "/proyectos/verduleria-ghione/2.webp",
        "alt": "Techo completo con paneles",
        "ancho": 1155,
        "alto": 866
      },
      {
        "src": "/proyectos/verduleria-ghione/3.webp",
        "alt": "Vista frontal de los paneles",
        "ancho": 1280,
        "alto": 947
      },
      {
        "src": "/proyectos/verduleria-ghione/4.webp",
        "alt": "Fachada de Verdulería Ghione",
        "ancho": 888,
        "alto": 489
      },
      {
        "src": "/proyectos/verduleria-ghione/5.webp",
        "alt": "Inversor y tablero de protecciones",
        "ancho": 1200,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "tambo-vagliente",
    "nombre": "Tambo Vagliente",
    "kw": 15,
    "segmento": "AGRO",
    "tipo": "On-grid",
    "detalle": "15,4 kWp con paneles de 550 Wp · inversor GoodWe de 15 kW",
    "descripcion": "Tambo con generación solar para el consumo diario.",
    "fotos": [
      {
        "src": "/proyectos/tambo-vagliente/1.webp",
        "alt": "Paneles sobre el tambo Vagliente",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/tambo-vagliente/2.webp",
        "alt": "Instalación de paneles de 550 Wp",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/tambo-vagliente/3.webp",
        "alt": "Inversor GoodWe de 15 kW",
        "ancho": 960,
        "alto": 1280
      }
    ]
  },
  {
    "slug": "arduino",
    "nombre": "Arduino S.R.L.",
    "kw": 15,
    "segmento": "INDUSTRIA",
    "tipo": "Híbrido",
    "detalle": "17,4 kWp TOPCon · 15 kW on-grid + respaldo de 5 kW con litio",
    "descripcion": "Inyección y autoconsumo, más un sistema de respaldo para luces, computadoras e internet.",
    "fotos": [
      {
        "src": "/proyectos/arduino/1.webp",
        "alt": "Paneles TOPCon de 580 Wp",
        "ancho": 1332,
        "alto": 1600
      },
      {
        "src": "/proyectos/arduino/2.webp",
        "alt": "Vista de los paneles",
        "ancho": 1332,
        "alto": 1600
      },
      {
        "src": "/proyectos/arduino/3.webp",
        "alt": "Inversor on-grid GoodWe de 15 kW",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/arduino/4.webp",
        "alt": "Batería de litio Growatt de 5 kW",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "embutidos-ciriacci-bsas",
    "nombre": "Embutidos Ciriacci (Buenos Aires)",
    "kw": 15,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "localidad": "Buenos Aires",
    "detalle": "Paneles Luxen de 550 Wp · inversor GoodWe de 15 kW",
    "descripcion": "Planta de embutidos con 15 kW conectados a la red.",
    "fotos": [
      {
        "src": "/proyectos/embutidos-ciriacci-bsas/1.webp",
        "alt": "Paneles monocristalinos de 550 Wp en Embutidos Ciriacci",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/embutidos-ciriacci-bsas/2.webp",
        "alt": "Inversor GoodWe de 15 kW",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/embutidos-ciriacci-bsas/3.webp",
        "alt": "Inversor y protecciones",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "alimentos-frescos",
    "nombre": "Alimentos Frescos",
    "kw": 15,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "detalle": "Paneles monocristalinos de 550 Wp · inversor GoodWe de 15 kW",
    "descripcion": "Instalación de 15 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/alimentos-frescos/1.webp",
        "alt": "Paneles monocristalinos en Alimentos Frescos",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/alimentos-frescos/2.webp",
        "alt": "Vista de los paneles",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/alimentos-frescos/3.webp",
        "alt": "Inversor GoodWe de 15 kW",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "veneranda",
    "nombre": "Veneranda S.A.",
    "kw": 15,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "detalle": "15 kW on-grid",
    "descripcion": "Instalación de 15 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/veneranda/1.webp",
        "alt": "Paneles sobre el techo de Veneranda",
        "ancho": 720,
        "alto": 1093,
        "posicion": "center 85%"
      },
      {
        "src": "/proyectos/veneranda/2.webp",
        "alt": "Inversor de 15 kW",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "expreso-lancioni",
    "nombre": "Expreso Lancioni (taller)",
    "kw": 10,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "10 kW",
    "descripcion": "Instalación de 10 kW con acople a la red sobre el taller.",
    "fotos": [
      {
        "src": "/proyectos/expreso-lancioni/1.webp",
        "alt": "Panorámica de la instalación en el taller de Expreso Lancioni",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/expreso-lancioni/2.webp",
        "alt": "Vista frontal",
        "ancho": 960,
        "alto": 960
      },
      {
        "src": "/proyectos/expreso-lancioni/3.webp",
        "alt": "Inversor y protecciones",
        "ancho": 1280,
        "alto": 960
      }
    ]
  },
  {
    "slug": "embutidos-ciriacci-uruguay",
    "nombre": "Embutidos Ciriacci (Uruguay)",
    "kw": 10,
    "segmento": "INDUSTRIA",
    "tipo": "On-grid",
    "localidad": "Uruguay",
    "detalle": "10 kW on-grid",
    "descripcion": "Instalación de 10 kW con acople a la red.",
    "fotos": [
      {
        "src": "/proyectos/embutidos-ciriacci-uruguay/1.webp",
        "alt": "Paneles en Embutidos Ciriacci Uruguay",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/embutidos-ciriacci-uruguay/2.webp",
        "alt": "Vista de los paneles",
        "ancho": 1333,
        "alto": 1600
      },
      {
        "src": "/proyectos/embutidos-ciriacci-uruguay/3.webp",
        "alt": "Inversor de 10 kW",
        "ancho": 624,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "inta-manfredi",
    "nombre": "INTA Manfredi",
    "kw": 10,
    "segmento": "AGRO",
    "tipo": "Riego",
    "localidad": "Manfredi",
    "detalle": "Equipo suplementario de 10 kW",
    "descripcion": "Equipo solar suplementario para riego en la estación experimental.",
    "fotos": [
      {
        "src": "/proyectos/inta-manfredi/1.webp",
        "alt": "Equipo solar para riego en INTA Manfredi",
        "ancho": 900,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "farmacia-dezotti",
    "nombre": "Farmacia Dezotti",
    "kw": 6,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "6 kW",
    "descripcion": "Farmacia con 6 kW de generación propia.",
    "fotos": [
      {
        "src": "/proyectos/farmacia-dezotti/1.webp",
        "alt": "Vista aérea de la instalación en Farmacia Dezotti",
        "ancho": 1200,
        "alto": 1600
      },
      {
        "src": "/proyectos/farmacia-dezotti/2.webp",
        "alt": "Vista lateral de los paneles",
        "ancho": 1200,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "casa-del-bel",
    "nombre": "Casa Del Bel",
    "kw": 6,
    "segmento": "HOGAR",
    "tipo": "On-grid",
    "detalle": "6 kW monofásico",
    "descripcion": "Vivienda con sistema on-grid de 6 kW.",
    "fotos": [
      {
        "src": "/proyectos/casa-del-bel/1.webp",
        "alt": "Paneles en la casa Del Bel",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/casa-del-bel/2.webp",
        "alt": "Vista de la instalación",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/casa-del-bel/3.webp",
        "alt": "Paneles sobre el techo",
        "ancho": 1333,
        "alto": 1600
      }
    ]
  },
  {
    "slug": "casa-san-antonio-de-arredondo",
    "nombre": "Casa en San Antonio de Arredondo",
    "kw": 6,
    "segmento": "HOGAR",
    "tipo": "On-grid",
    "localidad": "San Antonio de Arredondo",
    "detalle": "Inversor GoodWe de 6 kW",
    "descripcion": "Vivienda con 6 kW conectados a la red.",
    "fotos": [
      {
        "src": "/proyectos/casa-san-antonio-de-arredondo/1.webp",
        "alt": "Paneles sobre el techo de la casa",
        "ancho": 1080,
        "alto": 1080
      },
      {
        "src": "/proyectos/casa-san-antonio-de-arredondo/2.webp",
        "alt": "Inversor GoodWe de 6 kW",
        "ancho": 1080,
        "alto": 1080
      }
    ]
  },
  {
    "slug": "casa-cordoba",
    "nombre": "Casa en Córdoba",
    "kw": 4.2,
    "segmento": "HOGAR",
    "tipo": "On-grid",
    "localidad": "Córdoba",
    "detalle": "4,2 kW",
    "descripcion": "Vivienda con 4,2 kW conectados a la red.",
    "fotos": [
      {
        "src": "/proyectos/casa-cordoba/1.webp",
        "alt": "Paneles sobre la casa en Córdoba",
        "ancho": 1280,
        "alto": 720
      },
      {
        "src": "/proyectos/casa-cordoba/2.webp",
        "alt": "Vista de los paneles",
        "ancho": 720,
        "alto": 1280
      },
      {
        "src": "/proyectos/casa-cordoba/3.webp",
        "alt": "Instalación en el techo",
        "ancho": 720,
        "alto": 1280
      }
    ]
  },
  {
    "slug": "cabana-el-durazno",
    "nombre": "Cabaña en El Durazno",
    "kw": 3.4,
    "segmento": "HOGAR",
    "tipo": "Off-grid",
    "localidad": "El Durazno",
    "detalle": "12 paneles de 285 Wp · Power Rack de 5 kW",
    "descripcion": "Cabaña autónoma con baterías, sin conexión a la red.",
    "fotos": [
      {
        "src": "/proyectos/cabana-el-durazno/1.webp",
        "alt": "Paneles en la cabaña de El Durazno",
        "ancho": 1600,
        "alto": 1200
      },
      {
        "src": "/proyectos/cabana-el-durazno/2.webp",
        "alt": "12 paneles de 285 Wp",
        "ancho": 1280,
        "alto": 960
      },
      {
        "src": "/proyectos/cabana-el-durazno/3.webp",
        "alt": "Power Rack de 5 kW",
        "ancho": 960,
        "alto": 1280
      },
      {
        "src": "/proyectos/cabana-el-durazno/4.webp",
        "alt": "Instalación en El Durazno",
        "ancho": 768,
        "alto": 1024
      }
    ]
  },
  {
    "slug": "residencial-trifasico",
    "nombre": "Residencial trifásico",
    "kw": 3,
    "segmento": "HOGAR",
    "tipo": "On-grid",
    "detalle": "9 paneles policristalinos de 280 W · inversor Growatt trifásico de 3 kW",
    "descripcion": "Vivienda con instalación trifásica conectada a la red.",
    "fotos": [
      {
        "src": "/proyectos/residencial-trifasico/1.webp",
        "alt": "Paneles sobre techo residencial",
        "ancho": 815,
        "alto": 596
      },
      {
        "src": "/proyectos/residencial-trifasico/2.webp",
        "alt": "Nueve paneles de 280 W",
        "ancho": 814,
        "alto": 609
      },
      {
        "src": "/proyectos/residencial-trifasico/3.webp",
        "alt": "Inversor trifásico y tableros",
        "ancho": 436,
        "alto": 608
      }
    ]
  },
  {
    "slug": "estudio-abaco",
    "nombre": "Estudio Ábaco",
    "kw": 3,
    "segmento": "COMERCIO",
    "tipo": "On-grid",
    "detalle": "3 kW · inversor GoodWe",
    "descripcion": "Estudio contable con 3 kW conectados a la red.",
    "fotos": [
      {
        "src": "/proyectos/estudio-abaco/1.webp",
        "alt": "Paneles sobre el Estudio Ábaco",
        "ancho": 1080,
        "alto": 810
      },
      {
        "src": "/proyectos/estudio-abaco/2.webp",
        "alt": "Área de paneles",
        "ancho": 1080,
        "alto": 1080
      },
      {
        "src": "/proyectos/estudio-abaco/3.webp",
        "alt": "Inversor GoodWe y tablero",
        "ancho": 1080,
        "alto": 810
      }
    ]
  },
  {
    "slug": "campo-ausonia",
    "nombre": "Campo en Ausonia",
    "kw": 3,
    "segmento": "AGRO",
    "tipo": "Off-grid",
    "localidad": "Ausonia",
    "detalle": "Paneles de 330 Wp · inversor Growatt de 3 kW · 4,8 kWh de baterías",
    "descripcion": "Sistema autónomo para un establecimiento rural, montado sobre pilotes de cemento.",
    "fotos": [
      {
        "src": "/proyectos/campo-ausonia/1.webp",
        "alt": "Paneles en el campo de Ausonia",
        "ancho": 1024,
        "alto": 768
      },
      {
        "src": "/proyectos/campo-ausonia/2.webp",
        "alt": "Montaje sobre pilotes de cemento",
        "ancho": 1024,
        "alto": 768
      },
      {
        "src": "/proyectos/campo-ausonia/3.webp",
        "alt": "Inversor Growatt de 3 kW",
        "ancho": 768,
        "alto": 1024
      },
      {
        "src": "/proyectos/campo-ausonia/4.webp",
        "alt": "Estructura de aluminio",
        "ancho": 768,
        "alto": 1024
      }
    ]
  }
];
