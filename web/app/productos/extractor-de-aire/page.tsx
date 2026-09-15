import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { construirProductosJsonLd, construirBreadcrumbJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";
import ProductosRelacionados from "@/components/ProductosRelacionados";

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
const breadcrumbJsonLd = construirBreadcrumbJsonLd([
  { nombre: "Inicio", url: "https://www.skycool.com.mx/" },
  { nombre: "Catálogo", url: "https://www.skycool.com.mx/#catalogo" },
  { nombre: producto.nombre, url: URL_PAGINA },
]);

export default function ExtractorDeAirePage() {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <a href="/#catalogo" className="text-sm font-medium text-[var(--color-teal)] underline">
          ← Volver al catálogo
        </a>

        <h1 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
          Extractor de aire industrial — ventilación forzada para interiores
        </h1>

        <p className="mt-4 text-slate-300">
          Ventilador de extracción para espacios cerrados que necesitan intercambio de aire
          forzado: talleres, bodegas cerradas, cocinas industriales. A diferencia de los
          ventiladores de circulación, este saca el aire caliente o viciado hacia afuera en vez
          de solo moverlo dentro del mismo espacio.
        </p>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="font-heading text-lg font-bold text-[var(--color-teal)]">
            Ventajas técnicas
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Motor DC (corriente continua), más eficiente y silencioso que uno de corriente
            alterna. Flujo de aire de 38,000 m³/h con menos de 70 dB de ruido. Equipo de
            instalación fija — <strong className="text-white">solo venta</strong>, no disponible
            en renta.
          </p>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Garantía de 3 años contra defectos de fábrica.
        </p>

        <div className="mt-10 max-w-sm">
          <ProductoCardStandalone producto={producto} />
        </div>

        <ProductosRelacionados idActual="extractor-aire" />
      </div>
    </main>
  );
}
