import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VentiladorPisoVsTechoPage from "./page";

describe("VentiladorPisoVsTechoPage", () => {
  it("muestra el título y ambos productos comparados", () => {
    render(<VentiladorPisoVsTechoPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /ventilador de piso vs\. ventilador de techo/i
    );
    expect(screen.getAllByText(/\$23,520/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$46,298/).length).toBeGreaterThan(0);
  });

  it("incluye datos estructurados BlogPosting", () => {
    const { container } = render(<VentiladorPisoVsTechoPage />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@type"]).toBe("BlogPosting");
  });

  it("enlaza a ambas páginas de producto", () => {
    render(<VentiladorPisoVsTechoPage />);
    expect(screen.getByRole("link", { name: /ver ventilador de piso/i })).toHaveAttribute(
      "href",
      "/productos/ventilador-de-piso"
    );
    expect(screen.getByRole("link", { name: /ver ventilador de techo/i })).toHaveAttribute(
      "href",
      "/productos/ventilador-de-techo-industrial"
    );
  });
});
