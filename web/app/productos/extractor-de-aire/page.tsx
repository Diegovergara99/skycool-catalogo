import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { construirProductosJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";

const producto = productos.find((p) => p.id === "extractor-aire")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/extractor-de-aire";
const TITULO = "Extractor de aire industrial — venta | SkyCool";
const DESCRIPCION =
  "Extractor de aire industrial AY-1220 para espacios cerrados: talleres, bodegas y cocinas industriales. Motor DC, 38,000 m³/h, menos de 70 dB. Solo venta.";

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
    images: ["/imagenes/extractor-aire.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/extractor-aire.jpg"],
  },
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);

export default function ExtractorDeAirePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a href="/#catalogo" className="text-sm font-medium text-[var(--color-navy)] underline">
        ← Volver al catálogo
      </a>

      <h1 className="mt-4 font-heading text-3xl font-bold text-[var(--color-navy)] md:text-4xl">
        Extractor de aire industrial — ventilación forzada para interiores
      </h1>

      <p className="mt-4 text-slate-600">
        Ventilador de extracción para espacios cerrados que necesitan intercambio de aire
        forzado: talleres, bodegas cerradas, cocinas industriales. A diferencia de los
        ventiladores de circulación, este saca el aire caliente o viciado hacia afuera en vez de
        solo moverlo dentro del mismo espacio.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
          Ventajas técnicas
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Motor DC (corriente continua), más eficiente y silencioso que uno de corriente alterna.
          Flujo de aire de 38,000 m³/h con menos de 70 dB de ruido. Equipo de instalación fija —
          <strong> solo venta</strong>, no disponible en renta.
        </p>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Garantía de 3 años contra defectos de fábrica.
      </p>

      <div className="mt-10 max-w-sm">
        <ProductoCardStandalone producto={producto} />
      </div>
    </main>
  );
}
