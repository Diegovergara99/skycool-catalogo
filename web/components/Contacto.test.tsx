import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "./Contacto";

describe("Contacto", () => {
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
});
