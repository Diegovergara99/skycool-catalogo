import { describe, it, expect } from "vitest";
import { formatMoneda } from "./formatMoneda";

describe("formatMoneda", () => {
  it("formatea enteros como pesos mexicanos sin decimales", () => {
    expect(formatMoneda(1200)).toBe("$1,200");
    expect(formatMoneda(15000)).toBe("$15,000");
  });

  it("formatea cero correctamente", () => {
    expect(formatMoneda(0)).toBe("$0");
  });
});
