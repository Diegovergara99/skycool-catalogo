import Link from "next/link";

export default function PagoExitoPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-navy)]">¡Pago recibido!</h1>
      <p className="mt-3 text-slate-600">
        Gracias por tu compra o renta con SkyCool. Nos pondremos en contacto contigo para
        coordinar la entrega o instalación.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[var(--color-teal)] px-6 py-3 font-semibold text-[var(--color-navy)]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
