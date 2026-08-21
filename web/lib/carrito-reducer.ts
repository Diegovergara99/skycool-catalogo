export type TipoOperacion = "renta" | "venta";

export interface ItemCarrito {
  productoId: string;
  varianteId: string;
  nombreProducto: string;
  nombreVariante: string;
  tipo: TipoOperacion;
  precioUnitario: number;
  cantidad: number;
}

export type AccionCarrito =
  | { type: "AGREGAR"; item: ItemCarrito }
  | { type: "QUITAR"; clave: string }
  | { type: "ACTUALIZAR_CANTIDAD"; clave: string; cantidad: number }
  | { type: "VACIAR" }
  | { type: "CARGAR"; items: ItemCarrito[] };

export function claveItem(item: Pick<ItemCarrito, "productoId" | "varianteId" | "tipo">): string {
  return `${item.productoId}__${item.varianteId}__${item.tipo}`;
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

export function subtotalCarrito(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
}
