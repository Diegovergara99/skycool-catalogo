// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockCreate = vi.fn();

vi.mock("mercadopago", () => ({
  MercadoPagoConfig: vi.fn(),
  // Regular function (not arrow) so `new Preference(client)` — how route.ts
  // and the real SDK's Preference class must be invoked — works: arrow
  // functions have no [[Construct]] and throw under Reflect.construct.
  Preference: vi.fn().mockImplementation(function (this: { create: typeof mockCreate }) {
    this.create = mockCreate;
  }),
}));

const itemDePrueba = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "renta",
  precioUnitario: 1200,
  cantidad: 1,
};

function construirRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/create-preference", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/create-preference", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    delete process.env.MP_ACCESS_TOKEN;
  });

  it("devuelve 503 si no hay MP_ACCESS_TOKEN configurado", async () => {
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ items: [itemDePrueba] }));
    expect(res.status).toBe(503);
  });

  it("devuelve 400 si el carrito está vacío", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ items: [] }));
    expect(res.status).toBe(400);
  });

  it("devuelve initPoint cuando Mercado Pago responde bien", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ items: [itemDePrueba] }));
    const datos = await res.json();
    expect(res.status).toBe(200);
    expect(datos.initPoint).toBe("https://mp.example/checkout/123");
  });

  it("devuelve 502 si Mercado Pago falla", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockRejectedValue(new Error("mp down"));
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ items: [itemDePrueba] }));
    expect(res.status).toBe(502);
  });

  it("ignora precioUnitario manipulado por el cliente y usa el precio del catálogo", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");

    const itemManipulado = {
      ...itemDePrueba,
      tipo: "venta",
      precioUnitario: 1, // precio real de catálogo (venta) es 17914
    };

    const res = await POST(construirRequest({ items: [itemManipulado] }));
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ unit_price: 17914 }),
          ]),
        }),
      })
    );
  });

  it("devuelve 400 si productoId/varianteId no existen en el catálogo", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemInventado = {
      ...itemDePrueba,
      productoId: "producto-inventado",
      varianteId: "variante-inventada",
    };

    const res = await POST(construirRequest({ items: [itemInventado] }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it.each([-1, 0, 1.5])("devuelve 400 si cantidad es %s", async (cantidadInvalida) => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemInvalido = { ...itemDePrueba, cantidad: cantidadInvalida };

    const res = await POST(construirRequest({ items: [itemInvalido] }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("devuelve 400 si tipo no es 'renta' ni 'venta'", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemInvalido = { ...itemDePrueba, tipo: "hack" };

    const res = await POST(construirRequest({ items: [itemInvalido] }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("devuelve 400 si el cuerpo de la solicitud no es JSON válido", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const requestInvalida = new NextRequest("http://localhost:3000/api/create-preference", {
      method: "POST",
      body: "esto no es JSON{{{",
    });

    const res = await POST(requestInvalida);
    expect(res.status).toBe(400);
  });
});
