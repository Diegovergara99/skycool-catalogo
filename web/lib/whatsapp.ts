import type { ItemCarrito } from "./carrito-reducer";

export function construirMensajeWhatsapp(items: ItemCarrito[]): string {
  if (items.length === 0) {
    return "Hola, quiero cotizar equipo de SkyCool.";
  }

  const lineas = items.map(
    (i) =>
      `• ${i.nombreProducto} (${i.nombreVariante}) — ${i.tipo === "renta" ? "Renta" : "Venta"} x${i.cantidad}`
  );
  const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

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
