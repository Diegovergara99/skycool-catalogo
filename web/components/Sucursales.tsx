import { sucursales } from "@/lib/sucursales";

export default function Sucursales() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": sucursales.map((s) => ({
      "@type": "LocalBusiness",
      name: `SkyCool ${s.ciudad}`,
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
        <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">Puntos de venta</h2>
        <p className="mt-2 text-slate-500">Visítanos en cualquiera de nuestras sucursales.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sucursales.map((s) => (
            <address key={s.id} className="rounded-lg border border-slate-200 bg-white p-5 not-italic">
              <h3 className="font-heading text-lg font-semibold text-[var(--color-navy)]">
                {s.ciudad}, {s.estado}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{s.direccion}</p>
            </address>
          ))}
        </div>
      </div>
    </section>
  );
}
