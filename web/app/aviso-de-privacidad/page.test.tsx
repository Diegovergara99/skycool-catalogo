import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AvisoDePrivacidadPage from "./page";

describe("AvisoDePrivacidadPage", () => {
  it("muestra el título y las secciones clave del aviso", () => {
    render(<AvisoDePrivacidadPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Aviso de Privacidad");
    expect(screen.getByText(/Responsable del tratamiento/i)).toBeInTheDocument();
    expect(screen.getByText(/Datos personales que recabamos/i)).toBeInTheDocument();
    expect(screen.getAllByText(/derechos ARCO/i).length).toBeGreaterThan(0);
  });

  it("incluye un correo de contacto para ejercer derechos ARCO", () => {
    render(<AvisoDePrivacidadPage />);
    expect(screen.getByRole("link", { name: "skycool.gdl@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:skycool.gdl@gmail.com"
    );
  });

  it("no ofrece usar los datos para mercadotecnia, según lo pedido por el negocio", () => {
    render(<AvisoDePrivacidadPage />);
    expect(screen.getByText(/No usamos tus datos para fines de mercadotecnia/i)).toBeInTheDocument();
  });
});
