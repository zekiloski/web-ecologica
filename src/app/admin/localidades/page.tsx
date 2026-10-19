import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { listar, opcionesDistribuidoras } from "@/lib/admin/datos";

export default async function LocalidadesPage() {
  await requerirSesion("ADMIN");
  const [localidades, opciones] = await Promise.all([listar("localidad"), opcionesDistribuidoras()]);
  return (
    <>
      <Encabezado
        titulo="Localidades"
        descripcion="Cada localidad define la radiación solar (horas solares pico por mes) y la distribuidora de energía. Podés sacar los valores de PVGIS o de la base de NASA POWER."
      />
      <EditorEntidad entidad="localidad" filas={localidades} opciones={{ distribuidoraId: opciones }} />
    </>
  );
}
