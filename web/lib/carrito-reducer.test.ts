import { describe, it, expect } from "vitest";
import { carritoReducer, claveItem, subtotalCarrito, type ItemCarrito } from "./carrito-reducer";

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

  it("vacía el carrito por completo", () => {
    const estado = carritoReducer([itemBase], { type: "VACIAR" });
    expect(estado).toHaveLength(0);
  });
});

describe("subtotalCarrito", () => {
  it("suma precio unitario por cantidad de cada línea", () => {
    const itemVenta: ItemCarrito = { ...itemBase, tipo: "venta", precioUnitario: 45000, cantidad: 1 };
    const total = subtotalCarrito([{ ...itemBase, cantidad: 2 }, itemVenta]);
    expect(total).toBe(1200 * 2 + 45000);
  });
});
