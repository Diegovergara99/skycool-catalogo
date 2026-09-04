"use client";

import ProductoCard from "./ProductoCard";
import { useCarrito } from "@/lib/carrito-context";
import type { Producto } from "@/lib/types";

interface ProductoCardStandaloneProps {
  producto: Producto;
}

export default function ProductoCardStandalone({ producto }: ProductoCardStandaloneProps) {
  const { agregarProducto } = useCarrito();
  return <ProductoCard producto={producto} onAgregar={agregarProducto} />;
}
