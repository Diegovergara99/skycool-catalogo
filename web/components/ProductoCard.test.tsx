import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductoCard from "./ProductoCard";
import type { Producto } from "@/lib/types";

const productoDePrueba: Producto = {
  id: "ventilador-piso",
  nombre: "Ventilador de piso",
  categoria: "piso",
  imagen: "/imagenes/ventilador-piso.jpg",
  descripcion: "Descripción de prueba",
  specs: [{ label: "Diámetro", valor: "1.25 m" }],
  variantes: [
    { id: "dm-110", nombre: "DM-110", precioRenta: 900, precioVenta: 28000 },
    { id: "dm-220", nombre: "DM-220", precioRenta: 950, precioVenta: 29000 },
  ],
};

describe("ProductoCard", () => {
  it("muestra el precio de renta de la primera variante por defecto", () => {
    render(<ProductoCard producto={productoDePrueba} onAgregar={vi.fn()} />);
    expect(screen.getByText("$900")).toBeInTheDocument();
  });

  it("cambia al precio de venta al seleccionar el toggle Venta", () => {
    render(<ProductoCard producto={productoDePrueba} onAgregar={vi.fn()} />);
    fireEvent.click(screen.getByText("Venta"));
    expect(screen.getByText("$28,000")).toBeInTheDocument();
  });

  it("cambia el precio al seleccionar otra variante", () => {
    render(<ProductoCard producto={productoDePrueba} onAgregar={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Modelo"), { target: { value: "dm-220" } });
    expect(screen.getByText("$950")).toBeInTheDocument();
  });

  it("expone el estado seleccionado del toggle renta/venta vía aria-pressed", () => {
    render(<ProductoCard producto={productoDePrueba} onAgregar={vi.fn()} />);
    const botonRenta = screen.getByRole("button", { name: "Renta / día" });
    const botonVenta = screen.getByRole("button", { name: "Venta" });

    expect(botonRenta).toHaveAttribute("aria-pressed", "true");
    expect(botonVenta).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(botonVenta);

    expect(botonRenta).toHaveAttribute("aria-pressed", "false");
    expect(botonVenta).toHaveAttribute("aria-pressed", "true");
  });

  it("llama a onAgregar con el item correcto", () => {
    const onAgregar = vi.fn();
    render(<ProductoCard producto={productoDePrueba} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByText("Agregar al carrito"));
    expect(onAgregar).toHaveBeenCalledWith({
      productoId: "ventilador-piso",
      varianteId: "dm-110",
      nombreProducto: "Ventilador de piso",
      nombreVariante: "DM-110",
      tipo: "renta",
      precioUnitario: 900,
      cantidad: 1,
    });
  });
});
