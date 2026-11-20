import { construirLinkWhatsappMensaje } from "@/lib/whatsapp";
import { formatearTelefono } from "@/lib/formatearTelefono";
import SectionEyebrow from "./SectionEyebrow";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";
const MENSAJE = "Hola, quiero cotizar renta de ventiladores en Guadalajara.";

export default function RentaGuadalajara() {
  const linkWhatsapp = construirLinkWhatsappMensaje(WHATSAPP_NUMERO, MENSAJE);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <SectionEyebrow>Cobertura local</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-navy)]">
          Renta de ventiladores en Guadalajara
        </h2>
        <p className="mt-4 text-slate-600">
          ¿Tienes una boda, un evento o una bodega con calor en Guadalajara? Rentamos
          ventiladores industriales de piso, giratorios y enfriadores evaporativos para eventos
          en Guadalajara, Zapopan, Tonalá, Tlaquepaque y El Salto. Te los dejamos instalados
          antes de que llegue la gente y los recogemos al terminar. Desde $950 + IVA, con entrega
          e instalación incluidas.
        </p>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Cotiza por WhatsApp al {formatearTelefono(WHATSAPP_NUMERO)}
        </a>
      </div>
    </section>
  );
}
