import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RentaGuadalajara from "./RentaGuadalajara";

describe("RentaGuadalajara", () => {
  it("muestra el título y el texto con las ciudades de cobertura local", () => {
    render(<RentaGuadalajara />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Renta de ventiladores en Guadalajara" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Guadalajara, Zapopan, Tonalá, Tlaquepaque y El Salto/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Desde \$950 \+ IVA/)).toBeInTheDocument();
  });

  it("el botón de WhatsApp manda un mensaje mencionando Guadalajara", () => {
    render(<RentaGuadalajara />);
    const link = screen.getByRole("link", { name: /cotiza por whatsapp/i });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(link.getAttribute("href")!)).toContain("Guadalajara");
  });
});
