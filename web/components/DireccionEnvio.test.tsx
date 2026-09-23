import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DireccionEnvio from "./DireccionEnvio";

function llenarFormulario() {
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

describe("DireccionEnvio", () => {
  it("llama a onConfirmar con los datos capturados al enviar el formulario", () => {
    const onConfirmar = vi.fn();
    render(
      <DireccionEnvio onConfirmar={onConfirmar} onCerrar={vi.fn()} cargando={false} error={null} />
    );

    llenarFormulario();
    fireEvent.click(screen.getByText("Continuar al pago"));

    expect(onConfirmar).toHaveBeenCalledWith({
      nombre: "Juan Pérez",
      telefono: "3312345678",
      calle: "Av. Vallarta",
      numeroExterior: "1234",
      numeroInterior: "",
      colonia: "Americana",
      ciudad: "Guadalajara",
      estado: "Jalisco",
      codigoPostal: "44160",
      referencias: "",
    });
  });

  it("incluye número interior y referencias cuando se llenan", () => {
    const onConfirmar = vi.fn();
    render(
      <DireccionEnvio onConfirmar={onConfirmar} onCerrar={vi.fn()} cargando={false} error={null} />
    );

    llenarFormulario();
    fireEvent.change(screen.getByLabelText(/No\. interior/), { target: { value: "5B" } });
    fireEvent.change(screen.getByLabelText(/Referencias/), {
      target: { value: "Portón negro" },
    });
    fireEvent.click(screen.getByText("Continuar al pago"));

    expect(onConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({ numeroInterior: "5B", referencias: "Portón negro" })
    );
  });

  it("llama a onCerrar al hacer click en cerrar o presionar Escape", () => {
    const onCerrar = vi.fn();
    render(
      <DireccionEnvio onConfirmar={vi.fn()} onCerrar={onCerrar} cargando={false} error={null} />
    );

    fireEvent.click(screen.getByLabelText("Cerrar dirección de envío"));
    expect(onCerrar).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCerrar).toHaveBeenCalledTimes(2);
  });

  it("muestra el mensaje de error cuando se pasa uno", () => {
    render(
      <DireccionEnvio
        onConfirmar={vi.fn()}
        onCerrar={vi.fn()}
        cargando={false}
        error="No se pudo iniciar el pago."
      />
    );
    expect(screen.getByText("No se pudo iniciar el pago.")).toBeInTheDocument();
  });

  it("deshabilita el botón de enviar mientras está cargando", () => {
    render(
      <DireccionEnvio onConfirmar={vi.fn()} onCerrar={vi.fn()} cargando={true} error={null} />
    );
    expect(screen.getByText("Conectando…")).toBeDisabled();
  });
});
