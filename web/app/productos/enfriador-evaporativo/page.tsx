import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { construirProductosJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";

const producto = productos.find((p) => p.id === "enfriador-evaporativo")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/enfriador-evaporativo";
const TITULO = "Enfriador evaporativo industrial — renta o venta | SkyCool";
const DESCRIPCION =
  "Enfriador evaporativo AY-D18: el único equipo SkyCool que baja la temperatura real del ambiente, no solo mueve aire. Cubre 150 m². Renta o venta.";

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
    images: ["/imagenes/enfriador-evaporativo.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/enfriador-evaporativo.jpg"],
  },
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);

export default function EnfriadorEvaporativoPage() {
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
        Enfriador evaporativo — el único equipo que de verdad baja la temperatura
      </h1>

      <p className="mt-4 text-slate-600">
        A diferencia de los ventiladores (que solo mueven aire), el enfriador evaporativo lo
        enfría de verdad usando agua — baja la temperatura real del ambiente, no solo genera
        sensación de frescor. Cubre 150 m² de enfriamiento efectivo.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
          ¿Cuándo conviene sobre un ventilador?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Cuando ventilar no alcanza: invernaderos, bodegas con mucho calor, o eventos al aire
          libre en climas extremos donde mover el aire caliente no es suficiente.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">Rentas si...</h2>
          <p className="mt-2 text-sm text-slate-600">
            Es para un evento puntual en clima caluroso. Incluye entrega, instalación en sitio y
            recolección al terminar.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            Compras si...
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Necesitas enfriamiento permanente en una bodega, invernadero o taller. Incluye
            garantía de 3 años.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-sm">
        <ProductoCardStandalone producto={producto} />
      </div>
    </main>
  );
}
