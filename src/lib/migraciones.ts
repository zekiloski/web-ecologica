import "server-only";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { cargarDatosIniciales } from "@/lib/datos-iniciales";

/**
 * Prepara la base al arrancar la web: aplica las migraciones pendientes de prisma/migrations
 * y carga los datos iniciales si está vacía.
 *
 * Existe porque en Hostinger el build puede no llegar a la base y no hay un paso previo al arranque.
 * Registra cada migración en _prisma_migrations igual que `prisma migrate deploy`, así ambos son compatibles.
 */

const CARPETA = path.join(process.cwd(), "prisma", "migrations");

let enCurso: Promise<void> | null = null;

/** Se ejecuta una sola vez por proceso; si falla (por ejemplo, la base todavía no existe), reintenta en la próxima llamada. */
export function asegurarBase(): Promise<void> {
  enCurso ??= preparar().catch((e) => {
    enCurso = null;
    throw e;
  });
  return enCurso;
}

async function preparar() {
  // Evita que dos instancias migren a la vez.
  const [{ ok }] = await prisma.$queryRawUnsafe<{ ok: number | bigint }[]>("SELECT GET_LOCK('ecologica_migraciones', 60) AS ok");
  if (Number(ok) !== 1) throw new Error("No se pudo obtener el bloqueo para migrar");
  try {
    await aplicarMigraciones();
    if (await cargarDatosIniciales(prisma)) console.log("[db] Datos iniciales cargados.");
  } finally {
    await prisma.$queryRawUnsafe("SELECT RELEASE_LOCK('ecologica_migraciones')");
  }
}

async function aplicarMigraciones() {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS \`_prisma_migrations\` (
    \`id\` VARCHAR(36) NOT NULL,
    \`checksum\` VARCHAR(64) NOT NULL,
    \`finished_at\` DATETIME(3) NULL,
    \`migration_name\` VARCHAR(255) NOT NULL,
    \`logs\` TEXT NULL,
    \`rolled_back_at\` DATETIME(3) NULL,
    \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  const aplicadas = new Set(
    (await prisma.$queryRawUnsafe<{ migration_name: string }[]>(
      "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL",
    )).map((m) => m.migration_name),
  );

  const carpetas = (await fs.readdir(CARPETA, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const nombre of carpetas) {
    if (aplicadas.has(nombre)) continue;
    const sql = await fs.readFile(path.join(CARPETA, nombre, "migration.sql"), "utf8");
    const sentencias = dividirSql(sql);
    const id = randomUUID();
    const checksum = createHash("sha256").update(sql).digest("hex");
    await prisma.$executeRawUnsafe("INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at) VALUES (?, ?, ?, NOW(3))", id, checksum, nombre);
    for (const s of sentencias) await prisma.$executeRawUnsafe(s);
    await prisma.$executeRawUnsafe("UPDATE _prisma_migrations SET finished_at = NOW(3), applied_steps_count = ? WHERE id = ?", sentencias.length, id);
    console.log(`[db] Migración aplicada: ${nombre}`);
  }
}

/** Separa el SQL generado por Prisma en sentencias (terminan en ";" al final de una línea). */
function dividirSql(sql: string): string[] {
  return sql
    .split(/;\s*$/m)
    .map((s) =>
      s
        .split("\n")
        .filter((l) => !l.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}
