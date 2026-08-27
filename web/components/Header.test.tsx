import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Header from "./Header";
import Carrito from "./Carrito";
import { CarritoProvider } from "@/lib/carrito-context";

function renderHeaderConCarrito() {
  return render(
    <CarritoProvider>
      <Header />
      <Carrito />
    </CarritoProvider>
  );
}

describe("Header", () => {
  it("muestra los links de navegación principales", () => {
    renderHeaderConCarrito();
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Sucursales")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("abre el carrito al hacer click en el botón Carrito", () => {
    renderHeaderConCarrito();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /carrito/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("el menú móvil está cerrado por defecto", () => {
    renderHeaderConCarrito();
    expect(screen.queryByRole("navigation", { name: /menú móvil/i })).not.toBeInTheDocument();
  });

  it("abre el menú móvil al hacer click en el botón de menú y lo cierra al volver a hacer click", () => {
    renderHeaderConCarrito();
    const botonMenu = screen.getByRole("button", { name: /abrir menú/i });

    fireEvent.click(botonMenu);
    expect(screen.getByRole("navigation", { name: /menú móvil/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cerrar menú/i }));
    expect(screen.queryByRole("navigation", { name: /menú móvil/i })).not.toBeInTheDocument();
  });

  it("cierra el menú móvil al hacer click en un link de navegación", () => {
    renderHeaderConCarrito();
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));

    const menuMovil = screen.getByRole("navigation", { name: /menú móvil/i });
    fireEvent.click(within(menuMovil).getByText("Catálogo"));

    expect(screen.queryByRole("navigation", { name: /menú móvil/i })).not.toBeInTheDocument();
  });

  it("cierra el menú móvil al presionar Escape", () => {
    renderHeaderConCarrito();
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    expect(screen.getByRole("navigation", { name: /menú móvil/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: /menú móvil/i })).not.toBeInTheDocument();
  });

  it("el botón de menú referencia el panel móvil vía aria-controls", () => {
    renderHeaderConCarrito();
    const botonMenu = screen.getByRole("button", { name: /abrir menú/i });
    fireEvent.click(botonMenu);

    const menuMovil = screen.getByRole("navigation", { name: /menú móvil/i });
    expect(botonMenu).toHaveAttribute("aria-controls", menuMovil.id);
    expect(menuMovil.id).toBeTruthy();
  });
});
