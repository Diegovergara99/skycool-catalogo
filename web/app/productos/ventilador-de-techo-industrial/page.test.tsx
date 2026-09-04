import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import VentiladorDeTechoPage from "./page";

function renderPagina() {
  return render(
    <CarritoProvider>
      <VentiladorDeTechoPage />
    </CarritoProvider>
  );
}

describe("VentiladorDeTechoPage", () => {
  it("muestra el título y explica que es solo venta", () => {
    renderPagina();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ventilador de techo/i);
    expect(screen.getByText(/no es equipo de renta/i)).toBeInTheDocument();
  });

  it("muestra los tres tamaños con sus precios reales", () => {
    renderPagina();
    expect(screen.getAllByText(/W14/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/W20/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/W26/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$46,298/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$59,670/).length).toBeGreaterThan(0);
  });

  it("no ofrece la opción de renta en el widget de compra", () => {
    renderPagina();
    expect(screen.queryByText("Renta / día")).not.toBeInTheDocument();
  });

  it("incluye datos estructurados de Product apuntando a esta página", () => {
    const { container } = renderPagina();
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"][0].url).toBe(
      "https://www.skycool.com.mx/productos/ventilador-de-techo-industrial"
    );
    expect(data["@graph"][0].offers).toHaveLength(1);
    expect(data["@graph"][0].offers[0].businessFunction).toBe("https://schema.org/Sell");
  });

  it("tiene un link de regreso al catálogo", () => {
    renderPagina();
    expect(screen.getByRole("link", { name: /catálogo/i })).toHaveAttribute(
      "href",
      "/#catalogo"
    );
  });
});
