import type { Metadata } from "next";
import Link from "next/link";
import { obtenerEntradaBlog } from "@/lib/blog";
import { sucursales, listaCiudades } from "@/lib/sucursales";
import { construirArticuloJsonLd } from "@/lib/schema";

const entrada = obtenerEntradaBlog("cuantos-ventiladores-necesito")!;
const URL_PAGINA = "https://www.skycool.com.mx/blog/cuantos-ventiladores-necesito";

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

const TABLA = [
  { modelo: "Ventilador de piso (DM-110 / DM-220)", cobertura: "400–500 m²", idealPara: "Eventos, talleres y bodegas medianas" },
  { modelo: "Ventilador giratorio (AY-920B)", cobertura: "Alcance de 15–20 m", idealPara: "Espacios chicos o enfriar una zona puntual dentro de un área más grande" },
  { modelo: "Ventilador de techo W14", cobertura: "804 m²", idealPara: "Naves o bodegas medianas (instalación fija)" },
  { modelo: "Ventilador de techo W20", cobertura: "1,520 m²", idealPara: "Bodegas grandes" },
  { modelo: "Ventilador de techo W26", cobertura: "2,462 m²", idealPara: "Naves industriales muy grandes" },
  { modelo: "Enfriador evaporativo AY-D18", cobertura: "150 m² (enfriamiento real)", idealPara: "Climas calurosos y secos" },
];

export default function CuantosVentiladoresNecesitoPage() {
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
          Es la pregunta más común antes de rentar o comprar equipo de ventilación: ¿un solo
          ventilador alcanza, o necesito varios? La respuesta depende del tamaño real de tu
          espacio y de la cobertura de cada modelo — aquí te explicamos cómo calcularlo con datos
          reales, no al ojo.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Primero, mide tu espacio
        </h2>
        <p className="mt-2 text-slate-300">
          Multiplica el largo por el ancho del área que necesitas ventilar o enfriar para obtener
          los metros cuadrados (m²). Si es un espacio cerrado (bodega, taller, salón techado),
          considera también la altura del techo: espacios muy altos dispersan el aire hacia
          arriba y pueden necesitar un modelo con mayor volumen de aire. Si es un evento al aire
          libre, la cobertura efectiva suele ser un poco menor que en interiores porque el aire se
          dispersa con más libertad.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Cobertura real de cada modelo
        </h2>
        <div className="mt-3 overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-navy)] text-left text-xs text-white">
                <th className="p-2">Modelo</th>
                <th className="p-2">Cobertura</th>
                <th className="p-2">Ideal para</th>
              </tr>
            </thead>
            <tbody>
              {TABLA.map((fila) => (
                <tr key={fila.modelo} className="border-b border-slate-100">
                  <td className="p-2 font-medium text-slate-800">{fila.modelo}</td>
                  <td className="p-2">{fila.cobertura}</td>
                  <td className="p-2 text-slate-600">{fila.idealPara}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">Un ejemplo práctico</h2>
        <p className="mt-2 text-slate-300">
          Si tu salón de eventos mide 800 m², un solo ventilador de piso (400–500 m² de
          cobertura) no va a alcanzar a cubrir todo el espacio de forma uniforme — necesitarías
          al menos 2 unidades, o combinarlos con un ventilador giratorio para reforzar una zona
          específica (por ejemplo, la pista de baile o la mesa de honor). Para una bodega de 1,200
          m² de uso diario, en cambio, un solo ventilador de techo W20 (1,520 m² de cobertura) es
          más eficiente que instalar varios ventiladores de piso, porque no ocupa espacio en el
          suelo y queda fijo trabajando todos los días.
        </p>

        <h2 className="mt-10 font-heading text-xl font-bold text-white">
          Cuando un solo modelo no basta
        </h2>
        <p className="mt-2 text-slate-300">
          No tienes que quedarte con un solo tipo de equipo: puedes combinar uno o varios modelos
          para armar un sistema de ventilación acorde a las necesidades de tu evento o negocio —
          por ejemplo, ventiladores de piso para cobertura general más un enfriador evaporativo en
          la zona donde más calor se concentra.
        </p>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-slate-300">
            ¿No estás seguro de cuántos equipos necesitas? Cotiza por WhatsApp y te ayudamos a
            calcularlo según tu espacio — tenemos cobertura en {listaCiudades()} (
            {sucursales.length} sucursales).
          </p>
          <Link
            href="/#catalogo"
            className="mt-4 inline-flex items-center rounded-md bg-[var(--color-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </main>
  );
}
