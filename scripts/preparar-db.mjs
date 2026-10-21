// Corre durante el build: revisa las variables y trata de aplicar migraciones y datos iniciales.
// Si la base no está disponible en el build (o todavía no existe), no corta la publicación:
// la web hace lo mismo al arrancar (src/lib/migraciones.ts).
import { execSync } from "node:child_process";

// Avisos claros por variables mal cargadas (valores de ejemplo o comillas guardadas como parte del valor).
const problemas = [];
for (const nombre of ["DATABASE_URL", "AUTH_URL", "NEXT_PUBLIC_SITE_URL", "AUTH_SECRET", "AUTH_RESEND_KEY", "ADMIN_EMAILS"]) {
  const v = process.env[nombre];
  if (v === undefined || v === "") problemas.push(`${nombre}: no está cargada`);
  else if (/^["']|["']$/.test(v)) problemas.push(`${nombre}: tiene comillas guardadas como parte del valor; cargala sin comillas`);
  else if (/<[^>]*>/.test(v) && nombre !== "EMAIL_FROM") problemas.push(`${nombre}: todavía tiene un valor de ejemplo entre < >`);
}
const db = process.env.DATABASE_URL ?? "";
if (db && !/^["']?mysql:\/\//.test(db)) problemas.push("DATABASE_URL: tiene que empezar con mysql://");
if (problemas.length) {
  console.warn("\n[preparar-db] REVISÁ LAS VARIABLES DE ENTORNO:\n  - " + problemas.join("\n  - ") + "\n");
}

if (!db || problemas.some((p) => p.startsWith("DATABASE_URL"))) {
  console.log("[preparar-db] Se omiten migraciones y seed en el build.");
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
