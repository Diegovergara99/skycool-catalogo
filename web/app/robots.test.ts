import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("permite todo excepto /api/ y /pago/, y declara el sitemap", () => {
    const resultado = robots();
    expect(resultado.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/pago/"],
    });
    expect(resultado.sitemap).toBe("https://www.skycool.com.mx/sitemap.xml");
  });
});
