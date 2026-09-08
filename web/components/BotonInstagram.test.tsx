import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BotonInstagram from "./BotonInstagram";

describe("BotonInstagram", () => {
  it("enlaza directo al Instagram configurado", () => {
    render(<BotonInstagram />);
    const link = screen.getByRole("link", { name: "Síguenos en Instagram" });
    expect(link).toHaveAttribute("href", process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "[TU INSTAGRAM]");
  });

  it("abre en una pestaña nueva", () => {
    render(<BotonInstagram />);
    const link = screen.getByRole("link", { name: "Síguenos en Instagram" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
