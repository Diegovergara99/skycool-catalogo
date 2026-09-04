import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionEyebrow from "./SectionEyebrow";

describe("SectionEyebrow", () => {
  it("muestra el texto dado", () => {
    render(<SectionEyebrow>Sobre nosotros</SectionEyebrow>);
    expect(screen.getByText("Sobre nosotros")).toBeInTheDocument();
  });

  it("usa colores de texto oscuro sobre fondo claro por defecto", () => {
    render(<SectionEyebrow>Catálogo</SectionEyebrow>);
    expect(screen.getByText("Catálogo").className).toContain("text-[var(--color-teal-dark)]");
  });

  it("usa colores de texto claro sobre fondo oscuro con variant='dark'", () => {
    render(<SectionEyebrow variant="dark">Sobre nosotros</SectionEyebrow>);
    expect(screen.getByText("Sobre nosotros").className).toContain("text-[var(--color-teal)]");
  });
});
