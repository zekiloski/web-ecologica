import { requerirSesion } from "@/auth";
import { Encabezado } from "@/components/admin/Encabezado";
import { FormConfig } from "@/components/admin/FormConfig";
import { configuracion } from "@/lib/admin/datos";

export default async function CalculoPage() {
  await requerirSesion("ADMIN");
  const config = await configuracion();
  return (
    <>
      <Encabezado titulo="Parámetros de cálculo" descripcion="Supuestos técnicos y económicos de la generación, el ahorro y el impacto ambiental." />
      <FormConfig grupo="calculo" titulo="Generación y proyección" config={config} />
    </>
  );
}
