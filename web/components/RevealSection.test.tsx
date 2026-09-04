import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import RevealSection from "./RevealSection";

let ultimoCallback: IntersectionObserverCallback | null = null;

class IntersectionObserverStub {
  constructor(callback: IntersectionObserverCallback) {
    ultimoCallback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
}

describe("RevealSection", () => {
  afterEach(() => {
    ultimoCallback = null;
    vi.unstubAllGlobals();
  });

  it("muestra su contenido siempre (para SEO), sin importar si ya es visible", () => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    render(
      <RevealSection>
        <p>Contenido de la sección</p>
      </RevealSection>
    );
    expect(screen.getByText("Contenido de la sección")).toBeInTheDocument();
  });

  it("agrega la clase de visible una vez que el observador detecta la intersección", () => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    const { container } = render(
      <RevealSection>
        <p>Contenido</p>
      </RevealSection>
    );
    const envoltura = container.firstElementChild as HTMLElement;
    expect(envoltura.className).toContain("opacity-0");

    act(() => {
      ultimoCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(envoltura.className).toContain("opacity-100");
  });
});
