import { describe, it, expect } from "vitest";
import { sucursales, listaCiudades } from "./sucursales";

describe("sucursales", () => {
  it("incluye las 7 sucursales reales de SkyCool", () => {
    expect(sucursales).toHaveLength(7);
  });

  it("cada sucursal tiene ciudad, estado y dirección no vacíos", () => {
    for (const sucursal of sucursales) {
      expect(sucursal.ciudad.length).toBeGreaterThan(0);
      expect(sucursal.estado.length).toBeGreaterThan(0);
      expect(sucursal.direccion.length).toBeGreaterThan(0);
    }
  });

  it("tiene ids únicos", () => {
    const ids = sucursales.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("incluye Culiacán con su dirección real", () => {
    const culiacan = sucursales.find((s) => s.id === "culiacan");
    expect(culiacan?.direccion).toContain("Blvd. Francisco I. Madero 782");
  });
});

describe("listaCiudades", () => {
  it("une las 7 ciudades reales con comas y una 'y' antes de la última", () => {
    expect(listaCiudades()).toBe(
      "Guadalajara, Tonalá, Ciudad de México, Monterrey, Culiacán, León y Santa Rosa"
    );
  });
});
