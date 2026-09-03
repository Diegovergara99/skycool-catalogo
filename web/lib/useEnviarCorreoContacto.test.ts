import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEnviarCorreoContacto } from "./useEnviarCorreoContacto";

const datos = {
  nombre: "Diego",
  correo: "diego@example.com",
  telefono: "3312345678",
  mensaje: "Necesito 2 ventiladores de piso",
};

describe("useEnviarCorreoContacto", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("marca éxito cuando el correo se envía bien", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    const { result } = renderHook(() => useEnviarCorreoContacto());

    await act(async () => {
      await result.current.enviarCorreo(datos);
    });

    expect(result.current.exito).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.enviando).toBe(false);
  });

  it("guarda el mensaje de error cuando el servidor responde con error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "RESEND_API_KEY no configurado." }),
    });
    const { result } = renderHook(() => useEnviarCorreoContacto());

    await act(async () => {
      await result.current.enviarCorreo(datos);
    });

    expect(result.current.error).toBe("RESEND_API_KEY no configurado.");
    expect(result.current.exito).toBe(false);
    expect(result.current.enviando).toBe(false);
  });

  it("guarda un error genérico si fetch falla por red", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useEnviarCorreoContacto());

    await act(async () => {
      await result.current.enviarCorreo(datos);
    });

    expect(result.current.error).toMatch(/no se pudo conectar/i);
    expect(result.current.exito).toBe(false);
  });

  it("guarda un mensaje distinto si la respuesta de error no trae JSON válido", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    });
    const { result } = renderHook(() => useEnviarCorreoContacto());

    await act(async () => {
      await result.current.enviarCorreo(datos);
    });

    expect(result.current.error).toMatch(/respondió de forma inesperada/i);
    expect(result.current.error).not.toMatch(/no se pudo conectar/i);
  });
});
