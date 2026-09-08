import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComoFunciona from "./ComoFunciona";

describe("ComoFunciona", () => {
  it("muestra el encabezado de la sección", () => {
    render(<ComoFunciona />);
    expect(screen.getByRole("heading", { level: 2, name: "¿Cómo funciona?" })).toBeInTheDocument();
  });

  it("muestra los 4 pasos del proceso en orden", () => {
    render(<ComoFunciona />);
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos).toEqual(["Cotiza", "Confirmas", "Entrega", "Listo"]);
  });

  it("menciona WhatsApp y Mercado Pago como formas de contactar y pagar", () => {
    render(<ComoFunciona />);
    expect(screen.getAllByText(/WhatsApp/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Mercado Pago/)).toBeInTheDocument();
  });
});
