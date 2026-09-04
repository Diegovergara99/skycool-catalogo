"use client";

import { type FormEvent, useState } from "react";
import { construirLinkContacto } from "@/lib/whatsapp";
import { useEnviarCorreoContacto } from "@/lib/useEnviarCorreoContacto";
import SectionEyebrow from "./SectionEyebrow";

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
      <SectionEyebrow>Contacto</SectionEyebrow>
      <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-navy)]">Contacto</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-600 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6 text-[#25D366]">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.24 8.25-8.24M8.53 6.75c-.16 0-.43.06-.65.31s-.85.83-.85 2.02.87 2.35.99 2.51c.12.16 1.7 2.72 4.2 3.71 2.07.83 2.5.66 2.95.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.45-.28s-1.45-.72-1.68-.8c-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.36-.76-1.86-.2-.48-.4-.42-.55-.42h-.47z" />
            </svg>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">WhatsApp</p>
              <p className="font-medium text-[var(--color-navy)]">{WHATSAPP_NUMERO}</p>
            </div>
          </a>
          <a
            href={INSTAGRAM}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-600 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6 text-[#E4405F]">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.9 5.9 0 0 0 .62 4.14C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13a5.9 5.9 0 0 0 2.13 1.39c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.05-1.28.06-1.69.06-4.95s-.01-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84m0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0" />
            </svg>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Instagram</p>
              <p className="font-medium text-[var(--color-navy)]">{INSTAGRAM}</p>
            </div>
          </a>
        </div>

        <form
          onSubmit={enviarPorWhatsapp}
          className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-slate-700">
            Nombre
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm transition focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
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
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm transition focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
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
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm transition focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
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
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm transition focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
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
