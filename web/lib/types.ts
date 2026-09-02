export type Categoria = "piso" | "giratorio" | "techo" | "extraccion" | "evaporativo";

export interface EspecTecnica {
  label: string;
  valor: string;
}

export interface Variante {
  id: string;
  nombre: string;
  // Ausente cuando el producto no se ofrece en renta, solo en venta.
  precioRenta?: number;
  precioVenta: number;
  specs?: EspecTecnica[];
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  imagen: string;
  descripcion: string;
  specs: EspecTecnica[];
  variantes: Variante[];
}
