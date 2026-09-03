# Cotizaciones Descargables (Renta / Venta) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Generar cotización" flow to the existing cart, producing a print/PDF-ready formal quotation document (SkyCool-branded, matching the user's real templates) for renta and/or venta items, with verified IVA/3-day-package math.

**Architecture:** Pure calculation functions in `lib/cotizacion.ts` (subtotal/IVA/3-day package/date+number formatting), a presentational `CotizacionDocumento` component per document (renta or venta), and a `Cotizacion` orchestrator component (client-info form → preview → `window.print()`) wired into the existing `Carrito.tsx` via a new button. Printing isolates the document with a global `@media print` rule (visibility-based, ID-targeted) so only the quotation prints, not the rest of the page.

**Tech Stack:** Next.js App Router + TypeScript + Tailwind (existing stack, no new dependencies — PDF output uses the browser's native print-to-PDF, not a PDF library).

**Spec:** `docs/superpowers/specs/2026-09-02-cotizacion-pdf-design.md`

---

## Working directory

All commands run from `/Users/vergara/skycool-catalogo/web` unless noted. Git commands run from `/Users/vergara/skycool-catalogo` (the repo root), with `web/` path prefixes.

---

### Task 1: Currency-with-cents formatter and quotation math (`lib/cotizacion.ts`)

**Files:**
- Modify: `web/lib/formatMoneda.ts`
- Modify: `web/lib/formatMoneda.test.ts`
- Create: `web/lib/cotizacion.ts`
- Test: `web/lib/cotizacion.test.ts`

- [ ] **Step 1: Write the failing test for the new formatter — append to `web/lib/formatMoneda.test.ts`**

Add this `describe` block to the existing file (keep the existing `formatMoneda` tests untouched):

```ts
describe("formatMonedaConCentavos", () => {
  it("formatea con dos decimales, como en los documentos de cotización", () => {
    expect(formatMonedaConCentavos(941)).toBe("$941.00");
    expect(formatMonedaConCentavos(1091.56)).toBe("$1,091.56");
    expect(formatMonedaConCentavos(6461.7)).toBe("$6,461.70");
  });
});
```

Add `formatMonedaConCentavos` to the existing `import { formatMoneda } from "./formatMoneda";` line at the top of the test file, so it reads:

```ts
import { formatMoneda, formatMonedaConCentavos } from "./formatMoneda";
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- formatMoneda.test.ts
```

Expected: FAIL — `formatMonedaConCentavos` is not exported yet.

- [ ] **Step 3: Add `formatMonedaConCentavos` to `web/lib/formatMoneda.ts`**

Append this function after the existing `formatMoneda` function (keep `formatMoneda` exactly as-is):

```ts
export function formatMonedaConCentavos(valor: number): string {
  return valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- formatMoneda.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write the failing test — `web/lib/cotizacion.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import {
  calcularTotales,
  calcularPaquete3Dias,
  separarPorTipo,
  generarNumeroCotizacion,
  formatearFechaCotizacion,
} from "./cotizacion";
import type { ItemCarrito } from "./carrito-reducer";

const itemPisoRenta: ItemCarrito = {
  productoId: "ventilador-piso",
  varianteId: "dm-110",
  nombreProducto: "Ventilador de piso",
  nombreVariante: "DM-110 (conexión a 110V)",
  tipo: "renta",
  precioUnitario: 941,
  cantidad: 2,
};

const itemGiratorioRenta: ItemCarrito = {
  productoId: "ventilador-giratorio",
  varianteId: "ay-920b",
  nombreProducto: "Ventilador giratorio",
  nombreVariante: "AY-920B",
  tipo: "renta",
  precioUnitario: 652,
  cantidad: 1,
};

describe("calcularTotales", () => {
  it("calcula subtotal, IVA y total con IVA para renta (caso real verificado contra la plantilla)", () => {
    const totales = calcularTotales([itemPisoRenta, itemGiratorioRenta]);
    expect(totales.subtotal).toBe(2534);
    expect(totales.iva).toBeCloseTo(405.44, 2);
    expect(totales.totalConIva).toBeCloseTo(2939.44, 2);
  });

  it("calcula subtotal, IVA y total con IVA para venta (caso real verificado contra la plantilla)", () => {
    const itemPisoVenta: ItemCarrito = { ...itemPisoRenta, tipo: "venta", precioUnitario: 23520 };
    const itemGiratorioVenta: ItemCarrito = {
      ...itemGiratorioRenta,
      tipo: "venta",
      precioUnitario: 16310,
    };
    const totales = calcularTotales([itemPisoVenta, itemGiratorioVenta]);
    expect(totales.subtotal).toBe(63350);
    expect(totales.iva).toBeCloseTo(10136, 2);
    expect(totales.totalConIva).toBeCloseTo(73486, 2);
  });

  it("devuelve ceros para un arreglo vacío", () => {
    expect(calcularTotales([])).toEqual({ subtotal: 0, iva: 0, totalConIva: 0 });
  });
});

describe("calcularPaquete3Dias", () => {
  it("aplica 3 días con 15% de descuento (caso real verificado contra la plantilla)", () => {
    const paquete = calcularPaquete3Dias(2534);
    expect(paquete.sinIva).toBeCloseTo(6461.7, 2);
    expect(paquete.conIva).toBeCloseTo(7495.57, 2);
  });
});

describe("separarPorTipo", () => {
  it("separa los items de renta y de venta en dos listas", () => {
    const itemVenta: ItemCarrito = { ...itemPisoRenta, tipo: "venta", precioUnitario: 23520 };
    const { renta, venta } = separarPorTipo([itemPisoRenta, itemVenta, itemGiratorioRenta]);
    expect(renta).toEqual([itemPisoRenta, itemGiratorioRenta]);
    expect(venta).toEqual([itemVenta]);
  });

  it("devuelve listas vacías si no hay items de ese tipo", () => {
    const { renta, venta } = separarPorTipo([itemPisoRenta]);
    expect(renta).toHaveLength(1);
    expect(venta).toHaveLength(0);
  });
});

describe("generarNumeroCotizacion", () => {
  it("tiene el formato SKY-AAAAMMDD-#### con la fecha dada", () => {
    const numero = generarNumeroCotizacion(new Date(2026, 8, 2));
    expect(numero).toMatch(/^SKY-20260902-\d{4}$/);
  });
});

describe("formatearFechaCotizacion", () => {
  it("formatea la fecha como DD/MM/AAAA", () => {
    expect(formatearFechaCotizacion(new Date(2026, 8, 2))).toBe("02/09/2026");
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- cotizacion.test.ts
```

Expected: FAIL — `cotizacion.ts` doesn't exist yet.

- [ ] **Step 7: Create `web/lib/cotizacion.ts`**

```ts
import type { ItemCarrito } from "./carrito-reducer";

const TASA_IVA = 0.16;
const DESCUENTO_PAQUETE_3_DIAS = 0.15;

export interface TotalesCotizacion {
  subtotal: number;
  iva: number;
  totalConIva: number;
}

export function calcularTotales(items: ItemCarrito[]): TotalesCotizacion {
  const subtotal = items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  const iva = subtotal * TASA_IVA;
  return { subtotal, iva, totalConIva: subtotal + iva };
}

export interface PaqueteTresDias {
  sinIva: number;
  conIva: number;
}

export function calcularPaquete3Dias(subtotalPorDia: number): PaqueteTresDias {
  const sinIva = subtotalPorDia * 3 * (1 - DESCUENTO_PAQUETE_3_DIAS);
  return { sinIva, conIva: sinIva * (1 + TASA_IVA) };
}

export function separarPorTipo(items: ItemCarrito[]): {
  renta: ItemCarrito[];
  venta: ItemCarrito[];
} {
  return {
    renta: items.filter((item) => item.tipo === "renta"),
    venta: items.filter((item) => item.tipo === "venta"),
  };
}

export function generarNumeroCotizacion(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const sufijo = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `SKY-${yyyy}${mm}${dd}-${sufijo}`;
}

export function formatearFechaCotizacion(fecha: Date): string {
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- cotizacion.test.ts
```

Expected: PASS (9 tests).

- [ ] **Step 9: Commit**

```bash
cd /Users/vergara/skycool-catalogo
git add web/lib/formatMoneda.ts web/lib/formatMoneda.test.ts web/lib/cotizacion.ts web/lib/cotizacion.test.ts
git commit -m "feat: add quotation math (IVA, 3-day package) and 2-decimal currency formatter"
```

## Context for this task

The 3-day-package formula was reverse-verified against the user's real PDF template numbers, not guessed: `2 × $941 + 1 × $652 = $2,534` per day; the template shows the 3-day package at `$6,461.70` sin IVA, which equals `$2,534 × 3 × 0.85` exactly — i.e., 15% off the naive 3-day price, not 15% of something else. Don't "simplify" this formula.

---

### Task 2: `CotizacionDocumento` component (the printable document itself)

**Files:**
- Create: `web/components/CotizacionDocumento.tsx`
- Test: `web/components/CotizacionDocumento.test.tsx`

- [ ] **Step 1: Write the failing test — `web/components/CotizacionDocumento.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- CotizacionDocumento.test.tsx
```

Expected: FAIL — `CotizacionDocumento.tsx` doesn't exist yet.

- [ ] **Step 3: Create `web/components/CotizacionDocumento.tsx`**

```tsx
import type { ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { calcularTotales, calcularPaquete3Dias } from "@/lib/cotizacion";
import { formatMonedaConCentavos } from "@/lib/formatMoneda";

interface CotizacionDocumentoProps {
  tipo: TipoOperacion;
  items: ItemCarrito[];
  cliente: string;
  atencion: string;
  numero: string;
  fecha: string;
}

const CONDICIONES_RENTA = [
  "Renta: pago anticipado más depósito en garantía.",
  "Equipo sujeto a disponibilidad al confirmar el pedido.",
  "El cliente responde por daño o pérdida del equipo a valor de reposición.",
  "Esta cotización no constituye reservación de equipo hasta recibir el anticipo.",
];

const CONDICIONES_VENTA = [
  "Venta: pago anticipado.",
  "Garantía de 3 años contra defectos de fábrica.",
  "Equipo sujeto a disponibilidad al confirmar el pedido.",
  "Esta cotización no constituye reservación de equipo hasta recibir el anticipo.",
];

export default function CotizacionDocumento({
  tipo,
  items,
  cliente,
  atencion,
  numero,
  fecha,
}: CotizacionDocumentoProps) {
  const totales = calcularTotales(items);
  const paquete3Dias = tipo === "renta" ? calcularPaquete3Dias(totales.subtotal) : null;
  const condiciones = tipo === "renta" ? CONDICIONES_RENTA : CONDICIONES_VENTA;
  const tituloSeccion = tipo === "renta" ? "RENTA DE EQUIPO" : "VENTA DE EQUIPO";
  const columnaPrecio = tipo === "renta" ? "RENTA DÍA" : "P. UNITARIO";
  const columnaImporte = tipo === "renta" ? "IMPORTE DÍA" : "IMPORTE";
  const etiquetaTotal = tipo === "renta" ? "TOTAL POR DÍA" : "TOTAL";

  return (
    <div className="mb-8 break-after-page bg-white text-[var(--color-navy)] last:break-after-auto print:mb-0">
      <div className="bg-[var(--color-navy)] p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-wide">SKY COOL</h1>
            <p className="mt-1 text-xs tracking-widest text-[var(--color-teal)]">
              VENTILACIÓN Y ENFRIAMIENTO INDUSTRIAL
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-heading text-lg font-bold">
              {tipo === "renta" ? "COTIZACIÓN DE RENTA" : "COTIZACIÓN DE VENTA"}
            </p>
            <p className="mt-1">
              Tel / WhatsApp <span className="font-semibold">33 1970 4476</span>
            </p>
            <p>skycool@gmail.com</p>
            <p>Vigencia: 15 días naturales</p>
          </div>
        </div>
      </div>
      <div className="h-1 bg-[var(--color-teal)]" />

      <div className="grid grid-cols-4 gap-4 border-b border-slate-200 p-6 text-xs">
        <div>
          <p className="font-semibold uppercase text-slate-500">Cotización No.</p>
          <p className="mt-2 border-t border-slate-300 pt-1">{numero}</p>
        </div>
        <div>
          <p className="font-semibold uppercase text-slate-500">Fecha</p>
          <p className="mt-2 border-t border-slate-300 pt-1">{fecha}</p>
        </div>
        <div>
          <p className="font-semibold uppercase text-slate-500">Cliente</p>
          <p className="mt-2 border-t border-slate-300 pt-1">{cliente}</p>
        </div>
        <div>
          <p className="font-semibold uppercase text-slate-500">Atención</p>
          <p className="mt-2 border-t border-slate-300 pt-1">{atencion || "—"}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="rounded bg-[var(--color-navy)] px-2 py-1 text-xs font-bold text-white">
            01
          </span>
          <h2 className="font-heading text-xl font-bold">{tituloSeccion}</h2>
        </div>

        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-navy)] text-left text-xs text-white">
              <th className="p-2">Cant.</th>
              <th className="p-2">Descripción</th>
              <th className="p-2 text-right">{columnaPrecio} S/IVA</th>
              <th className="p-2 text-right">{columnaPrecio} + IVA</th>
              <th className="p-2 text-right">{columnaImporte} S/IVA</th>
              <th className="p-2 text-right">{columnaImporte} + IVA</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const importeSinIva = item.precioUnitario * item.cantidad;
              return (
                <tr
                  key={`${item.productoId}__${item.varianteId}`}
                  className="border-b border-slate-100"
                >
                  <td className="p-2">{item.cantidad}</td>
                  <td className="p-2">
                    {item.nombreProducto} — {item.nombreVariante}
                  </td>
                  <td className="p-2 text-right">{formatMonedaConCentavos(item.precioUnitario)}</td>
                  <td className="p-2 text-right font-semibold text-[var(--color-teal-dark)]">
                    {formatMonedaConCentavos(item.precioUnitario * 1.16)}
                  </td>
                  <td className="p-2 text-right">{formatMonedaConCentavos(importeSinIva)}</td>
                  <td className="p-2 text-right font-semibold text-[var(--color-teal-dark)]">
                    {formatMonedaConCentavos(importeSinIva * 1.16)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="ml-auto mt-4 w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{etiquetaTotal} SIN IVA</span>
            <span>{formatMonedaConCentavos(totales.subtotal)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-300 pb-1">
            <span className="text-slate-500">IVA 16%</span>
            <span>{formatMonedaConCentavos(totales.iva)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>{etiquetaTotal} CON IVA</span>
            <span className="text-[var(--color-teal-dark)]">
              {formatMonedaConCentavos(totales.totalConIva)}
            </span>
          </div>
        </div>

        {paquete3Dias && (
          <div className="mt-6 flex items-center justify-between border-l-4 border-[var(--color-teal)] bg-slate-50 p-4">
            <p className="font-heading font-bold">PAQUETE 3 DÍAS · 15% DE DESCUENTO</p>
            <p>
              {formatMonedaConCentavos(paquete3Dias.sinIva)} sin IVA /{" "}
              <span className="font-bold text-[var(--color-teal-dark)]">
                {formatMonedaConCentavos(paquete3Dias.conIva)}
              </span>{" "}
              con IVA
            </p>
          </div>
        )}

        <p className="mt-4 border-l-2 border-[var(--color-teal)] pl-3 text-xs text-slate-600">
          {tipo === "renta"
            ? "La renta incluye envío, instalación en sitio y recolección al término del periodo."
            : "El precio de venta incluye envío en zona metropolitana de Guadalajara. Envío foráneo se cotiza por separado. No incluye instalación."}
        </p>

        <div className="mt-4 rounded-md border border-slate-200 p-4 text-xs text-slate-600">
          <span className="mr-2 inline-block rounded bg-[var(--color-teal)] px-2 py-1 font-bold text-[var(--color-navy)]">
            FACTURACIÓN
          </span>
          Todos los precios están expresados en pesos mexicanos. La columna &quot;sin IVA&quot;
          aplica para operaciones sin comprobante fiscal. Si requiere factura, aplica la columna
          &quot;con IVA&quot; (16% adicional). La factura se emite a nombre de{" "}
          <strong>SkyCool</strong>.
        </div>

        <div className="mt-4">
          <p className="font-heading text-sm font-bold uppercase">Condiciones</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {condiciones.map((condicion) => (
              <li key={condicion}>{condicion}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 text-xs">
          <div>
            <div className="border-t border-slate-400 pt-1">Firma de aceptación del cliente</div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border-t border-slate-300 pt-1">Nombre</div>
              <div className="border-t border-slate-300 pt-1">Fecha</div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold">SKY COOL</p>
            <p className="text-slate-500">Ventilación y enfriamiento industrial</p>
            <p className="text-slate-500">Tel / WhatsApp 33 1970 4476</p>
            <p className="text-slate-500">skycool@gmail.com</p>
            <p className="text-slate-500">Guadalajara, Jalisco</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- CotizacionDocumento.test.tsx
```

Expected: PASS (7 tests). If any specific text assertion fails due to a duplicate-match ambiguity (two elements with the same exact text), adjust that ONE assertion to scope more precisely (e.g., query within a more specific container) — don't change the component's visible copy to work around it.

- [ ] **Step 5: Commit**

```bash
cd /Users/vergara/skycool-catalogo
git add web/components/CotizacionDocumento.tsx web/components/CotizacionDocumento.test.tsx
git commit -m "feat: add printable quotation document component (renta/venta)"
```

## Context for this task

This component is purely presentational (no `"use client"` needed — no hooks, no event handlers, no browser-only APIs) and receives everything as props from `Cotizacion` (Task 3). The `last:break-after-auto` / `break-after-page` classes matter for Task 4: when two documents render back-to-back (mixed cart), each should print on its own page except the last one (no trailing blank page).

---

### Task 3: `Cotizacion` orchestrator (client-info form → preview → print)

**Files:**
- Create: `web/components/Cotizacion.tsx`
- Test: `web/components/Cotizacion.test.tsx`

- [ ] **Step 1: Write the failing test — `web/components/Cotizacion.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Cotizacion from "./Cotizacion";
import type { ItemCarrito } from "@/lib/carrito-reducer";

const itemRenta: ItemCarrito = {
  productoId: "ventilador-piso",
  varianteId: "dm-110",
  nombreProducto: "Ventilador de piso",
  nombreVariante: "DM-110 (conexión a 110V)",
  tipo: "renta",
  precioUnitario: 941,
  cantidad: 1,
};

const itemVenta: ItemCarrito = {
  productoId: "extractor-aire",
  varianteId: "ay-1220",
  nombreProducto: "Extractor de aire",
  nombreVariante: "AY-1220",
  tipo: "venta",
  precioUnitario: 17914,
  cantidad: 1,
};

function llenarYEnviarForm(nombre: string) {
  fireEvent.change(screen.getByPlaceholderText("Nombre o empresa"), {
    target: { value: nombre },
  });
  fireEvent.click(screen.getByText("Generar cotización"));
}

describe("Cotizacion", () => {
  it("pide el nombre del cliente antes de mostrar el documento", () => {
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    expect(screen.getByText("Datos para tu cotización")).toBeInTheDocument();
    expect(screen.queryByText("COTIZACIÓN DE RENTA")).not.toBeInTheDocument();
  });

  it("muestra el documento de renta después de llenar el formulario", () => {
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.getByText("COTIZACIÓN DE RENTA")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("genera los dos documentos si el carrito mezcla renta y venta", () => {
    render(<Cotizacion items={[itemRenta, itemVenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.getByText("COTIZACIÓN DE RENTA")).toBeInTheDocument();
    expect(screen.getByText("COTIZACIÓN DE VENTA")).toBeInTheDocument();
  });

  it("solo genera el documento de venta si todos los items son de venta", () => {
    render(<Cotizacion items={[itemVenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    expect(screen.queryByText("COTIZACIÓN DE RENTA")).not.toBeInTheDocument();
    expect(screen.getByText("COTIZACIÓN DE VENTA")).toBeInTheDocument();
  });

  it("llama a window.print al hacer click en Descargar / Imprimir PDF", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<Cotizacion items={[itemRenta]} onCerrar={vi.fn()} />);
    llenarYEnviarForm("Juan Pérez");
    fireEvent.click(screen.getByText("Descargar / Imprimir PDF"));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("llama a onCerrar al hacer click en cerrar", () => {
    const onCerrar = vi.fn();
    render(<Cotizacion items={[itemRenta]} onCerrar={onCerrar} />);
    fireEvent.click(screen.getByLabelText("Cerrar"));
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- Cotizacion.test.tsx
```

Expected: FAIL — `Cotizacion.tsx` doesn't exist yet. (Vitest may also fail to resolve `CotizacionDocumento` imports transitively if Task 2 wasn't completed first — it should already exist by this point in the plan.)

- [ ] **Step 3: Create `web/components/Cotizacion.tsx`**

```tsx
"use client";

import { type FormEvent, useState } from "react";
import type { ItemCarrito } from "@/lib/carrito-reducer";
import {
  separarPorTipo,
  generarNumeroCotizacion,
  formatearFechaCotizacion,
} from "@/lib/cotizacion";
import CotizacionDocumento from "./CotizacionDocumento";

interface CotizacionProps {
  items: ItemCarrito[];
  onCerrar: () => void;
}

interface DatosDocumento {
  numero: string;
  fecha: string;
}

export default function Cotizacion({ items, onCerrar }: CotizacionProps) {
  const [cliente, setCliente] = useState("");
  const [atencion, setAtencion] = useState("");
  const [datosDocumento, setDatosDocumento] = useState<DatosDocumento | null>(null);

  function enviarForm(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setDatosDocumento({
      numero: generarNumeroCotizacion(new Date()),
      fecha: formatearFechaCotizacion(new Date()),
    });
  }

  const { renta, venta } = separarPorTipo(items);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 print:static print:bg-transparent print:p-0">
      {!datosDocumento ? (
        <div className="w-full max-w-md rounded-lg bg-white p-6 print:hidden">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[var(--color-navy)]">
              Datos para tu cotización
            </h2>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="text-2xl text-slate-400"
            >
              ×
            </button>
          </div>
          <form onSubmit={enviarForm} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Nombre del cliente
              <input
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre o empresa"
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Atención a (opcional)
              <input
                value={atencion}
                onChange={(e) => setAtencion(e.target.value)}
                placeholder="Nombre de contacto"
                className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)]"
            >
              Generar cotización
            </button>
          </form>
        </div>
      ) : (
        <div
          id="cotizacion-imprimible"
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-4 print:max-h-none print:overflow-visible print:rounded-none print:p-0"
        >
          <div className="mb-4 flex items-center justify-between print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-teal-dark)]"
            >
              Descargar / Imprimir PDF
            </button>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="text-2xl text-slate-400"
            >
              ×
            </button>
          </div>

          {renta.length > 0 && (
            <CotizacionDocumento
              tipo="renta"
              items={renta}
              cliente={cliente}
              atencion={atencion}
              numero={datosDocumento.numero}
              fecha={datosDocumento.fecha}
            />
          )}
          {venta.length > 0 && (
            <CotizacionDocumento
              tipo="venta"
              items={venta}
              cliente={cliente}
              atencion={atencion}
              numero={datosDocumento.numero}
              fecha={datosDocumento.fecha}
            />
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- Cotizacion.test.tsx
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/vergara/skycool-catalogo
git add web/components/Cotizacion.tsx web/components/Cotizacion.test.tsx
git commit -m "feat: add quotation form + preview + print flow"
```

## Context for this task

`numero`/`fecha` are generated ONCE, at form-submit time, and stored in state (`datosDocumento`) — not recomputed on every render. Computing them directly in the render body would call `generarNumeroCotizacion(new Date())` again on any re-render of this component while the preview is showing, silently changing the displayed quote number, which is wrong. Keep this exactly as written.

---

### Task 4: Wire the button into `Carrito.tsx` + print isolation CSS

**Files:**
- Modify: `web/components/Carrito.tsx`
- Modify: `web/components/Carrito.test.tsx`
- Modify: `web/app/globals.css`

- [ ] **Step 1: Write the failing test — add to `web/components/Carrito.test.tsx`**

Add this test to the existing `describe("Carrito", ...)` block (don't remove any existing tests):

```tsx
it("abre el flujo de cotización al hacer click en Generar cotización", () => {
  renderCarritoConProducto();
  fireEvent.click(screen.getByText("Generar cotización"));
  expect(screen.getByText("Datos para tu cotización")).toBeInTheDocument();
});
```

(This reuses the existing `renderCarritoConProducto()` helper already defined at the top of the file — don't duplicate it.)

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- Carrito.test.tsx
```

Expected: FAIL — no "Generar cotización" button exists yet.

- [ ] **Step 3: Modify `web/components/Carrito.tsx`**

Change the import line from:
```tsx
import { useEffect, useRef } from "react";
```
to:
```tsx
import { useEffect, useRef, useState } from "react";
```

Add a new import right after the existing `import { formatMoneda } from "@/lib/formatMoneda";` line:
```tsx
import Cotizacion from "./Cotizacion";
```

Inside the `Carrito` component, right after the line `const cerrarBotonRef = useRef<HTMLButtonElement>(null);`, add:
```tsx
const [cotizacionAbierta, setCotizacionAbierta] = useState(false);
```

Replace the final part of the component — from the `return (` that starts the JSX through the end of the file — with:

```tsx
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/40"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <div className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-[var(--color-navy)]">Tu carrito</h2>
            <button
              ref={cerrarBotonRef}
              type="button"
              onClick={cerrarCarrito}
              aria-label="Cerrar carrito"
              className="text-2xl text-slate-400"
            >
              ×
            </button>
          </div>

          <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
            {carritoVacio && (
              <p className="text-sm text-slate-500">
                Tu carrito está vacío. Agrega productos del catálogo.
              </p>
            )}

            {items.map((item) => {
              const clave = claveItem(item);
              return (
                <div
                  key={clave}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-[var(--color-navy)]">{item.nombreProducto}</p>
                    <p className="text-xs text-slate-500">
                      {item.nombreVariante} · {item.tipo === "renta" ? "Renta/día" : "Venta"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(clave, item.cantidad - 1)}
                        className="h-6 w-6 rounded border border-slate-300 text-sm"
                        aria-label={`Disminuir cantidad de ${item.nombreProducto}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => actualizarCantidad(clave, item.cantidad + 1)}
                        className="h-6 w-6 rounded border border-slate-300 text-sm"
                        aria-label={`Aumentar cantidad de ${item.nombreProducto}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--color-navy)]">
                      {formatMoneda(item.precioUnitario * item.cantidad)}
                    </p>
                    <button
                      type="button"
                      onClick={() => quitarProducto(clave)}
                      className="mt-2 text-xs text-red-500 underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-lg font-bold text-[var(--color-navy)]">
              Subtotal: {formatMoneda(subtotal)}{" "}
              <span className="text-sm font-normal text-slate-400">+ IVA</span>
            </p>

            {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

            <a
              href={carritoVacio ? undefined : linkWhatsapp}
              onClick={(e) => {
                if (carritoVacio) e.preventDefault();
              }}
              target="_blank"
              rel="noreferrer"
              aria-disabled={carritoVacio}
              className={`mt-4 block rounded-md py-3 text-center font-semibold text-white ${
                carritoVacio ? "pointer-events-none bg-slate-300" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Cotizar por WhatsApp
            </a>

            <button
              type="button"
              disabled={carritoVacio}
              onClick={() => setCotizacionAbierta(true)}
              className="mt-3 w-full rounded-md border border-[var(--color-navy)] py-3 font-semibold text-[var(--color-navy)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Generar cotización
            </button>

            <button
              type="button"
              disabled={carritoVacio || cargando}
              onClick={() => pagar(items)}
              className="mt-3 w-full rounded-md bg-[var(--color-teal)] py-3 font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-teal-dark)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {cargando ? "Conectando con Mercado Pago…" : "Pagar en línea"}
            </button>
          </div>
        </div>
      </div>

      {cotizacionAbierta && (
        <Cotizacion items={items} onCerrar={() => setCotizacionAbierta(false)} />
      )}
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- Carrito.test.tsx
```

Expected: PASS (8 tests — 7 existing + 1 new).

- [ ] **Step 5: Add the print-isolation rule — append to `web/app/globals.css`**

```css
@media print {
  body * {
    visibility: hidden;
  }
  #cotizacion-imprimible,
  #cotizacion-imprimible * {
    visibility: visible;
  }
  #cotizacion-imprimible {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
```

- [ ] **Step 6: Run the full test suite and build**

```bash
npm test
npm run build
```

Expected: all tests PASS, build succeeds.

- [ ] **Step 7: Commit**

```bash
cd /Users/vergara/skycool-catalogo
git add web/components/Carrito.tsx web/components/Carrito.test.tsx web/app/globals.css
git commit -m "feat: wire quotation flow into cart, isolate print output to the document only"
```

## Context for this task

The print CSS uses the classic "hide everything, then un-hide only the target by ID, then reposition it to the page origin" technique (`visibility` toggling, not `display`, so layout doesn't collapse mid-toggle) rather than sprinkling Tailwind `print:hidden` on every sibling component (`Header`, `Hero`, `Catalogo`, etc.) individually — it's one small global rule instead of touching a dozen unrelated files, and it works regardless of how deeply `#cotizacion-imprimible` is nested in the DOM.

---

### Task 5: Manual verification

This task has no code changes (unless a real bug is found — if so, fix it, re-run the relevant test file, and commit the fix separately).

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Walk through the golden path**

- Add at least one renta-capable product (e.g., Ventilador de piso) and confirm its rental price matches the real numbers now in `lib/productos.ts`.
- Open the cart, click "Generar cotización" — confirm the form asks for client name (required) and "Atención a" (optional, can submit blank).
- Submit — confirm a document appears styled like the SkyCool template: navy header with "COTIZACIÓN DE RENTA", teal accent bar, cotización no./fecha/cliente/atención row, product table with all 4 price columns (S/IVA and +IVA for both unit price and importe), totals block, the "PAQUETE 3 DÍAS · 15% DE DESCUENTO" box, the renta note, the facturación box (confirm it says **SkyCool**, not a personal name), condiciones list, signature line, footer.
- Click "Descargar / Imprimir PDF" — confirm the browser's print dialog opens showing ONLY the quotation document (no header, no cart chrome, no page background) — save as PDF and open it to confirm it looks clean.
- Close the quotation, empty the cart, add only a venta-only product (e.g., Extractor de aire, which has no renta option), add it to cart with "Venta" (the only option), generate a cotización — confirm it shows "COTIZACIÓN DE VENTA", correct venta condiciones, correct envío note, and NO paquete-3-días box.
- Add both a renta item and a venta item to the cart together, generate a cotización — confirm TWO documents appear (one renta, one venta), and that printing produces two separate pages (check via the print preview's page count).
- Confirm the "Generar cotización" button is disabled when the cart is empty, matching the other two cart action buttons.

- [ ] **Step 3: Final full check**

```bash
npm test
npm run build
```

Expected: all tests PASS, build succeeds.

- [ ] **Step 4: Deploy**

```bash
vercel --prod --yes
```

Confirm the deployed URL serves the updated site (spot-check via curl or by opening the production domain and repeating a couple of the checks from Step 2).
