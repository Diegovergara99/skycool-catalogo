/**
 * Formatea un número mexicano con código de país (52 + 10 dígitos) como
 * "+52 33 1970 4476" para que se vea legible en la UI, en vez del string
 * crudo de dígitos que se usa internamente para armar links de WhatsApp.
 * Si el número no tiene la forma esperada, solo antepone un "+" — nunca
 * inventa una agrupación para un formato que no reconoce.
 */
export function formatearTelefono(numero: string): string {
  const digitos = numero.replace(/\D/g, "");

  if (digitos.startsWith("52") && digitos.length === 12) {
    const pais = digitos.slice(0, 2);
    const area = digitos.slice(2, 4);
    const bloque1 = digitos.slice(4, 8);
    const bloque2 = digitos.slice(8, 12);
    return `+${pais} ${area} ${bloque1} ${bloque2}`;
  }

  return `+${digitos}`;
}
