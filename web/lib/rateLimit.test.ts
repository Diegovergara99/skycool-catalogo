import { describe, it, expect } from "vitest";
import { LimitadorSolicitudes } from "./rateLimit";

describe("LimitadorSolicitudes", () => {
  it("permite hasta el máximo de solicitudes dentro de la ventana", () => {
    const limitador = new LimitadorSolicitudes(3, 60_000);
    const ip = "1.2.3.4";
    expect(limitador.permitir(ip, 0)).toBe(true);
    expect(limitador.permitir(ip, 10)).toBe(true);
    expect(limitador.permitir(ip, 20)).toBe(true);
    expect(limitador.permitir(ip, 30)).toBe(false);
  });

  it("no mezcla el conteo entre IPs distintas", () => {
    const limitador = new LimitadorSolicitudes(1, 60_000);
    expect(limitador.permitir("1.1.1.1", 0)).toBe(true);
    expect(limitador.permitir("2.2.2.2", 0)).toBe(true);
  });

  it("vuelve a permitir solicitudes una vez que la ventana expira", () => {
    const limitador = new LimitadorSolicitudes(1, 1000);
    const ip = "1.2.3.4";
    expect(limitador.permitir(ip, 0)).toBe(true);
    expect(limitador.permitir(ip, 500)).toBe(false);
    expect(limitador.permitir(ip, 1500)).toBe(true);
  });

  it("reiniciar() borra el historial de todas las IPs", () => {
    const limitador = new LimitadorSolicitudes(1, 60_000);
    const ip = "1.2.3.4";
    expect(limitador.permitir(ip, 0)).toBe(true);
    expect(limitador.permitir(ip, 10)).toBe(false);
    limitador.reiniciar();
    expect(limitador.permitir(ip, 20)).toBe(true);
  });
});
