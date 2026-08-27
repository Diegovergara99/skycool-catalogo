import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { CarritoProvider, useCarrito } from "./carrito-context";
import type { ItemCarrito } from "./carrito-reducer";

const item: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "renta",
  precioUnitario: 1200,
  cantidad: 1,
};

function wrapper({ children }: { children: ReactNode }) {
  return <CarritoProvider>{children}</CarritoProvider>;
}

describe("CarritoProvider / useCarrito", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("empieza vacío y cerrado", () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.abierto).toBe(false);
  });

  it("hidratado pasa a true después de que el efecto de hidratación corre", async () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    await waitFor(() => {
      expect(result.current.hidratado).toBe(true);
    });
  });

  it("agregarProducto agrega el item y abre el carrito", () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    act(() => result.current.agregarProducto(item));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.abierto).toBe(true);
    expect(result.current.subtotal).toBe(1200);
    expect(result.current.cantidadTotal).toBe(1);
  });

  it("actualizarCantidad a 0 quita el producto", () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    act(() => result.current.agregarProducto(item));
    const clave = `${item.productoId}__${item.varianteId}__${item.tipo}`;
    act(() => result.current.actualizarCantidad(clave, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("persiste el carrito en localStorage", () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    act(() => result.current.agregarProducto(item));
    const guardado = window.localStorage.getItem("skycool-carrito");
    expect(guardado).toContain("extractor-aire");
  });

  it("cerrarCarrito cierra el panel", () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });
    act(() => result.current.agregarProducto(item));
    act(() => result.current.cerrarCarrito());
    expect(result.current.abierto).toBe(false);
  });

  it("recupera el carrito guardado en localStorage tras montar (sin mismatch de hidratación)", async () => {
    window.localStorage.setItem("skycool-carrito", JSON.stringify([item]));
    const { result } = renderHook(() => useCarrito(), { wrapper });

    // Un efecto post-montaje lee localStorage y carga el carrito guardado
    // (el estado inicial del hook, igual que en el servidor, es vacío).
    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });
    expect(result.current.items[0].productoId).toBe("extractor-aire");
  });

  it("no sobreescribe el carrito guardado con '[]' mientras se hidrata (sin ventana de pérdida de datos)", async () => {
    window.localStorage.setItem("skycool-carrito", JSON.stringify([item]));
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");
    setItemSpy.mockClear();

    const { result } = renderHook(() => useCarrito(), { wrapper });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    const escrituras = setItemSpy.mock.calls.filter(([clave]) => clave === "skycool-carrito");
    for (const [, valor] of escrituras) {
      expect(valor).not.toBe("[]");
    }
    expect(escrituras.length).toBeGreaterThan(0);
    expect(escrituras[escrituras.length - 1][1]).toContain("extractor-aire");

    setItemSpy.mockRestore();
  });
});
