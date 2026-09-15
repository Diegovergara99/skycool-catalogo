import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { sucursales } from "@/lib/sucursales";
import { construirProductosJsonLd, construirBreadcrumbJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";
import ProductosRelacionados from "@/components/ProductosRelacionados";

const producto = productos.find((p) => p.id === "ventilador-piso")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/ventilador-de-piso";
const TITULO = "Ventilador de piso industrial — renta o venta | SkyCool";
const DESCRIPCION =
  "Ventilador de piso industrial DM: renta por evento (con entrega e instalación) o compra para uso permanente, con garantía de 3 años. Diámetro 1.25 m, cobertura 400-500 m².";

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
    images: ["/imagenes/ventilador-piso.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/ventilador-piso.jpg"],
  },
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);
const breadcrumbJsonLd = construirBreadcrumbJsonLd([
  { nombre: "Inicio", url: "https://www.skycool.com.mx/" },
  { nombre: "Catálogo", url: "https://www.skycool.com.mx/#catalogo" },
  { nombre: producto.nombre, url: URL_PAGINA },
]);

export default function VentiladorDePisoPage() {
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
          Ventilador de piso industrial — renta por evento o compra para uso permanente
        </h1>

        <p className="mt-4 text-slate-300">
          El ventilador de piso DM es el equipo más versátil del catálogo de SkyCool: mismo
          ventilador, dos formas de conseguirlo según lo que necesites. Diámetro de 1.25 m,
          alcance de hasta 40 metros y cobertura de 400 a 500 m² — suficiente para mover aire en
          un salón de eventos, una bodega o un gimnasio completo.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="font-heading text-lg font-bold text-[var(--color-teal)]">
              Rentas si...
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Es para un evento puntual: boda, graduación, feria, jaripeo. Incluye entrega,
              instalación en sitio y recolección al terminar — tú no cargas ni conectas nada.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="font-heading text-lg font-bold text-[var(--color-teal)]">
              Compras si...
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              La necesidad es permanente: taller, bodega, gimnasio o negocio que requiere
              ventilación todos los días. Incluye garantía de 3 años contra defectos de fábrica.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-slate-400">
          3 años de experiencia, {sucursales.length} sucursales en todo el país, y el mismo
          equipo disponible en renta o venta según lo que tu evento o negocio necesite hoy.
        </p>

        <div className="mt-10 max-w-sm">
          <ProductoCardStandalone producto={producto} />
        </div>

        <ProductosRelacionados idActual="ventilador-piso" />
      </div>
    </main>
  );
}
