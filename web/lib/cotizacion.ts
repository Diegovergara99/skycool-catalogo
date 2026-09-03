import type { ItemCarrito } from "./carrito-reducer";

const TASA_IVA = 0.16;
const DESCUENTO_PAQUETE_3_DIAS = 0.15;

export interface TotalesCotizacion {
  subtotal: number;
  iva: number;
  totalConIva: number;
}

export function calcularTotales(items: ItemCarrito[]): TotalesCotizacion {
  const subtotal = items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  const iva = subtotal * TASA_IVA;
  return { subtotal, iva, totalConIva: subtotal + iva };
}

export interface PaqueteTresDias {
  sinIva: number;
  conIva: number;
}

export function calcularPaquete3Dias(subtotalPorDia: number): PaqueteTresDias {
  const sinIva = subtotalPorDia * 3 * (1 - DESCUENTO_PAQUETE_3_DIAS);
  return { sinIva, conIva: sinIva * (1 + TASA_IVA) };
}

export function separarPorTipo(items: ItemCarrito[]): {
  renta: ItemCarrito[];
  venta: ItemCarrito[];
} {
  return {
    renta: items.filter((item) => item.tipo === "renta"),
    venta: items.filter((item) => item.tipo === "venta"),
  };
}

export function generarNumeroCotizacion(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const sufijo = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `SKY-${yyyy}${mm}${dd}-${sufijo}`;
}

export function formatearFechaCotizacion(fecha: Date): string {
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
