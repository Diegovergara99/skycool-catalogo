import Link from "next/link";

export default function PagoErrorPage() {
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
    </main>
  );
}
