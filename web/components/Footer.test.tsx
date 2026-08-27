import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("muestra la marca y al menos un link de navegación", () => {
    render(<Footer />);
    expect(screen.getByText("SKYCOOL")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });
});
