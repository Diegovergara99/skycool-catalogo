import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Instalaciones from "@/components/Instalaciones";
import Catalogo from "@/components/Catalogo";
import Sucursales from "@/components/Sucursales";
import Contacto from "@/components/Contacto";
import RevealSection from "@/components/RevealSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <RevealSection>
        <Nosotros />
      </RevealSection>
      <RevealSection>
        <Instalaciones />
      </RevealSection>
      <RevealSection>
        <Catalogo />
      </RevealSection>
      <RevealSection>
        <Sucursales />
      </RevealSection>
      <RevealSection>
        <Contacto />
      </RevealSection>
    </main>
  );
}
