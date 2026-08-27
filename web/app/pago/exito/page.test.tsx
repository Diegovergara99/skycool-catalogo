import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PagoExitoPage from "./page";
import { CarritoProvider, useCarrito } from "@/lib/carrito-context";
import type { ItemCarrito } from "@/lib/carrito-reducer";

const item: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "renta",
  precioUnitario: 1200,
  cantidad: 1,
};

function LectorCarrito() {
  const { items } = useCarrito();
  return <div data-testid="cantidad-items">{items.length}</div>;
}

describe("PagoExitoPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("vacía un carrito ya persistido en localStorage al aterrizar en la página", async () => {
    // Simula el escenario real: el cliente agregó productos y pagó en una
    // sesión previa, por lo que el carrito ya está guardado en localStorage
    // ANTES de que `CarritoProvider` se monte en esta página.
    window.localStorage.setItem("skycool-carrito", JSON.stringify([item]));

    render(
      <CarritoProvider>
        <LectorCarrito />
        <PagoExitoPage />
      </CarritoProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cantidad-items").textContent).toBe("0");
    });

    expect(screen.getByText("¡Pago recibido!")).toBeInTheDocument();
    expect(window.localStorage.getItem("skycool-carrito")).toBe("[]");
  });

  it("no muestra productos previos tras el vaciado", async () => {
    window.localStorage.setItem("skycool-carrito", JSON.stringify([item]));

    render(
      <CarritoProvider>
        <PagoExitoPage />
      </CarritoProvider>
    );

    await waitFor(() => {
      expect(window.localStorage.getItem("skycool-carrito")).toBe("[]");
    });
  });
});
