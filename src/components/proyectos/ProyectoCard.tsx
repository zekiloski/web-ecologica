import { Images, MapPin } from "lucide-react";
import Image from "next/image";
import type { Proyecto } from "@/content/proyectos";
import { SEGMENTO_LABEL } from "@/lib/admin/leads";
import { numero } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProyectoCard({ proyecto: p, onAbrir, className, prioridad }: { proyecto: Proyecto; onAbrir: () => void; className?: string; prioridad?: boolean }) {
  const portada = p.fotos[0];
  return (
    <button
      type="button"
      onClick={onAbrir}
      className={cn(
        "group relative block w-full overflow-hidden rounded-3xl bg-secondary text-left focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        className,
      )}
      aria-label={`${p.nombre}, ${numero(p.kw, 1)} kW. Ver ${p.fotos.length} fotos`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={portada.src}
          alt={portada.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
          style={portada.posicion ? { objectPosition: portada.posicion } : undefined}
          priority={prioridad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur-md">
          {SEGMENTO_LABEL[p.segmento]} · {p.tipo}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur-md">
          <Images className="size-3.5" /> {p.fotos.length}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <p className="font-heading text-4xl leading-none font-semibold">
            {numero(p.kw, 1)}
            <span className="ml-1 text-lg font-normal text-[#a7e27a]">kW</span>
          </p>
          <h3 className="mt-2 text-lg leading-tight font-semibold">{p.nombre}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-white/75">{p.detalle}</p>
          {p.localidad && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/60">
              <MapPin className="size-3" /> {p.localidad}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
