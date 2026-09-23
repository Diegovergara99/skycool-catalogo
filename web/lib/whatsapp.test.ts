import { describe, it, expect } from "vitest";
import {
  construirMensajeWhatsapp,
  construirLinkWhatsapp,
  construirLinkContacto,
  construirLinkWhatsappMensaje,
  construirMensajeDisponibilidadRenta,
  construirLinkDisponibilidadRenta,
  construirMensajeCoberturaRenta,
  construirLinkCoberturaRenta,
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

  it("indica '3 días (-15%)' y aplica el descuento al total cuando el item se rentó a 3 días", () => {
    const items3Dias: ItemCarrito[] = [{ ...items[0], dias: 3, cantidad: 1 }];
    const mensaje = construirMensajeWhatsapp(items3Dias);
    expect(mensaje).toContain("3 días (-15%)");
    // $1,200 × 3 × 0.85 = $3,060
    expect(mensaje).toContain("3,060");
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

describe("construirMensajeDisponibilidadRenta", () => {
  it("incluye la ciudad, los items del carrito y pregunta por disponibilidad", () => {
    const mensaje = construirMensajeDisponibilidadRenta(items, "Guadalajara");
    expect(mensaje).toContain("Guadalajara");
    expect(mensaje).toContain("Extractor de aire");
    expect(mensaje).toContain("disponibilidad");
  });
});

describe("construirLinkDisponibilidadRenta", () => {
  it("arma un link wa.me con la ciudad y los items codificados", () => {
    const link = construirLinkDisponibilidadRenta("5215555555555", items, "Monterrey");
    expect(link).toMatch(/^https:\/\/wa\.me\/5215555555555\?text=/);
    expect(decodeURIComponent(link)).toContain("Monterrey");
    expect(decodeURIComponent(link)).toContain("Extractor de aire");
  });
});

describe("construirMensajeCoberturaRenta", () => {
  it("pregunta por cobertura de renta en una ciudad", () => {
    const mensaje = construirMensajeCoberturaRenta("Puebla");
    expect(mensaje).toContain("Puebla");
    expect(mensaje).toContain("cobertura");
  });
});

describe("construirLinkCoberturaRenta", () => {
  it("arma un link wa.me con la ciudad codificada", () => {
    const link = construirLinkCoberturaRenta("5215555555555", "Puebla");
    expect(link).toMatch(/^https:\/\/wa\.me\/5215555555555\?text=/);
    expect(decodeURIComponent(link)).toContain("Puebla");
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
