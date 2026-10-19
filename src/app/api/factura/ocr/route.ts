import { NextResponse } from "next/server";

/**
 * Lectura automática de la factura con IA (preparado para más adelante).
 * Debe devolver { kwhPeriodo, diasPeriodo } leídos de la imagen o PDF recibido en el campo "factura".
 */
export async function POST() {
  return NextResponse.json(
    { mensaje: "Muy pronto vamos a leer la factura automáticamente. Por ahora cargá los kWh y los días a mano." },
    { status: 501 },
  );
}
