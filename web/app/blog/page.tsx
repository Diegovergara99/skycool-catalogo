import type { Metadata } from "next";
import Link from "next/link";
import { entradasBlog } from "@/lib/blog";
import SectionEyebrow from "@/components/SectionEyebrow";

const URL_PAGINA = "https://www.skycool.com.mx/blog";
const TITULO = "Blog — Guías de ventilación industrial | SkyCool";
const DESCRIPCION =
  "Guías prácticas sobre ventiladores industriales, enfriadores evaporativos y renta de equipo para eventos: cuántos necesitas, qué modelo elegir y cómo cotizar.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: URL_PAGINA },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: URL_PAGINA,
    siteName: "SkyCool",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
};

export default function BlogPage() {
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
        <Link href="/" className="text-sm font-medium text-[var(--color-teal)] underline">
          ← Volver al inicio
        </Link>

        <SectionEyebrow variant="dark">Guías</SectionEyebrow>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">Blog</h1>
        <p className="mt-4 text-slate-300">
          Guías prácticas para elegir y rentar equipo de ventilación industrial, con datos reales
          de nuestro catálogo.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {entradasBlog.map((entrada) => (
            <Link
              key={entrada.slug}
              href={`/blog/${entrada.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="font-heading text-lg font-bold text-[var(--color-navy)] group-hover:text-[var(--color-teal-dark)]">
                {entrada.titulo}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{entrada.descripcion}</p>
              <span className="mt-4 inline-block text-sm font-medium text-[var(--color-teal-dark)] underline">
                Leer más
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
