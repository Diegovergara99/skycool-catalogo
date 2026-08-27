"use client";

import { useCarrito } from "@/lib/carrito-context";

const ENLACES = [
  { href: "#catalogo", etiqueta: "Catálogo" },
  { href: "#nosotros", etiqueta: "Nosotros" },
  { href: "#sucursales", etiqueta: "Sucursales" },
  { href: "#contacto", etiqueta: "Contacto" },
];

export default function Header() {
  const { cantidadTotal, abrirCarrito } = useCarrito();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="font-heading text-2xl font-bold tracking-wide text-[var(--color-navy)]">
          SKY<span className="text-[var(--color-teal)]">COOL</span>
        </a>

        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} href={enlace.href} className="transition hover:text-[var(--color-navy)]">
              {enlace.etiqueta}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={abrirCarrito}
          className="relative rounded-md bg-[var(--color-navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
        >
          Carrito
          {cantidadTotal > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-teal)] text-xs font-bold text-[var(--color-navy)]">
              {cantidadTotal}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
