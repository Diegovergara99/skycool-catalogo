import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { resolverPrecioOficial } from "@/lib/productos";

function esTipoValido(tipo: unknown): tipo is TipoOperacion {
  return tipo === "renta" || tipo === "venta";
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "MP_ACCESS_TOKEN no configurado. Agrega tus llaves de Mercado Pago en .env.local antes de aceptar pagos.",
      },
      { status: 503 }
    );
  }

  let items: ItemCarrito[] | undefined;
  try {
    const body = (await request.json()) as { items?: ItemCarrito[] };
    items = body.items;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es un JSON válido." },
      { status: 400 }
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  // Nunca confiar en precioUnitario/cantidad tal cual llegan del cliente:
  // resolvemos el precio oficial del catálogo por productoId/varianteId/tipo
  // y validamos la cantidad, para que nadie pueda manipular el monto a cobrar
  // llamando a esta ruta directamente (curl/Postman) con precios fabricados.
  const itemsMercadoPago: { id: string; title: string; quantity: number; unit_price: number; currency_id: string }[] = [];

  for (const item of items) {
    if (!esTipoValido(item.tipo)) {
      return NextResponse.json({ error: "Tipo de operación no válido." }, { status: 400 });
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

    itemsMercadoPago.push({
      id: `${item.productoId}__${item.varianteId}`,
      title: `${item.nombreProducto} — ${item.nombreVariante} (${
        item.tipo === "renta" ? "Renta" : "Venta"
      })`,
      quantity: item.cantidad,
      unit_price: precioOficial,
      currency_id: "MXN",
    });
  }

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
      },
    });

    return NextResponse.json({ initPoint: resultado.init_point });
  } catch {
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo o cotiza por WhatsApp." },
      { status: 502 }
    );
  }
}
