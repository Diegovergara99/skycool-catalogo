// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

function construirRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/contacto", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const datosDePrueba = {
  nombre: "Diego",
  correo: "diego@example.com",
  telefono: "3312345678",
  mensaje: "Necesito 2 ventiladores de piso",
};

describe("POST /api/contacto", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devuelve 503 si no hay RESEND_API_KEY configurado", async () => {
    const { POST } = await import("./route");
    const res = await POST(construirRequest(datosDePrueba));
    expect(res.status).toBe(503);
  });

  it("devuelve 400 si falta nombre, correo o mensaje", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ ...datosDePrueba, nombre: "" }));
    expect(res.status).toBe(400);
  });

  it("devuelve 400 si el correo no es válido", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const { POST } = await import("./route");
    const res = await POST(construirRequest({ ...datosDePrueba, correo: "no-es-correo" }));
    expect(res.status).toBe(400);
  });

  it("envía el correo a Resend con los datos correctos y responde ok", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ id: "abc" }), { status: 200 }));
    const { POST } = await import("./route");

    const res = await POST(construirRequest(datosDePrueba));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer re_test" }),
      })
    );

    const [, opciones] = fetchSpy.mock.calls[0];
    const cuerpoEnviado = JSON.parse(String(opciones?.body));
    expect(cuerpoEnviado.to).toEqual(["skycool.gdl@gmail.com"]);
    expect(cuerpoEnviado.reply_to).toBe("diego@example.com");
    expect(cuerpoEnviado.text).toContain("Necesito 2 ventiladores de piso");
    expect(cuerpoEnviado.text).toContain("3312345678");
  });

  it("devuelve 502 si Resend responde con error", async () => {
    process.env.RESEND_API_KEY = "re_test";
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("error", { status: 401 }));
    const { POST } = await import("./route");
    const res = await POST(construirRequest(datosDePrueba));
    expect(res.status).toBe(502);
  });

  it("devuelve 502 si falla la conexión con Resend", async () => {
    process.env.RESEND_API_KEY = "re_test";
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const { POST } = await import("./route");
    const res = await POST(construirRequest(datosDePrueba));
    expect(res.status).toBe(502);
  });

  it("devuelve 400 si el cuerpo de la solicitud no es JSON válido", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const { POST } = await import("./route");
    const requestInvalida = new NextRequest("http://localhost:3000/api/contacto", {
      method: "POST",
      body: "esto no es JSON{{{",
    });
    const res = await POST(requestInvalida);
    expect(res.status).toBe(400);
  });
});
