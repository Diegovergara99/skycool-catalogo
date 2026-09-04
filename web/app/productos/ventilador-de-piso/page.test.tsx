import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import VentiladorDePisoPage from "./page";

function renderPagina() {
  return render(
    <CarritoProvider>
      <VentiladorDePisoPage />
    </CarritoProvider>
  );
}

describe("VentiladorDePisoPage", () => {
  it("muestra el título y la explicación de renta vs. compra", () => {
    renderPagina();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ventilador de piso/i);
    expect(screen.getByText(/Rentas/)).toBeInTheDocument();
    expect(screen.getByText(/Compras/)).toBeInTheDocument();
  });

  it("muestra las especificaciones reales del producto", () => {
    renderPagina();
    expect(screen.getAllByText(/1.25 m/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/38,000 m³\/h/).length).toBeGreaterThan(0);
  });

  it("incluye el widget para agregar al carrito con ambos modelos", () => {
    renderPagina();
    expect(screen.getByText("Agregar al carrito")).toBeInTheDocument();
    expect(screen.getByLabelText("Modelo")).toBeInTheDocument();
  });

  it("incluye datos estructurados de Product apuntando a esta página", () => {
    const { container } = renderPagina();
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@graph"][0].url).toBe(
      "https://www.skycool.com.mx/productos/ventilador-de-piso"
    );
  });

  it("tiene un link de regreso al catálogo", () => {
    renderPagina();
    expect(screen.getByRole("link", { name: /catálogo/i })).toHaveAttribute(
      "href",
      "/#catalogo"
    );
  });
});
