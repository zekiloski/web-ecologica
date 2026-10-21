// Corre durante el build: intenta aplicar las migraciones y cargar los datos iniciales.
// Si la base no está disponible en el build (o todavía no existe), no corta la publicación:
// la web hace lo mismo al arrancar (src/lib/migraciones.ts).
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[preparar-db] Sin DATABASE_URL: se omiten migraciones y seed.");
  process.exit(0);
}

try {
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
  execSync("npx prisma db seed", { stdio: "inherit", env: process.env });
} catch {
  console.warn(
    "\n[preparar-db] AVISO: no se pudo conectar a la base durante el build. Se continúa igual:\n" +
      "la web aplica las migraciones al arrancar. Si después la web muestra error, revisá DATABASE_URL\n" +
      "(formato mysql://USUARIO:CLAVE@localhost:3306/BASE) y que la base y el usuario existan.\n",
  );
}
