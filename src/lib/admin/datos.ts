import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ENTIDADES, type EntidadId } from "@/lib/admin/entidades";

export type Fila = Record<string, unknown> & { id: string };

/** Interfaz mínima común a los delegados de Prisma que edita el panel. */
interface Delegado {
  findMany(args: { orderBy?: unknown }): Promise<Record<string, unknown>[]>;
  create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<{ id: string }>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

export function delegado(entidad: EntidadId, db: Prisma.TransactionClient = prisma): Delegado {
  const mapa: Record<EntidadId, unknown> = {
    linea: db.lineaCredito,
    distribuidora: db.distribuidora,
    tarifa: db.tarifa,
    localidad: db.localidad,
    panel: db.panel,
    inversor: db.inversor,
    bateria: db.bateria,
    estructura: db.estructura,
    escala: db.escalaPrecio,
    usuario: db.user,
  };
  return mapa[entidad] as Delegado;
}

/** Convierte Decimal y Date a valores serializables para pasar a componentes cliente. */
export function plano<T extends Record<string, unknown>>(fila: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fila).map(([k, v]) => [k, v instanceof Prisma.Decimal ? v.toNumber() : v instanceof Date ? v.toISOString() : v]),
  );
}

export async function listar(entidad: EntidadId): Promise<Fila[]> {
  const filas = await delegado(entidad).findMany({ orderBy: ENTIDADES[entidad].orden });
  return filas.map((f) => plano(f) as Fila);
}

export async function opcionesDistribuidoras() {
  const ds = await prisma.distribuidora.findMany({ orderBy: { nombre: "asc" }, select: { id: true, nombre: true } });
  return ds.map((d) => ({ value: d.id, label: d.nombre }));
}

export async function configuracion() {
  return plano(await prisma.configuracion.findUniqueOrThrow({ where: { id: 1 } }));
}
