import { describe, it, expect } from "vitest";
import { productos } from "./productos";

describe("productos", () => {
  it("incluye las 5 líneas de producto de SkyCool", () => {
    expect(productos).toHaveLength(5);
  });

  it("cada producto tiene al menos una variante con precios positivos", () => {
    for (const producto of productos) {
      expect(producto.variantes.length).toBeGreaterThan(0);
      for (const variante of producto.variantes) {
        expect(variante.precioRenta).toBeGreaterThan(0);
        expect(variante.precioVenta).toBeGreaterThan(0);
      }
    }
  });

  it("tiene ids de producto únicos", () => {
    const ids = productos.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("incluye el ventilador de techo con sus 3 tamaños", () => {
    const techo = productos.find((p) => p.id === "ventilador-techo");
    expect(techo?.variantes.map((v) => v.id)).toEqual(["w14", "w20", "w26"]);
  });
});
