import { describe, it, expect } from "vitest";
import {
  construirProductosJsonLd,
  construirCatalogoJsonLd,
  construirArticuloJsonLd,
  construirBreadcrumbJsonLd,
} from "./schema";
import type { Producto } from "./types";
import type { EntradaBlog } from "./blog";

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
  it("genera un @graph con un Product por cada variante de cada producto, más un ProductGroup por cada producto multi-variante", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta, productoSoloVenta]);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    // 2 variantes de piso + 1 del extractor + 1 ProductGroup (solo piso
    // tiene 2+ variantes, el extractor no genera grupo).
    expect(jsonLd["@graph"]).toHaveLength(4);
  });

  it("agrega un ProductGroup con hasVariant para un producto con 2+ modelos", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta]);
    const grupo: any = jsonLd["@graph"].find((n: any) => n["@type"] === "ProductGroup");
    expect(grupo).toBeDefined();
    expect(grupo.name).toBe("Ventilador de piso");
    expect(grupo.hasVariant).toEqual([
      { "@id": "https://www.skycool.com.mx/#ventilador-piso-dm-110" },
      { "@id": "https://www.skycool.com.mx/#ventilador-piso-dm-220" },
    ]);
  });

  it("no agrega ProductGroup para un producto con un solo modelo", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const grupo = jsonLd["@graph"].find((n) => n["@type"] === "ProductGroup");
    expect(grupo).toBeUndefined();
  });

  it("un producto con renta y venta tiene dos Offer: LeaseOut y Sell", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta]);
    const producto: any = jsonLd["@graph"][0];
    expect(producto.offers).toHaveLength(2);
    expect(producto.offers[0].businessFunction).toBe("https://schema.org/LeaseOut");
    expect(producto.offers[0].price).toBe(950);
    expect(producto.offers[1].businessFunction).toBe("https://schema.org/Sell");
    expect(producto.offers[1].price).toBe(23520);
  });

  it("un producto solo de venta tiene un único Offer: Sell", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const producto: any = jsonLd["@graph"][0];
    expect(producto.offers).toHaveLength(1);
    expect(producto.offers[0].businessFunction).toBe("https://schema.org/Sell");
    expect(producto.offers[0].price).toBe(17914);
  });

  it("marca los precios como sin IVA (valueAddedTaxIncluded: false), igual que se muestran en el sitio", () => {
    const jsonLd = construirProductosJsonLd([productoSoloVenta]);
    const oferta = (jsonLd["@graph"][0] as any).offers[0];
    expect(oferta.priceSpecification.valueAddedTaxIncluded).toBe(false);
  });

  it("la oferta de renta usa UnitPriceSpecification con unitText 'día'", () => {
    const jsonLd = construirProductosJsonLd([productoRentaYVenta]);
    const ofertaRenta = (jsonLd["@graph"][0] as any).offers[0];
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
    const producto: any = jsonLd["@graph"][0];
    expect(producto.url).toBe("https://www.skycool.com.mx/#catalogo");
    expect(producto.offers[0].url).toBe("https://www.skycool.com.mx/#catalogo");
  });

  it("usa la url de página dada cuando se especifica (para páginas de producto dedicadas)", () => {
    const jsonLd = construirProductosJsonLd(
      [productoSoloVenta],
      "https://www.skycool.com.mx/productos/extractor-de-aire"
    );
    const producto: any = jsonLd["@graph"][0];
    expect(producto.url).toBe("https://www.skycool.com.mx/productos/extractor-de-aire");
    expect(producto.offers[0].url).toBe("https://www.skycool.com.mx/productos/extractor-de-aire");
  });
});

describe("construirCatalogoJsonLd", () => {
  it("usa /#catalogo para productos sin página propia", () => {
    const jsonLd = construirCatalogoJsonLd([productoSoloVenta], {});
    expect(jsonLd["@graph"][0].url).toBe("https://www.skycool.com.mx/#catalogo");
  });

  it("usa la url de la página propia para un producto que sí la tiene, con el mismo @id que tendría en /#catalogo", () => {
    const conPaginaPropia = construirCatalogoJsonLd([productoRentaYVenta], {
      "ventilador-piso": "https://www.skycool.com.mx/productos/ventilador-de-piso",
    });
    const sinPaginaPropia = construirProductosJsonLd([productoRentaYVenta]);

    expect(conPaginaPropia["@graph"][0].url).toBe(
      "https://www.skycool.com.mx/productos/ventilador-de-piso"
    );
    // Mismo @id que si no tuviera página propia — es la misma entidad,
    // solo cambia a dónde apunta su url.
    expect(conPaginaPropia["@graph"][0]["@id"]).toBe(sinPaginaPropia["@graph"][0]["@id"]);
  });

  it("mezcla productos con y sin página propia en un solo @graph", () => {
    const jsonLd = construirCatalogoJsonLd([productoRentaYVenta, productoSoloVenta], {
      "ventilador-piso": "https://www.skycool.com.mx/productos/ventilador-de-piso",
    });
    // 2 Product + 1 ProductGroup del piso, más 1 Product del extractor.
    expect(jsonLd["@graph"]).toHaveLength(4);
    expect(jsonLd["@graph"][0].url).toBe("https://www.skycool.com.mx/productos/ventilador-de-piso");
    expect(jsonLd["@graph"].at(-1)!.url).toBe("https://www.skycool.com.mx/#catalogo");
  });
});

describe("construirBreadcrumbJsonLd", () => {
  it("genera un BreadcrumbList con position secuencial desde 1", () => {
    const jsonLd = construirBreadcrumbJsonLd([
      { nombre: "Inicio", url: "https://www.skycool.com.mx/" },
      { nombre: "Catálogo", url: "https://www.skycool.com.mx/#catalogo" },
      { nombre: "Ventilador de piso", url: "https://www.skycool.com.mx/productos/ventilador-de-piso" },
    ]);
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://www.skycool.com.mx/",
    });
    expect(jsonLd.itemListElement[2].position).toBe(3);
  });
});

describe("construirArticuloJsonLd", () => {
  const entrada: EntradaBlog = {
    slug: "cuantos-ventiladores-necesito",
    titulo: "¿Cuántos ventiladores industriales necesitas según los metros cuadrados?",
    descripcion: "Descripción de prueba",
    palabraClave: "cuántos ventiladores necesito",
    fechaPublicacion: "2026-09-14",
  };
  const url = "https://www.skycool.com.mx/blog/cuantos-ventiladores-necesito";

  it("genera un BlogPosting con los datos de la entrada", () => {
    const jsonLd = construirArticuloJsonLd(entrada, url);
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe(entrada.titulo);
    expect(jsonLd.datePublished).toBe("2026-09-14");
    expect(jsonLd.url).toBe(url);
  });

  it("referencia a la Organization como author y publisher vía @id", () => {
    const jsonLd = construirArticuloJsonLd(entrada, url);
    expect(jsonLd.author).toEqual({ "@id": "https://www.skycool.com.mx/#organizacion" });
    expect(jsonLd.publisher).toEqual({ "@id": "https://www.skycool.com.mx/#organizacion" });
  });
});
