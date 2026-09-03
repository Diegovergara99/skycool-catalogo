import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "RESEND_API_KEY no configurado. Agrega tu llave de Resend en .env.local antes de enviar correos.",
      },
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
