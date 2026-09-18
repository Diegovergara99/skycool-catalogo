import type { Producto } from "./types";
import type { EntradaBlog } from "./blog";
import type { Sucursal } from "./sucursales";

const SITIO = "https://www.skycool.com.mx";

/**
 * JSON-LD Organization del sitio. Extraído a una función (en vez de vivir
 * como constante directa en layout.tsx) para que next.config.ts pueda
 * generar el mismo string exacto al calcular su hash SHA-256 para el CSP
 * (ver "Content-Security-Policy" ahí) — el navegador solo ejecuta un
 * <script> inline si su contenido coincide byte a byte con un hash
 * declarado, así que esta función es la única fuente de verdad para ese
 * contenido, usada tanto en runtime como en build time.
 */
export function construirOrganizacionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITIO}/#organizacion`,
    name: "SkyCool",
    url: SITIO,
    logo: `${SITIO}/logo.png`,
    ...(process.env.NEXT_PUBLIC_INSTAGRAM_URL
      ? { sameAs: [process.env.NEXT_PUBLIC_INSTAGRAM_URL] }
      : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+52${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.slice(2) ?? ""}`,
        contactType: "sales",
        areaServed: "MX",
        availableLanguage: ["es"],
      },
    ],
  };
}

/**
 * JSON-LD LocalBusiness/Store por cada sucursal. Misma razón que
 * `construirOrganizacionJsonLd`: se extrae a una función pura para que
 * next.config.ts pueda calcular el hash SHA-256 exacto de este contenido
 * en build time.
 */
export function construirSucursalesJsonLd(sucursales: Sucursal[]) {
  const whatsappNumero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return {
    "@context": "https://schema.org",
    "@graph": sucursales.map((s) => ({
      "@type": ["LocalBusiness", "Store"],
      "@id": `${SITIO}/#sucursal-${s.id}`,
      name: `SkyCool ${s.ciudad}`,
      url: `${SITIO}/#sucursales`,
      branchOf: { "@id": `${SITIO}/#organizacion` },
      ...(whatsappNumero ? { telephone: `+52${whatsappNumero.slice(2)}` } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: s.direccion,
        addressLocality: s.ciudad,
        addressRegion: s.estado,
        addressCountry: "MX",
      },
    })),
  };
}

/**
 * JSON-LD BreadcrumbList a partir de una lista ordenada de
 * {nombre, url} — de la raíz del sitio hacia la página actual.
 */
export function construirBreadcrumbJsonLd(items: { nombre: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: item.nombre,
      item: item.url,
    })),
  };
}

/**
 * JSON-LD BlogPosting para una entrada del blog. `author`/`publisher`
 * referencian el `@id` de la Organization ya declarada en el layout raíz
 * (mismo patrón que `branchOf` en las sucursales) en vez de repetir sus
 * datos completos aquí.
 */
export function construirArticuloJsonLd(entrada: EntradaBlog, urlPagina: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entrada.titulo,
    description: entrada.descripcion,
    datePublished: entrada.fechaPublicacion,
    dateModified: entrada.fechaPublicacion,
    url: urlPagina,
    mainEntityOfPage: { "@type": "WebPage", "@id": urlPagina },
    author: { "@id": `${SITIO}/#organizacion` },
    publisher: { "@id": `${SITIO}/#organizacion` },
    inLanguage: "es-MX",
  };
}

/**
 * Construye el JSON-LD (Schema.org) del catálogo para que Google entienda
 * los precios y specs de cada modelo. Un `Product` por variante (no por
 * línea de producto), con un `Offer` de renta (businessFunction LeaseOut,
 * precio por día vía UnitPriceSpecification) cuando aplica, y siempre un
 * `Offer` de venta (businessFunction Sell). Los precios en el sitio se
 * muestran sin IVA, así que `valueAddedTaxIncluded: false` en ambos casos
 * para que el schema no implique que ese número ya incluye impuestos.
 */
export function construirProductosJsonLd(
  productos: Producto[],
  urlPagina: string = `${SITIO}/#catalogo`
) {
  const nodosProducto = productos.flatMap((producto) =>
    producto.variantes.map((variante) => {
      const offers = [];

      if (variante.precioRenta !== undefined) {
        offers.push({
          "@type": "Offer",
          businessFunction: "https://schema.org/LeaseOut",
          price: variante.precioRenta,
          priceCurrency: "MXN",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: variante.precioRenta,
            priceCurrency: "MXN",
            unitText: "día",
            valueAddedTaxIncluded: false,
          },
          availability: "https://schema.org/InStock",
          url: urlPagina,
        });
      }

      offers.push({
        "@type": "Offer",
        businessFunction: "https://schema.org/Sell",
        price: variante.precioVenta,
        priceCurrency: "MXN",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: variante.precioVenta,
          priceCurrency: "MXN",
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        url: urlPagina,
      });

      return {
        "@type": "Product",
        "@id": `${SITIO}/#${producto.id}-${variante.id}`,
        name: `${producto.nombre} ${variante.nombre}`,
        description: producto.descripcion,
        image: `${SITIO}${producto.imagen}`,
        url: urlPagina,
        offers,
      };
    })
  );

  // Un producto con 2+ modelos (ej. DM-110/DM-220, o W14/W20/W26) declara
  // cada modelo como su propio `Product`, pero los 2-3 comparten la misma
  // URL — Google generalmente solo puede mostrar UN producto por URL en
  // resultados enriquecidos, así que sin este `ProductGroup` los demás
  // modelos declarados quedan "invisibles" para ese resultado aunque su
  // schema sea válido. `ProductGroup` + `hasVariant` es el patrón que
  // Google recomienda desde 2022 para este caso exacto. Se agrega como
  // nodos adicionales al final del `@graph`, sin mover ni renumerar los
  // `Product` ya existentes.
  const gruposDeVariantes = productos
    .filter((producto) => producto.variantes.length > 1)
    .map((producto) => ({
      "@type": "ProductGroup",
      "@id": `${SITIO}/#${producto.id}-grupo`,
      name: producto.nombre,
      description: producto.descripcion,
      url: urlPagina,
      hasVariant: producto.variantes.map((variante) => ({
        "@id": `${SITIO}/#${producto.id}-${variante.id}`,
      })),
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [...nodosProducto, ...gruposDeVariantes],
  };
}

/**
 * Igual que `construirProductosJsonLd`, pero para el catálogo de la
 * portada: algunos productos tienen página propia y otros no. Un producto
 * con página propia debe usar el MISMO `@id` en la portada y en su página
 * (es la misma entidad), pero el `url` debe apuntar a su página dedicada
 * en ambos lugares — si la portada dijera `/#catalogo` mientras la página
 * dedicada dice su propia URL, Google vería dos `url` distintos para el
 * mismo `@id`, una señal contradictoria sobre cuál es la página real de
 * ese producto.
 */
export function construirCatalogoJsonLd(
  productos: Producto[],
  urlPorProducto: Record<string, string> = {}
) {
  const graficos = productos.map((producto) =>
    construirProductosJsonLd([producto], urlPorProducto[producto.id])
  );
  return {
    "@context": "https://schema.org",
    "@graph": graficos.flatMap((g) => g["@graph"]),
  };
}
