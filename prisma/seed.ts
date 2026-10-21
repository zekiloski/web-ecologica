/** Seed de Prisma: carga los datos iniciales si la base está vacía. */
import { PrismaClient } from "@prisma/client";
import { cargarDatosIniciales } from "../src/lib/datos-iniciales";

const prisma = new PrismaClient();

cargarDatosIniciales(prisma)
  .then((cargo) => console.log(cargo ? "Seed completo." : "La base ya tiene datos: seed omitido."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
