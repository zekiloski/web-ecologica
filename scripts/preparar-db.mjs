// Corre durante el build (Hostinger no tiene un paso previo al arranque):
// aplica las migraciones pendientes y carga los datos iniciales si la base está vacía.
// Sin DATABASE_URL (build local de prueba) no hace nada.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[preparar-db] Sin DATABASE_URL: se omiten migraciones y seed.");
  process.exit(0);
}

const correr = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

try {
  correr("npx prisma migrate deploy");
  correr("npx prisma db seed");
} catch {
  console.error(
    "\n[preparar-db] No se pudo preparar la base de datos. Revisá DATABASE_URL " +
      "(formato mysql://USUARIO:CLAVE@localhost:3306/BASE) y que el usuario tenga permisos sobre la base.\n",
  );
  process.exit(1);
}
