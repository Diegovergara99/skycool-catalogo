import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { DiasRenta, ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { calcularImporteUnitario, calcularImporteItem } from "@/lib/carrito-reducer";
import { resolverPrecioOficial } from "@/lib/productos";
import { esDireccionValida, formatearDireccionUnaLinea, type DireccionEnvio } from "@/lib/direccion-envio";
import { formatMoneda } from "@/lib/formatMoneda";

const CORREO_DESTINO = "skycool.gdl@gmail.com";
const REMITENTE = "SkyCool Web <onboarding@resend.dev>";

function esTipoValido(tipo: unknown): tipo is TipoOperacion {
  return tipo === "renta" || tipo === "venta";
}

function esDiasValido(dias: unknown): dias is DiasRenta | undefined {
  return dias === undefined || dias === 1 || dias === 3;
}

/**
 * Aviso al negocio de que hay un pedido de venta en curso, con la
 * dirección de envío capturada — no hay webhook de Mercado Pago
 * configurado todavía, así que este correo es la única forma de que
 * SkyCool se entere del pedido sin tener que revisar el panel de MP a
 * cada rato. Si el correo falla, no debe tumbar el flujo de pago: el
 * cliente ya tiene su link de Mercado Pago, que es lo importante.
 */
async function enviarAvisoDePedido(items: ItemCarrito[], direccion: DireccionEnvio) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("create-preference: RESEND_API_KEY no configurado, no se envió el aviso de pedido.");
    return;
  }

  const lineas = items.map(
    (item) =>
      `• ${item.nombreProducto} (${item.nombreVariante}) x${item.cantidad} — ${formatMoneda(
        calcularImporteItem(item)
      )}`
  );
  const total = items.reduce((acc, item) => acc + calcularImporteItem(item), 0);

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [CORREO_DESTINO],
        subject: `Nuevo pedido de venta — ${direccion.nombre}`,
        text: [
          "Nuevo pedido de venta desde la web:",
          "",
          ...lineas,
          "",
          `Total: ${formatMoneda(total)} + IVA`,
          "",
          `Cliente: ${direccion.nombre}`,
          `Teléfono: ${direccion.telefono}`,
          `Dirección de envío: ${formatearDireccionUnaLinea(direccion)}`,
          ...(direccion.referencias ? [`Referencias: ${direccion.referencias}`] : []),
        ].join("\n"),
      }),
    });
  } catch (err) {
    console.error("create-preference: no se pudo enviar el aviso de pedido por correo.", err);
  }
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    // El detalle (qué variable falta) solo va al log del servidor — nunca
    // al cliente. Revelar nombres de variables de entorno o que falta
    // configuración es información que un atacante puede usar; el usuario
    // final solo necesita saber que el pago no está disponible ahora mismo.
    console.error("create-preference: MP_ACCESS_TOKEN no está configurado en este entorno.");
    return NextResponse.json(
      { error: "El pago en línea no está disponible en este momento. Intenta por WhatsApp." },
      { status: 503 }
    );
  }

  let items: ItemCarrito[] | undefined;
  let direccion: unknown;
  try {
    const body = (await request.json()) as { items?: ItemCarrito[]; direccion?: unknown };
    items = body.items;
    direccion = body.direccion;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es un JSON válido." },
      { status: 400 }
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  // La renta se cotiza y confirma por WhatsApp (ver evaluarDisponibilidadRenta
  // en el carrito), así que a esta ruta solo llegan carritos de venta desde
  // la UI actual — pero validamos aquí también, y no solo en el cliente,
  // porque enviamos productos a cualquier parte de la República y sin
  // dirección no hay forma de cumplir el pedido.
  const hayVenta = items.some((item) => item.tipo === "venta");
  if (hayVenta && !esDireccionValida(direccion)) {
    return NextResponse.json(
      { error: "La dirección de envío es obligatoria para productos de venta." },
      { status: 400 }
    );
  }

  // Nunca confiar en precioUnitario/cantidad/dias tal cual llegan del
  // cliente: resolvemos el precio oficial del catálogo por
  // productoId/varianteId/tipo, validamos la cantidad y los días de renta, y
  // recalculamos el descuento del paquete de 3 días con la misma función que
  // usa el carrito y el PDF, para que nadie pueda manipular el monto a cobrar
  // llamando a esta ruta directamente (curl/Postman) con precios fabricados.
  const itemsMercadoPago: { id: string; title: string; quantity: number; unit_price: number; currency_id: string }[] = [];

  for (const item of items) {
    if (!esTipoValido(item.tipo)) {
      return NextResponse.json({ error: "Tipo de operación no válido." }, { status: 400 });
    }

    if (!esDiasValido(item.dias)) {
      return NextResponse.json({ error: "Días de renta no válidos." }, { status: 400 });
    }

    if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
      return NextResponse.json(
        { error: "La cantidad debe ser un entero positivo." },
        { status: 400 }
      );
    }

    const precioOficial = resolverPrecioOficial(item.productoId, item.varianteId, item.tipo);
    if (precioOficial === null) {
      return NextResponse.json({ error: "Producto no válido." }, { status: 400 });
    }

    const precioUnitario = calcularImporteUnitario(precioOficial, item.tipo, item.dias ?? 1);
    const sufijoDias = item.tipo === "renta" && item.dias === 3 ? " · 3 días (-15%)" : "";

    itemsMercadoPago.push({
      id: `${item.productoId}__${item.varianteId}`,
      title: `${item.nombreProducto} — ${item.nombreVariante} (${
        item.tipo === "renta" ? "Renta" : "Venta"
      })${sufijoDias}`,
      quantity: item.cantidad,
      unit_price: precioUnitario,
      currency_id: "MXN",
    });
  }

  const direccionValida = hayVenta && esDireccionValida(direccion) ? direccion : null;

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const origin = request.nextUrl.origin;

    const resultado = await preference.create({
      body: {
        items: itemsMercadoPago,
        back_urls: {
          success: `${origin}/pago/exito`,
          pending: `${origin}/pago/pendiente`,
          failure: `${origin}/pago/error`,
        },
        auto_return: "approved",
        ...(direccionValida && {
          payer: {
            name: direccionValida.nombre,
            phone: { number: direccionValida.telefono },
          },
          shipments: {
            receiver_address: {
              zip_code: direccionValida.codigoPostal,
              street_name: direccionValida.calle,
              street_number: direccionValida.numeroExterior,
              apartment: direccionValida.numeroInterior,
              city_name: direccionValida.ciudad,
              state_name: direccionValida.estado,
              country_name: "México",
            },
          },
          metadata: {
            colonia: direccionValida.colonia,
            referencias: direccionValida.referencias ?? "",
          },
        }),
      },
    });

    if (direccionValida) {
      await enviarAvisoDePedido(items, direccionValida);
    }

    return NextResponse.json({ initPoint: resultado.init_point });
  } catch {
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo o cotiza por WhatsApp." },
      { status: 502 }
    );
  }
}
