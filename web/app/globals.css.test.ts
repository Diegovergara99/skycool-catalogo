import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("globals.css", () => {
  const css = readFileSync(path.join(__dirname, "globals.css"), "utf-8");

  it("does not contain a prefers-color-scheme dark-mode override", () => {
    // SkyCool is designed light-only (navy/teal on white). A leftover
    // create-next-app dark-mode block would flip --background to near-black
    // for OS-level dark mode users, breaking contrast on sections that rely
    // on the body background (e.g. Nosotros, Catalogo, Contacto).
    expect(css).not.toContain("prefers-color-scheme");
  });
});
