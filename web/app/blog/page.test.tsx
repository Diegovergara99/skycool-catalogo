import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPage from "./page";
import { entradasBlog } from "@/lib/blog";

describe("BlogPage", () => {
  it("muestra un link a cada entrada del blog", () => {
    render(<BlogPage />);
    for (const entrada of entradasBlog) {
      expect(screen.getByRole("link", { name: new RegExp(entrada.titulo) })).toHaveAttribute(
        "href",
        `/blog/${entrada.slug}`
      );
    }
  });

  it("tiene un link de regreso al inicio", () => {
    render(<BlogPage />);
    expect(screen.getByRole("link", { name: /volver al inicio/i })).toHaveAttribute("href", "/");
  });
});
