import Image from "next/image";
import Link from "next/link";

/**
 * Logo de Eco Lógica: el globo de la marca + "ECO" en verde y "Lógica" en el color del texto,
 * para que se lea en modo claro y oscuro. Si el admin carga un logo propio, se usa ese.
 */
export function Logo({ nombre = "Eco Lógica", logoUrl }: { nombre?: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return (
      <Link href="/" className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- URL externa cargada desde el admin */}
        <img src={logoUrl} alt={nombre} className="h-9 w-auto max-w-44 object-contain" />
      </Link>
    );
  }
  return (
    <Link href="/" aria-label={nombre} className="flex items-center font-heading text-xl leading-none font-bold tracking-tight">
      <span className="text-eco">ECO</span>
      <Image src="/marca/globo.png" alt="" width={137} height={160} className="mx-0.5 h-9 w-auto" priority />
      <span className="text-marino dark:text-foreground">Lógica</span>
    </Link>
  );
}
