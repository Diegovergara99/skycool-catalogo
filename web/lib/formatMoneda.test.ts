import { describe, it, expect } from "vitest";
import { formatMoneda, formatMonedaConCentavos } from "./formatMoneda";

describe("formatMoneda", () => {
  it("formatea enteros como pesos mexicanos sin decimales", () => {
    expect(formatMoneda(1200)).toBe("$1,200");
    expect(formatMoneda(15000)).toBe("$15,000");
  });

  it("formatea cero correctamente", () => {
    expect(formatMoneda(0)).toBe("$0");
  });
});

describe("formatMonedaConCentavos", () => {
  it("formatea con dos decimales, como en los documentos de cotización", () => {
    expect(formatMonedaConCentavos(941)).toBe("$941.00");
    expect(formatMonedaConCentavos(1091.56)).toBe("$1,091.56");
    expect(formatMonedaConCentavos(6461.7)).toBe("$6,461.70");
  });
});
