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
    address: { "@type": "PostalAddress", streetAddress: EMPRESA.calle, addressLocality: EMPRESA.localidad, addressRegion: EMPRESA.provincia, addressCountry: "AR" },
    email: EMPRESA.email,
    sameAs: [EMPRESA.redes.facebook, EMPRESA.redes.instagram],
    url: "https://www.ecologica.com.ar",
    areaServed: { "@type": "State", name: "Córdoba" },
    knowsAbout: ["paneles solares", "energía solar fotovoltaica", "generación distribuida"],
  };

  // Colores cargados desde el admin (validados como #rrggbb). Si siguen en el valor por defecto, se usa la paleta del CSS.
  const esColor = (c: string) => /^#[0-9a-fA-F]{6}$/.test(c);
  const css = [
    esColor(config.colorPrimario) && config.colorPrimario.toUpperCase() !== "#F5A524" && `:root,.dark{--sun-1:${config.colorPrimario};--primary:${config.colorPrimario};--ring:${config.colorPrimario}}`,
    esColor(config.colorAcento) && config.colorAcento.toUpperCase() !== "#A3E635" && `.dark{--ahorro:${config.colorAcento}}`,
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {css.length > 0 && <style dangerouslySetInnerHTML={{ __html: css.join("") }} />}
      <Header logoUrl={config.logoUrl} />
      <main>{children}</main>
      <Footer nombre={config.empresaNombre} logoUrl={config.logoUrl} />
      <WhatsAppFloat numero={config.whatsapp} />
    </>
  );
}
