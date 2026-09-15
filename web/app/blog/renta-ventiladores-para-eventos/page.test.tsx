import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RentaVentiladoresParaEventosPage from "./page";

describe("RentaVentiladoresParaEventosPage", () => {
  it("muestra el título y qué incluye la renta", () => {
    render(<RentaVentiladoresParaEventosPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /renta de ventiladores industriales para eventos/i
    );
    expect(screen.getByText(/entrega, instalación en sitio y recolección/i)).toBeInTheDocument();
  });

  it("incluye datos estructurados BlogPosting", () => {
    const { container } = render(<RentaVentiladoresParaEventosPage />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@type"]).toBe("BlogPosting");
  });

  it("enlaza al catálogo y a contacto", () => {
    render(<RentaVentiladoresParaEventosPage />);
    expect(screen.getByRole("link", { name: /ver catálogo completo/i })).toHaveAttribute(
      "href",
      "/#catalogo"
    );
    expect(screen.getByRole("link", { name: /cotizar mi evento/i })).toHaveAttribute(
      "href",
      "/#contacto"
    );
  });
});
