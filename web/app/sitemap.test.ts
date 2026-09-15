import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("incluye la portada, las páginas de producto dedicadas y el aviso de privacidad", () => {
    const entradas = sitemap();
    const urls = entradas.map((e) => e.url);
    expect(urls).toContain("https://www.skycool.com.mx");
    expect(urls).toContain("https://www.skycool.com.mx/productos/ventilador-de-piso");
    expect(urls).toContain(
      "https://www.skycool.com.mx/productos/ventilador-de-techo-industrial"
    );
    expect(urls).toContain("https://www.skycool.com.mx/productos/extractor-de-aire");
    expect(urls).toContain("https://www.skycool.com.mx/productos/ventilador-giratorio");
    expect(urls).toContain("https://www.skycool.com.mx/productos/enfriador-evaporativo");
    expect(urls).toContain("https://www.skycool.com.mx/aviso-de-privacidad");
  });

  it("incluye el blog y sus 4 entradas", () => {
    const entradas = sitemap();
    const urls = entradas.map((e) => e.url);
    expect(urls).toContain("https://www.skycool.com.mx/blog");
    expect(urls).toContain("https://www.skycool.com.mx/blog/cuantos-ventiladores-necesito");
    expect(urls).toContain("https://www.skycool.com.mx/blog/ventilador-piso-vs-techo");
    expect(urls).toContain(
      "https://www.skycool.com.mx/blog/ventilador-vs-enfriador-evaporativo"
    );
    expect(urls).toContain("https://www.skycool.com.mx/blog/renta-ventiladores-para-eventos");
  });

  it("no incluye las páginas de resultado de pago (son noindex)", () => {
    const entradas = sitemap();
    const urls = entradas.map((e) => e.url);
    expect(urls.some((u) => u.includes("/pago/"))).toBe(false);
  });
});
