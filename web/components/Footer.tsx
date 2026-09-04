const ENLACES = [
  { href: "/#catalogo", etiqueta: "Catálogo" },
  { href: "/#nosotros", etiqueta: "Nosotros" },
  { href: "/#sucursales", etiqueta: "Sucursales" },
  { href: "/#contacto", etiqueta: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] py-10 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="h-6 w-6">
            <path d="M50 50 C50 30,65 15,85 15 C85 35,70 50,50 50 Z" fill="var(--color-teal)" />
            <path
              d="M50 50 C70 50,85 65,85 85 C65 85,50 70,50 50 Z"
              fill="var(--color-teal)"
              opacity="0.85"
            />
            <path
              d="M50 50 C50 70,35 85,15 85 C15 65,30 50,50 50 Z"
              fill="var(--color-teal)"
              opacity="0.7"
            />
          </svg>
          <p className="font-heading text-xl font-bold text-white">SKYCOOL</p>
        </div>
        <nav className="flex gap-5 text-sm">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} href={enlace.href} className="hover:text-white">
              {enlace.etiqueta}
            </a>
          ))}
          <a href="/aviso-de-privacidad" className="hover:text-white">
            Aviso de privacidad
          </a>
        </nav>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} SkyCool. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
