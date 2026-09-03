import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Cotizacion from "./Cotizacion";
import type { ItemCarrito } from "@/lib/carrito-reducer";

const itemRenta: ItemCarrito = {
  productoId: "ventilador-piso",
  varianteId: "dm-110",
  nombreProducto: "Ventilador de piso",
  nombreVariante: "DM-110 (conexión a 110V)",
  tipo: "renta",
  precioUnitario: 941,
  cantidad: 1,
};

const itemVenta: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "venta",
  precioUnitario: 17914,
  cantidad: 1,
};

function llenarYEnviarForm(nombre: string) {
  fireEvent.change(screen.getByPlaceholderText("Nombre o empresa"), {
    target: { value: nombre },
  });
  fireEvent.click(screen.getByText("Generar cotización"));
}

describe("Cotizacion", () => {
  it("pide el nombre del cliente antes de mostrar el documento", () => {
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    expect(screen.getByText("Datos para tu cotización")).toBeInTheDocument();
    expect(screen.queryByText("COTIZACIÓN DE RENTA")).not.toBeInTheDocument();
  });

  it("muestra el documento de renta después de llenar el formulario", () => {
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.getByText("COTIZACIÓN DE RENTA")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("genera los dos documentos si el carrito mezcla renta y venta", () => {
    render(<Cotizacion items={[itemRenta, itemVenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.getByText("COTIZACIÓN DE RENTA")).toBeInTheDocument();
    expect(screen.getByText("COTIZACIÓN DE VENTA")).toBeInTheDocument();
  });

  it("solo genera el documento de venta si todos los items son de venta", () => {
    render(<Cotizacion items={[itemVenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.queryByText("COTIZACIÓN DE RENTA")).not.toBeInTheDocument();
    expect(screen.getByText("COTIZACIÓN DE VENTA")).toBeInTheDocument();
  });

  it("llama a window.print al hacer click en Descargar / Imprimir PDF", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    fireEvent.click(screen.getByText("Descargar / Imprimir PDF"));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("llama a onCerrar al hacer click en cerrar", () => {
    const onCerrar = vi.fn();
    render(<Cotizacion items={[itemRenta]} onCerrar={onCerrar} />);
    fireEvent.click(screen.getByLabelText("Cerrar"));
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });
});
