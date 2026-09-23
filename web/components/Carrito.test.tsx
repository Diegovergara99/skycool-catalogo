import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import Carrito from "./Carrito";
import { CarritoProvider, useCarrito } from "@/lib/carrito-context";

function Iniciador() {
  const { agregarProducto } = useCarrito();
  useEffect(() => {
    agregarProducto({
      productoId: "extractor-aire",
      varianteId: "ay-1220",
      nombreProducto: "Extractor de aire",
      nombreVariante: "AY-1220",
      tipo: "renta",
      precioUnitario: 1200,
      cantidad: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function renderCarritoConProducto() {
  return render(
    <CarritoProvider>
      <Iniciador />
      <Carrito />
    </CarritoProvider>
  );
}

function IniciadorVenta() {
  const { agregarProducto } = useCarrito();
  useEffect(() => {
    agregarProducto({
      productoId: "extractor-aire",
      varianteId: "ay-1220",
      nombreProducto: "Extractor de aire",
      nombreVariante: "AY-1220",
      tipo: "venta",
      precioUnitario: 17914,
      cantidad: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function renderCarritoConProductoVenta() {
  return render(
    <CarritoProvider>
      <IniciadorVenta />
      <Carrito />
    </CarritoProvider>
  );
}

describe("Carrito", () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra el producto agregado y su precio", () => {
    renderCarritoConProducto();
    expect(screen.getByText("Extractor de aire")).toBeInTheDocument();
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("muestra el importe con descuento y la etiqueta '3 días (-15%)' para una renta de 3 días", () => {
    function Iniciador3Dias() {
      const { agregarProducto } = useCarrito();
      useEffect(() => {
        agregarProducto({
          productoId: "extractor-aire",
          varianteId: "ay-1220",
          nombreProducto: "Extractor de aire",
          nombreVariante: "AY-1220",
          tipo: "renta",
          precioUnitario: 1200,
          cantidad: 1,
          dias: 3,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return null;
    }
    render(
      <CarritoProvider>
        <Iniciador3Dias />
        <Carrito />
      </CarritoProvider>
    );
    // $1,200 × 3 × 0.85 = $3,060
    expect(screen.getByText("$3,060")).toBeInTheDocument();
    expect(screen.getByText(/3 días \(-15%\)/)).toBeInTheDocument();
  });

  it("aumenta la cantidad al presionar +", () => {
    renderCarritoConProducto();
    fireEvent.click(screen.getByLabelText("Aumentar cantidad de Extractor de aire"));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("quita el producto y muestra el carrito vacío", () => {
    renderCarritoConProducto();
    fireEvent.click(screen.getByText("Quitar"));
    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
  });

  function llenarDireccionEnvio() {
    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono de contacto"), {
      target: { value: "3312345678" },
    });
    fireEvent.change(screen.getByLabelText("Calle"), { target: { value: "Av. Vallarta" } });
    fireEvent.change(screen.getByLabelText("No. exterior"), { target: { value: "1234" } });
    fireEvent.change(screen.getByLabelText("Colonia"), { target: { value: "Americana" } });
    fireEvent.change(screen.getByLabelText("Ciudad"), { target: { value: "Guadalajara" } });
    fireEvent.change(screen.getByLabelText("Estado"), { target: { value: "Jalisco" } });
    fireEvent.change(screen.getByLabelText("Código postal"), { target: { value: "44160" } });
  }

  it("abre el formulario de dirección de envío al hacer clic en 'Pagar en línea'", () => {
    renderCarritoConProductoVenta();
    fireEvent.click(screen.getByText("Pagar en línea"));
    expect(screen.getByText("¿A dónde enviamos tu pedido?")).toBeInTheDocument();
  });

  it("muestra un error si Mercado Pago falla", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "MP_ACCESS_TOKEN no configurado." }),
    });
    renderCarritoConProductoVenta();
    fireEvent.click(screen.getByText("Pagar en línea"));
    llenarDireccionEnvio();
    fireEvent.click(screen.getByText("Continuar al pago"));
    await waitFor(() =>
      expect(screen.getByText("MP_ACCESS_TOKEN no configurado.")).toBeInTheDocument()
    );
  });

  it("envía la dirección capturada al confirmar el formulario de envío", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ initPoint: "https://mp.example/checkout/abc" }),
    });
    renderCarritoConProductoVenta();
    fireEvent.click(screen.getByText("Pagar en línea"));
    llenarDireccionEnvio();
    fireEvent.click(screen.getByText("Continuar al pago"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const [, opciones] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const cuerpo = JSON.parse((opciones as RequestInit).body as string);
    expect(cuerpo.direccion).toMatchObject({
      nombre: "Juan Pérez",
      calle: "Av. Vallarta",
      ciudad: "Guadalajara",
    });
  });

  it("muestra 'Pagar en línea' y no pide ciudad cuando el carrito es solo de venta", () => {
    renderCarritoConProductoVenta();
    expect(screen.getByText("Pagar en línea")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tu ciudad")).not.toBeInTheDocument();
  });

  it("no muestra 'Pagar en línea' y pide elegir ciudad cuando el carrito tiene un item de renta", () => {
    renderCarritoConProducto();
    expect(screen.queryByText("Pagar en línea")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Tu ciudad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Selecciona tu ciudad" })).toBeDisabled();
  });

  it("muestra 'Confirmar disponibilidad' con link de WhatsApp a la ciudad si tiene sucursal", () => {
    renderCarritoConProducto();
    fireEvent.change(screen.getByLabelText("Tu ciudad"), { target: { value: "Guadalajara" } });
    const boton = screen.getByText("Confirmar disponibilidad");
    expect(boton).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
    expect(decodeURIComponent(boton.getAttribute("href")!)).toContain("Guadalajara");
    expect(screen.queryByText("Pagar en línea")).not.toBeInTheDocument();
  });

  it("muestra advertencia y 'Preguntar por WhatsApp' si la ciudad no tiene sucursal SkyCool", () => {
    renderCarritoConProducto();
    fireEvent.change(screen.getByLabelText("Tu ciudad"), { target: { value: "Otra ciudad" } });
    expect(
      screen.getByText(/no tenemos servicio de renta en tu ciudad/i)
    ).toBeInTheDocument();
    const boton = screen.getByText("Preguntar por WhatsApp");
    expect(boton).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
    expect(decodeURIComponent(boton.getAttribute("href")!)).toContain("Otra ciudad");
  });

  it("no navega al hacer clic en el link de WhatsApp cuando el carrito está vacío", () => {
    renderCarritoConProducto();
    // Vacía el carrito para que el enlace quede deshabilitado.
    fireEvent.click(screen.getByText("Quitar"));
    const link = screen.getByText("Cotizar por WhatsApp");
    expect(link).not.toHaveAttribute("href");
    const evento = fireEvent.click(link);
    // fireEvent.click devuelve `false` cuando preventDefault() fue llamado.
    expect(evento).toBe(false);
  });

  it("cierra el carrito al presionar Escape", () => {
    renderCarritoConProducto();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mueve el foco al botón de cerrar cuando el carrito se abre", () => {
    renderCarritoConProducto();
    expect(screen.getByLabelText("Cerrar carrito")).toHaveFocus();
  });

  it("abre el flujo de cotización al hacer click en Cotización PDF", () => {
    renderCarritoConProducto();
    fireEvent.click(screen.getByText("Cotización PDF"));
    expect(screen.getByText("Datos para tu cotización")).toBeInTheDocument();
  });

  it("no cierra el carrito al presionar Escape mientras la cotización está abierta", () => {
    renderCarritoConProducto();
    fireEvent.click(screen.getByText("Cotización PDF"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("Datos para tu cotización")).not.toBeInTheDocument();
    expect(screen.getByText("Tu carrito")).toBeInTheDocument();
  });
});
