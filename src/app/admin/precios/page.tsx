import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { FormConfig } from "@/components/admin/FormConfig";
import { configuracion, listar } from "@/lib/admin/datos";

export default async function PreciosPage() {
  await requerirSesion("ADMIN");
  const [escalas, config] = await Promise.all([listar("escala"), configuracion()]);
  return (
    <>
      <Encabezado
        titulo="Precios"
        descripcion="Precio del sistema = kWp × precio por kWp de la escala + costo fijo + estructura + baterías. Cada tipo de cliente tiene sus escalas; si uno no tiene, usa las de Comercio."
      />
      <FormConfig grupo="precios" titulo="Rango de precio" config={config} />
      <EditorEntidad entidad="escala" filas={escalas} />
    </>
  );
}
