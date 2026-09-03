import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-navy)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-heading text-sm uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Venta y renta
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">
            Ventilación industrial para eventos y grandes espacios
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Ventiladores de piso, giratorios, de techo, extractores de aire y enfriadores
            evaporativos. Presencia en Guadalajara, CDMX, Monterrey, León y Culiacán.
          </p>
          <a
            href="#catalogo"
            className="mt-8 inline-block rounded-md bg-[var(--color-teal)] px-6 py-3 font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)]"
          >
            Ver catálogo
          </a>
        </div>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-navy-light)]">
          <Image
            src="/imagenes/ventilador-giratorio.jpg"
            alt="Ventilador industrial giratorio SkyCool en uso"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
