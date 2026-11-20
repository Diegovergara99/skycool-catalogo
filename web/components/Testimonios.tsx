import SectionEyebrow from "./SectionEyebrow";

interface Testimonio {
  nombre: string;
  opinion: string;
}

const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Omar",
    opinion:
      "Compré los dos ventiladores, el de techo y el de piso, para el taller y fue muy buena inversión. El de techo cubre toda la nave y el de piso lo movemos donde se necesite.",
  },
  {
    nombre: "Byron",
    opinion:
      "Todo bien, llegaron a la hora que quedamos y el ventilador jaló muy bien en la bodega. Ya no se siente ese bochorno de antes.",
  },
  {
    nombre: "David",
    opinion:
      "Renté uno para la boda de mi hermana y la neta nos salvó, hacía un calor horrible y con el ventilador se estuvo a gusto toda la noche.",
  },
];

function Estrellas() {
  return (
    <div className="flex gap-0.5 text-[var(--color-teal-dark)]" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.1 6-.7z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonios() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionEyebrow>Reseñas reales</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-navy)]">
          Lo que dicen nuestros clientes
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <figure
              key={t.nombre}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <Estrellas />
              <blockquote className="mt-3 text-sm text-slate-600">“{t.opinion}”</blockquote>
              <figcaption className="mt-4 font-heading font-bold text-[var(--color-navy)]">
                {t.nombre}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
