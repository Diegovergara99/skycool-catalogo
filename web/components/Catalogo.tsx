"use client";

import { useMemo, useState } from "react";
import ProductoCard from "./ProductoCard";
import { productos } from "@/lib/productos";
import { useCarrito } from "@/lib/carrito-context";
import { construirCatalogoJsonLd } from "@/lib/schema";
import type { Categoria } from "@/lib/types";

// Solo estos dos productos tienen página propia (con contenido real y
// dedicado, no una plantilla genérica) — el resto se queda en el catálogo.
// El link de "Ver ficha completa" usa la ruta relativa; el JSON-LD necesita
// la URL absoluta, porque el mismo producto usa el mismo @id en la portada
// y en su página propia — si aquí dijera /#catalogo mientras la página
// dedicada dice su propia URL, Google vería dos `url` distintos para el
// mismo `@id`.
const PAGINAS_PRODUCTO: Partial<Record<string, string>> = {
  "ventilador-piso": "/productos/ventilador-de-piso",
  "ventilador-techo": "/productos/ventilador-de-techo-industrial",
};

const SITIO = "https://www.skycool.com.mx";
const urlsAbsolutasPorProducto = Object.fromEntries(
  Object.entries(PAGINAS_PRODUCTO).map(([id, ruta]) => [id, `${SITIO}${ruta}`])
);

const jsonLdProductos = construirCatalogoJsonLd(productos, urlsAbsolutasPorProducto);

// Mantener sincronizado con el tipo Categoria en lib/types.ts —
// si se agrega una categoría nueva ahí, agregar también su chip aquí.
const CATEGORIAS: { id: Categoria | "todos"; etiqueta: string }[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "piso", etiqueta: "Piso" },
  { id: "giratorio", etiqueta: "Giratorio" },
  { id: "techo", etiqueta: "Techo" },
  { id: "extraccion", etiqueta: "Extracción" },
  { id: "evaporativo", etiqueta: "Evaporativo" },
];

export default function Catalogo() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const { agregarProducto } = useCarrito();

  const productosFiltrados = useMemo(
    () => (filtro === "todos" ? productos : productos.filter((p) => p.categoria === filtro)),
    [filtro]
  );

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProductos) }}
      />
      <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Catálogo</h2>
      <p className="mt-2 text-slate-500">
        Equipo de ventilación en renta y venta para tu evento o negocio.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filtro === c.id}
            onClick={() => setFiltro(c.id)}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              filtro === c.id
                ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white"
                : "border-slate-300 text-slate-600 hover:border-[var(--color-navy)]"
            }`}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productosFiltrados.map((producto) => (
          <div key={producto.id}>
            <ProductoCard producto={producto} onAgregar={agregarProducto} />
            {PAGINAS_PRODUCTO[producto.id] && (
              <a
                href={PAGINAS_PRODUCTO[producto.id]}
                className="mt-2 block text-center text-sm font-medium text-[var(--color-navy)] underline"
              >
                Ver ficha completa
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
