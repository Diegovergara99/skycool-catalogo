import type { ItemCarrito } from "./carrito-reducer";
import { calcularImporteItem } from "./carrito-reducer";

export const TASA_IVA = 0.16;

export interface TotalesCotizacion {
  subtotal: number;
  iva: number;
  totalConIva: number;
}

// El subtotal de cada línea ya refleja el descuento del paquete de 3 días
// cuando el cliente lo seleccionó (ver ItemCarrito.dias en
// carrito-reducer.ts) — antes esto se aproximaba con una sección aparte
// ("PAQUETE 3 DÍAS") calculada sobre el total completo asumiendo que TODO
// se rentaría a 3 días; ahora que el cliente elige los días por producto,
// ese cálculo genérico se reemplazó por el desglose real por línea.
export function calcularTotales(items: ItemCarrito[]): TotalesCotizacion {
  const subtotal = items.reduce((acc, item) => acc + calcularImporteItem(item), 0);
  const iva = subtotal * TASA_IVA;
  return { subtotal, iva, totalConIva: subtotal + iva };
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
