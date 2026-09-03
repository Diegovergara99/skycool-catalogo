# Cotizaciones descargables (Renta / Venta) — Diseño

**Fecha:** 2026-09-02
**Estado:** Aprobado por el usuario, listo para plan de implementación

## Contexto y objetivo

El sitio de SkyCool ya tiene un carrito (Task 15 del build original) con dos
acciones: "Cotizar por WhatsApp" (mensaje de texto) y "Pagar en línea"
(Mercado Pago). El usuario pidió agregar una tercera acción: generar una
**cotización formal descargable/imprimible**, con el mismo diseño que sus
plantillas actuales de PDF (cotización de renta y cotización de venta),
para que un cliente pueda llevarse un documento profesional sin que SkyCool
tenga que armarlo a mano.

El usuario proporcionó dos plantillas reales (capturas de pantalla) que se
usaron para extraer el diseño exacto, el texto fijo, y — verificando los
números contra las plantillas — las fórmulas de cálculo.

## Fórmulas verificadas contra las plantillas reales

Dado un conjunto de líneas `{cantidad, precioUnitario}` de un mismo tipo
(renta o venta):

- `subtotal = Σ (cantidad × precioUnitario)`
- `iva = subtotal × 0.16`
- `totalConIva = subtotal × 1.16`

Exclusivo de cotizaciones de **renta**, paquete de 3 días con 15% de
descuento sobre el precio de 3 días (no un 15% del precio de venta — esto
se verificó numéricamente contra la plantilla real: `2 × $941 + $652 =
$2,534` por día; `$2,534 × 3 × 0.85 = $6,461.70`, que coincide exactamente
con el total mostrado en la plantilla):

- `paquete3DiasSinIva = subtotal × 3 × 0.85`
- `paquete3DiasConIva = paquete3DiasSinIva × 1.16`

## Alcance

Dentro de alcance:
- Botón "Generar cotización" en el `Carrito.tsx` existente, junto a
  "Cotizar por WhatsApp" y "Pagar en línea".
- Formulario corto: Nombre del cliente (requerido), Atención a (opcional).
- Si el carrito mezcla renta y venta, se generan **dos documentos**
  separados (uno por tipo), cada uno solo con sus líneas correspondientes.
- Documento con el diseño de las plantillas: header azul marino "SKY COOL"
  + tipo de cotización, datos de contacto fijos, tabla de folio/fecha/
  cliente/atención, tabla de productos con columnas sin IVA / con IVA,
  totales, (solo renta) recuadro de paquete 3 días, nota de facturación
  **a nombre de SkyCool** (no del nombre personal del dueño), condiciones,
  línea de firma, pie de página con datos de contacto.
- Botón "Descargar / Imprimir PDF" que usa `window.print()` con CSS de
  impresión dedicado (`@media print`) que oculta todo el resto del sitio
  (header, carrito, etc.) y dejar solo el/los documento(s) — el usuario
  usa "Guardar como PDF" del diálogo de impresión del navegador. No se
  agrega ninguna librería de generación de PDF.
- Número de cotización autogenerado con fecha + sufijo aleatorio (no hay
  base de datos para numeración consecutiva real).

Fuera de alcance (por ahora):
- Numeración consecutiva real de cotizaciones (requeriría persistencia).
- Envío automático del PDF por correo o WhatsApp (el usuario ya tiene el
  botón de WhatsApp existente para el mensaje de texto; el PDF se
  descarga/imprime manualmente).
- Guardar historial de cotizaciones generadas.

## Datos fijos del documento (idénticos en ambas plantillas)

- Marca: "SKY COOL" / "VENTILACIÓN Y ENFRIAMIENTO INDUSTRIAL"
- Tel / WhatsApp: 33 1970 4476
- Email: skycool@gmail.com
- Vigencia: 15 días naturales
- Facturación: "Todos los precios están expresados en pesos mexicanos. La
  columna 'sin IVA' aplica para operaciones sin comprobante fiscal. Si
  requiere factura, aplica la columna 'con IVA' (16% adicional). La
  factura se emite a nombre de **SkyCool**."
- Pie de página: SKY COOL / Ventilación y enfriamiento industrial / Tel /
  WhatsApp 33 1970 4476 / skycool@gmail.com / Guadalajara, Jalisco

### Condiciones — Renta
- Renta: pago anticipado más depósito en garantía.
- Equipo sujeto a disponibilidad al confirmar el pedido.
- El cliente responde por daño o pérdida del equipo a valor de reposición.
- Esta cotización no constituye reservación de equipo hasta recibir el
  anticipo.
- Nota adicional bajo la tabla: "La renta incluye envío, instalación en
  sitio y recolección al término del periodo."

### Condiciones — Venta
- Venta: pago anticipado.
- Garantía de 3 años contra defectos de fábrica.
- Equipo sujeto a disponibilidad al confirmar el pedido.
- Esta cotización no constituye reservación de equipo hasta recibir el
  anticipo.
- Nota adicional bajo la tabla: "El precio de venta incluye envío en zona
  metropolitana de Guadalajara. Envío foráneo se cotiza por separado. No
  incluye instalación."

## Arquitectura

```
lib/
  cotizacion.ts               → funciones puras: cálculo de totales,
                                 generación de número de cotización,
                                 separación de items del carrito por tipo
  cotizacion.test.ts
components/
  Cotizacion.tsx               → modal: paso 1 (form cliente/atención),
                                  paso 2 (vista previa + botón imprimir)
  CotizacionDocumento.tsx      → el documento en sí (recibe tipo, items,
                                  cliente, atención, número, fecha), estilos
                                  Tailwind + clases `print:` para que solo
                                  esto sea visible al imprimir
  Cotizacion.test.tsx
  CotizacionDocumento.test.tsx
```

`Carrito.tsx` gana un botón "Generar cotización" (deshabilitado si el
carrito está vacío, igual que los otros dos) que abre `<Cotizacion />`.

### Impresión

Next.js/Tailwind: se usa el prefijo `print:` de Tailwind (ej.
`print:hidden` en todo lo que no sea el documento, `print:block` en el
documento) en vez de un stylesheet CSS aparte, manteniendo todo en un
solo lugar junto a los demás componentes. `window.print()` se dispara
desde el botón "Descargar / Imprimir PDF".

## Verificación

- Tests unitarios de `lib/cotizacion.ts` (cálculo de subtotal/IVA/paquete
  3 días) usando los números exactos de las plantillas reales como
  casos de prueba (ej. 2×$941 + 1×$652 → $2,534 día, $6,461.70 paquete 3
  días sin IVA).
- Tests de componente para `CotizacionDocumento` (contenido correcto según
  tipo) y `Cotizacion` (flujo de formulario → vista previa, separación en
  dos documentos cuando el carrito mezcla renta y venta).
- Verificación manual: generar una cotización de cada tipo y confirmar
  visualmente que coincide con las plantillas.
