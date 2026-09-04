"use client";

import { useEffect, useRef, useState } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
}

/**
 * Envuelve una sección para que aparezca con un fundido + desplazamiento
 * suave cuando entra en la pantalla al hacer scroll, en vez de aparecer de
 * golpe. El contenido siempre está en el HTML (los buscadores lo ven igual),
 * esto solo cambia la opacidad/posición visual mientras carga la página.
 */
export default function RevealSection({ children }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}
