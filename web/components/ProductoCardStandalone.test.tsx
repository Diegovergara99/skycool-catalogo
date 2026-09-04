import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarritoProvider } from "@/lib/carrito-context";
import ProductoCardStandalone from "./ProductoCardStandalone";
import Header from "./Header";
import type { Producto } from "@/lib/types";

const producto: Producto = {
  id: "ventilador-piso",
  nombre: "Ventilador de piso",
  categoria: "piso",
  imagen: "/imagenes/ventilador-piso.jpg",
  descripcion: "Descripción de prueba",
  specs: [{ label: "Diámetro", valor: "1.25 m" }],
  variantes: [{ id: "dm-110", nombre: "DM-110", precioRenta: 950, precioVenta: 23520 }],
};

describe("ProductoCardStandalone", () => {
  it("agrega el producto al carrito global (visible en el contador del header)", () => {
    render(
      <CarritoProvider>
        <Header />
        <ProductoCardStandalone producto={producto} />
      </CarritoProvider>
    );

    expect(screen.queryByText("1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Agregar al carrito"));

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
