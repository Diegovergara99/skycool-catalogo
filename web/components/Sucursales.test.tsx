import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Sucursales from "./Sucursales";

describe("Sucursales", () => {
  it("muestra las 7 sucursales", () => {
    render(<Sucursales />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
  });

  it("muestra la dirección real de Culiacán", () => {
    render(<Sucursales />);
    expect(screen.getByText(/Blvd\. Francisco I\. Madero 782/)).toBeInTheDocument();
  });

  it("incluye datos estructurados LocalBusiness para las 7 sucursales", () => {
    const { container } = render(<Sucursales />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"]).toHaveLength(7);
    expect(data["@graph"][0]["@type"]).toEqual(["LocalBusiness", "Store"]);
  });

  it("cada sucursal tiene @id único y referencia a la organización vía branchOf", () => {
    const { container } = render(<Sucursales />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    const ids = data["@graph"].map((s: { "@id": string }) => s["@id"]);
    expect(new Set(ids).size).toBe(7);
    for (const sucursal of data["@graph"]) {
      expect(sucursal.branchOf).toEqual({ "@id": "https://www.skycool.com.mx/#organizacion" });
    }
  });
});
