import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckoutMercadoPago } from "./useCheckoutMercadoPago";
import type { ItemCarrito } from "./carrito-reducer";
import type { DireccionEnvio } from "./direccion-envio";

const items: ItemCarrito[] = [
  {
    productoId: "extractor-aire",
    varianteId: "ay-1220",
    nombreProducto: "Extractor de aire",
    nombreVariante: "AY-1220",
    tipo: "renta",
    precioUnitario: 1200,
    cantidad: 1,
  },
];

describe("useCheckoutMercadoPago", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("redirige a initPoint cuando el pago se crea bien", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ initPoint: "https://mp.example/checkout/abc" }),
    });
    const redirigir = vi.fn();
    const { result } = renderHook(() => useCheckoutMercadoPago(redirigir));

    await act(async () => {
      await result.current.pagar(items);
    });

    expect(redirigir).toHaveBeenCalledWith("https://mp.example/checkout/abc");
    expect(result.current.error).toBeNull();
    expect(result.current.cargando).toBe(false);
  });

  it("envía la dirección de envío en el cuerpo de la solicitud cuando se proporciona", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ initPoint: "https://mp.example/checkout/abc" }),
    });
    const direccion: DireccionEnvio = {
      nombre: "Juan Pérez",
      telefono: "3312345678",
      calle: "Av. Vallarta",
      numeroExterior: "1234",
      colonia: "Americana",
      ciudad: "Guadalajara",
      estado: "Jalisco",
      codigoPostal: "44160",
    };
    const { result } = renderHook(() => useCheckoutMercadoPago(vi.fn()));

    await act(async () => {
      await result.current.pagar(items, direccion);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/create-preference",
      expect.objectContaining({
        body: JSON.stringify({ items, direccion }),
      })
    );
  });

  it("guarda el mensaje de error cuando el servidor responde con error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "MP_ACCESS_TOKEN no configurado." }),
    });
    const { result } = renderHook(() => useCheckoutMercadoPago(vi.fn()));

    await act(async () => {
      await result.current.pagar(items);
    });

    expect(result.current.error).toBe("MP_ACCESS_TOKEN no configurado.");
    expect(result.current.cargando).toBe(false);
  });

  it("guarda un error genérico si fetch falla por red", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useCheckoutMercadoPago(vi.fn()));

    await act(async () => {
      await result.current.pagar(items);
    });

    expect(result.current.error).toMatch(/no se pudo conectar/i);
  });

  it("guarda un mensaje distinto si la respuesta de error no trae JSON válido", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    });
    const { result } = renderHook(() => useCheckoutMercadoPago(vi.fn()));

    await act(async () => {
      await result.current.pagar(items);
    });

    expect(result.current.error).toMatch(/respondió de forma inesperada/i);
    expect(result.current.error).not.toMatch(/no se pudo conectar/i);
    expect(result.current.cargando).toBe(false);
  });
});
