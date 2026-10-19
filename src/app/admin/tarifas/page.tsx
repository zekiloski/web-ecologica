import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { listar, opcionesDistribuidoras } from "@/lib/admin/datos";

export default async function TarifasPage() {
  await requerirSesion("ADMIN");
  const [distribuidoras, tarifas, opciones] = await Promise.all([listar("distribuidora"), listar("tarifa"), opcionesDistribuidoras()]);
  return (
    <>
      <Encabezado
        titulo="Tarifas"
        descripcion="Precio del kWh por distribuidora y tipo de cliente. Si hay varias tarifas activas para el mismo tipo, el cotizador usa la de vigencia más reciente."
      />
      <EditorEntidad entidad="distribuidora" filas={distribuidoras} />
      <EditorEntidad entidad="tarifa" filas={tarifas} opciones={{ distribuidoraId: opciones }} />
    </>
  );
}
