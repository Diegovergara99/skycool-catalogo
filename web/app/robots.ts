import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /pago/* ya no se bloquea aquí: esas páginas tienen su propio
      // `noindex` (ver app/pago/layout.tsx). Si además las bloqueamos en
      // robots.txt, Google nunca llega a descargar el HTML y por lo tanto
      // nunca puede leer ese `noindex` — el bloqueo aquí anulaba la
      // protección en vez de reforzarla. /api/ sí se mantiene bloqueado:
      // son rutas de servidor sin HTML que rastrear, no páginas indexables.
      disallow: ["/api/"],
    },
    sitemap: "https://www.skycool.com.mx/sitemap.xml",
  };
}
