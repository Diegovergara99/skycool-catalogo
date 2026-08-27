"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCarrito } from "@/lib/carrito-context";

export default function PagoExitoPage() {
  const { vaciarCarrito, hidratado } = useCarrito();

  useEffect(() => {
    // Esperamos a que `CarritoProvider` termine de hidratarse desde
    // localStorage antes de vaciar: los efectos de este componente hijo
    // corren ANTES que el efecto de hidratación del provider, así que si
    // vaciáramos de inmediato, la hidratación posterior podría sobreescribir
    // el carrito vacío con los datos guardados de la sesión anterior.
    if (!hidratado) return;
    vaciarCarrito();
    // Solo debe reaccionar a que la hidratación termine, no a que
    // `vaciarCarrito` cambie de identidad en cada render (evita un loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidratado]);

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
