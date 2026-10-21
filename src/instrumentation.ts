// Next ejecuta register() una vez al arrancar el servidor: prepara la base (migraciones + datos iniciales).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) return;
  const { asegurarBase } = await import("@/lib/migraciones");
  try {
    await asegurarBase();
  } catch (e) {
    console.error("[db] No se pudo preparar la base al arrancar. Se reintenta en la próxima visita.", e);
  }
}
