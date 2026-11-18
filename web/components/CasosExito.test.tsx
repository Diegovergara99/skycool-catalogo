import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CasosExito from "./CasosExito";

describe("CasosExito", () => {
  it("muestra los 2 casos reales con cliente, giro y resultado", () => {
    render(<CasosExito />);
    expect(screen.getByText("Ilusión Bowl")).toBeInTheDocument();
    expect(screen.getByText("Boliche y arcade, Guadalajara")).toBeInTheDocument();
    expect(screen.getByText("3 coolers. 1 boliche. Cero calor.")).toBeInTheDocument();

    expect(screen.getByText("Foro Boletomóvil")).toBeInTheDocument();
    expect(screen.getByText("Foro de conciertos")).toBeInTheDocument();
    expect(
      screen.getByText("Ventiladores de piso listos antes de que empiece el show.")
    ).toBeInTheDocument();
  });

  it("cada caso tiene un video con poster y fuente mp4", () => {
    const { container } = render(<CasosExito />);
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(2);
    for (const video of videos) {
      expect(video.getAttribute("poster")).not.toBe("");
      const source = video.querySelector("source");
      expect(source?.getAttribute("src")).toMatch(/\.mp4$/);
      expect(source?.getAttribute("type")).toBe("video/mp4");
    }
  });
});
