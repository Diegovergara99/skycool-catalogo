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
    expect(data["@graph"][0]["@type"]).toBe("LocalBusiness");
  });
});
