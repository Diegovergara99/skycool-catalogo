import { describe, it, expect } from "vitest";
import { construirProductosJsonLd } from "./schema";
import type { Producto } from "./types";

const productoRentaYVenta: Producto = {
  id: "ventilador-piso",
  nombre: "Ventilador de piso",
  categoria: "piso",
  imagen: "/imagenes/ventilador-piso.jpg",
  descripcion: "Descripción de prueba",
  specs: [],
  variantes: [
    { id: "dm-110", nombre: "DM-110", precioRenta: 950, precioVenta: 23520 },
    { id: "dm-220", nombre: "DM-220", precioRenta: 950, precioVenta: 23520 },
  ],
};

const productoSoloVenta: Producto = {
  id: "extractor-aire",
  nombre: "Extractor de aire",
  categoria: "extraccion",
  imagen: "/imagenes/extractor-aire.jpg",
  descripcion: "Descripción de prueba",
  specs: [],
  variantes: [{ id: "ay-1220", nombre: "AY-1220", precioVenta: 17914 }],
};

describe("construirProductosJsonLd", () => {
  it("genera un @graph con un Product por cada variante de cada producto", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta, productoSoloVenta]);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@graph"]).toHaveLength(3);
  });

  it("un producto con renta y venta tiene dos Offer: LeaseOut y Sell", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta]);
    const producto = jsonLd["@graph"][0];
    expect(producto.offers).toHaveLength(2);
    expect(producto.offers[0].businessFunction).toBe("https://schema.org/LeaseOut");
    expect(producto.offers[0].price).toBe(950);
    expect(producto.offers[1].businessFunction).toBe("https://schema.org/Sell");
    expect(producto.offers[1].price).toBe(23520);
  });

  it("un producto solo de venta tiene un único Offer: Sell", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const producto = jsonLd["@graph"][0];
    expect(producto.offers).toHaveLength(1);
    expect(producto.offers[0].businessFunction).toBe("https://schema.org/Sell");
    expect(producto.offers[0].price).toBe(17914);
  });

  it("marca los precios como sin IVA (valueAddedTaxIncluded: false), igual que se muestran en el sitio", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const oferta = jsonLd["@graph"][0].offers[0];
    expect(oferta.priceSpecification.valueAddedTaxIncluded).toBe(false);
  });

  it("la oferta de renta usa UnitPriceSpecification con unitText 'día'", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta]);
    const ofertaRenta = jsonLd["@graph"][0].offers[0];
    expect(ofertaRenta.priceSpecification["@type"]).toBe("UnitPriceSpecification");
    expect(ofertaRenta.priceSpecification.unitText).toBe("día");
  });

  it("cada Product tiene un @id único", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta, productoSoloVenta]);
    const ids = jsonLd["@graph"].map((p) => p["@id"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("usa /#catalogo como url por defecto si no se especifica una página", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const producto = jsonLd["@graph"][0];
    expect(producto.url).toBe("https://www.skycool.com.mx/#catalogo");
    expect(producto.offers[0].url).toBe("https://www.skycool.com.mx/#catalogo");
  });

  it("usa la url de página dada cuando se especifica (para páginas de producto dedicadas)", () => {
    const jsonLd = construirProductosJsonLd(
      [productoSoloVenta],
      "https://www.skycool.com.mx/productos/extractor-de-aire"
    );
    const producto = jsonLd["@graph"][0];
    expect(producto.url).toBe("https://www.skycool.com.mx/productos/extractor-de-aire");
    expect(producto.offers[0].url).toBe("https://www.skycool.com.mx/productos/extractor-de-aire");
  });
});
