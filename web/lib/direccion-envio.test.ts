import { describe, it, expect } from "vitest";
import { esDireccionValida, formatearDireccionUnaLinea, type DireccionEnvio } from "./direccion-envio";

const direccionCompleta: DireccionEnvio = {
  nombre: "Juan Pérez",
  telefono: "3312345678",
  calle: "Av. Vallarta",
  numeroExterior: "1234",
  numeroInterior: "5B",
  colonia: "Americana",
  ciudad: "Guadalajara",
  estado: "Jalisco",
  codigoPostal: "44160",
  referencias: "Portón negro, frente a la farmacia",
};

describe("esDireccionValida", () => {
  it("acepta una dirección con todos los campos requeridos", () => {
    expect(esDireccionValida(direccionCompleta)).toBe(true);
  });

  it("acepta una dirección sin los campos opcionales (numeroInterior, referencias)", () => {
    const { numeroInterior, referencias, ...sinOpcionales } = direccionCompleta;
    expect(esDireccionValida(sinOpcionales)).toBe(true);
  });

  it.each([
    "nombre",
    "telefono",
    "calle",
    "numeroExterior",
    "colonia",
    "ciudad",
    "estado",
    "codigoPostal",
  ])("rechaza una dirección sin el campo requerido '%s'", (campo) => {
    const direccionIncompleta = { ...direccionCompleta, [campo]: "" };
    expect(esDireccionValida(direccionIncompleta)).toBe(false);
  });

  it("rechaza un campo requerido que solo tiene espacios en blanco", () => {
    expect(esDireccionValida({ ...direccionCompleta, calle: "   " })).toBe(false);
  });

  it("rechaza null, undefined, arreglos y strings sueltos", () => {
    expect(esDireccionValida(null)).toBe(false);
    expect(esDireccionValida(undefined)).toBe(false);
    expect(esDireccionValida([])).toBe(false);
    expect(esDireccionValida("Av. Vallarta 1234")).toBe(false);
  });
});

describe("formatearDireccionUnaLinea", () => {
  it("arma la dirección completa en una sola línea, incluyendo el número interior", () => {
    expect(formatearDireccionUnaLinea(direccionCompleta)).toBe(
      "Av. Vallarta 1234, Int. 5B, Americana, Guadalajara, Jalisco, C.P. 44160"
    );
  });

  it("omite 'Int.' cuando no hay número interior", () => {
    const { numeroInterior, ...sinInterior } = direccionCompleta;
    expect(formatearDireccionUnaLinea(sinInterior)).toBe(
      "Av. Vallarta 1234, Americana, Guadalajara, Jalisco, C.P. 44160"
    );
  });
});
