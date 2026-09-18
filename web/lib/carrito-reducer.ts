export type TipoOperacion = "renta" | "venta";

// Paquete de renta por 3 días con 15% de descuento sobre el precio de
// 3 días normales (precio por día × 3 × 0.85) — regla de negocio real,
// confirmada con datos de la tabla de precios oficial de SkyCool. Solo
// aplica a exactamente 3 días, no es un descuento escalonado para 4+ días.
export const DESCUENTO_PAQUETE_3_DIAS = 0.15;
export type DiasRenta = 1 | 3;

export interface ItemCarrito {
  productoId: string;
  varianteId: string;
  nombreProducto: string;
  nombreVariante: string;
  tipo: TipoOperacion;
  precioUnitario: number;
  cantidad: number;
  /**
   * Días de renta (1 o 3). Solo relevante cuando `tipo === "renta"` — en
   * venta no existe el concepto de "días". Si no está presente, se trata
   * como 1 (retrocompatible con items guardados en localStorage antes de
   * que existiera este campo).
   */
  dias?: DiasRenta;
}

export type AccionCarrito =
  | { type: "AGREGAR"; item: ItemCarrito }
  | { type: "QUITAR"; clave: string }
  | { type: "ACTUALIZAR_CANTIDAD"; clave: string; cantidad: number }
  | { type: "VACIAR" }
  | { type: "CARGAR"; items: ItemCarrito[] };

// Un mismo producto/variante rentado a 1 día y a 3 días son ofertas
// distintas (precio unitario efectivo distinto) — deben quedar como líneas
// separadas del carrito, no sumarse en una sola. Por eso `dias` forma parte
// de la clave para items de renta; en venta ese concepto no aplica.
export function claveItem(
  item: Pick<ItemCarrito, "productoId" | "varianteId" | "tipo" | "dias">
): string {
  const sufijoDias = item.tipo === "renta" ? `__${item.dias ?? 1}d` : "";
  return `${item.productoId}__${item.varianteId}__${item.tipo}${sufijoDias}`;
}

export function carritoReducer(state: ItemCarrito[], accion: AccionCarrito): ItemCarrito[] {
  switch (accion.type) {
    case "AGREGAR": {
      const clave = claveItem(accion.item);
      const existente = state.find((i) => claveItem(i) === clave);
      if (existente) {
        return state.map((i) =>
          claveItem(i) === clave ? { ...i, cantidad: i.cantidad + accion.item.cantidad } : i
        );
      }
      return [...state, accion.item];
    }
    case "QUITAR":
      return state.filter((i) => claveItem(i) !== accion.clave);
    case "ACTUALIZAR_CANTIDAD":
      if (accion.cantidad <= 0) {
        return state.filter((i) => claveItem(i) !== accion.clave);
      }
      return state.map((i) =>
        claveItem(i) === accion.clave ? { ...i, cantidad: accion.cantidad } : i
      );
    case "VACIAR":
      return [];
    case "CARGAR":
      return accion.items;
    default:
      return state;
  }
}

/**
 * Precio de una sola unidad, aplicando el descuento del paquete de 3 días
 * cuando corresponde. Ej.: $950/día a 3 días = $950 × 3 × 0.85 = $2,422.50.
 * Para venta (o renta a 1 día), es simplemente el precio unitario tal cual.
 */
export function calcularImporteUnitario(
  precioUnitario: number,
  tipo: TipoOperacion,
  dias: DiasRenta = 1
): number {
  if (tipo === "renta" && dias === 3) {
    return precioUnitario * 3 * (1 - DESCUENTO_PAQUETE_3_DIAS);
  }
  return precioUnitario;
}

/** Importe total de una línea del carrito (precio por unidad × cantidad). */
export function calcularImporteItem(item: ItemCarrito): number {
  return calcularImporteUnitario(item.precioUnitario, item.tipo, item.dias ?? 1) * item.cantidad;
}

export function subtotalCarrito(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + calcularImporteItem(i), 0);
}
