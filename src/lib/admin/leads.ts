import type { EstadoLead, Prisma } from "@prisma/client";

export const ESTADOS: { id: EstadoLead; label: string; clase: string }[] = [
  { id: "NUEVO", label: "Nuevo", clase: "bg-sky-500/15 text-sky-600 dark:text-sky-300" },
  { id: "CONTACTADO", label: "Contactado", clase: "bg-violet-500/15 text-violet-600 dark:text-violet-300" },
  { id: "VISITA", label: "Visita", clase: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { id: "VENDIDO", label: "Vendido", clase: "bg-lime-500/15 text-lime-700 dark:text-lime-300" },
  { id: "PERDIDO", label: "Perdido", clase: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400" },
];

export const SEGMENTO_LABEL = { HOGAR: "Hogar", COMERCIO: "Comercio", INDUSTRIA: "Industria", AGRO: "Agro" } as const;

/** Filtro común del listado y la exportación. */
export function filtroLeads(estado?: string, q?: string): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (estado && ESTADOS.some((e) => e.id === estado)) where.estado = estado as EstadoLead;
  // En MySQL la búsqueda ya ignora mayúsculas y acentos (collation por defecto).
  const texto = q?.trim();
  if (texto) {
    where.OR = ["nombre", "email", "telefono", "localidad"].map((campo) => ({ [campo]: { contains: texto } }));
  }
  return where;
}

export const incluirUltimaCotizacion = {
  cotizaciones: {
    orderBy: { createdAt: "desc" },
    take: 1,
    select: { id: true, kwp: true, paneles: true, precioTotal: true, plazoMeses: true, cuotaInicial: true, tipoCliente: true, lineaCredito: { select: { nombre: true } } },
  },
} satisfies Prisma.LeadInclude;
