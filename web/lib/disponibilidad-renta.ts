import type { ItemCarrito } from "./carrito-reducer";
import { sucursales } from "./sucursales";

export type EstadoDisponibilidadRenta =
  | "sin_renta"
  | "falta_ciudad"
  | "con_sucursal"
  | "sin_sucursal";

/**
 * La renta requiere logística local (entrega, instalación, recolección), a
 * diferencia de la venta que se puede enviar a cualquier parte. Por eso el
 * pago en línea de un carrito con renta se bloquea hasta confirmar
 * disponibilidad por WhatsApp, y solo se ofrece en ciudades donde ya hay
 * sucursal — fuera de esas ciudades no hay forma de cumplir la entrega.
 */
export function evaluarDisponibilidadRenta(
  items: ItemCarrito[],
  ciudad: string
): EstadoDisponibilidadRenta {
  const hayRenta = items.some((item) => item.tipo === "renta");
  if (!hayRenta) return "sin_renta";
  if (!ciudad) return "falta_ciudad";
  const tieneSucursal = sucursales.some((s) => s.ciudad === ciudad);
  return tieneSucursal ? "con_sucursal" : "sin_sucursal";
}
