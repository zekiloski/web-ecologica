import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { listar } from "@/lib/admin/datos";

export default async function CatalogoPage() {
  await requerirSesion("ADMIN");
  const [paneles, inversores, baterias, estructuras] = await Promise.all([listar("panel"), listar("inversor"), listar("bateria"), listar("estructura")]);
  return (
    <>
      <Encabezado
        titulo="Catálogo"
        descripcion="Equipos que usa el cotizador. El precio del sistema sale de la escala de $/kWp (en Precios); acá el precio de baterías y estructuras se suma aparte."
      />
      <EditorEntidad entidad="panel" filas={paneles} />
      <EditorEntidad entidad="inversor" filas={inversores} />
      <EditorEntidad entidad="bateria" filas={baterias} />
      <EditorEntidad entidad="estructura" filas={estructuras} />
    </>
  );
}
