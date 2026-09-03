import type { Metadata } from "next";

// Estas páginas son destinos de redirección de Mercado Pago (pago exitoso,
// con error, o pendiente) — no tienen contenido propio que valga la pena
// indexar, y sin esto heredarían el título/descripción de la portada,
// compitiendo con ella en resultados de búsqueda.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PagoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
