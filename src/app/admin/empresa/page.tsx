import { requerirSesion } from "@/auth";
import { Encabezado } from "@/components/admin/Encabezado";
import { FormConfig } from "@/components/admin/FormConfig";
import { configuracion } from "@/lib/admin/datos";

export default async function EmpresaPage() {
  await requerirSesion("ADMIN");
  const config = await configuracion();
  return (
    <>
      <Encabezado titulo="Empresa" descripcion="Datos que se muestran en la web y en los mensajes de WhatsApp." />
      <FormConfig grupo="empresa" titulo="Datos de la empresa" config={config} />
    </>
  );
}
