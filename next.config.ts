import type { NextConfig } from "next";

// Hostinger arranca el servidor "standalone" de Next (lo fuerza aunque no se configure);
// se deja explícito para que el build local sea igual al de producción.
const nextConfig: NextConfig = {
  output: "standalone",
  // Las migraciones se aplican al arrancar (src/lib/migraciones.ts): tienen que viajar con el servidor.
  outputFileTracingIncludes: { "/**": ["./prisma/migrations/**/*"] },
};

export default nextConfig;
