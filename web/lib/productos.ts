import type { Producto } from "./types";
import type { TipoOperacion } from "./carrito-reducer";

// precioVenta y precioRenta: precios reales (sin IVA) proporcionados por
// SkyCool. precioRenta es el precio por día de renta (1 día).
// Ausente en productos que SkyCool solo vende (Extractor de aire y
// Ventilador de techo) — esos no muestran la opción de renta en el sitio.
export const productos: Producto[] = [
  {
    id: "extractor-aire",
    nombre: "Extractor de aire",
    categoria: "extraccion",
    imagen: "/imagenes/extractor-aire.jpg",
    descripcion: "Para interiores y exteriores. Modelo AY-1220.",
    specs: [
      { label: "Diámetro de cuchillas", valor: "1100 mm" },
      { label: "Flujo de aire", valor: "38,000 m³/h" },
      { label: "Velocidad", valor: "405 rpm" },
      { label: "Ruido", valor: "<70 dB" },
      { label: "Potencia", valor: "750 W" },
      { label: "Alimentación", valor: "220 V" },
      { label: "Motor", valor: "DC (corriente continua)" },
      { label: "Dimensiones", valor: "1220 × 1220 × 400 mm" },
    ],
    variantes: [
      { id: "ay-1220", nombre: "AY-1220", precioVenta: 17914 },
    ],
  },
  {
    id: "ventilador-piso",
    nombre: "Ventilador de piso",
    categoria: "piso",
    imagen: "/imagenes/ventilador-piso.jpg",
    descripcion:
      "Suministro de aire de largo alcance. Ideal para talleres, gimnasios y eventos al aire libre.",
    specs: [
      { label: "Diámetro", valor: "1.25 m (48 pulgadas)" },
      { label: "Flujo de aire a plena carga", valor: "38,000 m³/h" },
      { label: "Velocidad", valor: "440 rpm" },
      { label: "Peso", valor: "60 kg" },
      { label: "Área aplicable", valor: "400-500 m²" },
      { label: "Dimensión exterior", valor: "1510 × 790 × 1680 mm" },
    ],
    variantes: [
      {
        id: "dm-110",
        nombre: "DM-110 (conexión a 110V)",
        precioRenta: 950,
        precioVenta: 23520,
        specs: [
          { label: "Alcance de aire", valor: "hasta 30 m" },
          { label: "Alimentación", valor: "110V/50Hz" },
        ],
      },
      {
        id: "dm-220",
        nombre: "DM-220 (conexión a 220V)",
        precioRenta: 950,
        precioVenta: 23520,
        specs: [
          { label: "Alcance de aire", valor: "hasta 40 m" },
          { label: "Alimentación", valor: "220V/50Hz" },
        ],
      },
    ],
  },
  {
    id: "ventilador-giratorio",
    nombre: "Ventilador giratorio",
    categoria: "giratorio",
    imagen: "/imagenes/ventilador-giratorio.jpg",
    descripcion: "Giratorio, 1 metro de diámetro. Modelo AY-920B.",
    specs: [
      { label: "Diámetro", valor: "1 m (39 pulgadas)" },
      { label: "Flujo de aire a plena carga", valor: "2,000 m³/h" },
      { label: "Alcance de aire", valor: "15-20 m" },
      { label: "Ruido", valor: "<50 dB" },
      { label: "Peso", valor: "29 kg" },
      { label: "Corriente", valor: "3.9 A" },
      { label: "Alimentación", valor: "110V/60Hz" },
      { label: "Dimensión exterior", valor: "1300 × 580 × 1180 mm" },
    ],
    variantes: [
      { id: "ay-920b", nombre: "AY-920B", precioRenta: 650, precioVenta: 16310 },
    ],
  },
  {
    id: "enfriador-evaporativo",
    nombre: "Enfriador evaporativo",
    categoria: "evaporativo",
    imagen: "/imagenes/enfriador-evaporativo.jpg",
    descripcion: "Para interiores y exteriores. Modelo AY-D18.",
    specs: [
      { label: "Alimentación", valor: "110V/60Hz" },
      { label: "Corriente", valor: "7.1 A" },
      { label: "Consumo de agua", valor: "20 L/hr" },
      { label: "Potencia", valor: "720 W" },
      { label: "Área de enfriamiento", valor: "150 m²" },
      { label: "Peso", valor: "56 kg" },
      { label: "Dimensión exterior", valor: "1175 × 650 × 410 mm" },
    ],
    variantes: [
      { id: "ay-d18", nombre: "AY-D18", precioRenta: 1250, precioVenta: 31685 },
    ],
  },
  {
    id: "ventilador-techo",
    nombre: "Ventilador de techo industrial",
    categoria: "techo",
    imagen: "/imagenes/ventilador-techo.jpg",
    descripcion: "Serie W.FANS, motor síncrono de imán permanente PMSM.",
    specs: [
      { label: "Ruido", valor: "≤38 dB" },
      { label: "Alimentación", valor: "380V/220V" },
    ],
    variantes: [
      {
        id: "w14",
        nombre: "W14 — 4.2 m de diámetro",
        precioVenta: 46298,
        specs: [
          { label: "Velocidad", valor: "10-80 rpm" },
          { label: "Volumen de aire", valor: "9,280 m³/min" },
          { label: "Área de cobertura", valor: "804 m²" },
          { label: "Potencia", valor: "0.75 kW" },
          { label: "Peso", valor: "47 kg" },
        ],
      },
      {
        id: "w20",
        nombre: "W20 — 6.1 m de diámetro",
        precioVenta: 53306,
        specs: [
          { label: "Velocidad", valor: "10-60 rpm" },
          { label: "Volumen de aire", valor: "13,800 m³/min" },
          { label: "Área de cobertura", valor: "1,520 m²" },
          { label: "Potencia", valor: "1.1 kW" },
          { label: "Peso", valor: "73 kg" },
        ],
      },
      {
        id: "w26",
        nombre: "W26 — 8 m de diámetro",
        precioVenta: 59670,
        specs: [
          { label: "Velocidad", valor: "10-45 rpm" },
          { label: "Volumen de aire", valor: "17,676 m³/min" },
          { label: "Área de cobertura", valor: "2,462 m²" },
          { label: "Potencia", valor: "1.5 kW" },
          { label: "Peso", valor: "108 kg" },
        ],
      },
    ],
  },
];

/**
 * Resuelve el precio oficial de una variante desde el catálogo, ignorando
 * cualquier precio que llegue del cliente. Úsalo en cualquier punto que
 * reciba un precio propuesto por el usuario (por ejemplo, la ruta que crea
 * la preferencia de pago) para evitar que se manipule el monto a cobrar.
 *
 * Devuelve `null` si el producto o la variante no existen en el catálogo,
 * o si se pide el precio de renta de un producto que solo se vende.
 */
export function resolverPrecioOficial(
  productoId: string,
  varianteId: string,
  tipo: TipoOperacion
): number | null {
  const producto = productos.find((p) => p.id === productoId);
  const variante = producto?.variantes.find((v) => v.id === varianteId);
  if (!variante) return null;
  if (tipo === "renta") return variante.precioRenta ?? null;
  return variante.precioVenta;
}
