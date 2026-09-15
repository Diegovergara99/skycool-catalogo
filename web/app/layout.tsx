import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/lib/carrito-context";
import { listaCiudades } from "@/lib/sucursales";
import { construirScriptGtag } from "@/lib/analytics";
import Header from "@/components/Header";
import Carrito from "@/components/Carrito";
import Footer from "@/components/Footer";
import BotonWhatsapp from "@/components/BotonWhatsapp";
import BotonInstagram from "@/components/BotonInstagram";
import BarraCtaMovil from "@/components/BarraCtaMovil";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const TITULO = "SkyCool — Venta y renta de ventilación para eventos y espacios grandes";
const DESCRIPCION = `Ventiladores de piso, giratorios, de techo, extractores de aire y enfriadores evaporativos en venta y renta. Cobertura en ${listaCiudades()}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skycool.com.mx"),
  title: TITULO,
  description: DESCRIPCION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/",
    siteName: "SkyCool",
    images: ["/imagenes/ventilador-giratorio.jpg"],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/imagenes/ventilador-giratorio.jpg"],
  },
};

const ORGANIZACION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.skycool.com.mx/#organizacion",
  name: "SkyCool",
  url: "https://www.skycool.com.mx",
  logo: "https://www.skycool.com.mx/logo.png",
  ...(process.env.NEXT_PUBLIC_INSTAGRAM_URL
    ? { sameAs: [process.env.NEXT_PUBLIC_INSTAGRAM_URL] }
    : {}),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+52${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.slice(2) ?? ""}`,
      contactType: "sales",
      areaServed: "MX",
      availableLanguage: ["es"],
    },
  ],
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${barlow.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZACION_JSON_LD) }}
        />
        {GA_MEASUREMENT_ID && (
          // strategy="lazyOnload": Google Analytics no necesita competir por
          // el hilo principal mientras la página recién carga — una
          // auditoría de rendimiento (Lighthouse) midió que este script,
          // cargado como <script async> normal, le robaba ~2s al primer
          // pintado del texto principal (LCP) porque se ejecutaba justo
          // cuando React estaba hidratando. lazyOnload lo difiere hasta que
          // el navegador está inactivo, sin perder ningún dato de analítica.
          <>
            <Script
              id="gtag-src"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{ __html: construirScriptGtag(GA_MEASUREMENT_ID) }}
            />
          </>
        )}
        <CarritoProvider>
          <Header />
          <Carrito />
          {children}
          <Footer />
          <BotonWhatsapp />
          <BotonInstagram />
          <BarraCtaMovil />
        </CarritoProvider>
      </body>
    </html>
  );
}
