/**
 * Datos de ejemplo para arrancar. Todos los valores (tarifas, tasas, precios, UVA) son de REFERENCIA
 * y se actualizan desde /admin. El seed solo corre si la base está vacía, para no pisar cambios del admin.
 */
import { PrismaClient, Segmento, TipoTecho, Destinatario } from "@prisma/client";

const prisma = new PrismaClient();

// HSP mensual aproximado para Córdoba con paneles inclinados a la latitud (ene → dic). Promedio ≈ 5,1.
const HSP_CORDOBA = [6.4, 6.0, 5.3, 4.5, 3.8, 3.4, 3.7, 4.5, 5.2, 5.8, 6.3, 6.5];

const LEGAL_BANCOR =
  "Simulación orientativa. Las cuotas en UVA se ajustan por inflación. Sujeto a calificación crediticia y aprobación de Bancor. Las condiciones pueden variar.";

async function main() {
  if (await prisma.configuracion.findUnique({ where: { id: 1 } })) {
    console.log("La base ya tiene datos: seed omitido.");
    return;
  }

  await prisma.configuracion.create({
    data: {
      id: 1,
      empresaNombre: "Eco Lógica S.A.S",
      whatsapp: "5493572445884",
      emailNotificaciones: "info@ecologica.com.ar",
      valorUVA: 1650,
      valorUVAFecha: new Date(),
    },
  });

  const epec = await prisma.distribuidora.create({
    data: {
      nombre: "EPEC",
      precioInyeccion: 95,
      tarifas: {
        create: [
          { categoria: "Residencial", segmento: Segmento.HOGAR, precioKwh: 210, cargoFijo: 8000, vigenteDesde: new Date() },
          { categoria: "General", segmento: Segmento.COMERCIO, precioKwh: 235, cargoFijo: 15000, vigenteDesde: new Date() },
          { categoria: "Grandes consumos", segmento: Segmento.INDUSTRIA, precioKwh: 190, cargoFijo: 60000, vigenteDesde: new Date() },
          { categoria: "Rural", segmento: Segmento.AGRO, precioKwh: 220, cargoFijo: 12000, vigenteDesde: new Date() },
        ],
      },
    },
  });

  const coop = await prisma.distribuidora.create({
    data: {
      nombre: "Cooperativa local",
      precioInyeccion: 90,
      tarifas: {
        create: [
          { categoria: "Residencial", segmento: Segmento.HOGAR, precioKwh: 225, cargoFijo: 9000, vigenteDesde: new Date() },
          { categoria: "General", segmento: Segmento.COMERCIO, precioKwh: 245, cargoFijo: 16000, vigenteDesde: new Date() },
          { categoria: "Grandes consumos", segmento: Segmento.INDUSTRIA, precioKwh: 200, cargoFijo: 60000, vigenteDesde: new Date() },
          { categoria: "Rural", segmento: Segmento.AGRO, precioKwh: 230, cargoFijo: 12000, vigenteDesde: new Date() },
        ],
      },
    },
  });

  const localidades: [string, string][] = [
    ["Córdoba", epec.id],
    ["Oncativo", coop.id],
    ["Villa María", epec.id],
    ["Río Cuarto", epec.id],
    ["Río Tercero", coop.id],
    ["Villa Carlos Paz", epec.id],
    ["San Francisco", epec.id],
    ["Jesús María", coop.id],
    ["Laguna Larga", coop.id],
    ["Pilar", coop.id],
  ];
  await prisma.localidad.createMany({
    data: localidades.map(([nombre, distribuidoraId]) => ({ provincia: "Córdoba", nombre, hspMensual: HSP_CORDOBA, distribuidoraId })),
  });

  await prisma.panel.createMany({
    data: [
      { marca: "Genérico Tier 1", modelo: "Mono N-Type 580 W", wp: 580, m2: 2.58, precio: 210000, predeterminado: true },
      { marca: "Genérico Tier 1", modelo: "Mono N-Type 620 W", wp: 620, m2: 2.79, precio: 235000 },
    ],
  });

  await prisma.inversor.createMany({
    data: [
      ...[3, 5, 6, 8, 10].map((kw) => ({ marca: "Genérico", modelo: `On-grid ${kw} kW monofásico`, kw, fases: 1, precio: 450000 + kw * 120000 })),
      ...[10, 15, 20, 25, 30, 50, 60, 100].map((kw) => ({ marca: "Genérico", modelo: `On-grid ${kw} kW trifásico`, kw, fases: 3, precio: 700000 + kw * 110000 })),
      { marca: "Genérico", modelo: "Híbrido 6 kW monofásico", kw: 6, fases: 1, hibrido: true, precio: 1900000 },
    ],
  });

  await prisma.bateria.createMany({
    data: [
      { marca: "Genérico", modelo: "Litio LFP 5 kWh", kwh: 5, precio: 2800000 },
      { marca: "Genérico", modelo: "Litio LFP 10 kWh", kwh: 10, precio: 5200000 },
    ],
  });

  await prisma.estructura.createMany({
    data: [
      { tipoTecho: TipoTecho.CHAPA, precioPorPanel: 35000 },
      { tipoTecho: TipoTecho.LOSA, precioPorPanel: 60000 },
      { tipoTecho: TipoTecho.TEJA, precioPorPanel: 55000 },
      { tipoTecho: TipoTecho.SUELO, precioPorPanel: 110000 },
    ],
  });

  // $/kWp instalado (equipos + mano de obra) y costo fijo de instalación por escala.
  const escalaComercial = [
    { kwpDesde: 0, kwpHasta: 20, precioPorKwp: 1300000, costoFijoInst: 900000 },
    { kwpDesde: 20, kwpHasta: 100, precioPorKwp: 1150000, costoFijoInst: 1500000 },
    { kwpDesde: 100, kwpHasta: 10000, precioPorKwp: 1000000, costoFijoInst: 3000000 },
  ];
  await prisma.escalaPrecio.createMany({
    data: [
      ...[
        { kwpDesde: 0, kwpHasta: 5, precioPorKwp: 1500000, costoFijoInst: 600000 },
        { kwpDesde: 5, kwpHasta: 10, precioPorKwp: 1350000, costoFijoInst: 700000 },
        { kwpDesde: 10, kwpHasta: 10000, precioPorKwp: 1250000, costoFijoInst: 900000 },
      ].map((e) => ({ ...e, segmento: Segmento.HOGAR })),
      ...escalaComercial.map((e) => ({ ...e, segmento: Segmento.COMERCIO })),
      ...escalaComercial.map((e) => ({ ...e, segmento: Segmento.AGRO })),
      ...[
        { kwpDesde: 0, kwpHasta: 100, precioPorKwp: 1100000, costoFijoInst: 2000000 },
        { kwpDesde: 100, kwpHasta: 10000, precioPorKwp: 950000, costoFijoInst: 4000000 },
      ].map((e) => ({ ...e, segmento: Segmento.INDUSTRIA })),
    ],
  });

  await prisma.lineaCredito.createMany({
    data: [
      {
        nombre: "Personas – Préstamo personal ecosustentable UVA",
        destinatario: Destinatario.PERSONA,
        tna: 0.12,
        plazos: [12, 24, 36, 48, 60, 72],
        montoMaximo: 40000000,
        esUVA: true,
        vigenciaDesde: new Date(),
        textoLegal: LEGAL_BANCOR,
        requisitos: "Solo en comercios vinculados con Bancor.",
      },
      {
        nombre: "Empresas – Línea pyme con tasa bonificada",
        destinatario: Destinatario.EMPRESA,
        tna: 0.35,
        plazos: [12, 24, 36, 48],
        montoMaximo: 300000000,
        esUVA: false,
        ivaSobreIntereses: true,
        vigenciaDesde: new Date(),
        textoLegal: LEGAL_BANCOR,
        requisitos: "Requiere proveedor con convenio Bancor y adherido a CADIEC.",
      },
    ],
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await prisma.user.upsert({ where: { email: adminEmail }, update: {}, create: { email: adminEmail, name: "Administrador" } });
  }

  console.log("Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
