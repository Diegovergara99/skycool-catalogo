export interface Sucursal {
  id: string;
  ciudad: string;
  estado: string;
  direccion: string;
}

export const sucursales: Sucursal[] = [
  {
    id: "guadalajara",
    ciudad: "Guadalajara",
    estado: "Jalisco",
    direccion: "Calle 18 #2530, Colón Industrial, 44940 Guadalajara, Jal.",
  },
  {
    id: "tonala",
    ciudad: "Tonalá",
    estado: "Jalisco",
    direccion: "Av Tonalá 536, Francisco Villa, 45402 Tonalá, Jal.",
  },
  {
    id: "cdmx",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    direccion: "Talabarteros 95, Emilio Carranza, Venustiano Carranza, 15230, CDMX",
  },
  {
    id: "monterrey",
    ciudad: "Monterrey",
    estado: "Nuevo León",
    direccion: "Manuel María del Llano 1020, Centro, 64000 Monterrey, N.L.",
  },
  {
    id: "culiacan",
    ciudad: "Culiacán",
    estado: "Sinaloa",
    direccion: "Blvd. Francisco I. Madero 782, Primer Cuadro, 80000 Culiacán Rosales, Sin.",
  },
  {
    id: "leon",
    ciudad: "León",
    estado: "Guanajuato",
    direccion: "Mérida 127, El Coecillo, 37260 León de los Aldama, Gto.",
  },
  {
    id: "santa-rosa",
    ciudad: "Santa Rosa",
    estado: "Guanajuato",
    direccion: "San Juan Crisóstomo 1312, 37490 Plan de Ayala, Gto.",
  },
];
