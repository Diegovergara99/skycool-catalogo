import type { Metadata } from "next";
import Link from "next/link";
import { obtenerEntradaBlog } from "@/lib/blog";
import { sucursales, listaCiudades } from "@/lib/sucursales";
import { construirArticuloJsonLd } from "@/lib/schema";

const entrada = obtenerEntradaBlog("ventilador-vs-enfriador-evaporativo")!;
const URL_PAGINA = "https://www.skycool.com.mx/blog/ventilador-vs-enfriador-evaporativo";

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

export default function VentiladorVsEnfriadorEvaporativoPage() {
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

        <Link href="/blog" className="text-sm font-medium text-[var(--color-teal)] underline">
          ← Volver al blog
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
          {entrada.titulo}
        </h1>
        <p className="mt-2 text-sm text-slate-400">Publicado el 14 de septiembre de 2026</p>

        <p className="mt-6 text-slate-300">
          Es una confusión común: un ventilador y un enfriador evaporativo no hacen lo mismo. Uno
          mueve aire, el otro lo enfría de verdad. Elegir el equivocado significa gastar en algo
          que no resuelve tu problema de calor.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Cómo funciona un ventilador industrial
        </h2>
        <p className="mt-2 text-slate-300">
          Un ventilador (de piso, giratorio o de techo) mueve grandes volúmenes de aire de un
          punto a otro. Esto genera una sensación de frescor real sobre la piel —el aire en
          movimiento acelera la evaporación del sudor— pero no cambia la temperatura del ambiente.
          En un cuarto a 35°C, un ventilador se siente mejor, pero el termómetro sigue marcando
          35°C.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Cómo funciona un enfriador evaporativo
        </h2>
        <p className="mt-2 text-slate-300">
          El enfriador evaporativo (modelo AY-D18) usa agua —consume 20 L/hr— que se evapora al
          pasar el aire a través de él, bajando la temperatura real del aire que sale, no solo la
          sensación térmica. Cubre 150 m² de enfriamiento efectivo. Como todo sistema evaporativo,
          funciona mejor en climas calurosos y secos: entre más húmedo esté el ambiente, menos
          margen tiene el agua para evaporarse y menos baja la temperatura.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">Comparación</h2>
        <div className="mt-3 overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-navy)] text-left text-xs text-white">
                <th className="p-2">Criterio</th>
                <th className="p-2">Ventilador</th>
                <th className="p-2">Enfriador evaporativo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-medium text-slate-800">¿Baja la temperatura real?</td>
                <td className="p-2 text-slate-600">No, solo sensación de frescor</td>
                <td className="p-2 text-slate-600">Sí, de verdad</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-medium text-slate-800">Cobertura</td>
                <td className="p-2 text-slate-600">400–500 m² (ventilador de piso)</td>
                <td className="p-2 text-slate-600">150 m²</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-medium text-slate-800">Usa agua</td>
                <td className="p-2 text-slate-600">No</td>
                <td className="p-2 text-slate-600">Sí, 20 L/hr</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-medium text-slate-800">Mejor clima para usarlo</td>
                <td className="p-2 text-slate-600">Cualquiera</td>
                <td className="p-2 text-slate-600">Caluroso y seco</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-slate-800">Precio (renta/día)</td>
                <td className="p-2 text-slate-600">Desde $650</td>
                <td className="p-2 text-slate-600">$1,250</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">¿Cuál elegir?</h2>
        <p className="mt-2 text-slate-300">
          Si solo necesitas circular el aire de un espacio —una bodega, un taller, un evento en un
          clima templado— un ventilador es más barato y cubre más superficie. Si el problema es
          calor extremo y necesitas bajar la temperatura de verdad —un evento al aire libre en
          pleno verano, un invernadero, una bodega con mucho calor generado por maquinaria— el
          enfriador evaporativo es el que resuelve el problema, siempre que el clima sea seco.
        </p>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-slate-300">
            Cotiza el equipo que necesites por WhatsApp — tenemos cobertura en {listaCiudades()} (
            {sucursales.length} sucursales).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/productos/enfriador-evaporativo"
              className="inline-flex items-center rounded-md bg-[var(--color-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
            >
              Ver enfriador evaporativo
            </Link>
            <Link
              href="/productos/ventilador-de-piso"
              className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              Ver ventilador de piso
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
