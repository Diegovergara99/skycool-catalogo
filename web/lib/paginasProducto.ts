export interface PaginaProducto {
  id: string;
  nombre: string;
  ruta: string;
}

/**
 * Única fuente de verdad para las 5 páginas de producto dedicadas — usada
 * tanto para enlazar "También te puede interesar" entre ellas como para
 * construir breadcrumbs. Si agregas una página de producto nueva, agrégala
 * aquí también.
 */
export const paginasProducto: PaginaProducto[] = [
  { id: "ventilador-piso", nombre: "Ventilador de piso", ruta: "/productos/ventilador-de-piso" },
  {
    id: "ventilador-techo",
    nombre: "Ventilador de techo industrial",
    ruta: "/productos/ventilador-de-techo-industrial",
  },
  { id: "extractor-aire", nombre: "Extractor de aire", ruta: "/productos/extractor-de-aire" },
  {
    id: "ventilador-giratorio",
    nombre: "Ventilador giratorio",
    ruta: "/productos/ventilador-giratorio",
  },
  {
    id: "enfriador-evaporativo",
    nombre: "Enfriador evaporativo",
    ruta: "/productos/enfriador-evaporativo",
  },
];
