import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("permite todo excepto /api/, y declara el sitemap", () => {
    const resultado = robots();
    expect(resultado.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    });
    expect(resultado.sitemap).toBe("https://www.skycool.com.mx/sitemap.xml");
  });

  it("no bloquea /pago/ — esas páginas usan noindex propio, no robots.txt", () => {
    // Bloquear con robots.txt Y noindex a la vez es contraproducente: si
    // Google no puede rastrear la página, tampoco puede leer su noindex.
    const resultado = robots();
    const disallow = Array.isArray(resultado.rules)
      ? resultado.rules.flatMap((r) => r.disallow ?? [])
      : (resultado.rules.disallow ?? []);
    expect(disallow).not.toContain("/pago/");
  });
});
