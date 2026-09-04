import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { sucursales } from "@/lib/sucursales";

describe("Hero", () => {
  it("muestra el titular principal y el CTA al catálogo", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ventilación industrial/i);
    expect(screen.getByRole("link", { name: /ver catálogo/i })).toHaveAttribute("href", "#catalogo");
  });

  it("muestra un CTA secundario para cotizar por WhatsApp", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /cotizar por whatsapp/i });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("muestra el número real de sucursales en la línea de confianza", () => {
    render(<Hero />);
    expect(screen.getByText(new RegExp(`${sucursales.length} sucursales`))).toBeInTheDocument();
  });
});
