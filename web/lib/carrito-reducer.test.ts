import { describe, it, expect } from "vitest";
import {
  carritoReducer,
  claveItem,
  subtotalCarrito,
  calcularImporteUnitario,
  calcularImporteItem,
  type ItemCarrito,
} from "./carrito-reducer";

const itemBase: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "renta",
  precioUnitario: 1200,
  cantidad: 1,
};

describe("carritoReducer", () => {
  it("agrega un producto nuevo al carrito vacío", () => {
    const estado = carritoReducer([], { type: "AGREGAR", item: itemBase });
    expect(estado).toHaveLength(1);
    expect(estado[0]).toEqual(itemBase);
  });

  it("suma cantidades si el mismo producto/variante/tipo ya está en el carrito", () => {
    const estado = carritoReducer([itemBase], { type: "AGREGAR", item: itemBase });
    expect(estado).toHaveLength(1);
    expect(estado[0].cantidad).toBe(2);
  });

  it("trata renta y venta del mismo producto como líneas distintas", () => {
    const itemVenta: ItemCarrito = { ...itemBase, tipo: "venta", precioUnitario: 45000 };
    const estado = carritoReducer([itemBase], { type: "AGREGAR", item: itemVenta });
    expect(estado).toHaveLength(2);
  });

  it("quita un producto por su clave", () => {
    const estado = carritoReducer([itemBase], { type: "QUITAR", clave: claveItem(itemBase) });
    expect(estado).toHaveLength(0);
  });

  it("actualiza la cantidad de un producto", () => {
    const estado = carritoReducer([itemBase], {
      type: "ACTUALIZAR_CANTIDAD",
      clave: claveItem(itemBase),
      cantidad: 5,
    });
    expect(estado[0].cantidad).toBe(5);
  });

  it("quita el producto si la cantidad se actualiza a 0", () => {
    const estado = carritoReducer([itemBase], {
      type: "ACTUALIZAR_CANTIDAD",
      clave: claveItem(itemBase),
      cantidad: 0,
    });
    expect(estado).toHaveLength(0);
  });

  it("trata la renta a 1 día y a 3 días del mismo producto como líneas distintas", () => {
    const item3Dias: ItemCarrito = { ...itemBase, dias: 3 };
    const estado = carritoReducer([itemBase], { type: "AGREGAR", item: item3Dias });
    expect(estado).toHaveLength(2);
  });

  it("suma cantidades si ya hay una línea con el mismo número de días", () => {
    const item1 = { ...itemBase, dias: 3 as const };
    const item2 = { ...itemBase, dias: 3 as const, cantidad: 2 };
    const estado = carritoReducer([item1], { type: "AGREGAR", item: item2 });
    expect(estado).toHaveLength(1);
    expect(estado[0].cantidad).toBe(3);
  });

  it("vacía el carrito por completo", () => {
    const estado = carritoReducer([itemBase], { type: "VACIAR" });
    expect(estado).toHaveLength(0);
  });

  it("CARGAR reemplaza el estado completo con los items dados", () => {
    const itemVenta: ItemCarrito = { ...itemBase, tipo: "venta", precioUnitario: 45000 };
    const estado = carritoReducer([itemBase], { type: "CARGAR", items: [itemVenta] });
    expect(estado).toEqual([itemVenta]);
  });
});

describe("subtotalCarrito", () => {
  it("suma precio unitario por cantidad de cada línea", () => {
    const itemVenta: ItemCarrito = { ...itemBase, tipo: "venta", precioUnitario: 45000, cantidad: 1 };
    const total = subtotalCarrito([{ ...itemBase, cantidad: 2 }, itemVenta]);
    expect(total).toBe(1200 * 2 + 45000);
  });

  it("aplica el descuento del paquete de 3 días en el subtotal", () => {
    const item3Dias: ItemCarrito = { ...itemBase, dias: 3, cantidad: 2 };
    const total = subtotalCarrito([item3Dias]);
    // $1200/día × 2 unidades × 3 días × 0.85 = $6,120
    expect(total).toBe(6120);
  });
});

describe("calcularImporteUnitario", () => {
  it("devuelve el precio por día tal cual para renta a 1 día", () => {
    expect(calcularImporteUnitario(950, "renta", 1)).toBe(950);
  });

  it("aplica 15% de descuento sobre el precio de 3 días", () => {
    // $950 × 3 × 0.85 = $2,422.50 — caso real de la tabla de precios
    expect(calcularImporteUnitario(950, "renta", 3)).toBeCloseTo(2422.5, 2);
  });

  it("ignora `dias` para venta (no aplica el concepto)", () => {
    expect(calcularImporteUnitario(23520, "venta", 3)).toBe(23520);
  });

  it("por defecto (sin dias) se comporta como 1 día", () => {
    expect(calcularImporteUnitario(650, "renta")).toBe(650);
  });
});

describe("calcularImporteItem", () => {
  it("multiplica el importe unitario (con descuento si aplica) por la cantidad", () => {
    const item: ItemCarrito = {
      productoId: "enfriador-evaporativo",
      varianteId: "ay-d18",
      nombreProducto: "Enfriador evaporativo",
      nombreVariante: "AY-D18",
      tipo: "renta",
      precioUnitario: 1250,
      cantidad: 1,
      dias: 3,
    };
    // $1,250 × 3 × 0.85 = $3,187.50 — caso real de la tabla de precios
    expect(calcularImporteItem(item)).toBeCloseTo(3187.5, 2);
  });
});
