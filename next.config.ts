import type { NextConfig } from "next";

// Hostinger arranca el servidor "standalone" de Next (lo fuerza aunque no se configure);
// se deja explícito para que el build local sea igual al de producción.
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
