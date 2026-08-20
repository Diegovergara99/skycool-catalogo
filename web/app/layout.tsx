import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "SkyCool — Venta y renta de ventilación para eventos y espacios grandes",
  description:
    "Ventiladores de piso, giratorios, de techo, extractores de aire y enfriadores evaporativos en venta y renta. Cobertura en Guadalajara, CDMX, Monterrey, León y Culiacán.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${barlow.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
