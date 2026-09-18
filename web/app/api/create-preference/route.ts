import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { DiasRenta, ItemCarrito, TipoOperacion } from "@/lib/carrito-reducer";
import { calcularImporteUnitario } from "@/lib/carrito-reducer";
import { resolverPrecioOficial } from "@/lib/productos";

function esTipoValido(tipo: unknown): tipo is TipoOperacion {
  return tipo === "renta" || tipo === "venta";
}

function esDiasValido(dias: unknown): dias is DiasRenta | undefined {
  return dias === undefined || dias === 1 || dias === 3;
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
