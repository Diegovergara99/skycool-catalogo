import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Nosotros from "./Nosotros";

describe("Nosotros", () => {
  it("muestra el texto de la empresa", () => {
    render(<Nosotros />);
    expect(screen.getByText(/empresa mexicana/i)).toBeInTheDocument();
  });
});
