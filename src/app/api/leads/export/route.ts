import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ESTADOS, SEGMENTO_LABEL, filtroLeads, incluirUltimaCotizacion } from "@/lib/admin/leads";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const leads = await prisma.lead.findMany({
    where: filtroLeads(searchParams.get("estado") ?? undefined, searchParams.get("q") ?? undefined),
    orderBy: { createdAt: "desc" },
    include: incluirUltimaCotizacion,
  });

  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet("Leads", { views: [{ state: "frozen", ySplit: 1 }] });
  hoja.columns = [
    { header: "Fecha", key: "fecha", width: 18, style: { numFmt: "dd/mm/yyyy hh:mm" } },
    { header: "Nombre", key: "nombre", width: 26 },
    { header: "Teléfono", key: "telefono", width: 16 },
    { header: "Email", key: "email", width: 28 },
    { header: "Localidad", key: "localidad", width: 18 },
    { header: "Estado", key: "estado", width: 12 },
    { header: "Tipo", key: "tipo", width: 11 },
    { header: "kWp", key: "kwp", width: 8, style: { numFmt: "0.00" } },
    { header: "Paneles", key: "paneles", width: 9 },
    { header: "Precio ($)", key: "precio", width: 14, style: { numFmt: "#,##0" } },
    { header: "Línea de crédito", key: "linea", width: 34 },
    { header: "Plazo (meses)", key: "plazo", width: 13 },
    { header: "Cuota inicial ($)", key: "cuota", width: 16, style: { numFmt: "#,##0" } },
    { header: "Notas", key: "notas", width: 40 },
  ];
  hoja.getRow(1).font = { bold: true };
  hoja.autoFilter = { from: "A1", to: "N1" };

  for (const l of leads) {
    const c = l.cotizaciones[0];
    hoja.addRow({
      fecha: l.createdAt,
      nombre: l.nombre,
      telefono: l.telefono,
      email: l.email,
      localidad: l.localidad,
      estado: ESTADOS.find((e) => e.id === l.estado)?.label ?? l.estado,
      tipo: c ? SEGMENTO_LABEL[c.tipoCliente] : "",
      kwp: c?.kwp,
      paneles: c?.paneles,
      precio: c ? Number(c.precioTotal) : undefined,
      linea: c?.lineaCredito?.nombre ?? (c ? "Contado" : ""),
      plazo: c?.plazoMeses ?? undefined,
      cuota: c?.cuotaInicial != null ? Number(c.cuotaInicial) : undefined,
      notas: l.notas ?? "",
    });
  }

  const buffer = await libro.xlsx.writeBuffer();
  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads-${fecha}.xlsx"`,
    },
  });
}
