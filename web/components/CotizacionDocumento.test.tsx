import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CotizacionDocumento from "./CotizacionDocumento";
import type { ItemCarrito } from "@/lib/carrito-reducer";

const itemsRenta: ItemCarrito[] = [
  {
    productoId: "ventilador-piso",
    varianteId: "dm-110",
    nombreProducto: "Ventilador de piso",
    nombreVariante: "DM-110 (conexión a 110V)",
    tipo: "renta",
    precioUnitario: 941,
    cantidad: 2,
  },
  {
    productoId: "ventilador-giratorio",
    varianteId: "ay-920b",
    nombreProducto: "Ventilador giratorio",
    nombreVariante: "AY-920B",
    tipo: "renta",
    precioUnitario: 652,
    cantidad: 1,
  },
];

const itemsVenta: ItemCarrito[] = [
  {
    productoId: "ventilador-piso",
    varianteId: "dm-110",
    nombreProducto: "Ventilador de piso",
    nombreVariante: "DM-110 (conexión a 110V)",
    tipo: "venta",
    precioUnitario: 23520,
    cantidad: 2,
  },
  {
    productoId: "ventilador-giratorio",
    varianteId: "ay-920b",
    nombreProducto: "Ventilador giratorio",
    nombreVariante: "AY-920B",
    tipo: "venta",
    precioUnitario: 16310,
    cantidad: 1,
  },
];

describe("CotizacionDocumento (renta)", () => {
  it("muestra el título de renta, los datos del cliente, y los totales correctos", () => {
    render(
      <CotizacionDocumento
        tipo="renta"
        items={itemsRenta}
        cliente="Juan Pérez"
        atencion="María López"
        numero="SKY-20260902-0001"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("COTIZACIÓN DE RENTA")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("María López")).toBeInTheDocument();
    expect(screen.getByText("SKY-20260902-0001")).toBeInTheDocument();
    expect(screen.getByText("02/09/2026")).toBeInTheDocument();
    expect(screen.getByText("$2,534.00")).toBeInTheDocument();
    expect(screen.getByText("$405.44")).toBeInTheDocument();
    expect(screen.getByText("$2,939.44")).toBeInTheDocument();
  });

  it("muestra el paquete de 3 días con el descuento correcto", () => {
    render(
      <CotizacionDocumento
        tipo="renta"
        items={itemsRenta}
        cliente="Juan Pérez"
        atencion=""
        numero="SKY-20260902-0001"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("PAQUETE 3 DÍAS · 15% DE DESCUENTO")).toBeInTheDocument();
    expect(screen.getByText(/\$6,461\.70 sin IVA/)).toBeInTheDocument();
    expect(screen.getByText("$7,495.57")).toBeInTheDocument();
  });

  it("muestra las condiciones de renta y la nota de envío/instalación", () => {
    render(
      <CotizacionDocumento
        tipo="renta"
        items={itemsRenta}
        cliente="Juan Pérez"
        atencion=""
        numero="SKY-20260902-0001"
        fecha="02/09/2026"
      />
    );
    expect(
      screen.getByText("Renta: pago anticipado más depósito en garantía.")
    ).toBeInTheDocument();
    expect(screen.getByText(/La renta incluye envío, instalación en sitio/)).toBeInTheDocument();
  });

  it("muestra un guión cuando no hay atención especificada", () => {
    render(
      <CotizacionDocumento
        tipo="renta"
        items={itemsRenta}
        cliente="Juan Pérez"
        atencion=""
        numero="SKY-20260902-0001"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("CotizacionDocumento (venta)", () => {
  it("muestra el título de venta y los totales correctos, sin paquete de 3 días", () => {
    render(
      <CotizacionDocumento
        tipo="venta"
        items={itemsVenta}
        cliente="Ana Ruiz"
        atencion=""
        numero="SKY-20260902-0002"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("COTIZACIÓN DE VENTA")).toBeInTheDocument();
    expect(screen.getByText("$63,350.00")).toBeInTheDocument();
    expect(screen.getByText("$10,136.00")).toBeInTheDocument();
    expect(screen.getByText("$73,486.00")).toBeInTheDocument();
    expect(screen.queryByText(/PAQUETE 3 DÍAS/)).not.toBeInTheDocument();
  });

  it("muestra las condiciones de venta y la nota de envío GDL", () => {
    render(
      <CotizacionDocumento
        tipo="venta"
        items={itemsVenta}
        cliente="Ana Ruiz"
        atencion=""
        numero="SKY-20260902-0002"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("Venta: pago anticipado.")).toBeInTheDocument();
    expect(screen.getByText("Garantía de 3 años contra defectos de fábrica.")).toBeInTheDocument();
    expect(screen.getByText(/envío en zona metropolitana de Guadalajara/)).toBeInTheDocument();
  });

  it("emite la factura a nombre de SkyCool, no de una persona", () => {
    render(
      <CotizacionDocumento
        tipo="venta"
        items={itemsVenta}
        cliente="Ana Ruiz"
        atencion=""
        numero="SKY-20260902-0002"
        fecha="02/09/2026"
      />
    );
    expect(screen.getByText("SkyCool")).toBeInTheDocument();
  });
});
