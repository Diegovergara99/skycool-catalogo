import type { ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { calcularTotales, calcularPaquete3Dias, TASA_IVA } from "@/lib/cotizacion";
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
            <p>skycool.gdl@gmail.com</p>
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
                  key={`${item.productoId}__${item.varianteId}__${item.tipo}`}
                  className="border-b border-slate-100"
                >
                  <td className="p-2">{item.cantidad}</td>
                  <td className="p-2">
                    {item.nombreProducto} — {item.nombreVariante}
                  </td>
                  <td className="p-2 text-right">{formatMonedaConCentavos(item.precioUnitario)}</td>
                  <td className="p-2 text-right font-semibold text-[var(--color-teal-dark)]">
                    {formatMonedaConCentavos(item.precioUnitario * (1 + TASA_IVA))}
                  </td>
                  <td className="p-2 text-right">{formatMonedaConCentavos(importeSinIva)}</td>
                  <td className="p-2 text-right font-semibold text-[var(--color-teal-dark)]">
                    {formatMonedaConCentavos(importeSinIva * (1 + TASA_IVA))}
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
            <p className="text-slate-500">skycool.gdl@gmail.com</p>
            <p className="text-slate-500">Guadalajara, Jalisco</p>
          </div>
        </div>
      </div>
    </div>
  );
}
