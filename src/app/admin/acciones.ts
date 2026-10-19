"use server";

import { Prisma, type EstadoLead } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/auth";
import { CAMPOS_CONFIG, ENTIDADES, schemaDe, type EntidadId } from "@/lib/admin/entidades";
import { delegado } from "@/lib/admin/datos";
import { prisma } from "@/lib/db";

export type Resultado = { ok: true } | { ok: false; error: string };

function mensajePrisma(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return "Ya existe un registro con esos datos.";
    if (e.code === "P2003") return "No se puede borrar: otros datos dependen de este registro.";
    if (e.code === "P2025") return "El registro ya no existe.";
  }
  console.error(e);
  return "No pudimos guardar los cambios.";
}

function refrescar() {
  revalidateTag("parametros");
  revalidatePath("/admin", "layout");
}

export async function guardarEntidad(entidad: EntidadId, id: string | null, datos: Record<string, unknown>): Promise<Resultado> {
  const session = await requerirSesion("ADMIN");
  const def = ENTIDADES[entidad];
  if (!def) return { ok: false, error: "Entidad desconocida" };
  const parsed = schemaDe(def.campos).safeParse(datos);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data as Record<string, unknown>;

  if (entidad === "escala" && Number(data.kwpHasta) <= Number(data.kwpDesde)) return { ok: false, error: "«Hasta» tiene que ser mayor que «Desde»." };
  if (entidad === "usuario" && id === session.user.id && data.role !== "ADMIN") return { ok: false, error: "No podés quitarte el rol de administrador." };

  try {
    await prisma.$transaction(async (tx) => {
      // Un solo panel predeterminado.
      if (entidad === "panel" && data.predeterminado) await tx.panel.updateMany({ where: { id: id ? { not: id } : undefined }, data: { predeterminado: false } });
      const d = delegado(entidad, tx);
      if (id) await d.update({ where: { id }, data });
      else await d.create({ data });
    });
  } catch (e) {
    return { ok: false, error: mensajePrisma(e) };
  }
  refrescar();
  return { ok: true };
}

export async function eliminarEntidad(entidad: EntidadId, id: string): Promise<Resultado> {
  const session = await requerirSesion("ADMIN");
  if (entidad === "usuario" && id === session.user.id) return { ok: false, error: "No podés borrar tu propio usuario." };
  try {
    await delegado(entidad).delete({ where: { id } });
  } catch (e) {
    return { ok: false, error: mensajePrisma(e) };
  }
  refrescar();
  return { ok: true };
}

export async function guardarConfig(grupo: keyof typeof CAMPOS_CONFIG, datos: Record<string, unknown>): Promise<Resultado> {
  await requerirSesion("ADMIN");
  const campos = CAMPOS_CONFIG[grupo];
  if (!campos) return { ok: false, error: "Grupo desconocido" };
  const parsed = schemaDe(campos).safeParse(datos);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  try {
    await prisma.configuracion.update({ where: { id: 1 }, data: parsed.data as Prisma.ConfiguracionUpdateInput });
  } catch (e) {
    return { ok: false, error: mensajePrisma(e) };
  }
  refrescar();
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- Leads ----------

const ESTADOS: EstadoLead[] = ["NUEVO", "CONTACTADO", "VISITA", "VENDIDO", "PERDIDO"];

export async function actualizarLead(id: string, cambios: { estado?: string; notas?: string }): Promise<Resultado> {
  await requerirSesion();
  const data: Prisma.LeadUpdateInput = {};
  if (cambios.estado !== undefined) {
    if (!ESTADOS.includes(cambios.estado as EstadoLead)) return { ok: false, error: "Estado inválido" };
    data.estado = cambios.estado as EstadoLead;
  }
  if (cambios.notas !== undefined) data.notas = cambios.notas.slice(0, 4000) || null;
  try {
    await prisma.lead.update({ where: { id }, data });
  } catch (e) {
    return { ok: false, error: mensajePrisma(e) };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function eliminarLead(id: string) {
  await requerirSesion("ADMIN");
  await prisma.$transaction([prisma.cotizacion.deleteMany({ where: { leadId: id } }), prisma.lead.delete({ where: { id } })]);
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}
