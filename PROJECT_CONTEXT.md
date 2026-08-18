# Socado Web — Contexto del Proyecto

Documento de referencia rápida para entender el proyecto, sus decisiones de diseño, su estado actual y sus convenciones. No reemplaza la documentación en `docs/`, pero sirve como punto de entrada para retomar trabajo de forma eficiente.

---

## 1. Qué es Socado

Socado Café es una cadena de cafeterías en Caracas, Venezuela, con presencia en tres ubicaciones:

| Tienda | URL Ecommerce |
|---|---|
| Las Mercedes | https://lasmercedes.socadocafe.com |
| La Trinidad | https://latrinidad.socadocafe.com |
| El Rosal | https://elrosal.socadocafe.com |

**Filosofía de marca:** Social. Café. Conectado.

**Tres pilares de personalidad:**
- *"Simplemente Elegante"* — minimal, auténtico, refinado, sin decoración innecesaria.
- *"Cálidamente Conectado"* — cercano, humano, inspirador.
- *"Únicamente Sobrio"* — moderno, directo, balanceado.

---

## 2. Propósito de la plataforma web

1. Presentar la experiencia de marca Socado.
2. Capturar leads de catering calificados mediante un flujo de cotización.
3. **No hay pasarela de pago.** El journey del cliente termina con el envío de una solicitud de cotización.

---

## 3. Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Lenguaje | TypeScript |
| CMS / Backend embebido | Payload CMS 3.85 |
| Base de datos | PostgreSQL |
| Almacenamiento de media | Vercel Blob |
| Estilos | Tailwind CSS v4 |
| Estado del cliente | Zustand |
| Animaciones | Motion v12 (`motion/react`) |
| Iconos | Lucide React |
| Modales/alertas | SweetAlert2 |
| Fuentes | Raleway (headings) + Outfit (body) — vía `next/font` |
| Package manager | pnpm |
| Testing integración | Vitest |
| Testing e2e | Playwright |

---

## 4. Identidad visual

### Colores de marca

| Token | Nombre | Hex |
|---|---|---|
| `azul-socado` | Azul Socado | `#063547` |
| `celeste-socado` | Celeste Socado | `#5c8ea0` |
| `terra` | Terra / Terracota | `#b45b38` |
| `ivory` | Ivory / Marfil | `#f2eae6` |
| Gris funcional | — | `#6e7c7c` |
| Gris suave | — | `#b2b5a9` |

### Tipografía

| Rol | Fuente | Variable CSS |
|---|---|---|
| Headings | Raleway | `--font-raleway` |
| Body / funcional | Outfit | `--font-outfit` |

### Assets de logo
- `/icons/logo_oscuro.svg` — para fondos claros
- `/icons/logo_white.svg` — para fondos oscuros
- `/icons/isotipo.svg` — favicon / isotipo solo

---

## 5. Rutas y páginas

| Ruta | Descripción |
|---|---|
| `/` | Home: hero, menú categorías, tiendas, nosotros preview, catering promo, footer |
| `/nosotros` | Hero + OurStory + RadialTimeline + Footer |
| `/catering` | Catálogo de catering: modo libre y BoxBuilder |
| `/catering/checkout` | Página de cotización (form + resumen del carrito) |
| `/admin` | Panel de administración Payload CMS |

---

## 6. Secciones de la home (`/`)

| Sección | Componente | Id |
|---|---|---|
| Hero principal | `HeroLeft` | `#inicio` |
| Conoce nuestro menú | `MenuCategories` | `#menu-categorias` |
| Nuestras tiendas | `StoresCards` | `#tiendas` |
| Nuestra historia | `OurStory` | `#nosotros` |
| Catering promo | `CateringPromo2` | `#catering-pedido` |
| Footer / Contacto | `Footer` | `#contacto` |

---

## 7. Componentes principales (`src/components/catalog/`)

| Componente | Función |
|---|---|
| `Header.tsx` | Nav fija, transparente en scroll, modal de ecommerce, menú móvil |
| `Footer.tsx` | Footer blanco con nav, tiendas y contacto |
| `HeroLeft.tsx` | Hero de la home con video + parallax de scroll |
| `HeroNosotros.tsx` | Hero de la página Nosotros con imagen estática |
| `MenuCategories.tsx` | Grid de categorías con hover reveal + apertura de modal de tienda |
| `StoresCards.tsx` | Carrusel draggable de tiendas |
| `StoreCard.tsx` | Card individual de tienda con slideshow en hover |
| `EcommerceModal.tsx` | Modal de selección de tienda ecommerce |
| `CateringPromo2.tsx` | Sección "Socado en tu evento" |
| `OurStory.tsx` | Sección de historia con clip-path animado en scroll |
| `RadialTimeline.tsx` | Timeline circular interactivo con arco SVG animado |
| `Promotion.tsx` | Sección de promociones con rotación automática cada 4s |
| `BoxBuilder.tsx` | Constructor de box de catering por slots |
| `CartDrawer.tsx` | Drawer lateral del carrito |
| `ProductCard.tsx` | Card de producto en el catálogo de catering |
| `HowItWorksCatering.tsx` | Pasos del proceso de catering |
| `ViewModeToggle.tsx` | Toggle entre modo libre y modo box |

---

## 8. Colecciones de Payload CMS (`src/collections/`)

| Colección | Slug API | Descripción |
|---|---|---|
| Products | `/api/products` | Catálogo de productos |
| Categories | `/api/categories` | Categorías del menú (para catálogo libre) |
| Cat_categories | `/api/cat-categories` | Categorías de catering (para BoxBuilder slots) |
| Cat_combos | `/api/cat-combos` | Boxes de catering con reglas por slot |
| Macrocategorias | `/api/macrocategories` | Grupos de alto nivel (Desayuno, Almuerzo, etc.) |
| Subcategories | `/api/subcategories` | Subcategorías de filtrado |
| Stores | `/api/stores` | Tiendas físicas |
| Promotions | `/api/promotions` | Promociones de la sección Promotions |
| Quotes | `/api/quotes` | Cotizaciones de catering (solo admin) |
| Taxes | `/api/taxes` | Impuestos |
| DiscountRules | `/api/discount-rules` | Reglas de descuento |
| Media | `/api/media` | Archivos de medios |
| Users | `/api/users` | Usuarios admin |

---

## 9. Módulo de catering — reglas clave

### Modos de selección
1. **Modo libre** — el cliente navega por macrocategoría → categoría → subcategoría y agrega productos individualmente.
2. **Arma tu Box** — el cliente selecciona un combo/box predefinido y elige productos para cada slot.

### Estructura de Box (`Cat_combos`)
```
combo {
  name, description, image, pricePerPerson, priceTenPeople,
  rules: [{
    category: Cat_category,
    allowedQuantity: number,
    allowedProducts?: Product[]  // si está definido, solo estos productos van en este slot
  }]
}
```

**Lógica de filtrado en BoxBuilder:**
- Si `rule.allowedProducts` tiene elementos → muestra solo esos productos.
- Si está vacío → muestra todos los productos de esa categoría (fallback).

### Flujo de cotización
1. Cliente arma su selección (libre o box).
2. Carrito en Zustand acumula los ítems.
3. `CartDrawer` muestra resumen lateral.
4. Cliente va a `/catering/checkout` → llena datos del evento.
5. Submit → `POST /api/cotizaciones` → servicio persiste y envía emails.

---

## 10. Imágenes del menú (`public/images/menu/`)

| Archivo | Categoría |
|---|---|
| `ensaladas.png` | Ensaladas |
| `wraps_new.jpg` | Sándwiches y Wraps |
| `allday.png` | All Day Brunch |
| `bolleria.jpg` | Bollería |
| `cafe.jpg` | Café y Cacao |
| `tea.png` | Refreshers & Tea |
| `snacks.png` | Snacks |
| `prostres.png` | Postres |

---

## 11. Convenciones de código

### Lenguaje
- **Código, comentarios, documentación técnica:** inglés.
- **Contenido visible al usuario (web):** español.
- **Expresiones de marca:** respetar el original (`"Arma tu box"`, `"Simplemente Elegante"`, etc.).

### Animaciones
- Librería: `motion/react` (Motion v12). No usar `framer-motion` directamente.
- `whileInView` con `viewport={{ once: false }}` para que las animaciones se repitan al volver a la sección.
- CSS transitions para microinteracciones simples (hover, etc.).
- Respetar `prefers-reduced-motion`.

### Arquitectura de capas (obligatoria)
```
Presentación → Transporte → Servicio → Datos → Base de datos
```
- Los componentes **no** consultan la DB directamente.
- La lógica de negocio vive en `src/lib/services/`.
- Precios, descuentos e impuestos se validan en el servidor.

### Tokens y estilos
- Usar tokens de `src/app/(frontend)/styles.css`.
- Preferir utilidades Tailwind nombradas sobre valores hexadecimales crudos.
- `font-raleway` para headings, `font-outfit` para body.

---

## 12. Variables de entorno necesarias

```env
# Base de datos
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=...

# Media
BLOB_READ_WRITE_TOKEN=...

# Email (pendiente de configurar)
EMAIL_FROM=noreply@socadocafe.com
EMAIL_COMERCIAL=ventas@socadocafe.com
# + credenciales del proveedor SMTP o API
```

---

## 13. Comandos principales

```bash
pnpm dev              # Servidor de desarrollo (Next.js + Payload)
pnpm build            # Build de producción
pnpm generate:types   # Regenerar payload-types.ts tras cambiar colecciones
pnpm generate:importmap  # Regenerar import map de Payload
pnpm test:int         # Tests de integración (Vitest)
pnpm test:e2e         # Tests end-to-end (Playwright)
```

> Siempre regenerar tipos (`pnpm generate:types`) después de modificar una colección de Payload.

---

## 14. Estado actual del proyecto (agosto 2025)

### Implementado ✅
- Home completa: hero, menú, tiendas, historia, catering promo, footer.
- Modal de selección de tienda ecommerce.
- Página `/nosotros` con hero, historia y timeline.
- Catálogo de catering: navegación libre por macrocategoría/categoría.
- BoxBuilder con slots por categoría y filtrado por `allowedProducts`.
- Carrito con Zustand + CartDrawer.
- Animaciones de entrada (`whileInView`) en secciones principales.
- Promociones con rotación automática cada 4 segundos.
- Panel admin Payload CMS funcional.

### Pendiente 🔲
- Flujo completo de cotización: `POST /api/cotizaciones`, servicio, emails.
- Página `/catering/checkout` con formulario y resumen.
- `CartSummaryBar` flotante en `/catering`.
- Colección `Cotizaciones` en Payload.
- Integración con proveedor de email (nodemailer / Resend / SendGrid).
- Tests de integración para lógica de cotización.
