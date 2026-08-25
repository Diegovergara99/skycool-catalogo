"use client";

import { useState } from "react";
import type { ItemCarrito } from "./carrito-reducer";

interface EstadoCheckout {
  cargando: boolean;
  error: string | null;
}

function redirigirPorDefecto(url: string) {
  window.location.href = url;
}

export function useCheckoutMercadoPago(redirigir: (url: string) => void = redirigirPorDefecto) {
  const [estado, setEstado] = useState<EstadoCheckout>({ cargando: false, error: null });

  async function pagar(items: ItemCarrito[]) {
    if (estado.cargando) return;
    setEstado({ cargando: true, error: null });
    try {
      const respuesta = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!respuesta.ok) {
        let mensaje = "No se pudo iniciar el pago.";
        try {
          const datos = await respuesta.json();
          mensaje = datos.error ?? mensaje;
        } catch {
          mensaje = "El servidor de pago respondió de forma inesperada.";
        }
        setEstado({ cargando: false, error: mensaje });
        return;
      }

      const datos = await respuesta.json();
      setEstado({ cargando: false, error: null });
      redirigir(datos.initPoint);
    } catch {
      setEstado({ cargando: false, error: "No se pudo conectar con el servidor de pago." });
    }
  }

  return { ...estado, pagar };
}
