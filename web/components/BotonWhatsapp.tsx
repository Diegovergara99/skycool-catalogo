import { construirLinkWhatsappMensaje } from "@/lib/whatsapp";

const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "[TU WHATSAPP]";
const MENSAJE_SALUDO = "Hola, quiero más información sobre los equipos de SkyCool.";

export default function BotonWhatsapp() {
  const link = construirLinkWhatsappMensaje(WHATSAPP_NUMERO, MENSAJE_SALUDO);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"
      />
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.24 8.25-8.24M8.53 6.75c-.16 0-.43.06-.65.31s-.85.83-.85 2.02.87 2.35.99 2.51c.12.16 1.7 2.72 4.2 3.71 2.07.83 2.5.66 2.95.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.45-.28s-1.45-.72-1.68-.8c-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.36-.76-1.86-.2-.48-.4-.42-.55-.42h-.47z" />
      </svg>
    </a>
  );
}
