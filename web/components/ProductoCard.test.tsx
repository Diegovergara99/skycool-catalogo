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

const productoSoloVenta: Producto = {
  id: "extractor-aire",
  nombre: "Extractor de aire",
  categoria: "extraccion",
  imagen: "/imagenes/extractor-aire.jpg",
  descripcion: "Descripción de prueba",
  specs: [{ label: "Diámetro", valor: "1100 mm" }],
  variantes: [{ id: "ay-1220", nombre: "AY-1220", precioVenta: 17914 }],
};

const productoUnModeloRentaYVenta: Producto = {
  id: "ventilador-giratorio",
  nombre: "Ventilador giratorio",
  categoria: "giratorio",
  imagen: "/imagenes/ventilador-giratorio.jpg",
  descripcion: "Descripción de prueba",
  specs: [{ label: "Peso", valor: "29 kg" }],
  variantes: [{ id: "ay-920b", nombre: "AY-920B", precioRenta: 650, precioVenta: 16310 }],
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

  it("no muestra el toggle renta/venta en un producto que solo se vende", () => {
    render(<ProductoCard producto={productoSoloVenta} onAgregar={vi.fn()} />);
    expect(screen.queryByText("Renta / día")).not.toBeInTheDocument();
    expect(screen.queryByText("Venta")).not.toBeInTheDocument();
    expect(screen.getByText("$17,914")).toBeInTheDocument();
  });

  it("agrega tipo 'venta' al carrito en un producto que solo se vende", () => {
    const onAgregar = vi.fn();
    render(<ProductoCard producto={productoSoloVenta} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByText("Agregar al carrito"));
    expect(onAgregar).toHaveBeenCalledWith({
      productoId: "extractor-aire",
      varianteId: "ay-1220",
      nombreProducto: "Extractor de aire",
      nombreVariante: "AY-1220",
      tipo: "venta",
      precioUnitario: 17914,
      cantidad: 1,
    });
  });

  it("incluye specs y precios de todas las variantes en el HTML, no solo la seleccionada, para que los indexe un buscador", () => {
    render(<ProductoCard producto={productoDePrueba} onAgregar={vi.fn()} />);
    // DM-220 no está seleccionado por defecto (DM-110 lo está), pero su
    // información debe existir en el DOM aunque esté oculta visualmente.
    expect(screen.getByText(/Precio renta por día: \$950/)).toBeInTheDocument();
    expect(screen.getByText(/Precio de venta: \$29,000/)).toBeInTheDocument();
  });

  it("no incluye el bloque oculto de variantes cuando el producto tiene un solo modelo y solo se vende", () => {
    render(<ProductoCard producto={productoSoloVenta} onAgregar={vi.fn()} />);
    expect(screen.queryByText(/Precio de venta:/)).not.toBeInTheDocument();
  });

  it("incluye el precio de venta oculto cuando el producto tiene un solo modelo pero se renta Y se vende", () => {
    // Bug real: con un solo modelo, el bloque oculto se saltaba por
    // completo, así que el precio de venta (no seleccionado por defecto)
    // nunca aparecía en el HTML para productos como el ventilador
    // giratorio, que tiene un único modelo pero dos precios.
    render(<ProductoCard producto={productoUnModeloRentaYVenta} onAgregar={vi.fn()} />);
    expect(screen.getByText(/Precio de venta: \$16,310/)).toBeInTheDocument();
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
