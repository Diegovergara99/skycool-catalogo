"use client";

import { useState } from "react";
import Image from "next/image";
import type { Producto } from "@/lib/types";
import type { ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { formatMoneda } from "@/lib/formatMoneda";

interface ProductoCardProps {
  producto: Producto;
  onAgregar: (item: ItemCarrito) => void;
}

export default function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const [varianteId, setVarianteId] = useState(producto.variantes[0].id);
  const [tipo, setTipo] = useState<TipoOperacion>("renta");

  const variante = producto.variantes.find((v) => v.id === varianteId) ?? producto.variantes[0];
  const precio = tipo === "renta" ? variante.precioRenta : variante.precioVenta;
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
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full bg-slate-50">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-contain p-4"
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

        <div className="flex rounded-md border border-slate-300 p-1 text-sm font-medium">
          {(["renta", "venta"] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              aria-pressed={tipo === opcion}
              onClick={() => setTipo(opcion)}
              className={`flex-1 rounded py-1 transition ${
                tipo === opcion
                  ? "bg-[var(--color-navy)] text-white"
                  : "text-slate-500"
              }`}
            >
              {opcion === "renta" ? "Renta / día" : "Venta"}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
          {specs.map((s) => (
            <li key={s.label}>
              <span className="font-medium text-slate-700">{s.label}:</span> {s.valor}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-heading text-2xl font-bold text-[var(--color-navy)]">
            {formatMoneda(precio)}
          </span>
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
