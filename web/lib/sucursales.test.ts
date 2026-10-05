import { describe, it, expect } from "vitest";
import { sucursales, listaCiudades } from "./sucursales";

describe("sucursales", () => {
  it("incluye las 8 sucursales reales de SkyCool", () => {
    expect(sucursales).toHaveLength(8);
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

  it("incluye Torreón con su dirección real", () => {
    const torreon = sucursales.find((s) => s.id === "torreon");
    expect(torreon?.direccion).toContain("Blvrd. Revolución 1199-Oriente");
  });
});

describe("listaCiudades", () => {
  it("une las 8 ciudades reales con comas y una 'y' antes de la última", () => {
    expect(listaCiudades()).toBe(
      "Guadalajara, Tonalá, Ciudad de México, Monterrey, Culiacán, León, Santa Rosa y Torreón"
    );
  });
});
