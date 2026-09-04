import { sucursales } from "@/lib/sucursales";
import SectionEyebrow from "./SectionEyebrow";

export default function Sucursales() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": sucursales.map((s) => ({
      "@type": ["LocalBusiness", "Store"],
      "@id": `https://www.skycool.com.mx/#sucursal-${s.id}`,
      name: `SkyCool ${s.ciudad}`,
      url: "https://www.skycool.com.mx/#sucursales",
      branchOf: { "@id": "https://www.skycool.com.mx/#organizacion" },
      address: {
        "@type": "PostalAddress",
        streetAddress: s.direccion,
        addressLocality: s.ciudad,
        addressRegion: s.estado,
        addressCountry: "MX",
      },
    })),
  };

  return (
    <section id="sucursales" className="bg-slate-50 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4">
        <SectionEyebrow>Ubicaciones</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-navy)]">
          Puntos de venta
        </h2>
        <p className="mt-2 text-slate-500">Visítanos en cualquiera de nuestras sucursales.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sucursales.map((s) => (
            <address
              key={s.id}
              className="flex gap-3 rounded-lg border border-slate-200 bg-white p-5 not-italic shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-teal-dark)]"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-navy)]">
                  {s.ciudad}, {s.estado}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{s.direccion}</p>
              </div>
            </address>
          ))}
        </div>
      </div>
    </section>
  );
}
