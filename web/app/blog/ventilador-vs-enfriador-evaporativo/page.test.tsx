import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VentiladorVsEnfriadorEvaporativoPage from "./page";

describe("VentiladorVsEnfriadorEvaporativoPage", () => {
  it("muestra el título y aclara que el ventilador no baja la temperatura", () => {
    render(<VentiladorVsEnfriadorEvaporativoPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /ventilador industrial vs\. enfriador evaporativo/i
    );
    expect(screen.getByText(/no cambia la temperatura del ambiente/i)).toBeInTheDocument();
  });

  it("incluye datos estructurados BlogPosting", () => {
    const { container } = render(<VentiladorVsEnfriadorEvaporativoPage />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@type"]).toBe("BlogPosting");
  });

  it("enlaza a la página del enfriador evaporativo", () => {
    render(<VentiladorVsEnfriadorEvaporativoPage />);
    expect(screen.getByRole("link", { name: /ver enfriador evaporativo/i })).toHaveAttribute(
      "href",
      "/productos/enfriador-evaporativo"
    );
  });
});
