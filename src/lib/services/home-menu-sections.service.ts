import { fetchHomeMenuSections } from '@/lib/data/home-menu-sections.data'

/** Normalised shape consumed by the presentation layer. */
export interface HomeMenuSectionItem {
  id: string
  title: string
  description: string
  /** Absolute or root-relative URL ready for next/image `src`. */
  image: string
  order: number
}

/**
 * Static fallback shown when the CMS collection is empty or unavailable.
 * Mirrors the eight categories that were previously hardcoded in MenuCategories.tsx.
 */
const STATIC_FALLBACK: HomeMenuSectionItem[] = [
  {
    id: 'static-1',
    title: 'Ensaladas',
    description:
      'Una variedad de bowls y ensaladas que combinan proteínas, vegetales, granos y aderezos llenos de sabor. Opciones completas, coloridas y equilibradas, pensadas para disfrutar una comida diferente sin dejar de lado el gusto.',
    image: '/images/menu/ensaladas.png',
    order: 1,
  },
  {
    id: 'static-2',
    title: 'Sándwiches y Wraps',
    description:
      'Una selección de preparaciones prácticas y completas, elaboradas con panes, tortillas, proteínas, vegetales y diferentes salsas. Desde combinaciones clásicas hasta opciones más ligeras y variadas, ideales para disfrutar en cualquier momento del día.',
    image: '/images/menu/wraps_new.jpg',
    order: 2,
  },
  {
    id: 'static-3',
    title: 'All Day Brunch',
    description:
      'Una propuesta pensada para disfrutar el brunch a cualquier hora del día, con alternativas dulces y saladas. Bagels, tostadas, muffins y panquecas que combinan ingredientes variados para crear opciones completas y llenas de sabor.',
    image: '/images/menu/allday.png',
    order: 3,
  },
  {
    id: 'static-4',
    title: 'Bollería',
    description:
      'Una selección de productos horneados que combina opciones clásicas y variadas para cualquier momento del día. Cachitos, croissants, empanadas y quiches con diferentes rellenos, ideales para desayunar, merendar o acompañar tu café.',
    image: '/images/menu/bolleria.jpg',
    order: 4,
  },
  {
    id: 'static-5',
    title: 'Café y Cacao',
    description:
      'Una selección de bebidas calientes y frías preparadas a base de café y cacao. Desde espressos y americanos hasta opciones con leche, sabores y distintas texturas, pensadas para acompañarte en cualquier momento del día.',
    image: '/images/menu/cafe.jpg',
    order: 5,
  },
  {
    id: 'static-6',
    title: 'Refreshers & Tea',
    description:
      'Una selección de bebidas refrescantes e infusiones para disfrutar frías o calientes. Limonadas frutales, matcha, hojicha, chai y diferentes variedades de té se combinan con sabores y preparaciones para cada preferencia.',
    image: '/images/menu/tea.png',
    order: 6,
  },
  {
    id: 'static-7',
    title: 'Snacks',
    description:
      'Una selección ligera y variada para complementar cualquier momento del día. Avena, chía, frutas, yogures y granola se combinan en opciones prácticas, con distintas texturas y sabores para disfrutar entre comidas.',
    image: '/images/menu/snacks.png',
    order: 7,
  },
  {
    id: 'static-8',
    title: 'Postres',
    description:
      'Una variedad de cookies, muffins, tortas y brownies para acompañar el café o disfrutar algo dulce. Incluye recetas clásicas y una selección de postres Zero, con alternativas sin azúcar añadida y opciones libres de gluten.',
    image: '/images/menu/prostres.png',
    order: 8,
  },
]

/** Resolve a Payload media field (expanded or raw) to a usable URL string. */
function resolveImageUrl(
  image: HomeMenuSectionItem['image'] | { url?: string | null; filename?: string | null } | null | undefined,
): string {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object' && image !== null) {
    if ('url' in image && image.url) return image.url
    if ('filename' in image && image.filename) return `/api/media/file/${image.filename}`
  }
  return ''
}

export class HomeMenuSectionsService {
  /**
   * Returns all home menu section cards sorted by order.
   * Falls back to the static list when the CMS collection is empty or throws.
   */
  static async getAll(): Promise<HomeMenuSectionItem[]> {
    try {
      const docs = await fetchHomeMenuSections()

      if (!docs || docs.length === 0) {
        return STATIC_FALLBACK
      }

      return docs.map((doc) => ({
        id: String(doc.id),
        title: doc.title,
        description: doc.description ?? '',
        image: resolveImageUrl(doc.image as any),
        order: doc.order ?? 0,
      }))
    } catch (error) {
      console.error('[HomeMenuSectionsService] Error fetching home menu sections:', error)
      return STATIC_FALLBACK
    }
  }
}
