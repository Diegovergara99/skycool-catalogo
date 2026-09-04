import Image from "next/image";

const FOTOS = [
  {
    src: "/imagenes/instalaciones/ventilador-techo-instalado.jpg",
    alt: "Ventilador de techo industrial instalado, vista de las aspas",
    descripcion: "Ventilador de techo industrial instalado en nave industrial",
  },
  {
    src: "/imagenes/instalaciones/ventilador-techo-bodega.jpg",
    alt: "Ventilador de techo industrial funcionando en una bodega con rollos de tela",
    descripcion: "Ventilador de techo instalado en bodega textil",
  },
  {
    src: "/imagenes/instalaciones/ventilador-piso-instalado.jpg",
    alt: "Ventilador de piso industrial instalado en un área de recepción",
    descripcion: "Ventilador de piso instalado en área de recepción",
  },
  {
    src: "/imagenes/instalaciones/enfriador-evaporativo-instalado.jpg",
    alt: "Enfriador evaporativo instalado en una planta industrial",
    descripcion: "Enfriador evaporativo instalado en planta industrial",
  },
];

export default function Instalaciones() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">
        Instalaciones reales
      </h2>
      <p className="mt-2 text-slate-500">Equipo SkyCool trabajando en sitio, no solo en catálogo.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FOTOS.map((foto) => (
          <figure key={foto.src} className="overflow-hidden rounded-lg border border-slate-200">
            <div className="relative aspect-[4/3] w-full bg-slate-50">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
            <figcaption className="p-3 text-xs text-slate-500">{foto.descripcion}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
