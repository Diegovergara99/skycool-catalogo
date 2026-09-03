"use client";

import { type FormEvent, useState } from "react";
import { construirLinkContacto } from "@/lib/whatsapp";
import { useEnviarCorreoContacto } from "@/lib/useEnviarCorreoContacto";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";
const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "[TU INSTAGRAM]";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const { enviando, error, exito, enviarCorreo } = useEnviarCorreoContacto();

  function enviarPorWhatsapp(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const link = construirLinkContacto(WHATSAPP_NUMERO, nombre, telefono, mensaje);
    const nuevaVentana = window.open(link, "_blank", "noopener,noreferrer");
    if (!nuevaVentana) {
      window.location.href = link;
    }
    setEnviado(true);
    setNombre("");
    setCorreo("");
    setTelefono("");
    setMensaje("");
  }

  async function enviarPorCorreo() {
    const enviadoOk = await enviarCorreo({ nombre, correo, telefono, mensaje });
    if (enviadoOk) {
      setNombre("");
      setCorreo("");
      setTelefono("");
      setMensaje("");
    }
  }

  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pb-16">
      <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Contacto</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-3 text-slate-600">
          <p>
            WhatsApp:{" "}
            <a
              className="font-medium text-[var(--color-navy)] underline"
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
            >
              {WHATSAPP_NUMERO}
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a className="font-medium text-[var(--color-navy)] underline" href={INSTAGRAM}>
              {INSTAGRAM}
            </a>
          </p>
        </div>

        <form onSubmit={enviarPorWhatsapp} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Nombre
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Correo
            <input
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Tu correo"
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Teléfono
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Tu teléfono"
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ¿Qué necesitas?
            <textarea
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¿Qué necesitas rentar o comprar?"
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
            />
          </label>
          <p className="text-xs text-slate-400">
            Al enviar este formulario aceptas nuestro{" "}
            <a href="/aviso-de-privacidad" className="underline">
              Aviso de privacidad
            </a>
            .
          </p>
          <button
            type="submit"
            className="w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)]"
          >
            Enviar por WhatsApp
          </button>
          {enviado && (
            <p role="status" className="text-sm font-medium text-[var(--color-navy)]">
              Te estamos redirigiendo a WhatsApp…
            </p>
          )}

          <button
            type="button"
            disabled={enviando}
            onClick={enviarPorCorreo}
            className="w-full rounded-md border border-[var(--color-navy)] py-3 font-semibold text-[var(--color-navy)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            {enviando ? "Enviando…" : "Enviar por correo"}
          </button>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {exito && (
            <p role="status" className="text-sm font-medium text-[var(--color-navy)]">
              ¡Correo enviado! Te contactaremos pronto.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
