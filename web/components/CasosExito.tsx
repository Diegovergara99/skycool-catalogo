import SectionEyebrow from "./SectionEyebrow";

interface CasoExito {
  video: string;
  poster: string;
  cliente: string;
  giro: string;
  resultado: string;
}

const CASOS: CasoExito[] = [
  {
    video: "/videos/casos-exito/ilusion-bowl.mp4",
    poster: "/videos/casos-exito/ilusion-bowl-poster.jpg",
    cliente: "Ilusión Bowl",
    giro: "Boliche y arcade, Guadalajara",
    resultado: "3 coolers. 1 boliche. Cero calor.",
  },
  {
    video: "/videos/casos-exito/foro-boletomovil.mp4",
    poster: "/videos/casos-exito/foro-boletomovil-poster.jpg",
    cliente: "Foro Boletomóvil",
    giro: "Foro de conciertos",
    resultado: "Ventiladores de piso listos antes de que empiece el show.",
  },
];

export default function CasosExito() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionEyebrow>Casos de éxito</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-navy)]">
          Clientes reales, resultados reales
        </h2>
        <p className="mt-2 text-slate-500">
          Así usan nuestro equipo negocios y eventos que no pueden darse el lujo de parar por el
          calor.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CASOS.map((caso) => (
            <figure
              key={caso.video}
              className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"
            >
              <video
                controls
                playsInline
                preload="none"
                poster={caso.poster}
                className="aspect-[9/16] w-full bg-black object-cover"
              >
                <source src={caso.video} type="video/mp4" />
              </video>
              <figcaption className="p-4">
                <p className="font-heading text-lg font-bold text-[var(--color-navy)]">
                  {caso.cliente}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{caso.giro}</p>
                <p className="mt-2 text-sm text-slate-600">{caso.resultado}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
