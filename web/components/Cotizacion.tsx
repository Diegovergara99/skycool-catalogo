"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import type { ItemCarrito } from "@/lib/carrito-reducer";
import {
  separarPorTipo,
  generarNumeroCotizacion,
  formatearFechaCotizacion,
} from "@/lib/cotizacion";
import { useDialogoAccesible } from "@/lib/useDialogoAccesible";
import CotizacionDocumento from "./CotizacionDocumento";

interface CotizacionProps {
  items: ItemCarrito[];
  onCerrar: () => void;
}

interface DatosDocumento {
  numero: string;
  fecha: string;
}

export default function Cotizacion({ items, onCerrar }: CotizacionProps) {
  const [cliente, setCliente] = useState("");
  const [atencion, setAtencion] = useState("");
  const [datosDocumento, setDatosDocumento] = useState<DatosDocumento | null>(null);
  const cerrarBotonRef = useRef<HTMLButtonElement>(null);
  const dialogoRef = useRef<HTMLDivElement>(null);

  useDialogoAccesible(dialogoRef);

  useEffect(() => {
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [onCerrar]);

  useEffect(() => {
    cerrarBotonRef.current?.focus();
  }, [datosDocumento]);

  function enviarForm(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setDatosDocumento({
      numero: generarNumeroCotizacion(new Date()),
      fecha: formatearFechaCotizacion(new Date()),
    });
  }

  const { renta, venta } = separarPorTipo(items);

  return (
    <div
      ref={dialogoRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 print:static print:bg-transparent print:p-0"
      role="dialog"
      aria-modal="true"
      aria-label="Cotización"
    >
      {!datosDocumento ? (
        <div className="w-full max-w-md rounded-lg bg-white p-6 print:hidden">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[var(--color-navy)]">
              Datos para tu cotización
            </h2>
            <button
              ref={cerrarBotonRef}
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar cotización"
              className="flex h-10 w-10 items-center justify-center text-2xl text-slate-400"
            >
              ×
            </button>
          </div>
          <form onSubmit={enviarForm} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Nombre del cliente
              <input
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre o empresa"
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Atención a (opcional)
              <input
                value={atencion}
                onChange={(e) => setAtencion(e.target.value)}
                placeholder="Nombre de contacto"
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)]"
            >
              Generar cotización
            </button>
          </form>
        </div>
      ) : (
        <div
          id="cotizacion-imprimible"
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-4 print:max-h-none print:overflow-visible print:rounded-none print:p-0"
        >
          <div className="mb-4 flex items-center justify-between print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)]"
            >
              Descargar / Imprimir PDF
            </button>
            <button
              ref={cerrarBotonRef}
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar cotización"
              className="flex h-10 w-10 items-center justify-center text-2xl text-slate-400"
            >
              ×
            </button>
          </div>

          {renta.length > 0 && (
            <CotizacionDocumento
              tipo="renta"
              items={renta}
              cliente={cliente}
              atencion={atencion}
              numero={datosDocumento.numero}
              fecha={datosDocumento.fecha}
            />
          )}
          {venta.length > 0 && (
            <CotizacionDocumento
              tipo="venta"
              items={venta}
              cliente={cliente}
              atencion={atencion}
              numero={datosDocumento.numero}
              fecha={datosDocumento.fecha}
            />
          )}
        </div>
      )}
    </div>
  );
}
