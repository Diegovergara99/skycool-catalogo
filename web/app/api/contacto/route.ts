import { NextRequest, NextResponse } from "next/server";
import { limitadorContacto } from "@/lib/rateLimit";

const CORREO_DESTINO = "skycool.gdl@gmail.com";
const REMITENTE = "SkyCool Web <onboarding@resend.dev>";

interface DatosContacto {
  nombre?: string;
  correo?: string;
  telefono?: string;
  mensaje?: string;
}

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function obtenerIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
}

export async function POST(request: NextRequest) {
  if (!limitadorContacto.permitir(obtenerIp(request))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera unos minutos e intenta de nuevo." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // El detalle solo va al log del servidor, nunca a la respuesta que ve
    // el usuario — revelar nombres de variables de entorno es información
    // que un atacante puede usar.
    console.error("contacto: RESEND_API_KEY no está configurado en este entorno.");
    return NextResponse.json(
      { error: "No se pudo enviar el correo en este momento. Intenta por WhatsApp." },
      { status: 503 }
    );
  }

  let datos: DatosContacto;
  try {
    datos = (await request.json()) as DatosContacto;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es un JSON válido." },
      { status: 400 }
    );
  }

  const { nombre, correo, telefono, mensaje } = datos;

  if (!nombre || !correo || !mensaje) {
    return NextResponse.json(
      { error: "Nombre, correo y mensaje son obligatorios." },
      { status: 400 }
    );
  }

  if (!esCorreoValido(correo)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [CORREO_DESTINO],
        reply_to: correo,
        subject: `Nuevo contacto desde la web — ${nombre}`,
        text: [
          `Nombre: ${nombre}`,
          `Correo: ${correo}`,
          `Teléfono: ${telefono ?? "(no proporcionado)"}`,
          "",
          "Mensaje:",
          mensaje,
        ].join("\n"),
      }),
    });

    if (!respuesta.ok) {
      return NextResponse.json(
        { error: "No se pudo enviar el correo. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de correo." },
      { status: 502 }
    );
  }
}
