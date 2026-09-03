"use client";

import { useState } from "react";

interface DatosContacto {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
}

interface EstadoEnvioCorreo {
  enviando: boolean;
  error: string | null;
  exito: boolean;
}

export function useEnviarCorreoContacto() {
  const [estado, setEstado] = useState<EstadoEnvioCorreo>({
    enviando: false,
    error: null,
    exito: false,
  });

  async function enviarCorreo(datos: DatosContacto) {
    if (estado.enviando) return;
    setEstado({ enviando: true, error: null, exito: false });
    try {
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
        let mensaje = "No se pudo enviar el correo.";
        try {
          const cuerpo = await respuesta.json();
          mensaje = cuerpo.error ?? mensaje;
        } catch {
          mensaje = "El servidor de correo respondió de forma inesperada.";
        }
        setEstado({ enviando: false, error: mensaje, exito: false });
        return;
      }

      setEstado({ enviando: false, error: null, exito: true });
    } catch {
      setEstado({
        enviando: false,
        error: "No se pudo conectar con el servidor de correo.",
        exito: false,
      });
    }
  }

  return { ...estado, enviarCorreo };
}
