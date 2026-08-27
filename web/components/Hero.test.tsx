import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("muestra el titular principal y el CTA al catálogo", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ventilación industrial/i);
    expect(screen.getByRole("link", { name: /ver catálogo/i })).toHaveAttribute("href", "#catalogo");
  });
});
