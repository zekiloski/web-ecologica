import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { EMPRESA } from "@/content/sitio";
import { obtenerDatosCotizador } from "@/lib/params";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { config } = await obtenerDatosCotizador();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.empresaNombre,
    description: "Venta e instalación de paneles solares on-grid para hogares, comercios, industrias y campo. Financiación con crédito Bancor.",
    telephone: `+${config.whatsapp}`,
    address: { "@type": "PostalAddress", addressLocality: EMPRESA.localidad, addressRegion: EMPRESA.provincia, addressCountry: "AR" },
    areaServed: { "@type": "State", name: "Córdoba" },
    knowsAbout: ["paneles solares", "energía solar fotovoltaica", "generación distribuida"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>{children}</main>
      <Footer nombre={config.empresaNombre} />
      <WhatsAppFloat numero={config.whatsapp} />
    </>
  );
}
