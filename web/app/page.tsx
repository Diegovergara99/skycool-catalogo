import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Catalogo from "@/components/Catalogo";
import Sucursales from "@/components/Sucursales";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <main>
      <Hero />
      <Nosotros />
      <Catalogo />
      <Sucursales />
      <Contacto />
    </main>
  );
}
