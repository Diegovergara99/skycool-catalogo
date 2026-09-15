import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { construirProductosJsonLd, construirBreadcrumbJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";
import ProductosRelacionados from "@/components/ProductosRelacionados";

const producto = productos.find((p) => p.id === "ventilador-techo")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/ventilador-de-techo-industrial";
const TITULO = "Ventilador de techo industrial (serie W.FANS) — venta | SkyCool";
const DESCRIPCION =
  "Ventilador de techo industrial para naves y bodegas grandes. Tres tamaños: W14, W20 y W26. Motor PMSM de bajo consumo, ruido ≤38 dB, garantía de 3 años.";

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
    images: ["/imagenes/ventilador-techo.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/ventilador-techo.jpg"],
  },
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);
const breadcrumbJsonLd = construirBreadcrumbJsonLd([
  { nombre: "Inicio", url: "https://www.skycool.com.mx/" },
  { nombre: "Catálogo", url: "https://www.skycool.com.mx/#catalogo" },
  { nombre: producto.nombre, url: URL_PAGINA },
]);

const TAMANOS = [
  { modelo: "W14", diametro: "4.2 m", cobertura: "804 m²", precio: "$46,298" },
  { modelo: "W20", diametro: "6.1 m", cobertura: "1,520 m²", precio: "$53,306" },
  { modelo: "W26", diametro: "8 m", cobertura: "2,462 m²", precio: "$59,670" },
];

export default function VentiladorDeTechoPage() {
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
          Ventilador de techo industrial — ventilación permanente para naves y bodegas grandes
        </h1>

        <p className="mt-4 text-slate-300">
          La serie W.FANS está pensada para espacios que necesitan ventilación todos los días, no
          solo para un evento: naves industriales, bodegas grandes, gimnasios y plantas de
          producción. A diferencia de nuestros equipos de renta, este ventilador es de
          instalación fija — se compra, se instala una vez, y no es equipo de renta.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Tres tamaños según el espacio
        </h2>
        <div className="mt-3 overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-navy)] text-left text-xs text-white">
                <th className="p-2">Modelo</th>
                <th className="p-2">Diámetro</th>
                <th className="p-2">Cobertura</th>
                <th className="p-2 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {TAMANOS.map((t) => (
                <tr key={t.modelo} className="border-b border-slate-100">
                  <td className="p-2 font-medium text-slate-800">{t.modelo}</td>
                  <td className="p-2">{t.diametro}</td>
                  <td className="p-2">{t.cobertura}</td>
                  <td className="p-2 text-right">{t.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Por qué un ventilador de techo y no uno de piso
        </h2>
        <p className="mt-2 text-slate-300">
          No ocupa espacio en el suelo (importante en bodegas con montacargas o pasillos de
          trabajo), mueve el aire de todo el espacio de forma uniforme, y con motor síncrono de
          imán permanente (PMSM) consume menos energía operando todo el día que varios
          ventiladores de piso encendidos al mismo tiempo. Ruido de operación de apenas ≤38 dB —
          no interfiere con el trabajo debajo.
        </p>

        <p className="mt-6 text-sm text-slate-400">
          Garantía de 3 años contra defectos de fábrica. Solo venta — no disponible en renta, por
          ser equipo de instalación fija.
        </p>

        <div className="mt-10 max-w-sm">
          <ProductoCardStandalone producto={producto} />
        </div>

        <ProductosRelacionados idActual="ventilador-techo" />
      </div>
    </main>
  );
}
