import { construirLinkWhatsappMensaje } from "@/lib/whatsapp";
import { sucursales } from "@/lib/sucursales";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";
const MENSAJE_HERO = "Hola, quiero cotizar equipo de SkyCool para mi evento o negocio.";

export default function Hero() {
  const linkWhatsapp = construirLinkWhatsappMensaje(WHATSAPP_NUMERO, MENSAJE_HERO);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-navy)] via-[#081420] to-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-teal)] opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[var(--color-teal-dark)] opacity-20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2 md:items-center">
        <div className="motion-safe:animate-[fade-in-up_0.6s_ease-out]">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)] backdrop-blur">
            Venta y renta
          </span>

          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-[1.05] md:text-6xl">
            Ventilación industrial para eventos y grandes espacios
          </h1>

          <p className="mt-5 max-w-md text-slate-300">
            Ventiladores de piso, giratorios, de techo, extractores de aire y enfriadores
            evaporativos. Presencia en Guadalajara, CDMX, Monterrey, León y Culiacán.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex items-center rounded-md bg-[var(--color-teal)] px-6 py-3 font-semibold text-[var(--color-navy)] shadow-[0_10px_40px_-10px_rgba(34,211,211,0.5)] transition hover:scale-[1.03] hover:bg-[var(--color-teal-dark)]"
            >
              Ver catálogo
            </a>
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              Cotizar por WhatsApp
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span>{sucursales.length} sucursales</span>
            <span className="text-white/20">•</span>
            <span>Entrega e instalación incluida</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center py-8 motion-safe:animate-[fade-in-up_0.6s_ease-out_0.15s_backwards]">
          <div
            aria-hidden="true"
            className="absolute h-72 w-72 rounded-full border border-[var(--color-teal)]/30 motion-safe:animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"
          />
          <div
            aria-hidden="true"
            className="absolute h-56 w-56 rounded-full border border-[var(--color-teal)]/40 motion-safe:animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:1s]"
          />

          <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur">
            <svg
              viewBox="0 0 200 200"
              className="h-40 w-40 motion-safe:animate-[spin_9s_linear_infinite]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="aspa" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3d3" />
                  <stop offset="100%" stopColor="#159999" />
                </linearGradient>
              </defs>
              <path d="M100 100 C100 60,130 30,170 30 C170 70,140 100,100 100 Z" fill="url(#aspa)" />
              <path
                d="M100 100 C140 100,170 130,170 170 C130 170,100 140,100 100 Z"
                fill="url(#aspa)"
                opacity="0.85"
              />
              <path
                d="M100 100 C100 140,70 170,30 170 C30 130,60 100,100 100 Z"
                fill="url(#aspa)"
                opacity="0.7"
              />
              <path
                d="M100 100 C60 100,30 70,30 30 C70 30,100 60,100 100 Z"
                fill="url(#aspa)"
                opacity="0.55"
              />
              <circle cx="100" cy="100" r="16" fill="#0b1f33" stroke="#22d3d3" strokeWidth="3" />
            </svg>
          </div>

          <div className="absolute -bottom-2 -left-2 rounded-xl border border-white/10 bg-[var(--color-navy)]/90 px-4 py-3 shadow-xl backdrop-blur">
            <p className="font-heading text-2xl font-bold text-[var(--color-teal)]">3 años</p>
            <p className="text-xs text-slate-300">de experiencia</p>
          </div>
          <div className="absolute -right-2 -top-2 rounded-xl border border-white/10 bg-[var(--color-navy)]/90 px-4 py-3 shadow-xl backdrop-blur">
            <p className="font-heading text-2xl font-bold text-[var(--color-teal)]">38,000 m³/h</p>
            <p className="text-xs text-slate-300">flujo de aire</p>
          </div>
        </div>
      </div>
    </section>
  );
}
