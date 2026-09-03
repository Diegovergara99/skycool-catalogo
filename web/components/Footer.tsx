const ENLACES = [
  { href: "#catalogo", etiqueta: "Catálogo" },
  { href: "#nosotros", etiqueta: "Nosotros" },
  { href: "#sucursales", etiqueta: "Sucursales" },
  { href: "#contacto", etiqueta: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] py-10 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="font-heading text-xl font-bold text-white">SKYCOOL</p>
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
