import { listaCiudades } from "@/lib/sucursales";
import SectionEyebrow from "./SectionEyebrow";

const PREGUNTAS = [
  {
    pregunta: "¿Me conviene rentar o comprar?",
    respuesta:
      "Si es para un evento puntual —boda, feria, jaripeo— te conviene rentar. Si necesitas ventilación todos los días —taller, bodega, gimnasio— comprar te sale mejor a largo plazo.",
  },
  {
    pregunta: "¿Qué incluye la renta?",
    respuesta:
      "Entrega, instalación en sitio y recolección del equipo al terminar tu evento — tú no cargas ni conectas nada.",
  },
  {
    pregunta: "¿Cómo puedo pagar?",
    respuesta:
      "Coordinas y pagas por WhatsApp, o pagas con tarjeta en línea de forma segura con Mercado Pago.",
  },
  {
    pregunta: "¿En qué ciudades tienen cobertura?",
    respuesta: `Tenemos sucursales en ${listaCiudades()}.`,
  },
  {
    pregunta: "¿Los equipos de venta tienen garantía?",
    respuesta: "Sí, todo nuestro equipo de venta incluye garantía de 3 años contra defectos de fábrica.",
  },
  {
    pregunta: "¿Cuánto tarda la entrega?",
    respuesta:
      "Depende de tu ciudad y la disponibilidad del equipo — cotiza por WhatsApp y te confirmamos fecha exacta antes de que pagues.",
  },
];

export default function Faq() {
  return (
    <section
      id="preguntas-frecuentes"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-navy)] via-[#081420] to-black py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-teal)] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[var(--color-teal-dark)] opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4">
        <SectionEyebrow variant="dark">Dudas frecuentes</SectionEyebrow>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">Preguntas frecuentes</h2>

        <div className="mt-8 space-y-3">
          {PREGUNTAS.map((item) => (
            <details
              key={item.pregunta}
              className="group rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur open:bg-white/10"
            >
              <summary className="cursor-pointer list-none font-heading text-base font-semibold text-white marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {item.pregunta}
                  <span
                    aria-hidden="true"
                    className="text-[var(--color-teal)] transition group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-slate-300">{item.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
