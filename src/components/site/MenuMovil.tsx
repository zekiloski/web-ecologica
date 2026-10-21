"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Menú desplegable para celulares y tablets (en escritorio se ve la barra completa). */
export function MenuMovil({ items }: { items: { href: string; label: string }[] }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  useEffect(() => setAbierto(false), [ruta]);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="grid size-10 place-items-center rounded-full border border-glass-border"
      >
        {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <AnimatePresence>
        {abierto && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-16 z-40 bg-black/40" onClick={() => setAbierto(false)} />
            <motion.nav
              id="menu-movil"
              aria-label="Principal"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-glass-border bg-background p-4 shadow-xl"
            >
              <ul className="mx-auto max-w-md">
                {items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} onClick={() => setAbierto(false)} className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium hover:bg-secondary">
                      {i.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-3">
                  <Link href="/cotizador" onClick={() => setAbierto(false)} className="btn-sun flex h-12 items-center justify-center rounded-xl">
                    Cotizar mi sistema
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
