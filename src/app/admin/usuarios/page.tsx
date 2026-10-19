import { requerirSesion } from "@/auth";
import { EditorEntidad } from "@/components/admin/EditorEntidad";
import { Encabezado } from "@/components/admin/Encabezado";
import { listar } from "@/lib/admin/datos";

export default async function UsuariosPage() {
  await requerirSesion("ADMIN");
  const usuarios = await listar("usuario");
  return (
    <>
      <Encabezado
        titulo="Usuarios"
        descripcion="Solo los emails de esta lista pueden ingresar al panel. Los vendedores ven únicamente los leads."
      />
      <EditorEntidad entidad="usuario" filas={usuarios} />
    </>
  );
}
