import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

/** URL pública para metadatos. Tolera comillas pegadas o un valor inválido (no debe romper el build). */
function urlDelSitio(): URL {
  const crudo = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/^["']|["']$/g, "");
  try {
    return new URL(crudo);
  } catch {
    if (crudo) console.warn(`[config] NEXT_PUBLIC_SITE_URL no es una URL válida ("${crudo}"). Se usa http://localhost:3000.`);
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: urlDelSitio(),
  title: {
    default: "Paneles solares en Córdoba con financiación Bancor | Eco Lógica",
    template: "%s | Eco Lógica",
  },
  description:
    "Cotizá tu sistema de energía solar en minutos: cuántos paneles necesitás, cuánto ahorrás y cuánto pagás de cuota con crédito Bancor. Instalaciones en Oncativo y toda Córdoba.",
  keywords: ["paneles solares Córdoba", "energía solar Oncativo", "crédito Bancor paneles solares", "cotizador solar", "generación distribuida Córdoba"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Eco Lógica",
    title: "Tu techo puede pagar tu factura de luz",
    description: "Cotizador solar con simulador de crédito Bancor.",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050914" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
  ],
};

// Aplica el tema guardado antes de pintar para evitar el parpadeo. Oscuro por defecto.
const temaScript = `try{if(localStorage.getItem("tema")!=="claro")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
