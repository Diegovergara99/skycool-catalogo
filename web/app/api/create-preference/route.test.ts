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

const direccionDePrueba = {
  nombre: "Juan Pérez",
  telefono: "3312345678",
  calle: "Av. Vallarta",
  numeroExterior: "1234",
  numeroInterior: "5B",
  colonia: "Americana",
  ciudad: "Guadalajara",
  estado: "Jalisco",
  codigoPostal: "44160",
  referencias: "Portón negro",
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
    const res = await POST(
      construirRequest({ items: [itemDePrueba], direccion: direccionDePrueba })
    );
    const datos = await res.json();
    expect(res.status).toBe(200);
    expect(datos.initPoint).toBe("https://mp.example/checkout/123");
  });

  it("devuelve 502 si Mercado Pago falla", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockRejectedValue(new Error("mp down"));
    const { POST } = await import("./route");
    const res = await POST(
      construirRequest({ items: [itemDePrueba], direccion: direccionDePrueba })
    );
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

    const res = await POST(
      construirRequest({ items: [itemManipulado], direccion: direccionDePrueba })
    );
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

  it("devuelve 400 si hay un item de venta y no se manda dirección de envío", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const res = await POST(construirRequest({ items: [itemDePrueba] }));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it.each(["nombre", "calle", "numeroExterior", "colonia", "ciudad", "estado", "codigoPostal", "telefono"])(
    "devuelve 400 si la dirección de envío no trae '%s'",
    async (campo) => {
      process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
      const { POST } = await import("./route");

      const direccionIncompleta = { ...direccionDePrueba, [campo]: "" };
      const res = await POST(
        construirRequest({ items: [itemDePrueba], direccion: direccionIncompleta })
      );
      expect(res.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
    }
  );

  it("no requiere dirección de envío si el carrito es solo de renta", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");

    const itemRenta = { ...itemDePrueba, tipo: "renta", productoId: "ventilador-piso", varianteId: "dm-110" };
    const res = await POST(construirRequest({ items: [itemRenta] }));
    expect(res.status).toBe(200);
  });

  it("incluye payer, shipments y metadata con los datos de envío en la preferencia de Mercado Pago", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const { POST } = await import("./route");

    const res = await POST(
      construirRequest({ items: [itemDePrueba], direccion: direccionDePrueba })
    );
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          payer: expect.objectContaining({
            name: "Juan Pérez",
            phone: { number: "3312345678" },
          }),
          shipments: expect.objectContaining({
            receiver_address: expect.objectContaining({
              zip_code: "44160",
              street_name: "Av. Vallarta",
              street_number: "1234",
              apartment: "5B",
              city_name: "Guadalajara",
              state_name: "Jalisco",
            }),
          }),
          metadata: expect.objectContaining({
            colonia: "Americana",
            referencias: "Portón negro",
          }),
        }),
      })
    );
  });

  it("envía un aviso por correo con la dirección de envío cuando hay venta y RESEND_API_KEY está configurado", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    process.env.RESEND_API_KEY = "re_test";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ id: "abc" }), { status: 200 }));
    const { POST } = await import("./route");

    const res = await POST(
      construirRequest({ items: [itemDePrueba], direccion: direccionDePrueba })
    );
    expect(res.status).toBe(200);

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer re_test" }),
      })
    );
    const [, opciones] = fetchSpy.mock.calls[0];
    const cuerpoEnviado = JSON.parse(String((opciones as RequestInit).body));
    expect(cuerpoEnviado.to).toEqual(["skycool.gdl@gmail.com"]);
    expect(cuerpoEnviado.text).toContain("Extractor de aire");
    expect(cuerpoEnviado.text).toContain("Guadalajara");
    expect(cuerpoEnviado.text).toContain("Juan Pérez");

    delete process.env.RESEND_API_KEY;
    fetchSpy.mockRestore();
  });

  it("no falla el pago si el envío del correo de aviso falla", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    process.env.RESEND_API_KEY = "re_test";
    mockCreate.mockResolvedValue({ init_point: "https://mp.example/checkout/123" });
    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("resend down"));
    const { POST } = await import("./route");

    const res = await POST(
      construirRequest({ items: [itemDePrueba], direccion: direccionDePrueba })
    );
    const datos = await res.json();
    expect(res.status).toBe(200);
    expect(datos.initPoint).toBe("https://mp.example/checkout/123");

    delete process.env.RESEND_API_KEY;
    fetchSpy.mockRestore();
  });

  it("devuelve 400 si productoId/varianteId no existen en el catálogo", async () => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemInventado = {
      ...itemDePrueba,
      productoId: "producto-inventado",
      varianteId: "variante-inventada",
    };

    const res = await POST(
      construirRequest({ items: [itemInventado], direccion: direccionDePrueba })
    );
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it.each([-1, 0, 1.5])("devuelve 400 si cantidad es %s", async (cantidadInvalida) => {
    process.env.MP_ACCESS_TOKEN = "TEST-TOKEN";
    const { POST } = await import("./route");

    const itemInvalido = { ...itemDePrueba, cantidad: cantidadInvalida };

    const res = await POST(
      construirRequest({ items: [itemInvalido], direccion: direccionDePrueba })
    );
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

    const res = await POST(
      construirRequest({ items: [itemVentaConDias], direccion: direccionDePrueba })
    );
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
