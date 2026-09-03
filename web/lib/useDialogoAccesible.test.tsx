import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useDialogoAccesible } from "./useDialogoAccesible";

function Dialogo({ mostrar }: { mostrar: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogoAccesible(ref);
  if (!mostrar) return null;
  return (
    <div ref={ref}>
      <button>Primero</button>
      <button>Segundo</button>
      <button>Último</button>
    </div>
  );
}

// Simula el caso real de Carrito.tsx: el componente NUNCA se desmonta,
// solo deja de renderizar contenido (devuelve null) cuando está cerrado —
// por eso `useDialogoAccesible` necesita su propio flag `activo`.
function DialogoQueNuncaSeDesmonta({ activo }: { activo: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogoAccesible(ref, activo);
  if (!activo) return null;
  return (
    <div ref={ref}>
      <button>Primero</button>
      <button>Último</button>
    </div>
  );
}

describe("useDialogoAccesible", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("bloquea el scroll del body mientras está montado, y lo restaura al desmontar", () => {
    const { unmount } = render(<Dialogo mostrar />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("Tab en el último elemento regresa el foco al primero (atrapa el foco)", () => {
    render(<Dialogo mostrar />);
    const botones = document.querySelectorAll("button");
    const primero = botones[0] as HTMLElement;
    const ultimo = botones[botones.length - 1] as HTMLElement;
    ultimo.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(primero);
  });

  it("Shift+Tab en el primer elemento manda el foco al último", () => {
    render(<Dialogo mostrar />);
    const botones = document.querySelectorAll("button");
    const primero = botones[0] as HTMLElement;
    const ultimo = botones[botones.length - 1] as HTMLElement;
    primero.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
  });

  it("no interfiere con Tab entre elementos que no son el primero ni el último", () => {
    render(<Dialogo mostrar />);
    const botones = document.querySelectorAll("button");
    const primero = botones[0] as HTMLElement;
    primero.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    // El navegador (no este hook) se encarga de mover el foco al siguiente
    // elemento en este caso — el hook solo debe actuar en los bordes.
    expect(document.activeElement).toBe(primero);
  });

  it("no bloquea el scroll si activo=false, aunque el componente esté montado", () => {
    const { rerender } = render(<DialogoQueNuncaSeDesmonta activo={false} />);
    expect(document.body.style.overflow).toBe("");

    rerender(<DialogoQueNuncaSeDesmonta activo />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<DialogoQueNuncaSeDesmonta activo={false} />);
    expect(document.body.style.overflow).toBe("");
  });
});
