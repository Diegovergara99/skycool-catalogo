import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import ExtractorDeAirePage from "./page";

function renderPagina() {
  return render(
    <CarritoProvider>
      <ExtractorDeAirePage />
    </CarritoProvider>
  );
}

describe("ExtractorDeAirePage", () => {
  it("muestra el título y explica que es solo venta", () => {
    renderPagina();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/extractor de aire/i);
    expect(screen.getByText(/solo venta/i)).toBeInTheDocument();
  });

  it("incluye el widget de compra con el precio real", () => {
    renderPagina();
    expect(screen.getAllByText(/\$17,914/).length).toBeGreaterThan(0);
    expect(screen.queryByText("Renta / día")).not.toBeInTheDocument();
  });

  it("incluye datos estructurados de Product apuntando a esta página", () => {
    const { container } = renderPagina();
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"][0].url).toBe("https://www.skycool.com.mx/productos/extractor-de-aire");
    expect(data["@graph"][0].offers).toHaveLength(1);
    expect(data["@graph"][0].offers[0].businessFunction).toBe("https://schema.org/Sell");
  });

  it("tiene un link de regreso al catálogo", () => {
    renderPagina();
    expect(screen.getByRole("link", { name: /catálogo/i })).toHaveAttribute("href", "/#catalogo");
  });
});
