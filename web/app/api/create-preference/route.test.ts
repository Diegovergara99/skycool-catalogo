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
  tipo: "venta",
  precioUnitario: 17914,
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

  it("nunca revela el nombre de la variable de entorno faltante al cliente", async () => {
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ items: [itemDePrueba] }));
    const json = await res.json();
    expect(json.error).not.toMatch(/MP_ACCESS_TOKEN|\.env/i);
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

  it("devuelve 400 si se pide renta de un producto que solo se vende", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemRentaInvalida = { ...itemDePrueba, tipo: "renta" };

    const res = await POST(construirRequest({ items: [itemRentaInvalida] }));
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

  it("aplica el descuento del 15% en unit_price cuando dias es 3, usando el precio oficial de catálogo", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");

    const itemRenta3Dias = {
      productoId: "ventilador-piso",
      varianteId: "dm-110",
      nombreProducto: "Ventilador de piso",
      nombreVariante: "DM-110 (conexión a 110V)",
      tipo: "renta",
      precioUnitario: 1, // manipulado — el server debe ignorarlo
      cantidad: 1,
      dias: 3,
    };

    const res = await POST(construirRequest({ items: [itemRenta3Dias] }));
    expect(res.status).toBe(200);
    // Precio oficial de catálogo (renta) para dm-110 es $950/día.
    // $950 × 3 × 0.85 = $2,422.50
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: expect.arrayContaining([expect.objectContaining({ unit_price: 2422.5 })]),
        }),
      })
    );
  });

  it("ignora dias manipulado en un item de venta (no aplica el concepto)", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");

    const itemVentaConDias = { ...itemDePrueba, tipo: "venta", dias: 3 };

    const res = await POST(construirRequest({ items: [itemVentaConDias] }));
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          items: expect.arrayContaining([expect.objectContaining({ unit_price: 17914 })]),
        }),
      })
    );
  });

  it.each([0, 2, 4, "3", -3])("devuelve 400 si dias es un valor no válido (%s)", async (diasInvalido) => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemDiasInvalido = {
      productoId: "ventilador-piso",
      varianteId: "dm-110",
      nombreProducto: "Ventilador de piso",
      nombreVariante: "DM-110 (conexión a 110V)",
      tipo: "renta",
      precioUnitario: 950,
      cantidad: 1,
      dias: diasInvalido,
    };

    const res = await POST(construirRequest({ items: [itemDiasInvalido] }));
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
