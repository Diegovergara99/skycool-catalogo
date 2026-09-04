import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import EnfriadorEvaporativoPage from "./page";

function renderPagina() {
  return render(
    <CarritoProvider>
      <EnfriadorEvaporativoPage />
    </CarritoProvider>
  );
}

describe("EnfriadorEvaporativoPage", () => {
  it("muestra el título y explica que enfría de verdad, no solo mueve aire", () => {
    renderPagina();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/enfriador evaporativo/i);
    expect(screen.getAllByText(/150 m²/).length).toBeGreaterThan(0);
  });

  it("incluye el widget de compra/renta con el precio real", () => {
    renderPagina();
    expect(screen.getAllByText(/\$1,250/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$31,685/).length).toBeGreaterThan(0);
  });

  it("incluye datos estructurados de Product con oferta de renta y venta", () => {
    const { container } = renderPagina();
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"][0].url).toBe(
      "https://www.skycool.com.mx/productos/enfriador-evaporativo"
    );
    expect(data["@graph"][0].offers).toHaveLength(2);
  });

  it("tiene un link de regreso al catálogo", () => {
    renderPagina();
    expect(screen.getByRole("link", { name: /catálogo/i })).toHaveAttribute("href", "/#catalogo");
  });
});
