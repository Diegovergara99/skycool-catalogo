"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import type { DireccionEnvio as DireccionEnvioType } from "@/lib/direccion-envio";
import { useDialogoAccesible } from "@/lib/useDialogoAccesible";

interface DireccionEnvioProps {
  onConfirmar: (direccion: DireccionEnvioType) => void;
  onCerrar: () => void;
  cargando: boolean;
  error: string | null;
}

const ESTADO_INICIAL: DireccionEnvioType = {
  nombre: "",
  telefono: "",
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  colonia: "",
  ciudad: "",
  estado: "",
  codigoPostal: "",
  referencias: "",
};

export default function DireccionEnvio({
  onConfirmar,
  onCerrar,
  cargando,
  error,
}: DireccionEnvioProps) {
  const [direccion, setDireccion] = useState<DireccionEnvioType>(ESTADO_INICIAL);
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

  function actualizarCampo(campo: keyof DireccionEnvioType, valor: string) {
    setDireccion((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviarForm(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onConfirmar(direccion);
  }

  return (
    <div
      ref={dialogoRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Dirección de envío"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[var(--color-navy)]">
            ¿A dónde enviamos tu pedido?
          </h2>
          <button
            ref={cerrarBotonRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar dirección de envío"
            className="flex h-10 w-10 items-center justify-center text-2xl text-slate-400"
          >
            ×
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Enviamos a cualquier parte de la República Mexicana. Necesitamos estos datos para
          cotizar y programar tu envío.
        </p>

        {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={enviarForm} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Nombre completo
            <input
              required
              value={direccion.nombre}
              onChange={(e) => actualizarCampo("nombre", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Teléfono de contacto
            <input
              required
              type="tel"
              value={direccion.telefono}
              onChange={(e) => actualizarCampo("telefono", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-2 block text-sm font-medium text-slate-700">
              Calle
              <input
                required
                value={direccion.calle}
                onChange={(e) => actualizarCampo("calle", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              No. exterior
              <input
                required
                value={direccion.numeroExterior}
                onChange={(e) => actualizarCampo("numeroExterior", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            No. interior / depto / oficina (opcional)
            <input
              value={direccion.numeroInterior}
              onChange={(e) => actualizarCampo("numeroInterior", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Colonia
            <input
              required
              value={direccion.colonia}
              onChange={(e) => actualizarCampo("colonia", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm font-medium text-slate-700">
              Ciudad
              <input
                required
                value={direccion.ciudad}
                onChange={(e) => actualizarCampo("ciudad", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Estado
              <input
                required
                value={direccion.estado}
                onChange={(e) => actualizarCampo("estado", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Código postal
            <input
              required
              inputMode="numeric"
              value={direccion.codigoPostal}
              onChange={(e) => actualizarCampo("codigoPostal", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Referencias (opcional)
            <input
              value={direccion.referencias}
              onChange={(e) => actualizarCampo("referencias", e.target.value)}
              placeholder="Color de fachada, entre calles, etc."
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {cargando ? "Conectando…" : "Continuar al pago"}
          </button>
        </form>
      </div>
    </div>
  );
}
