import { describe, it, expect } from "vitest";
import { construirScriptGtag } from "./analytics";

describe("construirScriptGtag", () => {
  it("configura gtag con el ID de medición dado", () => {
    const script = construirScriptGtag("G-SB105XEFG6");
    expect(script).toContain("gtag('config', 'G-SB105XEFG6');");
  });

  it("inicializa dataLayer y define la función gtag", () => {
    const script = construirScriptGtag("G-TEST123");
    expect(script).toContain("window.dataLayer = window.dataLayer || [];");
    expect(script).toContain("function gtag(){dataLayer.push(arguments);}");
  });
});
