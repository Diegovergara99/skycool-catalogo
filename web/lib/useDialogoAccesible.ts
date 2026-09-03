"use client";

import { useEffect, type RefObject } from "react";

const SELECTOR_FOCOABLES =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Bloquea el scroll del fondo y atrapa el foco (Tab/Shift+Tab) dentro de
 * `contenedorRef` mientras `activo` sea true. Pensado para modales/diálogos
 * que se superponen al resto de la página (Carrito, Cotización): sin esto,
 * alguien navegando solo con teclado puede salirse del diálogo con Tab, y
 * la página de fondo sigue haciendo scroll debajo del overlay en móvil.
 *
 * `activo` existe como parámetro aparte (no basta con desmontar el hook)
 * porque `Carrito` nunca se desmonta de verdad — sigue montado y solo
 * devuelve `null` cuando está cerrado, así que sus hooks se siguen
 * llamando en cada render. Sin el flag `activo`, el scroll del sitio
 * quedaría bloqueado para siempre desde la primera vez que se abre.
 */
export function useDialogoAccesible(
  contenedorRef: RefObject<HTMLElement | null>,
  activo: boolean = true
) {
  useEffect(() => {
    if (!activo) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function manejarTab(evento: KeyboardEvent) {
      if (evento.key !== "Tab") return;
      const contenedor = contenedorRef.current;
      if (!contenedor) return;

      const focoables = contenedor.querySelectorAll<HTMLElement>(SELECTOR_FOCOABLES);
      if (focoables.length === 0) return;

      const primero = focoables[0];
      const ultimo = focoables[focoables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", manejarTab);
    return () => {
      document.body.style.overflow = overflowOriginal;
      document.removeEventListener("keydown", manejarTab);
    };
  }, [contenedorRef, activo]);
}
