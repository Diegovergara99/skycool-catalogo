"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/lib/carrito-context";

const ENLACES = [
  { href: "/#catalogo", etiqueta: "Catálogo" },
  { href: "/#nosotros", etiqueta: "Nosotros" },
  { href: "/#sucursales", etiqueta: "Sucursales" },
  { href: "/#contacto", etiqueta: "Contacto" },
];

export default function Header() {
  const { cantidadTotal, abrirCarrito } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!menuAbierto) return;
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [menuAbierto]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-navy)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="font-heading text-2xl font-bold tracking-wide text-white">
          SKY<span className="text-[var(--color-teal)]">COOL</span>
        </a>

        <nav className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} href={enlace.href} className="transition hover:text-[var(--color-teal)]">
              {enlace.etiqueta}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={abrirCarrito}
            className="relative rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
          >
            Carrito
            {cantidadTotal > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--color-navy)]">
                {cantidadTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white md:hidden"
          >
            {menuAbierto ? (
              <span className="text-xl leading-none">×</span>
            ) : (
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </span>
            )}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label="Menú móvil"
          className="flex flex-col gap-1 border-t border-white/10 bg-[var(--color-navy)] px-4 py-3 font-heading text-base font-medium text-white md:hidden"
        >
          {ENLACES.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
              className="rounded-md px-2 py-2 transition hover:bg-white/5 hover:text-[var(--color-teal)]"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
