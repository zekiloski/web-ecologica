import { asegurarBase } from "@/lib/migraciones";

export async function prepararBaseAlArrancar() {
  if (!process.env.DATABASE_URL) return;
  try {
    await asegurarBase();
  } catch (e) {
    console.error("[db] No se pudo preparar la base al arrancar. Se reintenta en la próxima visita.", e);
  }
}
