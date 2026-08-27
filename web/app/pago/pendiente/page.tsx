import Link from "next/link";

export default function PagoPendientePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-navy)]">
        Tu pago está pendiente
      </h1>
      <p className="mt-3 text-slate-600">
        Mercado Pago está confirmando tu pago (por ejemplo, si pagaste en OXXO o por
        transferencia). Te avisaremos por WhatsApp en cuanto se confirme.
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
