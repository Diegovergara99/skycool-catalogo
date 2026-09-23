export interface DireccionEnvio {
  nombre: string;
  telefono: string;
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  referencias?: string;
}

const CAMPOS_REQUERIDOS = [
  "nombre",
  "telefono",
  "calle",
  "numeroExterior",
  "colonia",
  "ciudad",
  "estado",
  "codigoPostal",
] as const;

/**
 * Validación server-side: nunca confiar en que el cliente mandó una
 * dirección completa solo porque el formulario la pedía — la ruta de la
 * API es la que decide si el pago puede crearse, así que valida por su
 * cuenta antes de armar la preferencia de Mercado Pago.
 */
export function esDireccionValida(direccion: unknown): direccion is DireccionEnvio {
  if (typeof direccion !== "object" || direccion === null) return false;
  const d = direccion as Record<string, unknown>;
  return CAMPOS_REQUERIDOS.every((campo) => typeof d[campo] === "string" && d[campo].trim().length > 0);
}

export function formatearDireccionUnaLinea(direccion: DireccionEnvio): string {
  const interior = direccion.numeroInterior ? ` Int. ${direccion.numeroInterior},` : "";
  return `${direccion.calle} ${direccion.numeroExterior},${interior} ${direccion.colonia}, ${direccion.ciudad}, ${direccion.estado}, C.P. ${direccion.codigoPostal}`;
}
