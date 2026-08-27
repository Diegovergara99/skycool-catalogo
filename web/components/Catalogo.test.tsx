import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Catalogo from "./Catalogo";
import { CarritoProvider } from "@/lib/carrito-context";

function renderCatalogo() {
  return render(
    <CarritoProvider>
      <Catalogo />
    </CarritoProvider>
  );
}

describe("Catalogo", () => {
  it("muestra los 5 productos por defecto", () => {
    renderCatalogo();
    expect(screen.getByText("Extractor de aire")).toBeInTheDocument();
    expect(screen.getByText("Ventilador de piso")).toBeInTheDocument();
    expect(screen.getByText("Ventilador giratorio")).toBeInTheDocument();
    expect(screen.getByText("Enfriador evaporativo")).toBeInTheDocument();
    expect(screen.getByText("Ventilador de techo industrial")).toBeInTheDocument();
  });

  it("filtra por categoría al hacer click en un chip", () => {
    renderCatalogo();
    fireEvent.click(screen.getByText("Techo"));
    expect(screen.getByText("Ventilador de techo industrial")).toBeInTheDocument();
    expect(screen.queryByText("Extractor de aire")).not.toBeInTheDocument();
  });

  it("vuelve a mostrar todos al hacer click en Todos", () => {
    renderCatalogo();
    fireEvent.click(screen.getByText("Techo"));
    fireEvent.click(screen.getByText("Todos"));
    expect(screen.getByText("Extractor de aire")).toBeInTheDocument();
  });

  it("marca aria-pressed en el chip de categoría activo", () => {
    renderCatalogo();
    fireEvent.click(screen.getByText("Techo"));
    expect(screen.getByText("Techo")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Todos")).toHaveAttribute("aria-pressed", "false");
  });
});
