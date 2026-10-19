import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/Wizard";
import { obtenerDatosCotizador } from "@/lib/params";

export const metadata: Metadata = {
  title: "Cotizador solar con crédito Bancor",
  description: "Calculá tu sistema de paneles solares, el ahorro en la factura y la cuota con crédito Bancor en 8 pasos.",
};

export default async function CotizadorPage({ searchParams }: { searchParams: Promise<{ importe?: string }> }) {
  const [datos, { importe }] = await Promise.all([obtenerDatosCotizador(), searchParams]);
  const importeInicial = Number(importe) > 0 ? Math.min(Number(importe), 1e10) : undefined;
  return <Wizard datos={datos} importeInicial={importeInicial} />;
}
