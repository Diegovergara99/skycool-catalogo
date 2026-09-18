import type { NextConfig } from "next";

// CSP sin nonce: se investigó nonce-per-request y hash-based script-src
// (ambos documentados por Next.js para eliminar 'unsafe-inline'), pero
// ninguno es viable aquí sin un costo real:
// - nonce: obliga a que TODO el sitio se renderice dinámicamente en cada
//   visita (Next.js lo exige porque el nonce debe cambiar por request).
//   Medido en un deploy de prueba: el TTFB de la portada subió de
//   ~250-390ms (estática) a ~430-1250ms (dinámica) — justo el tipo de
//   regresión que se corrigió antes al diferir Google Analytics.
// - hashes SHA-256 manuales: cubren los <script> propios (JSON-LD), pero
//   Next.js App Router también inyecta scripts inline internos (el RSC
//   "flight data" que hidrata React) cuyo contenido cambia con cualquier
//   edición de una página — la propia documentación de Next.js reconoce
//   esto como limitación ("cannot handle dynamically generated scripts").
// Por eso 'unsafe-inline' se mantiene en script-src, tal como la propia
// guía de Next.js recomienda para sitios que no requieren nonces. Como
// mitigación real (sin costo de rendimiento ni de renderizado dinámico) se
// habilita SRI abajo, que protege los bundles JS del framework con hashes
// de integridad — ver "experimental.sri".
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Subresource Integrity: Next.js agrega un atributo `integrity` con hash
  // SHA-256 a cada bundle JS que sirve, para que el navegador rechace el
  // archivo si su contenido fue alterado en tránsito (ej. un CDN
  // comprometido). No sustituye lo de arriba (es para archivos externos
  // con src=, no para scripts inline), pero es una capa de protección real
  // sin ningún costo de rendimiento — compatible con generación estática.
  experimental: {
    sri: {
      algorithm: "sha256",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
