/**
 * Single source of truth for the catering image specification report.
 *
 * The dimension figures below are derived from the sizing classes, aspect-ratio
 * utilities and grid column counts declared in the catering components. Update
 * this file when a layout changes, and the generated report follows.
 */

/**
 * The generator runs Socado on its own port rather than the default 3000, so a
 * dev server for an unrelated project already occupying 3000 cannot be picked
 * up by mistake. Override with VISUAL_PORT or PLAYWRIGHT_BASE_URL if needed.
 */
export const VISUAL_PORT = process.env.VISUAL_PORT || '3100'
export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${VISUAL_PORT}`

/** Text that must appear on the served page for it to be the Socado app. */
export const IDENTITY_MARKER = 'Socado'

export type ViewportKey = 'mobile' | 'tablet' | 'desktop'

export interface Viewport {
  key: ViewportKey
  /** Label shown to the design team. */
  label: string
  width: number
  height: number
}

export const VIEWPORTS: Viewport[] = [
  { key: 'mobile', label: 'Mobile', width: 375, height: 812 },
  { key: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  { key: 'desktop', label: 'Desktop', width: 1280, height: 900 },
]

export interface ComponentSpec {
  /** Slug used for screenshot filenames: `${key}-${viewport}.png` */
  key: string
  /** Display name in the report. */
  name: string
  /** Plain-language description of where the image appears. */
  where: string
  /** Structural aspect ratio. */
  ratio: string
  resolutions: Record<ViewportKey, string>
  /** Whether the capture step attempts a screenshot for this component. */
  hasScreenshot: boolean
}

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    key: 'catering-hero',
    name: 'Hero de Catering',
    where:
      'Imagen a pantalla completa que recibe al visitante al entrar a la sección de catering. Su proporción cambia según el dispositivo: vertical en teléfonos, horizontal en escritorio.',
    ratio: '9:16 → 16:9',
    resolutions: {
      mobile: '1080 × 1920',
      tablet: '1600 × 2100',
      desktop: '2560 × 1440',
    },
    hasScreenshot: true,
  },
  {
    key: 'mode-selector',
    name: 'Paneles del Selector de Modalidad',
    where:
      'Las dos imágenes que presentan las opciones «Individuales» y «Compartir». Se muestran apiladas en teléfonos y lado a lado desde tablet.',
    ratio: '9:10 → 9:8',
    resolutions: {
      mobile: '1080 × 1200',
      tablet: '1100 × 1900',
      desktop: '1920 × 1700',
    },
    hasScreenshot: true,
  },
  {
    key: 'category-carousel',
    name: 'Tarjetas de Categoría y Box',
    where:
      'Tarjetas verticales del carrusel horizontal que permite elegir categoría de producto o tipo de box.',
    ratio: '4:5 → 2:3',
    resolutions: {
      mobile: '840 × 1050',
      tablet: '960 × 1200',
      desktop: '1000 × 1500',
    },
    hasScreenshot: true,
  },
  {
    key: 'product-card',
    name: 'Tarjeta de Producto',
    where:
      'Fotografía de cada producto dentro de la grilla del catálogo y del armador de boxes. Mantiene una proporción constante en todos los dispositivos.',
    ratio: '4:5',
    resolutions: {
      mobile: '600 × 750',
      tablet: '600 × 750',
      desktop: '800 × 1000',
    },
    hasScreenshot: true,
  },
  {
    key: 'box-builder',
    name: 'Armador de Boxes',
    where:
      'Vista donde se arma un box individual, combinando el carrusel de categorías con la grilla de productos.',
    ratio: '4:5',
    resolutions: {
      mobile: '600 × 750',
      tablet: '600 × 750',
      desktop: '800 × 1000',
    },
    hasScreenshot: true,
  },
  {
    key: 'variations-band',
    name: 'Banda del Panel de Variaciones',
    where:
      'Franja horizontal ubicada en la parte superior del panel lateral donde se eligen las versiones de un producto.',
    ratio: '4:1',
    resolutions: {
      mobile: '1200 × 340',
      tablet: '1200 × 300',
      desktop: '1200 × 300',
    },
    hasScreenshot: false,
  },
  {
    key: 'cart-thumbnail',
    name: 'Miniatura del Carrito',
    where: 'Imagen cuadrada de cada producto dentro del panel de cotización.',
    ratio: '1:1',
    resolutions: {
      mobile: '240 × 240',
      tablet: '240 × 240',
      desktop: '240 × 240',
    },
    hasScreenshot: false,
  },
  {
    key: 'checkout-thumbnail',
    name: 'Miniatura del Checkout',
    where: 'Imagen cuadrada de cada producto en el resumen final de la cotización.',
    ratio: '1:1',
    resolutions: {
      mobile: '200 × 200',
      tablet: '200 × 200',
      desktop: '200 × 200',
    },
    hasScreenshot: false,
  },
  {
    key: 'isotipo',
    name: 'Isotipo de Marca',
    where:
      'Versión en mapa de bits del isotipo, utilizada en encabezados y como imagen de reemplazo cuando un producto aún no tiene fotografía cargada.',
    ratio: '1:1',
    resolutions: {
      mobile: '108 × 108',
      tablet: '108 × 108',
      desktop: '108 × 108',
    },
    hasScreenshot: false,
  },
]

/** Screenshot filename for a component at a given viewport. */
export function screenshotName(componentKey: string, viewport: ViewportKey): string {
  return `${componentKey}-${viewport}.png`
}
