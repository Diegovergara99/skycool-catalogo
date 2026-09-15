export interface EntradaBlog {
  slug: string;
  titulo: string;
  descripcion: string;
  palabraClave: string;
  fechaPublicacion: string;
}

export const entradasBlog: EntradaBlog[] = [
  {
    slug: "cuantos-ventiladores-necesito",
    titulo: "¿Cuántos ventiladores industriales necesitas según los metros cuadrados?",
    descripcion:
      "Guía práctica para calcular cuántos ventiladores o enfriadores necesitas según el tamaño de tu evento, bodega o taller, con la cobertura real de cada modelo.",
    palabraClave: "cuántos ventiladores necesito para mi evento",
    fechaPublicacion: "2026-09-14",
  },
  {
    slug: "ventilador-piso-vs-techo",
    titulo: "Ventilador de piso vs. ventilador de techo industrial: diferencias",
    descripcion:
      "Comparamos el ventilador de piso portátil contra el ventilador de techo industrial de instalación fija: cobertura, costo, portabilidad y cuándo conviene cada uno.",
    palabraClave: "ventilador de piso vs ventilador de techo industrial",
    fechaPublicacion: "2026-09-14",
  },
  {
    slug: "ventilador-vs-enfriador-evaporativo",
    titulo: "Ventilador industrial vs. enfriador evaporativo: ¿cuál baja la temperatura?",
    descripcion:
      "Un ventilador mueve aire; un enfriador evaporativo lo enfría de verdad usando agua. La diferencia real y cuándo conviene cada equipo.",
    palabraClave: "diferencia entre ventilador y enfriador evaporativo",
    fechaPublicacion: "2026-09-14",
  },
  {
    slug: "renta-ventiladores-para-eventos",
    titulo: "Renta de ventiladores industriales para eventos: guía completa",
    descripcion:
      "Qué necesitas saber para rentar ventiladores industriales en tu boda, feria o jaripeo: qué modelo elegir, qué incluye la renta y cómo cotizar.",
    palabraClave: "renta de ventiladores industriales para eventos",
    fechaPublicacion: "2026-09-14",
  },
];

export function obtenerEntradaBlog(slug: string): EntradaBlog | undefined {
  return entradasBlog.find((e) => e.slug === slug);
}
