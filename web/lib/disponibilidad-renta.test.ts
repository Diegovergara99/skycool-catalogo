import { describe, it, expect } from "vitest";
import { evaluarDisponibilidadRenta } from "./disponibilidad-renta";
import type { ItemCarrito } from "./carrito-reducer";

const itemRenta: ItemCarrito = {
  productoId: "ventilador-piso",
  varianteId: "dm-110",
  nombreProducto: "Ventilador de piso",
  nombreVariante: "DM-110 (conexión a 110V)",
  tipo: "renta",
  precioUnitario: 950,
  cantidad: 1,
};

const itemVenta: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "venta",
  precioUnitario: 17914,
  cantidad: 1,
};

describe("evaluarDisponibilidadRenta", () => {
  it("devuelve 'sin_renta' si el carrito no tiene items de renta", () => {
    expect(evaluarDisponibilidadRenta([itemVenta], "Guadalajara")).toBe("sin_renta");
    expect(evaluarDisponibilidadRenta([itemVenta], "")).toBe("sin_renta");
  });

  it("devuelve 'falta_ciudad' si hay renta pero no se ha elegido ciudad", () => {
    expect(evaluarDisponibilidadRenta([itemRenta], "")).toBe("falta_ciudad");
  });

  it("devuelve 'con_sucursal' si hay renta y la ciudad tiene sucursal SkyCool", () => {
    expect(evaluarDisponibilidadRenta([itemRenta], "Guadalajara")).toBe("con_sucursal");
    expect(evaluarDisponibilidadRenta([itemRenta], "Culiacán")).toBe("con_sucursal");
  });

  it("devuelve 'sin_sucursal' si hay renta y la ciudad no tiene sucursal SkyCool", () => {
    expect(evaluarDisponibilidadRenta([itemRenta], "Otra ciudad")).toBe("sin_sucursal");
    expect(evaluarDisponibilidadRenta([itemRenta], "Puebla")).toBe("sin_sucursal");
  });

  it("considera un carrito mixto (renta + venta) como carrito con renta", () => {
    expect(evaluarDisponibilidadRenta([itemVenta, itemRenta], "")).toBe("falta_ciudad");
    expect(evaluarDisponibilidadRenta([itemVenta, itemRenta], "Monterrey")).toBe("con_sucursal");
  });
});
