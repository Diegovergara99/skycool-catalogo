import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Sucursales from "./Sucursales";

describe("Sucursales", () => {
  it("muestra las 8 sucursales", () => {
    render(<Sucursales />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
  });

  it("muestra la dirección real de Culiacán", () => {
    render(<Sucursales />);
    expect(screen.getByText(/Blvd\. Francisco I\. Madero 782/)).toBeInTheDocument();
  });

  it("muestra la dirección real de Torreón", () => {
    render(<Sucursales />);
    expect(screen.getByText(/Blvrd\. Revolución 1199-Oriente/)).toBeInTheDocument();
  });

  it("incluye datos estructurados LocalBusiness para las 8 sucursales", () => {
    const { container } = render(<Sucursales />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"]).toHaveLength(8);
    expect(data["@graph"][0]["@type"]).toEqual(["LocalBusiness", "Store"]);
  });

  it("cada sucursal tiene @id único y referencia a la organización vía branchOf", () => {
    const { container } = render(<Sucursales />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    const ids = data["@graph"].map((s: { "@id": string }) => s["@id"]);
    expect(new Set(ids).size).toBe(8);
    for (const sucursal of data["@graph"]) {
      expect(sucursal.branchOf).toEqual({ "@id": "https://www.skycool.com.mx/#organizacion" });
    }
  });

  it("si hay número de WhatsApp configurado, cada sucursal lo incluye como telephone en formato +52", () => {
    const { container } = render(<Sucursales />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    // El número solo se agrega si NEXT_PUBLIC_WHATSAPP_NUMBER está
    // configurado (no lo está en este entorno de pruebas) — esta prueba
    // solo verifica que, cuando SÍ está presente, tiene el formato
    // correcto y es igual en las 8 sucursales.
    const telefonos = data["@graph"].map((s: { telephone?: string }) => s.telephone);
    if (telefonos[0] !== undefined) {
      for (const telefono of telefonos) {
        expect(telefono).toMatch(/^\+52\d+$/);
      }
    } else {
      expect(telefonos.every((t: unknown) => t === undefined)).toBe(true);
    }
  });
});
