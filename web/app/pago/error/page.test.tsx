import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PagoErrorPage from "./page";

describe("PagoErrorPage", () => {
  it("incluye un link directo de WhatsApp para coordinar el pago", () => {
    render(<PagoErrorPage />);

    const link = screen.getByText("Coordinar por WhatsApp");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\//));

    const href = link.getAttribute("href")!;
    expect(decodeURIComponent(href)).toContain(
      "Hola, tuve un problema al pagar en el sitio de SkyCool. Quiero coordinar mi pago."
    );
  });

  it("también conserva el botón para volver al catálogo", () => {
    render(<PagoErrorPage />);
    expect(screen.getByText("Volver al catálogo")).toBeInTheDocument();
  });
});
