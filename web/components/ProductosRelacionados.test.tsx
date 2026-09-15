import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductosRelacionados from "./ProductosRelacionados";
import { paginasProducto } from "@/lib/paginasProducto";

describe("ProductosRelacionados", () => {
  it("enlaza a las otras 4 páginas de producto, sin incluir la actual", () => {
    render(<ProductosRelacionados idActual="ventilador-piso" />);
    const enlaces = screen.getAllByRole("link");
    expect(enlaces).toHaveLength(4);

    const actual = paginasProducto.find((p) => p.id === "ventilador-piso")!;
    expect(screen.queryByRole("link", { name: actual.nombre })).not.toBeInTheDocument();

    for (const p of paginasProducto.filter((p) => p.id !== "ventilador-piso")) {
      expect(screen.getByRole("link", { name: p.nombre })).toHaveAttribute("href", p.ruta);
    }
  });
});
