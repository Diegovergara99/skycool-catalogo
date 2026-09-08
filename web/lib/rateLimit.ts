export class LimitadorSolicitudes {
  private historial = new Map<string, number[]>();

  constructor(
    private readonly maxSolicitudes: number,
    private readonly ventanaMs: number
  ) {}

  permitir(id: string, ahora: number = Date.now()): boolean {
    const previos = (this.historial.get(id) ?? []).filter((t) => ahora - t < this.ventanaMs);
    if (previos.length >= this.maxSolicitudes) {
      this.historial.set(id, previos);
      return false;
    }
    previos.push(ahora);
    this.historial.set(id, previos);
    return true;
  }

  reiniciar(): void {
    this.historial.clear();
  }
}

// Máximo 5 solicitudes cada 10 minutos por IP — suficiente para uso legítimo
// del formulario, pero frena el envío automatizado masivo. Estado en
// memoria: se reinicia si la función serverless se reinicia, lo cual es
// aceptable para frenar spam básico (no sustituye un límite a nivel de
// infraestructura si el sitio llegara a necesitar uno más estricto).
export const limitadorContacto = new LimitadorSolicitudes(5, 10 * 60 * 1000);
