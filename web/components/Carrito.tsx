"use client";

import { useEffect, useRef } from "react";
import { useCarrito } from "@/lib/carrito-context";
import { useCheckoutMercadoPago } from "@/lib/useCheckoutMercadoPago";
import { claveItem } from "@/lib/carrito-reducer";
import { construirLinkWhatsapp } from "@/lib/whatsapp";
import { formatMoneda } from "@/lib/formatMoneda";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";

export default function Carrito() {
  const { items, subtotal, abierto, cerrarCarrito, quitarProducto, actualizarCantidad } =
    useCarrito();
  const { cargando, error, pagar } = useCheckoutMercadoPago();
  const cerrarBotonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") cerrarCarrito();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [abierto, cerrarCarrito]);

  useEffect(() => {
    if (abierto) cerrarBotonRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  const carritoVacio = items.length === 0;
  const linkWhatsapp = construirLinkWhatsapp(WHATSAPP_NUMERO, items);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito"
    >
      <div className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-navy)]">Tu carrito</h2>
          <button
            ref={cerrarBotonRef}
            type="button"
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
            className="text-2xl text-slate-400"
          >
            ×
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {carritoVacio && (
            <p className="text-sm text-slate-500">
              Tu carrito está vacío. Agrega productos del catálogo.
            </p>
          )}

          {items.map((item) => {
            const clave = claveItem(item);
            return (
              <div
                key={clave}
                className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4"
              >
                <div>
                  <p className="font-medium text-[var(--color-navy)]">{item.nombreProducto}</p>
                  <p className="text-xs text-slate-500">
                    {item.nombreVariante} · {item.tipo === "renta" ? "Renta/día" : "Venta"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(clave, item.cantidad - 1)}
                      className="h-6 w-6 rounded border border-slate-300 text-sm"
                      aria-label={`Disminuir cantidad de ${item.nombreProducto}`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(clave, item.cantidad + 1)}
                      className="h-6 w-6 rounded border border-slate-300 text-sm"
                      aria-label={`Aumentar cantidad de ${item.nombreProducto}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-navy)]">
                    {formatMoneda(item.precioUnitario * item.cantidad)}
                  </p>
                  <button
                    type="button"
                    onClick={() => quitarProducto(clave)}
                    className="mt-2 text-xs text-red-500 underline"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-lg font-bold text-[var(--color-navy)]">
            Subtotal: {formatMoneda(subtotal)}
          </p>

          {error && (
            <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          <a
            href={carritoVacio ? undefined : linkWhatsapp}
            onClick={(e) => {
              if (carritoVacio) e.preventDefault();
            }}
            target="_blank"
            rel="noreferrer"
            aria-disabled={carritoVacio}
            className={`mt-4 block rounded-md py-3 text-center font-semibold text-white ${
              carritoVacio ? "pointer-events-none bg-slate-300" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Cotizar por WhatsApp
          </a>

          <button
            type="button"
            disabled={carritoVacio || cargando}
            onClick={() => pagar(items)}
            className="mt-3 w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {cargando ? "Conectando con Mercado Pago…" : "Pagar en línea"}
          </button>
        </div>
      </div>
    </div>
  );
}
