import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BarraCtaMovil from "./BarraCtaMovil";

describe("BarraCtaMovil", () => {
  it("enlaza directo a WhatsApp con el número configurado y un mensaje de saludo", () => {
    render(<BarraCtaMovil />);
    const link = screen.getByRole("link", { name: /WhatsApp/ });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/.*\?text=/));
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("Hola");
  });

  it("abre en una pestaña nueva", () => {
    render(<BarraCtaMovil />);
    const link = screen.getByRole("link", { name: /WhatsApp/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("muestra un texto que invita a cotizar", () => {
    render(<BarraCtaMovil />);
    expect(screen.getByText(/Cotiza gratis/)).toBeInTheDocument();
  });
});
