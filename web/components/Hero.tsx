import Image from "next/image";
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

        <div className="relative motion-safe:animate-[fade-in-up_0.6s_ease-out_0.15s_backwards]">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <Image
              src="/imagenes/ventilador-giratorio.jpg"
              alt="Ventilador industrial giratorio SkyCool en uso"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-[var(--color-navy)]/90 px-4 py-3 shadow-xl backdrop-blur">
            <p className="font-heading text-2xl font-bold text-[var(--color-teal)]">3 años</p>
            <p className="text-xs text-slate-300">de experiencia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
