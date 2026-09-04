import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Instalaciones from "./Instalaciones";

describe("Instalaciones", () => {
  it("muestra las 4 fotos reales con su descripción", () => {
    render(<Instalaciones />);
    expect(
      screen.getByText(/Ventilador de techo industrial instalado en nave industrial/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ventilador de techo instalado en bodega textil/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ventilador de piso instalado en área de recepción/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enfriador evaporativo instalado en planta industrial/i)
    ).toBeInTheDocument();
  });

  it("cada foto tiene alt text descriptivo", () => {
    render(<Instalaciones />);
    const imagenes = screen.getAllByRole("img");
    expect(imagenes).toHaveLength(4);
    for (const img of imagenes) {
      expect(img.getAttribute("alt")).not.toBe("");
    }
  });
});
