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

  it("muestra un error si Mercado Pago falla", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "MP_ACCESS_TOKEN no configurado." }),
    });
    renderCarritoConProducto();
    fireEvent.click(screen.getByText("Pagar en línea"));
    await waitFor(() =>
      expect(screen.getByText("MP_ACCESS_TOKEN no configurado.")).toBeInTheDocument()
    );
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
