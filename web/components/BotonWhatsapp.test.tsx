import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BotonWhatsapp from "./BotonWhatsapp";

describe("BotonWhatsapp", () => {
  it("enlaza directo a WhatsApp con el número configurado y un mensaje de saludo", () => {
    render(<BotonWhatsapp />);
    const link = screen.getByRole("link", { name: "Chatea con nosotros por WhatsApp" });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/.*\?text=/));
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("Hola");
  });

  it("abre en una pestaña nueva", () => {
    render(<BotonWhatsapp />);
    const link = screen.getByRole("link", { name: "Chatea con nosotros por WhatsApp" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
