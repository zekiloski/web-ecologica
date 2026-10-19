"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [oscuro, setOscuro] = useState(true);

  // Reaplica el tema guardado por si React regeneró el <html> al hidratar.
  useEffect(() => {
    let guardado: string | null = null;
    try {
      guardado = localStorage.getItem("tema");
    } catch {}
    const esOscuro = guardado !== "claro";
    document.documentElement.classList.toggle("dark", esOscuro);
    setOscuro(esOscuro);
  }, []);

  function alternar() {
    const nuevo = !oscuro;
    setOscuro(nuevo);
    document.documentElement.classList.toggle("dark", nuevo);
    try {
      localStorage.setItem("tema", nuevo ? "oscuro" : "claro");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="grid size-10 place-items-center rounded-full border border-glass-border text-muted-foreground transition hover:text-foreground"
    >
      {oscuro ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
