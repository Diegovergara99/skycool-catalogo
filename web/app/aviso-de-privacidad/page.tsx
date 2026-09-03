import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — SkyCool",
  description:
    "Aviso de privacidad de SkyCool: qué datos personales recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
};

export default function AvisoDePrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-[var(--color-navy)] underline">
        ← Volver al inicio
      </Link>

      <h1 className="mt-4 font-heading text-3xl font-bold text-[var(--color-navy)]">
        Aviso de Privacidad
      </h1>
      <p className="mt-2 text-sm text-slate-500">Última actualización: septiembre de 2026.</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            1. Responsable del tratamiento de tus datos
          </h2>
          <p className="mt-2">
            SkyCool (persona física con actividad empresarial), con domicilio en Calle 18 #2530,
            Colón Industrial, 44940 Guadalajara, Jalisco, México, es responsable del uso y
            protección de tus datos personales conforme a la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares (LFPDPPP).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            2. Datos personales que recabamos
          </h2>
          <p className="mt-2">
            Cuando usas el formulario de contacto o generas una cotización en nuestro sitio,
            recabamos:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>El contenido de tu mensaje o solicitud</li>
          </ul>
          <p className="mt-2">
            No recabamos datos personales sensibles (salud, origen étnico, creencias religiosas,
            etc.). Si decides pagar en línea, el manejo de tus datos de tarjeta/pago corre por
            cuenta de Mercado Pago, no de SkyCool — nunca vemos ni almacenamos tu información de
            pago directamente (ver sección 4).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            3. Para qué usamos tus datos
          </h2>
          <p className="mt-2">Usamos los datos que nos das únicamente para:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Responder tu solicitud de contacto o cotización</li>
            <li>Darte información sobre nuestros productos y servicios de renta y venta</li>
            <li>Coordinar la entrega, instalación o recolección del equipo</li>
            <li>Procesar tu compra o renta, incluyendo el pago en línea si lo eliges</li>
          </ul>
          <p className="mt-2 font-medium">
            No usamos tus datos para fines de mercadotecnia, publicidad o prospección comercial,
            y no los vendemos, rentamos ni compartimos con nadie fuera de lo descrito en este
            aviso.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            4. Con quién compartimos tus datos
          </h2>
          <p className="mt-2">
            Para poder operar el sitio, algunos de tus datos pasan por dos proveedores externos,
            únicamente para las funciones que prestan:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Resend</strong> (proveedor de envío de correo electrónico): entrega el
              mensaje de tu formulario de contacto directamente a nuestra bandeja de correo.
            </li>
            <li>
              <strong>Mercado Pago</strong> (procesador de pagos): si eliges pagar en línea,
              procesa tu pago de forma directa y segura — SkyCool no ve ni guarda los datos de tu
              tarjeta.
            </li>
          </ul>
          <p className="mt-2">
            No tenemos una base de datos propia donde almacenemos tu información: los mensajes
            del formulario llegan directo a nuestro correo, y los artículos de tu carrito de
            compras se guardan únicamente en tu propio navegador (no en nuestros servidores)
            hasta que decides enviarlos.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            5. Cómo ejercer tus derechos ARCO
          </h2>
          <p className="mt-2">
            Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte (derechos ARCO) al uso de
            tus datos personales, así como a revocar tu consentimiento en cualquier momento. Para
            ejercer cualquiera de estos derechos, escríbenos a{" "}
            <a href="mailto:skycool.gdl@gmail.com" className="underline">
              skycool.gdl@gmail.com
            </a>{" "}
            indicando tu nombre, el dato sobre el que quieres ejercer tu derecho, y una
            identificación que nos permita confirmar que eres tú. Responderemos tu solicitud en
            un plazo razonable.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            6. Cookies y tecnologías de rastreo
          </h2>
          <p className="mt-2">
            Usamos Google Analytics para entender, de forma anónima y agregada, cuánta gente
            visita el sitio y qué páginas les interesan más — esto nos ayuda a mejorar el sitio,
            no a identificarte a ti individualmente. Google Analytics usa cookies para esto.
            Puedes bloquear estas cookies desde la configuración de tu navegador, o instalar el{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              complemento de inhabilitación de Google Analytics
            </a>{" "}
            si prefieres no ser medido.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            7. Cambios a este aviso
          </h2>
          <p className="mt-2">
            Si actualizamos este aviso de privacidad, publicaremos la nueva versión en esta misma
            página con la fecha de actualización correspondiente.
          </p>
        </section>
      </div>
    </main>
  );
}
