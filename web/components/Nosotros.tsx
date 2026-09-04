import { sucursales } from "@/lib/sucursales";

const DATOS_CONFIANZA = [
  { valor: "3 años", etiqueta: "de experiencia" },
  { valor: `${sucursales.length} sucursales`, etiqueta: "en toda la república" },
  { valor: "Garantía", etiqueta: "entrega e instalación incluidas en renta, 3 años en venta" },
];

export default function Nosotros() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">¿Quiénes somos?</h2>
        </div>
        <div className="space-y-4 text-slate-600 md:col-span-2">
          <p>
            Somos una empresa mexicana, con presencia en toda la república, que te ofrece las
            mejores opciones en ventilación para grandes espacios: eventos, fiestas, bodegas,
            talleres y gimnasios. Combina uno o varios de nuestros modelos para crear un sistema
            de ventilación acorde a las necesidades de tu evento o negocio.
          </p>
          <p>
            Si tu necesidad es temporal —una boda, una feria, un evento de una noche— te conviene
            rentar: incluye entrega, instalación en sitio y recolección al terminar. Si necesitas
            ventilación todos los días —un taller, una bodega, un gimnasio— comprar te sale mejor
            a largo plazo, y todo nuestro equipo de venta incluye garantía de 3 años.
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {DATOS_CONFIANZA.map((dato) => (
          <div
            key={dato.etiqueta}
            className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="font-heading text-2xl font-bold text-[var(--color-teal-dark)]">
              {dato.valor}
            </p>
            <p className="mt-1 text-sm text-slate-500">{dato.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
