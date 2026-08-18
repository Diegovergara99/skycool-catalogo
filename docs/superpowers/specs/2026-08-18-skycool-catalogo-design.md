# SkyCool — Catálogo web con carrito, cotización por WhatsApp y pago en línea

**Fecha:** 2026-08-18
**Estado:** Aprobado por el usuario, listo para plan de implementación

## Contexto y objetivo

SkyCool es una empresa mexicana de venta y renta de sistemas de ventilación
para grandes espacios (eventos, fiestas, bodegas, talleres, gimnasios):
ventiladores de piso, ventiladores giratorios, ventiladores de techo
industriales, extractores de aire y enfriadores evaporativos.

El usuario pidió un sitio web de catálogo "súper completo, muy fácil de usar,
pero con buen diseño", que incluya:

- Catálogo de productos con specs técnicas reales (tomadas de los catálogos
  PDF provistos).
- Carrito de compras (agregar/quitar productos y variantes).
- Botón de cotización que arma el pedido y lo envía por WhatsApp.
- Pago en línea real desde el carrito (tienen cuenta de Mercado Pago).
- Sección de sucursales/puntos de venta.

Fuente de datos de producto: PDFs `CATALOGO SKYCOOL - piso.pdf` y
`CATALOGO SKYCOOL - techo.pdf`, y fotos de producto vía WhatsApp — todos
copiados a `reference/catalogos-original/` en este repo.

## Alcance

Dentro de alcance (v1):
- Sitio de una sola página (landing) con navegación por anclas.
- Catálogo completo de las 5 líneas de producto, con variantes donde aplica.
- Carrito con estado en cliente (sin cuenta de usuario, sin historial de
  pedidos persistente).
- Cotización vía WhatsApp (link `wa.me` con mensaje pre-armado desde el
  carrito).
- Pago en línea vía Mercado Pago Checkout Pro (redirect), con páginas de
  resultado (éxito / pendiente / fallo).
- Sección de las 7 sucursales reales con dirección completa.
- Precios de muestra (placeholder) y llaves de Mercado Pago vacías —
  el usuario las completa antes de publicar.
- WhatsApp de negocio y redes sociales como placeholders visibles y fáciles
  de encontrar en el código para reemplazar.

Fuera de alcance (v1, posible fase futura):
- Checkout Bricks embebido (pago sin salir del sitio).
- Cuentas de usuario, historial de pedidos, panel de administración.
- Base de datos — los datos de producto viven en un archivo de datos local.
- Multi-idioma.

## Catálogo de productos (datos extraídos de los PDFs)

| Producto | Modelo(s)/variantes | Categoría | Specs clave |
|---|---|---|---|
| Extractor de aire | AY-1220 | Extracción | Ø 1100mm cuchillas, 38,000 m³/h, 220V, motor DC, <70dB |
| Ventilador de piso | DM-110 (110V) / DM-220 (220V) | Piso | Ø 1.25m, 38,000 m³/h, alcance 35-40m, 60kg |
| Ventilador giratorio de piso | AY-920B | Piso / Giratorio | Ø 1m, 2,000 m³/h, alcance 15-20m, <50dB, 29kg |
| Enfriador evaporativo | AY-D18 | Evaporativo | 110V, 720W, área de enfriamiento 150m², 56kg |
| Ventilador de techo industrial | W14 (4.2m) / W20 (6.1m) / W26 (8m) | Techo | Cobertura hasta 2,462m², ≤38dB, 380V/220V |

Cada producto debe mostrar: nombre, categoría, imagen real (de
`reference/catalogos-original/`), tabla de specs completa, selector de
variante (voltaje o tamaño, donde aplica), toggle Renta / Venta con su
precio correspondiente, y botón "Agregar al carrito".

## Sucursales (reales, de los PDFs)

1. **Guadalajara, Jal.** — Calle 18 #2530, Colón Industrial, 44940 Guadalajara, Jal.
2. **Tonalá, Jal.** — Av Tonalá 536, Francisco Villa, 45402 Tonalá, Jal.
3. **CDMX** — Talabarteros 95, Emilio Carranza, Venustiano Carranza, 15230, CDMX
4. **Monterrey, N.L.** — Manuel María del Llano 1020, Centro, 64000 Monterrey, N.L.
5. **Culiacán, Sin.** — Blvd. Francisco I. Madero 782, Primer Cuadro, 80000 Culiacán Rosales, Sin.
6. **León, Gto.** — Mérida 127, El Coecillo, 37260 León de los Aldama, Gto.
7. **Santa Rosa, Gto.** — San Juan Crisóstomo 1312, 37490 Plan de Ayala, Gto.

## Enfoque técnico

**Stack: Next.js (App Router) + TypeScript + Tailwind, deploy en Vercel.**

Se evaluaron 3 enfoques:
- **A — Next.js + Mercado Pago Checkout Pro (elegido).** El carrito vive en
  el cliente; al pagar, una API route del propio Next.js crea una
  "preferencia" de pago vía el SDK server-side de Mercado Pago y redirige al
  usuario al checkout hospedado por Mercado Pago (tarjeta, OXXO, SPEI, MSI).
  Mercado Pago absorbe el cumplimiento PCI. Es el balance correcto entre
  velocidad de construcción y un pago real y confiable.
- **B — Checkout Bricks embebido.** Mismo backend, pero el formulario de
  pago se renderiza dentro del sitio (sin redirect). Mejor UX, bastante más
  integración. Se deja como mejora de fase 2.
- **C — Sitio estático + función serverless suelta.** Más liviano pero peor
  para manejar el estado rico del carrito (variantes, filtros, cantidades)
  que pide el usuario. Descartado.

### Arquitectura

```
app/
  page.tsx                 → página única con todas las secciones
  layout.tsx                → shell, fuentes, metadata SEO
  api/create-preference/route.ts   → crea preferencia de pago en Mercado Pago
  pago/exito/page.tsx        → resultado de pago (approved)
  pago/pendiente/page.tsx    → resultado de pago (pending)
  pago/error/page.tsx        → resultado de pago (failure)
components/
  Header.tsx                 (nav + logo + ícono carrito)
  Hero.tsx
  Nosotros.tsx
  Catalogo.tsx                (grid + filtro por categoría)
  ProductoCard.tsx             (variante, toggle renta/venta, agregar)
  Carrito.tsx                  (panel lateral, resumen, checkout)
  Sucursales.tsx
  Contacto.tsx
  Footer.tsx
lib/
  productos.ts                 → datos de producto (fuente única, editable)
  sucursales.ts
  carrito-context.tsx           → estado global del carrito (React context)
  whatsapp.ts                   → arma el link wa.me desde el carrito
public/
  imagenes/... (fotos reales copiadas de reference/)
.env.example                   → MP_ACCESS_TOKEN, NEXT_PUBLIC_MP_PUBLIC_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER
```

### Flujo de datos

1. `lib/productos.ts` es la única fuente de verdad de productos, variantes y
   precios (placeholder). El usuario lo edita directamente para poner
   precios reales — no requiere tocar componentes.
2. El carrito vive en un React Context (`carrito-context.tsx`), persistido en
   `localStorage` para que sobreviva a un refresh.
3. **Cotizar por WhatsApp:** `lib/whatsapp.ts` arma un mensaje de texto con
   el detalle del carrito (producto, variante, cantidad, renta/venta,
   subtotal) y abre `https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=...`.
4. **Pagar en línea:** el frontend llama a `POST /api/create-preference` con
   los items del carrito; la API route usa el SDK de Mercado Pago
   (`MP_ACCESS_TOKEN`, variable de entorno server-side) para crear la
   preferencia y devuelve `init_point`; el navegador redirige ahí. Mercado
   Pago regresa al usuario a `/pago/exito`, `/pago/pendiente` o
   `/pago/error` según el resultado.

### Manejo de errores / estados vacíos

- Carrito vacío → botones de checkout/WhatsApp deshabilitados con mensaje.
- `MP_ACCESS_TOKEN` no configurado (placeholder) → la API route responde con
  un error controlado; el botón "Pagar en línea" muestra un aviso claro en
  vez de fallar silenciosamente, y sugiere cotizar por WhatsApp mientras
  tanto.
- Falla la creación de preferencia (red, credenciales inválidas) → mensaje
  de error inline, el carrito no se pierde.
- Número de WhatsApp / redes sociales sin configurar → se muestran como
  placeholders visualmente distinguibles (p. ej. `[TU WHATSAPP]`) tanto en
  el sitio como en el código, fáciles de encontrar y reemplazar.

### Diseño visual

- Paleta: azul marino oscuro + acento turquesa/cian (tomada del logo y
  catálogos actuales de SkyCool), tipografía condensada para títulos.
- Fotos reales de producto (de `reference/catalogos-original/`), no
  ilustraciones genéricas ni stock.
- Mobile-first, responsive; el carrito es un panel deslizable que funciona
  igual en móvil y escritorio.

### Verificación

- `npm run build` sin errores de tipos/lint.
- Recorrido manual (Playwright vía skill `run`) cubriendo: filtrar catálogo
  por categoría, seleccionar variante, agregar/quitar del carrito, generar
  mensaje de WhatsApp correcto, intentar pago con credenciales vacías
  (debe mostrar el aviso controlado, no un crash), y con credenciales de
  prueba de Mercado Pago si el usuario las provee más adelante.
- Revisión visual en móvil y escritorio antes de dar por completo el
  trabajo.

## Pendientes que el usuario completará antes de publicar

- Precios reales de venta y renta por producto/variante (`lib/productos.ts`).
- `MP_ACCESS_TOKEN` y `NEXT_PUBLIC_MP_PUBLIC_KEY` de su cuenta de Mercado Pago.
- Número de WhatsApp de negocio y links de redes sociales.
