import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Nosotros from "./Nosotros";

describe("Nosotros", () => {
  it("muestra el texto de la empresa", () => {
    render(<Nosotros />);
    expect(screen.getByText(/empresa mexicana/i)).toBeInTheDocument();
  });

  it("muestra los datos de confianza: años de experiencia, sucursales y garantía", () => {
    render(<Nosotros />);
    expect(screen.getByText("3 años")).toBeInTheDocument();
    expect(screen.getByText("8 sucursales")).toBeInTheDocument();
    expect(screen.getByText("Garantía")).toBeInTheDocument();
  });
});
