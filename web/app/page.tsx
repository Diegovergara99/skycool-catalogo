import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import ComoFunciona from "@/components/ComoFunciona";
import Instalaciones from "@/components/Instalaciones";
import Catalogo from "@/components/Catalogo";
import Sucursales from "@/components/Sucursales";
import Faq from "@/components/Faq";
import Contacto from "@/components/Contacto";
import RevealSection from "@/components/RevealSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <RevealSection>
        <Catalogo />
      </RevealSection>
      <RevealSection>
        <Nosotros />
      </RevealSection>
      <RevealSection>
        <ComoFunciona />
      </RevealSection>
      <RevealSection>
        <Instalaciones />
      </RevealSection>
      <RevealSection>
        <Sucursales />
      </RevealSection>
      <RevealSection>
        <Faq />
      </RevealSection>
      <RevealSection>
        <Contacto />
      </RevealSection>
    </main>
  );
}
