import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Node's experimental global `localStorage` (present since Node 22, default
// in newer versions) shadows jsdom's own window.localStorage implementation
// under the jsdom test environment, since vitest's `window` === `globalThis`.
// Node's accessor silently returns `undefined` (with a warning) instead of
// throwing, so `window.localStorage` resolves to `undefined` in tests.
// Replace it with a small in-memory Storage polyfill so code under test can
// rely on `window.localStorage` working as it does in real browsers.
class StoragePolyfill implements Storage {
  private datos = new Map<string, string>();

  get length(): number {
    return this.datos.size;
  }

  clear(): void {
    this.datos.clear();
  }

  getItem(clave: string): string | null {
    return this.datos.has(clave) ? this.datos.get(clave)! : null;
  }

  key(indice: number): string | null {
    return Array.from(this.datos.keys())[indice] ?? null;
  }

  removeItem(clave: string): void {
    this.datos.delete(clave);
  }

  setItem(clave: string, valor: string): void {
    this.datos.set(clave, String(valor));
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new StoragePolyfill(),
  configurable: true,
  writable: true,
});

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...rest }: Record<string, unknown>) =>
    React.createElement("img", rest),
}));
