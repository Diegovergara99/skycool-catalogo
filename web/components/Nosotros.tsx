import { sucursales } from "@/lib/sucursales";
import SectionEyebrow from "./SectionEyebrow";

const DATOS_CONFIANZA = [
  { valor: "3 años", etiqueta: "de experiencia" },
  { valor: `${sucursales.length} sucursales`, etiqueta: "en toda la república" },
  { valor: "Garantía", etiqueta: "entrega e instalación incluidas en renta, 3 años en venta" },
];

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-navy)] via-[#081420] to-black py-16 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-teal)] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[var(--color-teal-dark)] opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <SectionEyebrow variant="dark">Sobre nosotros</SectionEyebrow>
            <h2 className="mt-3 font-heading text-3xl font-bold">¿Quiénes somos?</h2>
          </div>
          <div className="space-y-4 text-slate-300 md:col-span-2">
            <p>
              Somos una empresa mexicana, con presencia en toda la república, que te ofrece las
              mejores opciones en ventilación para grandes espacios: eventos, fiestas, bodegas,
              talleres y gimnasios. Combina uno o varios de nuestros modelos para crear un
              sistema de ventilación acorde a las necesidades de tu evento o negocio.
            </p>
            <p>
              Si tu necesidad es temporal —una boda, una feria, un evento de una noche— te
              conviene rentar: incluye entrega, instalación en sitio y recolección al terminar.
              Si necesitas ventilación todos los días —un taller, una bodega, un gimnasio—
              comprar te sale mejor a largo plazo, y todo nuestro equipo de venta incluye
              garantía de 3 años.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {DATOS_CONFIANZA.map((dato) => (
            <div
              key={dato.etiqueta}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="font-heading text-2xl font-bold text-[var(--color-teal)]">
                {dato.valor}
              </p>
              <p className="mt-1 text-sm text-slate-300">{dato.etiqueta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
