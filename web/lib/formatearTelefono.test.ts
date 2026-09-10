import { describe, it, expect } from "vitest";
import { formatearTelefono } from "./formatearTelefono";

describe("formatearTelefono", () => {
  it("formatea un número mexicano de 12 dígitos con espacios legibles", () => {
    expect(formatearTelefono("523319704476")).toBe("+52 33 1970 4476");
  });

  it("limpia caracteres no numéricos antes de formatear", () => {
    expect(formatearTelefono("+52 33 1970 4476")).toBe("+52 33 1970 4476");
  });

  it("solo antepone '+' si el número no tiene la forma esperada", () => {
    expect(formatearTelefono("123")).toBe("+123");
  });
});
