export default function Nosotros() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="font-heading text-3xl font-bold text-[var(--color-navy)]">¿Quiénes somos?</h2>
        </div>
        <p className="text-slate-600 md:col-span-2">
          Somos una empresa mexicana, con presencia en toda la república, que te ofrece las
          mejores opciones en ventilación para grandes espacios: eventos, fiestas, bodegas,
          talleres y gimnasios. Combina uno o varios de nuestros modelos para crear un sistema
          de ventilación acorde a las necesidades de tu evento o negocio.
        </p>
      </div>
    </section>
  );
}
