import type { Metadata } from "next";
import Link from "next/link";
import { obtenerEntradaBlog } from "@/lib/blog";
import { sucursales, listaCiudades } from "@/lib/sucursales";
import { construirArticuloJsonLd, construirBreadcrumbJsonLd } from "@/lib/schema";

const entrada = obtenerEntradaBlog("ventilador-piso-vs-techo")!;
const URL_PAGINA = "https://www.skycool.com.mx/blog/ventilador-piso-vs-techo";

export const metadata: Metadata = {
  title: `${entrada.titulo} | SkyCool`,
  description: entrada.descripcion,
  alternates: { canonical: URL_PAGINA },
  openGraph: {
    title: entrada.titulo,
    description: entrada.descripcion,
    url: URL_PAGINA,
    siteName: "SkyCool",
    locale: "es_MX",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: entrada.titulo,
    description: entrada.descripcion,
  },
};

const jsonLd = construirArticuloJsonLd(entrada, URL_PAGINA);
const breadcrumbJsonLd = construirBreadcrumbJsonLd([
  { nombre: "Inicio", url: "https://www.skycool.com.mx/" },
  { nombre: "Blog", url: "https://www.skycool.com.mx/blog" },
  { nombre: entrada.titulo, url: URL_PAGINA },
]);

const COMPARACION = [
  { criterio: "Renta disponible", piso: "Sí, desde $950/día", techo: "No, solo venta" },
  { criterio: "Portabilidad", piso: "Sí, se puede mover", techo: "No, instalación fija" },
  { criterio: "Cobertura", piso: "400–500 m²", techo: "804–2,462 m² según tamaño" },
  { criterio: "Ruido", piso: "—", techo: "≤38 dB (motor PMSM)" },
  { criterio: "Precio de compra", piso: "$23,520", techo: "$46,298 – $59,670" },
  { criterio: "Ideal para", piso: "Eventos y uso temporal", techo: "Bodegas y uso diario permanente" },
];

export default function VentiladorPisoVsTechoPage() {
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

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-16 sm:pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <Link href="/blog" className="text-sm font-medium text-[var(--color-teal)] underline">
          ← Volver al blog
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
          {entrada.titulo}
        </h1>
        <p className="mt-2 text-sm text-slate-400">Publicado el 14 de septiembre de 2026</p>

        <p className="mt-6 text-slate-300">
          Ambos mueven grandes volúmenes de aire, pero resuelven necesidades muy distintas: uno es
          para lo temporal y portátil, el otro para lo permanente y fijo. Aquí la diferencia real,
          con specs de catálogo.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Ventilador de piso — portátil y flexible
        </h2>
        <p className="mt-2 text-slate-300">
          Diámetro de 1.25 m, 60 kg de peso, cobertura de 400 a 500 m² y alcance de hasta 30–40 m
          según el modelo (110V o 220V). Se puede rentar por $950 al día (incluye entrega,
          instalación en sitio y recolección al terminar) o comprar por $23,520 para uso
          permanente. Su ventaja principal es que se mueve de un lugar a otro según lo necesites.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Ventilador de techo industrial — instalación fija
        </h2>
        <p className="mt-2 text-slate-300">
          La serie W.FANS viene en tres tamaños (W14, W20, W26) con coberturas de 804, 1,520 y
          2,462 m² respectivamente. Usa un motor síncrono de imán permanente (PMSM) que consume
          menos energía operando todo el día que varios ventiladores de piso encendidos al mismo
          tiempo, y su ruido de operación es de apenas ≤38 dB. Es solo venta — no está disponible
          en renta porque requiere instalación fija en el techo.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">Comparación directa</h2>
        <div className="mt-3 overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-navy)] text-left text-xs text-white">
                <th className="p-2">Criterio</th>
                <th className="p-2">Ventilador de piso</th>
                <th className="p-2">Ventilador de techo</th>
              </tr>
            </thead>
            <tbody>
              {COMPARACION.map((fila) => (
                <tr key={fila.criterio} className="border-b border-slate-100">
                  <td className="p-2 font-medium text-slate-800">{fila.criterio}</td>
                  <td className="p-2 text-slate-600">{fila.piso}</td>
                  <td className="p-2 text-slate-600">{fila.techo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">¿Cuál me conviene?</h2>
        <p className="mt-2 text-slate-300">
          Si tu necesidad es temporal —una boda, una feria, un evento de una noche— te conviene
          rentar el ventilador de piso: no tiene sentido comprar algo que usarás una sola vez. Si
          necesitas ventilación todos los días en un mismo lugar —un taller, una bodega, una nave
          industrial— el ventilador de techo te sale mejor a largo plazo: no ocupa espacio en el
          suelo (importante si hay montacargas o pasillos de trabajo) y no tienes que estar
          moviéndolo ni almacenándolo.
        </p>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-slate-300">
            Cotiza el modelo que necesites por WhatsApp — tenemos cobertura en {listaCiudades()} (
            {sucursales.length} sucursales).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/productos/ventilador-de-piso"
              className="inline-flex items-center rounded-md bg-[var(--color-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
            >
              Ver ventilador de piso
            </Link>
            <Link
              href="/productos/ventilador-de-techo-industrial"
              className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              Ver ventilador de techo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
