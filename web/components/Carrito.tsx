"use client";

import { useEffect, useRef, useState } from "react";
import { useCarrito } from "@/lib/carrito-context";
import { useCheckoutMercadoPago } from "@/lib/useCheckoutMercadoPago";
import { claveItem, calcularImporteItem } from "@/lib/carrito-reducer";
import {
  construirLinkWhatsapp,
  construirLinkDisponibilidadRenta,
  construirLinkCoberturaRenta,
} from "@/lib/whatsapp";
import { evaluarDisponibilidadRenta } from "@/lib/disponibilidad-renta";
import { sucursales } from "@/lib/sucursales";
import { formatMoneda } from "@/lib/formatMoneda";
import { useDialogoAccesible } from "@/lib/useDialogoAccesible";
import Cotizacion from "./Cotizacion";
import DireccionEnvio from "./DireccionEnvio";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";

export default function Carrito() {
  const { items, subtotal, abierto, cerrarCarrito, quitarProducto, actualizarCantidad } =
    useCarrito();
  const { cargando, error, pagar } = useCheckoutMercadoPago();
  const cerrarBotonRef = useRef<HTMLButtonElement>(null);
  const dialogoRef = useRef<HTMLDivElement>(null);
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);
  const [direccionAbierta, setDireccionAbierta] = useState(false);
  const [ciudad, setCiudad] = useState("");

  useDialogoAccesible(dialogoRef, abierto && !cotizacionAbierta && !direccionAbierta);

  useEffect(() => {
    if (!abierto) return;
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape" && !cotizacionAbierta && !direccionAbierta) cerrarCarrito();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [abierto, cerrarCarrito, cotizacionAbierta, direccionAbierta]);

  useEffect(() => {
    if (abierto) cerrarBotonRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  const carritoVacio = items.length === 0;
  const linkWhatsapp = construirLinkWhatsapp(WHATSAPP_NUMERO, items);
  const estadoRenta = evaluarDisponibilidadRenta(items, ciudad);

  return (
    <>
    <div
      ref={dialogoRef}
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
            className="flex h-10 w-10 items-center justify-center text-2xl text-slate-400"
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
                    {item.nombreVariante} ·{" "}
                    {item.tipo === "renta"
                      ? `Renta ${item.dias === 3 ? "3 días (-15%)" : "1 día"}`
                      : "Venta"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(clave, item.cantidad - 1)}
                      className="flex h-11 w-11 items-center justify-center rounded border border-slate-300 text-sm"
                      aria-label={`Disminuir cantidad de ${item.nombreProducto}`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(clave, item.cantidad + 1)}
                      className="flex h-11 w-11 items-center justify-center rounded border border-slate-300 text-sm"
                      aria-label={`Aumentar cantidad de ${item.nombreProducto}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-navy)]">
                    {formatMoneda(calcularImporteItem(item))}
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
            Subtotal: {formatMoneda(subtotal)} <span className="text-sm font-normal text-slate-400">+ IVA</span>
          </p>

          {error && !direccionAbierta && (
            <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          {!carritoVacio && (
            <p className="mt-4 text-xs text-slate-500">
              ¿Necesitas respuesta rápida? Cotiza por WhatsApp. ¿Cotización formal para tu
              empresa o pago inmediato? Usa las opciones de abajo.
            </p>
          )}

          <a
            href={carritoVacio ? undefined : linkWhatsapp}
            onClick={(e) => {
              if (carritoVacio) e.preventDefault();
            }}
            target="_blank"
            rel="noreferrer"
            aria-disabled={carritoVacio}
            className={`mt-2 block rounded-md py-4 text-center text-lg font-semibold text-white ${
              carritoVacio ? "pointer-events-none bg-slate-300" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Cotizar por WhatsApp
          </a>

          {estadoRenta !== "sin_renta" && (
            <label className="mt-4 block text-sm font-medium text-slate-600">
              Tu ciudad
              <select
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              >
                <option value="">Selecciona tu ciudad</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.ciudad}>
                    {s.ciudad}
                  </option>
                ))}
                <option value="Otra ciudad">Otra ciudad</option>
              </select>
            </label>
          )}

          {estadoRenta === "sin_sucursal" && (
            <p className="mt-2 text-xs text-amber-600">
              Por ahora no tenemos servicio de renta en tu ciudad. Pregunta por WhatsApp o ajusta
              tu carrito a solo compra.
            </p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={carritoVacio}
              onClick={() => setCotizacionAbierta(true)}
              className="rounded-md border border-[var(--color-navy)] py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Cotización PDF
            </button>

            {estadoRenta === "sin_renta" && (
              <button
                type="button"
                disabled={carritoVacio}
                onClick={() => setDireccionAbierta(true)}
                className="rounded-md bg-[var(--color-teal)] py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Pagar en línea
              </button>
            )}

            {estadoRenta === "falta_ciudad" && (
              <button
                type="button"
                disabled
                className="rounded-md bg-slate-100 py-2 text-sm font-semibold text-slate-400"
              >
                Selecciona tu ciudad
              </button>
            )}

            {estadoRenta === "con_sucursal" && (
              <a
                href={construirLinkDisponibilidadRenta(WHATSAPP_NUMERO, items, ciudad)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Confirmar disponibilidad
              </a>
            )}

            {estadoRenta === "sin_sucursal" && (
              <a
                href={construirLinkCoberturaRenta(WHATSAPP_NUMERO, ciudad)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Preguntar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>

    {cotizacionAbierta && (
      <Cotizacion items={items} onCerrar={() => setCotizacionAbierta(false)} />
    )}

    {direccionAbierta && (
      <DireccionEnvio
        onConfirmar={(direccion) => pagar(items, direccion)}
        onCerrar={() => setDireccionAbierta(false)}
        cargando={cargando}
        error={error}
      />
    )}
    </>
  );
}
