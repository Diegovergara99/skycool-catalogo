import Link from "next/link";
import { construirLinkWhatsappMensaje } from "@/lib/whatsapp";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";

export default function PagoErrorPage() {
  const linkWhatsapp = construirLinkWhatsappMensaje(
    WHATSAPP_NUMERO,
    "Hola, tuve un problema al pagar en el sitio de SkyCool. Quiero coordinar mi pago."
  );

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-navy)]">
        No pudimos procesar tu pago
      </h1>
      <p className="mt-3 text-slate-600">
        Tu pago no se completó. Puedes intentarlo de nuevo desde el carrito, o cotizar y
        coordinar el pago directamente por WhatsApp.
      </p>
      <Link
        href="/#catalogo"
        className="mt-6 rounded-md bg-[var(--color-teal)] px-6 py-3 font-semibold text-[var(--color-navy)]"
      >
        Volver al catálogo
      </Link>
      <a
        href={linkWhatsapp}
        target="_blank"
        rel="noreferrer"
        className="mt-3 rounded-md bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        Coordinar por WhatsApp
      </a>
    </main>
  );
}
