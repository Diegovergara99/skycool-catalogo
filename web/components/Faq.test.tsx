import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Faq from "./Faq";

describe("Faq", () => {
  it("muestra el encabezado de la sección", () => {
    render(<Faq />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Preguntas frecuentes" })
    ).toBeInTheDocument();
  });

  it("muestra las 6 preguntas reales", () => {
    render(<Faq />);
    expect(screen.getByText("¿Me conviene rentar o comprar?")).toBeInTheDocument();
    expect(screen.getByText("¿Qué incluye la renta?")).toBeInTheDocument();
    expect(screen.getByText("¿Cómo puedo pagar?")).toBeInTheDocument();
    expect(screen.getByText("¿En qué ciudades tienen cobertura?")).toBeInTheDocument();
    expect(screen.getByText("¿Los equipos de venta tienen garantía?")).toBeInTheDocument();
    expect(screen.getByText("¿Cuánto tarda la entrega?")).toBeInTheDocument();
  });

  it("la respuesta de cobertura usa la lista dinámica de ciudades (7 sucursales reales)", () => {
    render(<Faq />);
    expect(screen.getByText(/Guadalajara, Tonalá, Ciudad de México/)).toBeInTheDocument();
  });

  it("menciona Mercado Pago como método de pago con tarjeta", () => {
    render(<Faq />);
    expect(screen.getByText(/Mercado Pago/)).toBeInTheDocument();
  });

  it("no agrega datos estructurados FAQPage (Google ya no da rich results por esto en sitios comerciales)", () => {
    const { container } = render(<Faq />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
