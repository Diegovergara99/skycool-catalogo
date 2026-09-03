import { describe, it, expect } from "vitest";
import {
  calcularTotales,
  calcularPaquete3Dias,
  separarPorTipo,
  generarNumeroCotizacion,
  formatearFechaCotizacion,
} from "./cotizacion";
import type { ItemCarrito } from "./carrito-reducer";

const itemPisoRenta: ItemCarrito = {
  productoId: "ventilador-piso",
  varianteId: "dm-110",
  nombreProducto: "Ventilador de piso",
  nombreVariante: "DM-110 (conexión a 110V)",
  tipo: "renta",
  precioUnitario: 941,
  cantidad: 2,
};

const itemGiratorioRenta: ItemCarrito = {
  productoId: "ventilador-giratorio",
  varianteId: "ay-920b",
  nombreProducto: "Ventilador giratorio",
  nombreVariante: "AY-920B",
  tipo: "renta",
  precioUnitario: 652,
  cantidad: 1,
};

describe("calcularTotales", () => {
  it("calcula subtotal, IVA y total con IVA para renta (caso real verificado contra la plantilla)", () => {
    const totales = calcularTotales([itemPisoRenta, itemGiratorioRenta]);
    expect(totales.subtotal).toBe(2534);
    expect(totales.iva).toBeCloseTo(405.44, 2);
    expect(totales.totalConIva).toBeCloseTo(2939.44, 2);
  });

  it("calcula subtotal, IVA y total con IVA para venta (caso real verificado contra la plantilla)", () => {
    const itemPisoVenta: ItemCarrito = { ...itemPisoRenta, tipo: "venta", precioUnitario: 23520 };
    const itemGiratorioVenta: ItemCarrito = {
      ...itemGiratorioRenta,
      tipo: "venta",
      precioUnitario: 16310,
    };
    const totales = calcularTotales([itemPisoVenta, itemGiratorioVenta]);
    expect(totales.subtotal).toBe(63350);
    expect(totales.iva).toBeCloseTo(10136, 2);
    expect(totales.totalConIva).toBeCloseTo(73486, 2);
  });

  it("devuelve ceros para un arreglo vacío", () => {
    expect(calcularTotales([])).toEqual({ subtotal: 0, iva: 0, totalConIva: 0 });
  });
});

describe("calcularPaquete3Dias", () => {
  it("aplica 3 días con 15% de descuento (caso real verificado contra la plantilla)", () => {
    const paquete = calcularPaquete3Dias(2534);
    expect(paquete.sinIva).toBeCloseTo(6461.7, 2);
    expect(paquete.conIva).toBeCloseTo(7495.57, 2);
  });
});

describe("separarPorTipo", () => {
  it("separa los items de renta y de venta en dos listas", () => {
    const itemVenta: ItemCarrito = { ...itemPisoRenta, tipo: "venta", precioUnitario: 23520 };
    const { renta, venta } = separarPorTipo([itemPisoRenta, itemVenta, itemGiratorioRenta]);
    expect(renta).toEqual([itemPisoRenta, itemGiratorioRenta]);
    expect(venta).toEqual([itemVenta]);
  });

  it("devuelve listas vacías si no hay items de ese tipo", () => {
    const { renta, venta } = separarPorTipo([itemPisoRenta]);
    expect(renta).toHaveLength(1);
    expect(venta).toHaveLength(0);
  });
});

describe("generarNumeroCotizacion", () => {
  it("tiene el formato SKY-AAAAMMDD-#### con la fecha dada", () => {
    const numero = generarNumeroCotizacion(new Date(2026, 8, 2));
    expect(numero).toMatch(/^SKY-20260902-\d{4}$/);
  });
});

describe("formatearFechaCotizacion", () => {
  it("formatea la fecha como DD/MM/AAAA", () => {
    expect(formatearFechaCotizacion(new Date(2026, 8, 2))).toBe("02/09/2026");
  });
});
