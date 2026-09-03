import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contacto from "./Contacto";

function llenarFormulario() {
  fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Diego" } });
  fireEvent.change(screen.getByPlaceholderText("Tu correo"), {
    target: { value: "diego@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Tu teléfono"), { target: { value: "3312345678" } });
  fireEvent.change(screen.getByPlaceholderText("¿Qué necesitas rentar o comprar?"), {
    target: { value: "2 ventiladores de piso" },
  });
}

describe("Contacto", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra el WhatsApp, Instagram y Facebook (o sus placeholders)", () => {
    render(<Contacto />);
    expect(screen.getByText(/whatsapp:/i)).toBeInTheDocument();
    expect(screen.getByText(/instagram:/i)).toBeInTheDocument();
    expect(screen.getByText(/facebook:/i)).toBeInTheDocument();
  });

  it("abre WhatsApp con los datos del formulario al enviarlo", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<Contacto />);

    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Diego" } });
    fireEvent.change(screen.getByPlaceholderText("Tu teléfono"), { target: { value: "3312345678" } });
    fireEvent.change(screen.getByPlaceholderText("¿Qué necesitas rentar o comprar?"), {
      target: { value: "2 ventiladores de piso" },
    });
    fireEvent.click(screen.getByText("Enviar por WhatsApp"));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0];
    expect(decodeURIComponent(String(url))).toContain("Diego");
    expect(decodeURIComponent(String(url))).toContain("2 ventiladores de piso");
  });

  it("muestra una confirmación y limpia el formulario tras enviarlo", () => {
    vi.spyOn(window, "open").mockImplementation(() => ({}) as Window);
    render(<Contacto />);

    const inputNombre = screen.getByPlaceholderText("Tu nombre") as HTMLInputElement;
    const inputTelefono = screen.getByPlaceholderText("Tu teléfono") as HTMLInputElement;
    const textareaMensaje = screen.getByPlaceholderText(
      "¿Qué necesitas rentar o comprar?"
    ) as HTMLTextAreaElement;

    fireEvent.change(inputNombre, { target: { value: "Diego" } });
    fireEvent.change(inputTelefono, { target: { value: "3312345678" } });
    fireEvent.change(textareaMensaje, { target: { value: "2 ventiladores de piso" } });
    fireEvent.click(screen.getByText("Enviar por WhatsApp"));

    expect(screen.getByText(/te estamos redirigiendo a whatsapp/i)).toBeInTheDocument();
    expect(inputNombre.value).toBe("");
    expect(inputTelefono.value).toBe("");
    expect(textareaMensaje.value).toBe("");
  });

  it("si la ventana emergente es bloqueada, redirige en la misma pestaña", () => {
    vi.spyOn(window, "open").mockImplementation(() => null);
    const originalLocation = window.location;
    // @ts-expect-error - jsdom permite redefinir location para pruebas
    delete window.location;
    // @ts-expect-error - reemplazamos location con un objeto simple para poder inspeccionar `href`
    window.location = { ...originalLocation, href: "" };

    try {
      render(<Contacto />);

      fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Diego" } });
      fireEvent.change(screen.getByPlaceholderText("Tu teléfono"), {
        target: { value: "3312345678" },
      });
      fireEvent.change(screen.getByPlaceholderText("¿Qué necesitas rentar o comprar?"), {
        target: { value: "2 ventiladores de piso" },
      });
      fireEvent.click(screen.getByText("Enviar por WhatsApp"));

      expect(decodeURIComponent(window.location.href)).toContain("Diego");
    } finally {
      // @ts-expect-error - restauramos el location original de jsdom
      window.location = originalLocation;
    }
  });

  it("envía el correo con los datos del formulario al hacer click en Enviar por correo", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    render(<Contacto />);

    llenarFormulario();
    fireEvent.click(screen.getByText("Enviar por correo"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contacto",
        expect.objectContaining({ method: "POST" })
      );
    });
    const [, opciones] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const cuerpo = JSON.parse(String(opciones?.body));
    expect(cuerpo).toEqual({
      nombre: "Diego",
      correo: "diego@example.com",
      telefono: "3312345678",
      mensaje: "2 ventiladores de piso",
    });
  });

  it("muestra confirmación y limpia el formulario cuando el correo se envía bien", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    render(<Contacto />);

    llenarFormulario();
    fireEvent.click(screen.getByText("Enviar por correo"));

    expect(await screen.findByText(/¡correo enviado!/i)).toBeInTheDocument();
    expect((screen.getByPlaceholderText("Tu nombre") as HTMLInputElement).value).toBe("");
    expect((screen.getByPlaceholderText("Tu correo") as HTMLInputElement).value).toBe("");
  });

  it("muestra un mensaje de error si el envío del correo falla", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "RESEND_API_KEY no configurado." }),
    });
    render(<Contacto />);

    llenarFormulario();
    fireEvent.click(screen.getByText("Enviar por correo"));

    expect(await screen.findByRole("alert")).toHaveTextContent("RESEND_API_KEY no configurado.");
  });
});
