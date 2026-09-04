import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import VentiladorGiratorioPage from "./page";

function renderPagina() {
  return render(
    <CarritoProvider>
      <VentiladorGiratorioPage />
    </CarritoProvider>
  );
}

describe("VentiladorGiratorioPage", () => {
  it("muestra el título y menciona que es compacto/portátil", () => {
    renderPagina();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ventilador giratorio/i);
    expect(screen.getAllByText(/29 kg/).length).toBeGreaterThan(0);
  });

  it("incluye el widget de compra/renta con el precio real", () => {
    renderPagina();
    expect(screen.getAllByText(/\$650/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$16,310/).length).toBeGreaterThan(0);
  });

  it("incluye datos estructurados de Product con oferta de renta y venta", () => {
    const { container } = renderPagina();
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"][0].url).toBe(
      "https://www.skycool.com.mx/productos/ventilador-giratorio"
    );
    expect(data["@graph"][0].offers).toHaveLength(2);
  });

  it("tiene un link de regreso al catálogo", () => {
    renderPagina();
    expect(screen.getByRole("link", { name: /catálogo/i })).toHaveAttribute("href", "/#catalogo");
  });
});
