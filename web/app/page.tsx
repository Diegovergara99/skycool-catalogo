import Header from "@/components/Header";
import Carrito from "@/components/Carrito";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Catalogo from "@/components/Catalogo";
import Sucursales from "@/components/Sucursales";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BotonWhatsapp from "@/components/BotonWhatsapp";

export default function Home() {
  return (
    <>
      <Header />
      <Carrito />
      <main>
        <Hero />
        <Nosotros />
        <Catalogo />
        <Sucursales />
        <Contacto />
      </main>
      <Footer />
      <BotonWhatsapp />
    </>
  );
}
