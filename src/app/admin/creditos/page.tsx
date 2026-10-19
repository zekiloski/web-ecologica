import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { FormConfig } from "@/components/admin/FormConfig";
import { configuracion, listar } from "@/lib/admin/datos";

export default async function CreditosPage() {
  await requerirSesion("ADMIN");
  const [lineas, config] = await Promise.all([listar("linea"), configuracion()]);
  return (
    <>
      <Encabezado
        titulo="Créditos y UVA"
        descripcion="Líneas de financiación que ofrece el simulador. Solo se muestran las activas y vigentes. Cargá el CFT informado por Bancor: es obligatorio mostrarlo."
      />
      <FormConfig grupo="uva" titulo="Valor UVA" descripcion="Se usa para convertir la cuota de las líneas UVA a pesos." config={config} />
      <EditorEntidad entidad="linea" filas={lineas} />
    </>
  );
}
