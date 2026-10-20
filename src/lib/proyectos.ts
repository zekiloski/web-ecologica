import { PROYECTOS } from "@/content/proyectos";

export function totalesProyectos() {
  return {
    cantidad: PROYECTOS.length,
    kw: PROYECTOS.reduce((a, p) => a + p.kw, 0),
    fotos: PROYECTOS.reduce((a, p) => a + p.fotos.length, 0),
  };
}
