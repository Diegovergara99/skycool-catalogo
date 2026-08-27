import { describe, it, expect } from "vitest";
import {
  construirMensajeWhatsapp,
  construirLinkWhatsapp,
  construirLinkContacto,
  construirLinkWhatsappMensaje,
} from "./whatsapp";
import type { ItemCarrito } from "./carrito-reducer";

const items: ItemCarrito[] = [
  {
    productoId: "extractor-aire",
    varianteId: "ay-1220",
    nombreProducto: "Extractor de aire",
    nombreVariante: "AY-1220",
    tipo: "renta",
    precioUnitario: 1200,
    cantidad: 2,
  },
];

describe("construirMensajeWhatsapp", () => {
  it("incluye producto, variante, tipo, cantidad y total", () => {
    const mensaje = construirMensajeWhatsapp(items);
    expect(mensaje).toContain("Extractor de aire");
    expect(mensaje).toContain("AY-1220");
    expect(mensaje).toContain("Renta");
    expect(mensaje).toContain("x2");
    expect(mensaje).toContain("2,400");
  });

  it("da un mensaje genérico si el carrito está vacío", () => {
    expect(construirMensajeWhatsapp([])).toContain("cotizar");
  });

  it("muestra 'Venta' para items con tipo venta", () => {
    const itemsVenta: ItemCarrito[] = [
      {
        productoId: "extractor-aire",
        varianteId: "ay-1220",
        nombreProducto: "Extractor de aire",
        nombreVariante: "AY-1220",
        tipo: "venta",
        precioUnitario: 1200,
        cantidad: 1,
      },
    ];
    expect(construirMensajeWhatsapp(itemsVenta)).toContain("Venta");
  });

  it("incluye todos los items cuando hay varios en el carrito", () => {
    const itemsMultiples: ItemCarrito[] = [
      ...items,
      {
        productoId: "ventilador-industrial",
        varianteId: "vi-40",
        nombreProducto: "Ventilador industrial",
        nombreVariante: "VI-40",
        tipo: "venta",
        precioUnitario: 3000,
        cantidad: 1,
      },
    ];
    const mensaje = construirMensajeWhatsapp(itemsMultiples);
    expect(mensaje).toContain("Extractor de aire");
    expect(mensaje).toContain("Ventilador industrial");
    expect(mensaje).toContain("5,400");
  });
});

describe("construirLinkWhatsapp", () => {
  it("arma un link wa.me con el número y el mensaje codificado", () => {
    const link = construirLinkWhatsapp("5215555555555", items);
    expect(link).toContain("https://wa.me/5215555555555?text=");
    expect(link).toContain(encodeURIComponent("Extractor de aire"));
  });
});

describe("construirLinkWhatsappMensaje", () => {
  it("arma un link wa.me con un mensaje libre, sin depender de items del carrito", () => {
    const link = construirLinkWhatsappMensaje(
      "5215555555555",
      "Hola, tuve un problema al pagar en el sitio de SkyCool. Quiero coordinar mi pago."
    );
    expect(link).toMatch(/^https:\/\/wa\.me\/5215555555555\?text=/);
    expect(decodeURIComponent(link)).toContain("tuve un problema al pagar");
  });
});

describe("construirLinkContacto", () => {
  it("arma un mensaje con nombre, teléfono y mensaje", () => {
    const link = construirLinkContacto("5215555555555", "Diego", "3312345678", "Necesito 2 ventiladores");
    expect(link).toMatch(/^https:\/\/wa\.me\/5215555555555\?text=/);
    expect(decodeURIComponent(link)).toContain("Diego");
    expect(decodeURIComponent(link)).toContain("3312345678");
    expect(decodeURIComponent(link)).toContain("Necesito 2 ventiladores");
  });

  it("limpia el número de teléfono removiendo espacios, +, # y guiones", () => {
    const link = construirLinkContacto("+52 1 55 5555#5555", "Diego", "3312345678", "Hola");
    expect(link).toMatch(/^https:\/\/wa\.me\/5215555555555\?text=/);
  });
});
