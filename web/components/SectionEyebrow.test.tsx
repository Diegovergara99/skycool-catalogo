import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionEyebrow from "./SectionEyebrow";

describe("SectionEyebrow", () => {
  it("muestra el texto dado", () => {
    render(<SectionEyebrow>Sobre nosotros</SectionEyebrow>);
    expect(screen.getByText("Sobre nosotros")).toBeInTheDocument();
  });
});
