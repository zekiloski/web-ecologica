// Next ejecuta register() una vez al arrancar el servidor: prepara la base (migraciones + datos iniciales).
// El import queda dentro del if con NEXT_RUNTIME para que no se compile para el runtime edge.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prepararBaseAlArrancar } = await import("./lib/arranque");
    await prepararBaseAlArrancar();
  }
}
