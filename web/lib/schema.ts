import type { Producto } from "./types";

const SITIO = "https://www.skycool.com.mx";

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
  return {
    "@context": "https://schema.org",
    "@graph": productos.flatMap((producto) =>
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
    ),
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
