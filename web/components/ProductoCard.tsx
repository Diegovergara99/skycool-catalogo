"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Producto } from "@/lib/types";
import type { ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { formatMoneda } from "@/lib/formatMoneda";

interface ProductoCardProps {
  producto: Producto;
  onAgregar: (item: ItemCarrito) => void;
}

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const tieneRenta = producto.variantes.every((v) => v.precioRenta !== undefined);
  const [varianteId, setVarianteId] = useState(producto.variantes[0].id);
  const [tipo, setTipo] = useState<TipoOperacion>(tieneRenta ? "renta" : "venta");
  const cardRef = useRef<HTMLElement>(null);

  // Inclinación 3D sutil que sigue al cursor. Se escribe directo al estilo
  // del elemento (en vez de useState) para no re-renderizar en cada
  // movimiento del mouse — con decenas de tarjetas en el catálogo, actualizar
  // React en cada pixel de movimiento sería notablemente más lento.
  function inclinar(e: React.MouseEvent<HTMLElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rot-x", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--rot-y", `${(px - 0.5) * 8}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  }

  function enderezar() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rot-x", "0deg");
    el.style.setProperty("--rot-y", "0deg");
  }

  const variante = producto.variantes.find((v) => v.id === varianteId) ?? producto.variantes[0];
  const precio = tipo === "renta" ? (variante.precioRenta ?? variante.precioVenta) : variante.precioVenta;
  const specs = [...producto.specs, ...(variante.specs ?? [])];

  function agregar() {
    onAgregar({
      productoId: producto.id,
      varianteId: variante.id,
      nombreProducto: producto.nombre,
      nombreVariante: variante.nombre,
      tipo,
      precioUnitario: precio,
      cantidad: 1,
    });
  }

  return (
    <article
      ref={cardRef}
      onMouseMove={inclinar}
      onMouseLeave={enderezar}
      className="tarjeta-3d group relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-heading text-xl font-semibold text-[var(--color-navy)]">
            {producto.nombre}
          </h3>
          <p className="text-sm text-slate-500">{producto.descripcion}</p>
        </div>

        {producto.variantes.length > 1 && (
          <label className="text-sm font-medium text-slate-600">
            Modelo
            <select
              className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
              value={varianteId}
              onChange={(e) => setVarianteId(e.target.value)}
            >
              {producto.variantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </label>
        )}

        {(producto.variantes.length > 1 || tieneRenta) && (
          // Los modelos no seleccionados quedan visualmente ocultos, pero
          // presentes en el HTML: el buscador solo lee el modelo activo del
          // <select> si no incluimos esto, y nunca indexaría los specs ni
          // precios de los demás modelos (ej. W20/W26 del ventilador de
          // techo, o el DM-220 del de piso). También cubre el caso de un
          // solo modelo con renta Y venta (ej. ventilador giratorio): sin
          // esto, el precio del modo no seleccionado por defecto (venta)
          // tampoco aparecería en el HTML.
          <div className="hidden" aria-hidden="true">
            {producto.variantes.map((v) => {
              const specsVariante = [...producto.specs, ...(v.specs ?? [])];
              return (
                <div key={v.id}>
                  <span>
                    {producto.nombre} {v.nombre}
                  </span>
                  {specsVariante.map((s) => (
                    <span key={s.label}>
                      {s.label}: {s.valor}
                    </span>
                  ))}
                  {v.precioRenta !== undefined && (
                    <span>Precio renta por día: {formatMoneda(v.precioRenta)}</span>
                  )}
                  <span>Precio de venta: {formatMoneda(v.precioVenta)}</span>
                </div>
              );
            })}
          </div>
        )}

        {tieneRenta && (
          <div className="flex rounded-md border border-slate-300 p-1 text-sm font-medium">
            {(["renta", "venta"] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                aria-pressed={tipo === opcion}
                onClick={() => setTipo(opcion)}
                className={`flex-1 rounded py-2 transition ${
                  tipo === opcion
                    ? "bg-[var(--color-navy)] text-white"
                    : "text-slate-500"
                }`}
              >
                {opcion === "renta" ? "Renta / día" : "Venta"}
              </button>
            ))}
          </div>
        )}

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
          {specs.map((s) => (
            <li key={s.label}>
              <span className="font-medium text-slate-700">{s.label}:</span> {s.valor}
            </li>
          ))}
        </ul>

        <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-teal-dark)]">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z"
              clipRule="evenodd"
            />
          </svg>
          {tipo === "renta" ? "Entrega e instalación incluida" : "Garantía de 3 años"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold text-[var(--color-navy)]">
              {formatMoneda(precio)}
            </span>
            <span className="text-xs text-slate-400">+ IVA</span>
          </div>
          <button
            type="button"
            onClick={agregar}
            className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
