import type { Metadata } from "next";
import { productos } from "@/lib/productos";
import { sucursales } from "@/lib/sucursales";
import { construirProductosJsonLd } from "@/lib/schema";
import ProductoCardStandalone from "@/components/ProductoCardStandalone";

const producto = productos.find((p) => p.id === "ventilador-piso")!;
const URL_PAGINA = "https://www.skycool.com.mx/productos/ventilador-de-piso";

export const metadata: Metadata = {
  title: "Ventilador de piso industrial — renta o venta | SkyCool",
  description:
    "Ventilador de piso industrial DM: renta por evento (con entrega e instalación) o compra para uso permanente, con garantía de 3 años. Diámetro 1.25 m, cobertura 400-500 m².",
};

const jsonLd = construirProductosJsonLd([producto], URL_PAGINA);

export default function VentiladorDePisoPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a href="/#catalogo" className="text-sm font-medium text-[var(--color-navy)] underline">
        ← Volver al catálogo
      </a>

      <h1 className="mt-4 font-heading text-3xl font-bold text-[var(--color-navy)] md:text-4xl">
        Ventilador de piso industrial — renta por evento o compra para uso permanente
      </h1>

      <p className="mt-4 text-slate-600">
        El ventilador de piso DM es el equipo más versátil del catálogo de SkyCool: mismo
        ventilador, dos formas de conseguirlo según lo que necesites. Diámetro de 1.25 m, alcance
        de hasta 40 metros y cobertura de 400 a 500 m² — suficiente para mover aire en un salón de
        eventos, una bodega o un gimnasio completo.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">Rentas si...</h2>
          <p className="mt-2 text-sm text-slate-600">
            Es para un evento puntual: boda, graduación, feria, jaripeo. Incluye entrega,
            instalación en sitio y recolección al terminar — tú no cargas ni conectas nada.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            Compras si...
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            La necesidad es permanente: taller, bodega, gimnasio o negocio que requiere
            ventilación todos los días. Incluye garantía de 3 años contra defectos de fábrica.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        3 años de experiencia, {sucursales.length} sucursales en todo el país, y el mismo equipo
        disponible en renta o venta según lo que tu evento o negocio necesite hoy.
      </p>

      <div className="mt-10 max-w-sm">
        <ProductoCardStandalone producto={producto} />
      </div>
    </main>
  );
}
