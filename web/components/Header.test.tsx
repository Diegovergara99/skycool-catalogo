import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import Carrito from "./Carrito";
import { CarritoProvider } from "@/lib/carrito-context";

function renderHeaderConCarrito() {
  return render(
    <CarritoProvider>
      <Header />
      <Carrito />
    </CarritoProvider>
  );
}

describe("Header", () => {
  it("muestra los links de navegación principales", () => {
    renderHeaderConCarrito();
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Sucursales")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("abre el carrito al hacer click en el botón Carrito", () => {
    renderHeaderConCarrito();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /carrito/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
