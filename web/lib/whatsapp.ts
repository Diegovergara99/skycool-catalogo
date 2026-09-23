import type { ItemCarrito } from "./carrito-reducer";
import { calcularImporteItem } from "./carrito-reducer";

export function construirMensajeWhatsapp(items: ItemCarrito[]): string {
  if (items.length === 0) {
    return "Hola, quiero cotizar equipo de SkyCool.";
  }

  const lineas = items.map((i) => {
    const etiquetaTipo =
      i.tipo === "renta" ? `Renta ${i.dias === 3 ? "3 días (-15%)" : "1 día"}` : "Venta";
    return `• ${i.nombreProducto} (${i.nombreVariante}) — ${etiquetaTipo} x${i.cantidad}`;
  });
  const total = items.reduce((acc, i) => acc + calcularImporteItem(i), 0);

  return [
    "Hola, quiero cotizar los siguientes equipos SkyCool:",
    "",
    ...lineas,
    "",
    `Total estimado: $${total.toLocaleString("es-MX")} MXN`,
  ].join("\n");
}

function limpiarNumero(numero: string): string {
  return numero.replace(/\D/g, "");
}

function construirLinkWaMe(numero: string, texto: string): string {
  return `https://wa.me/${limpiarNumero(numero)}?text=${encodeURIComponent(texto)}`;
}

export function construirLinkWhatsapp(numero: string, items: ItemCarrito[]): string {
  const mensaje = construirMensajeWhatsapp(items);
  return construirLinkWaMe(numero, mensaje);
}

/**
 * Arma un link de WhatsApp con un mensaje libre (sin depender de items del
 * carrito), útil para casos como "tuve un problema al pagar" donde no hay
 * un carrito que cotizar.
 */
export function construirLinkWhatsappMensaje(numero: string, mensaje: string): string {
  return construirLinkWaMe(numero, mensaje);
}

export function construirLinkContacto(
  numero: string,
  nombre: string,
  telefono: string,
  mensaje: string
): string {
  const texto = `Hola, soy ${nombre} (tel: ${telefono}). ${mensaje}`;
  return construirLinkWaMe(numero, texto);
}

/**
 * Mensaje para confirmar disponibilidad de renta antes de pagar en línea —
 * la renta necesita entrega/instalación/recolección en sitio, así que el
 * pago no se habilita hasta confirmar que hay equipo disponible para las
 * fechas del cliente en su ciudad.
 */
export function construirMensajeDisponibilidadRenta(items: ItemCarrito[], ciudad: string): string {
  const lineas = items.map((i) => {
    const etiquetaTipo =
      i.tipo === "renta" ? `Renta ${i.dias === 3 ? "3 días (-15%)" : "1 día"}` : "Venta";
    return `• ${i.nombreProducto} (${i.nombreVariante}) — ${etiquetaTipo} x${i.cantidad}`;
  });

  return [
    `Hola, quiero confirmar disponibilidad de renta en ${ciudad} para:`,
    "",
    ...lineas,
    "",
    "¿Está disponible para las fechas que necesito?",
  ].join("\n");
}

export function construirLinkDisponibilidadRenta(
  numero: string,
  items: ItemCarrito[],
  ciudad: string
): string {
  return construirLinkWaMe(numero, construirMensajeDisponibilidadRenta(items, ciudad));
}

/**
 * Para ciudades donde todavía no hay sucursal SkyCool — se pregunta
 * cobertura en vez de ofrecer pago en línea, porque la renta no se puede
 * cumplir logísticamente fuera de las ciudades con sucursal.
 */
export function construirMensajeCoberturaRenta(ciudad: string): string {
  return `Hola, quiero rentar equipo de SkyCool en ${ciudad}. No veo esa ciudad entre las que tienen sucursal — ¿tienen cobertura ahí?`;
}

export function construirLinkCoberturaRenta(numero: string, ciudad: string): string {
  return construirLinkWaMe(numero, construirMensajeCoberturaRenta(ciudad));
}
