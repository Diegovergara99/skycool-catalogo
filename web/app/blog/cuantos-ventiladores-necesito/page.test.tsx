import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CuantosVentiladoresNecesitoPage from "./page";

describe("CuantosVentiladoresNecesitoPage", () => {
  it("muestra el título y contenido real de cobertura por modelo", () => {
    render(<CuantosVentiladoresNecesitoPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /cuántos ventiladores industriales/i
    );
    expect(screen.getAllByText(/400–500 m²/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2,462 m²/)).toBeInTheDocument();
  });

  it("incluye datos estructurados BlogPosting apuntando a esta página", () => {
    const { container } = render(<CuantosVentiladoresNecesitoPage />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "{}");
    expect(data["@type"]).toBe("BlogPosting");
    expect(data.url).toBe("https://www.skycool.com.mx/blog/cuantos-ventiladores-necesito");
  });

  it("tiene un link de regreso al blog", () => {
    render(<CuantosVentiladoresNecesitoPage />);
    expect(screen.getByRole("link", { name: /volver al blog/i })).toHaveAttribute("href", "/blog");
  });
});
