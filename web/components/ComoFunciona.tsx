import SectionEyebrow from "./SectionEyebrow";

const PASOS = [
  {
    numero: "1",
    titulo: "Cotiza",
    texto:
      "Arma tu pedido en el catálogo o escríbenos directo por WhatsApp — te respondemos en minutos.",
  },
  {
    numero: "2",
    titulo: "Confirmas",
    texto:
      "Eliges renta o compra, cantidad y, si es renta, la fecha de tu evento.",
  },
  {
    numero: "3",
    titulo: "Entrega",
    texto:
      "En renta, te lo entregamos e instalamos en sitio y lo recogemos al terminar. En compra, coordinamos entrega o recolección en la sucursal más cercana.",
  },
  {
    numero: "4",
    titulo: "Listo",
    texto:
      "Pagas por WhatsApp o con tarjeta en línea vía Mercado Pago, y tu equipo queda funcionando.",
  },
];

export default function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-navy)] via-[#081420] to-black py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[var(--color-teal)] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[var(--color-teal-dark)] opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <SectionEyebrow variant="dark">Proceso</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">¿Cómo funciona?</h2>
        <p className="mt-2 text-slate-300">
          De cotizar a tener el equipo funcionando, en cuatro pasos.
        </p>

        <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso) => (
            <li
              key={paso.numero}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="font-heading text-3xl font-bold text-[var(--color-teal)]">
                {paso.numero}
              </span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-white">{paso.titulo}</h3>
              <p className="mt-1 text-sm text-slate-300">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
