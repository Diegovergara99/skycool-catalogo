import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { construirProductosJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";

const producto = productos.find((p) => p.id === "ventilador-giratorio")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/ventilador-giratorio";
const TITULO = "Ventilador giratorio industrial — renta o venta | SkyCool";
const DESCRIPCION =
  "Ventilador giratorio AY-920B: el más compacto y portátil de SkyCool. Renta para eventos pequeños o enfriamiento puntual, o compra para oficinas y talleres chicos. Desde $650/día.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: {
    canonical: URL_PAGINA,
  },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: URL_PAGINA,
    siteName: "SkyCool",
    images: ["/imagenes/ventilador-giratorio.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/ventilador-giratorio.jpg"],
  },
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);

export default function VentiladorGiratorioPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[var(--color-navy)] via-[#081420] to-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-teal)] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[var(--color-teal-dark)] opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-16 sm:pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <a href="/#catalogo" className="text-sm font-medium text-[var(--color-teal)] underline">
          ← Volver al catálogo
        </a>

        <h1 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
          Ventilador giratorio — compacto, portátil y para espacios pequeños
        </h1>

        <p className="mt-4 text-slate-300">
          El más ligero y compacto de la línea SkyCool: solo 29 kg, frente a los 60 kg del
          ventilador de piso. Ideal para espacios chicos o para enfriamiento puntual dentro de un
          área más grande. Oscila para cubrir más superficie sin ocupar tanto espacio.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="font-heading text-lg font-bold text-[var(--color-teal)]">
              Rentas si...
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Es para un evento pequeño o para enfriar una zona específica dentro de un espacio
              más grande. Incluye entrega, instalación en sitio y recolección al terminar.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="font-heading text-lg font-bold text-[var(--color-teal)]">
              Compras si...
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Necesitas ventilación permanente en una oficina o taller chico que no requiere un
              equipo grande. Incluye garantía de 3 años.
            </p>
          </div>
        </div>

        <div className="mt-10 max-w-sm">
          <ProductoCardStandalone producto={producto} />
        </div>
      </div>
    </main>
  );
}
