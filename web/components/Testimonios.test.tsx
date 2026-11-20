import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonios from "./Testimonios";

describe("Testimonios", () => {
  it("muestra el título de la sección", () => {
    render(<Testimonios />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Lo que dicen nuestros clientes" })
    ).toBeInTheDocument();
  });

  it("muestra los 3 testimonios reales con nombre y opinión", () => {
    render(<Testimonios />);
    expect(screen.getByText("Omar")).toBeInTheDocument();
    expect(screen.getByText(/muy buena inversión/)).toBeInTheDocument();

    expect(screen.getByText("Byron")).toBeInTheDocument();
    expect(screen.getByText(/ya no se siente ese bochorno/i)).toBeInTheDocument();

    expect(screen.getByText("David")).toBeInTheDocument();
    expect(screen.getByText(/la boda de mi hermana/)).toBeInTheDocument();
  });

  it("cada testimonio muestra 5 estrellas", () => {
    const { container } = render(<Testimonios />);
    const grupos = screen.getAllByLabelText("5 de 5 estrellas");
    expect(grupos).toHaveLength(3);
    for (const grupo of grupos) {
      expect(grupo.querySelectorAll("svg")).toHaveLength(5);
    }
  });
});
