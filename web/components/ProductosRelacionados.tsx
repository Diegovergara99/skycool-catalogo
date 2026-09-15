import Link from "next/link";
import { paginasProducto } from "@/lib/paginasProducto";

interface ProductosRelacionadosProps {
  idActual: string;
}

/**
 * Enlaza cada página de producto con las otras 4 — antes ninguna página de
 * producto enlazaba a otra (solo se llegaba a ellas desde el catálogo de la
 * portada), lo cual dejaba huérfano el enlazado interno entre fichas.
 */
export default function ProductosRelacionados({ idActual }: ProductosRelacionadosProps) {
  const otros = paginasProducto.filter((p) => p.id !== idActual);

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <h2 className="font-heading text-lg font-bold text-white">También te puede interesar</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {otros.map((p) => (
          <li key={p.id}>
            <Link
              href={p.ruta}
              className="block rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
            >
              {p.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
