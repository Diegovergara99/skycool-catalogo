import type { Metadata } from "next";
import Link from "next/link";
import { sucursales, listaCiudades } from "@/lib/sucursales";
import { obtenerEntradaBlog } from "@/lib/blog";
import { construirArticuloJsonLd, construirBreadcrumbJsonLd } from "@/lib/schema";

const entrada = obtenerEntradaBlog("renta-ventiladores-para-eventos")!;
const URL_PAGINA = "https://www.skycool.com.mx/blog/renta-ventiladores-para-eventos";

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

export default function RentaVentiladoresParaEventosPage() {
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
          Bodas, ferias, jaripeos, graduaciones — cualquier evento con mucha gente en un espacio
          cerrado o al aire libre en clima caluroso necesita ventilación, y comprar el equipo no
          siempre tiene sentido para un uso de un solo día. Aquí lo que necesitas saber antes de
          rentar.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">¿Qué incluye la renta?</h2>
        <p className="mt-2 text-slate-300">
          Entrega, instalación en sitio y recolección del equipo al terminar tu evento — tú no
          cargas ni conectas nada. El equipo llega listo para usarse y se retira cuando el evento
          termina.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          ¿Qué modelo elegir según tu evento?
        </h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Salón o carpa mediana:</strong> el ventilador de piso
            (cobertura de 400–500 m², $950/día) es el más versátil — diámetro de 1.25 m y alcance
            de hasta 40 m.
          </li>
          <li>
            <strong className="text-white">Espacio grande o exterior:</strong> combina varios
            ventiladores de piso para cubrir todo el área, o si el calor es extremo y el clima es
            seco, considera un enfriador evaporativo ($1,250/día) — es el único equipo que baja la
            temperatura real del ambiente, no solo mueve el aire.
          </li>
          <li>
            <strong className="text-white">Zona puntual</strong> (mesa de honor, pista de baile,
            área de DJ): el ventilador giratorio ($650/día) es compacto —solo 29 kg— y oscila para
            cubrir más superficie sin ocupar tanto espacio.
          </li>
        </ul>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          ¿Con cuánta anticipación debo cotizar?
        </h2>
        <p className="mt-2 text-slate-300">
          Entre más pronto cotices, más margen tienes para asegurar la cantidad de equipo que
          necesitas, sobre todo en temporada alta de bodas y ferias. Si tu evento es en fin de
          semana, cotizar durante la semana te da más flexibilidad de fecha y horario de entrega.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">Cómo cotizar</h2>
        <p className="mt-2 text-slate-300">
          Puedes armar tu pedido directo en el catálogo y pagar con tarjeta en línea vía Mercado
          Pago, o escribirnos por WhatsApp con los detalles de tu evento (fecha, tamaño del
          espacio y ciudad) y te ayudamos a definir qué equipo y cuántas unidades necesitas.
        </p>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-slate-300">
            Tenemos cobertura en {listaCiudades()} ({sucursales.length} sucursales) — cotiza tu
            evento hoy mismo.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#catalogo"
              className="inline-flex items-center rounded-md bg-[var(--color-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
            >
              Ver catálogo completo
            </Link>
            <Link
              href="/#contacto"
              className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              Cotizar mi evento
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
