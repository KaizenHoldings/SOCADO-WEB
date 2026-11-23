import { fetchWorkclubPasses, type WorkclubPassesRaw } from '@/lib/data/workclub-passes.data'
import { WORKCLUB_RESERVA_URL, WORKCLUB_VISITA_URL } from '@/lib/constants/links'
import type { PassType, Plan } from '@/payload-types'

/**
 * The /workclub packages section, assembled for the presentation layer.
 *
 * It groups the plans under their pass type, resolves the CTA each card
 * inherits from its type, turns prices into the strings the cards render, and
 * flattens the info cards of the type into a shape the components can walk.
 * Nothing here knows about React: the landing receives plain data.
 */

export type CtaVariant = 'outline' | 'solid'

/**
 * Background of the band above the cards, chosen per pass type in the admin.
 *
 * Only the token name travels: turning it into classes is a presentation
 * decision, and so is the text tone each background needs. Every value here
 * reaches AA contrast with the tone the landing pairs it with.
 */
export const BAND_COLORS = [
  'wc-verde',
  'wc-verde-medio',
  'wc-verde-claro',
  'wc-marron',
  'wc-marron-medio',
  'wc-terracota',
] as const

export type BandColor = (typeof BAND_COLORS)[number]

/** Band of the section before it was configurable. */
export const DEFAULT_BAND_COLOR: BandColor = 'wc-verde'

/**
 * An unknown value in the database would leave the band without a background,
 * so anything outside the list falls back to the original green.
 */
function bandColorOf(value?: string | null): BandColor {
  return (BAND_COLORS as readonly string[]).includes(value ?? '')
    ? (value as BandColor)
    : DEFAULT_BAND_COLOR
}

export interface Pass {
  /** Sent to the booking system as `?paquete=<slug>`. */
  slug: string
  name: string
  description: string
  /** Reference price, digits only. */
  price: string
  /** Word before the price, e.g. "ref.". */
  pricePrefix: string
  /** Glued to the price, e.g. "/h". */
  priceSuffix?: string
  /** Legend under the price, e.g. "por día" or "desde · según sala". */
  period: string
  /** Pills under the legend, in order. */
  chips: string[]
  /** One thin line under the pills. */
  secondaryLine?: string
  /** Lines of the "más información" modal; empty when the plan has none. */
  details: string[]
  /** Heading over those lines. Empty falls back to "incluye" in the modal. */
  detailsTitle?: string
  /**
   * This plan is an exception to what its pass type gives everyone, so the
   * modal does not repeat the type's "incluyen" card for it.
   */
  excludesGroupBenefits: boolean
  /** Button label. */
  cta: string
  ctaVariant: CtaVariant
  /** Button destination. */
  ctaHref: string
  /** Slug appended as `?paquete=…`; absent when the plan sets its own URL. */
  ctaPaquete?: string
}

/** One benefit of an `includes` card: a bold line and its detail. */
export interface InfoItem {
  title: string
  detail: string
}

/** One row of a `table` card. */
export interface InfoRow {
  label: string
  /** Thin aside next to the label; only shown in the `split` layout. */
  note?: string
  value: string
}

export interface InfoCardIncludes {
  type: 'includes'
  title: string
  items: InfoItem[]
}

export interface InfoCardTable {
  type: 'table'
  title: string
  subtitle: string
  /** `inline`: "sala 1: 1 crédito por hora". `split`: label left, value right. */
  layout: 'inline' | 'split'
  rows: InfoRow[]
}

/** Cards under the price row. The admin decides how many and in what order. */
export type InfoCard = InfoCardIncludes | InfoCardTable

/** Centred note under the info cards: a bold label and its text. */
export interface PassFootnote {
  label: string
  text: string
}

export interface PassGroup {
  /** Pass type slug, also the value used in `?pass=` on the landing. */
  id: string
  /** Tab label. */
  name: string
  /** Small line over the section title. */
  eyebrow: string
  /** Shown under the tab selector. */
  description: string
  /**
   * Line next to the check icon under the selector.
   *
   * Legacy: the current design carries what a pass includes in its `includes`
   * card, so this is empty in the default content and the band drops the line.
   */
  note: string
  /** Part of `note` set in semibold. */
  noteHighlight?: string
  /** Palette token for the band of this tab, e.g. `wc-verde-claro`. */
  bandColor: BandColor
  passes: Pass[]
  infoCards: InfoCard[]
  footnote?: PassFootnote
}

export interface WorkclubPasses {
  groups: PassGroup[]
  /**
   * Small print of the global settings.
   *
   * The packages section no longer shows it — each pass type carries its own
   * footnote — but it stays available for the rest of the landing.
   */
  footnote: string
  reservaUrl: string
  visitaUrl: string
}

const DEFAULT_PRICE_PREFIX = 'ref.'

const FALLBACK_FOOTNOTE =
  'café básico: espresso, americano, cappuccino, latte, flat white o macchiato con leche animal de preferencia.'

/**
 * Content shown when Payload is unreachable or still has no pass type with
 * plans — the copy the section ships with, in the same shape the mapping
 * produces, so it looks identical either way.
 *
 * It is a fallback, not a source of truth: the admin owns this content, and
 * these records are written on a fresh database by `src/seed/workclub.ts` and
 * `src/seed/workclub-v2.ts`.
 */
/**
 * Lo que muestra el modal de spot y studio member, tal y como lo pidieron.
 *
 * Literal: "lunes y viernes" es lo que llegó en la petición. Dicho así son dos
 * días sueltos, no un rango — casi seguro querían "lunes a viernes", pero un
 * horario es un dato, no una redacción, y no es mío para corregirlo. Está
 * marcado en la entrega para que lo confirmen.
 */
const WEEK_ACCESS = 'acceso lunes y viernes de 7 am a 9 pm'
const WEEKEND_ACCESS = 'acceso fines de semana y feriado de 8 am a 8 pm'

/**
 * Salas y tarifas dentro del modal de "reserva de sala".
 *
 * Repite las tarifas de la tarjeta "tarifas de salas" de la página y añade el
 * aforo, que allí no cabe. La tarjeta se queda como está: es información del
 * tipo de pass, y esto es lo que se lee sin salir del modal.
 */
const ROOM_DETAILS = [
  'sala 1: hasta 4 personas · ref. 25/h',
  'sala 2: hasta 8 personas · ref. 35/h',
  'sala eventos: mínimo 2 horas · ref. 50/h',
]

const SPOT_DETAILS = [
  'arturito personal',
  'internet de alta velocidad',
  WEEK_ACCESS,
  WEEKEND_ACCESS,
]

const STUDIO_DETAILS = [
  'oficina privada con acceso exclusivo',
  'internet de alta velocidad',
  WEEK_ACCESS,
  WEEKEND_ACCESS,
]

export const WORKCLUB_PASSES_FALLBACK: PassGroup[] = [
  {
    id: 'workclub-pass',
    name: 'workclub pass',
    eyebrow: '',
    description: 'acceso por día, por paquete de días o por hora de sala',
    note: '',
    bandColor: 'wc-verde-claro',
    passes: [
      {
        slug: 'day-pass',
        name: 'day pass',
        description: 'acceso por un día a la zona hot desk.',
        price: '25',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        period: 'por día',
        chips: ['1 café socado'],
        details: [],
        excludesGroupBenefits: false,
        cta: 'más información',
        ctaVariant: 'outline',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: 'day-pass',
      },
      {
        slug: '10-pack',
        name: '10-pack',
        description: '10 días de acceso a la zona hot desk.',
        price: '180',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        period: 'por paquete',
        chips: ['utilizable en 60 días', '1 café socado'],
        details: [],
        excludesGroupBenefits: false,
        cta: 'más información',
        ctaVariant: 'outline',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: '10-pack',
      },
      {
        slug: 'reserva-de-sala',
        name: 'reserva de sala',
        description: 'reserva por hora, según capacidad y disponibilidad.',
        price: '25',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        priceSuffix: '/h',
        period: 'desde · según sala',
        // Sin café socado: este plan es la excepción del tipo de pass.
        chips: ['catering exclusivo socado'],
        details: ROOM_DETAILS,
        detailsTitle: 'salas y tarifas',
        excludesGroupBenefits: true,
        cta: 'más información',
        ctaVariant: 'outline',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: 'reserva-de-sala',
      },
    ],
    infoCards: [
      {
        type: 'includes',
        title: 'incluye:',
        items: [
          {
            title: '1 café socado',
            detail:
              'espresso, americano, cappuccino, latte, flat white o macchiato con leche animal.',
          },
        ],
      },
      {
        type: 'table',
        title: 'tarifas de salas',
        subtitle: 'precio por hora, según la sala.',
        layout: 'split',
        rows: [
          { label: 'sala 1', value: 'ref. 25/h' },
          { label: 'sala 2', value: 'ref. 35/h' },
          { label: 'sala eventos', note: 'mínimo 2 horas', value: 'ref. 50/h' },
        ],
      },
    ],
  },
  {
    id: 'member-pass',
    name: 'member pass',
    eyebrow: 'socado',
    description: 'membresías de 30 días con beneficios socado incluidos',
    note: '',
    bandColor: 'wc-marron-medio',
    passes: [
      {
        slug: 'hot-desk-member',
        name: 'hot desk member',
        description: 'acceso flexible para trabajar desde la zona hot desk.',
        price: '250',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        period: 'por 30 días',
        chips: ['2 créditos incluidos'],
        secondaryLine: '10 páginas por período',
        details: [],
        excludesGroupBenefits: false,
        cta: 'más información',
        ctaVariant: 'solid',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: 'hot-desk-member',
      },
      {
        slug: 'spot-member',
        name: 'spot member',
        description: 'puesto fijo asignado para trabajar todos los días.',
        price: '400',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        period: 'por 30 días',
        chips: ['4 créditos incluidos'],
        secondaryLine: '20 páginas por período',
        details: SPOT_DETAILS,
        excludesGroupBenefits: false,
        cta: 'más información',
        ctaVariant: 'solid',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: 'spot-member',
      },
      {
        slug: 'studio-member',
        name: 'studio member',
        description: 'oficina privada asignada para mayor privacidad y enfoque.',
        price: '750',
        pricePrefix: DEFAULT_PRICE_PREFIX,
        period: 'por 30 días',
        chips: ['6 créditos incluidos'],
        secondaryLine: '30 páginas por período',
        details: STUDIO_DETAILS,
        excludesGroupBenefits: false,
        cta: 'más información',
        ctaVariant: 'solid',
        ctaHref: WORKCLUB_RESERVA_URL,
        ctaPaquete: 'studio-member',
      },
    ],
    infoCards: [
      {
        type: 'includes',
        title: 'incluye:',
        items: [
          { title: '15% de descuento', detail: 'en productos socado' },
          { title: '5 cafés socado', detail: 'por período de membresía' },
          { title: 'acceso a café socado by socado', detail: 'precio especial' },
          { title: '20% off', detail: 'en alquiler de salas' },
        ],
      },
      {
        type: 'table',
        title: '¿cómo funcionan los créditos?',
        subtitle: 'se usan para reservar salas.',
        layout: 'inline',
        rows: [
          { label: 'sala 1', value: '1 crédito por hora' },
          { label: 'sala 2', value: '1.5 créditos por hora' },
          { label: 'sala eventos', value: '2.5 créditos por hora' },
        ],
      },
    ],
    footnote: {
      label: 'cafés socado:',
      text: 'espresso, americano, cappuccino, latte, flat white o macchiato con leche animal.',
    },
  },
]

const FALLBACK: WorkclubPasses = {
  groups: WORKCLUB_PASSES_FALLBACK,
  footnote: FALLBACK_FOOTNOTE,
  reservaUrl: WORKCLUB_RESERVA_URL,
  visitaUrl: WORKCLUB_VISITA_URL,
}

/** Id of a relationship field, whether it came expanded or as a raw id. */
function relationId(value: Plan['passType']): string {
  if (value && typeof value === 'object') return String(value.id)
  return String(value)
}

function trimmed(value?: string | null): string | undefined {
  const text = value?.trim()
  return text ? text : undefined
}

function mapPass(
  plan: Plan,
  group: { ctaLabel: string; ctaVariant: CtaVariant; reservaUrl: string },
): Pass {
  // A plan with its own URL goes straight there; otherwise the booking system
  // receives the slug of the package.
  const ownUrl = trimmed(plan.ctaUrl)

  /*
    The price is always a single figure, whatever `priceMode` says: per-room
    rates are written as a `table` block of the pass type now. `rooms`,
    `roomsNote`, `highlight` and `features` stay in the collection for the data
    already stored, and are deliberately not mapped.
  */
  return {
    slug: plan.slug,
    name: plan.name,
    description: trimmed(plan.description) ?? '',
    price: typeof plan.price === 'number' ? String(plan.price) : '',
    pricePrefix: trimmed(plan.pricePrefix) ?? DEFAULT_PRICE_PREFIX,
    priceSuffix: trimmed(plan.priceSuffix),
    period: trimmed(plan.priceUnit) ?? '',
    chips: (plan.chips ?? []).map((chip) => chip.text?.trim()).filter((text): text is string => !!text),
    secondaryLine: trimmed(plan.secondaryLine),
    details: (plan.details ?? [])
      .map((detail) => detail.text?.trim())
      .filter((text): text is string => !!text),
    detailsTitle: trimmed(plan.detailsTitle),
    excludesGroupBenefits: plan.excludesGroupBenefits === true,
    cta: trimmed(plan.ctaLabel) ?? group.ctaLabel,
    ctaVariant: (plan.ctaVariant as CtaVariant | null | undefined) ?? group.ctaVariant,
    ctaHref: ownUrl ?? group.reservaUrl,
    ctaPaquete: ownUrl ? undefined : plan.slug,
  }
}

/**
 * Info cards of a pass type, in the order of the admin.
 *
 * A block with nothing to show — no benefits, no rows — is dropped rather than
 * rendered as an empty card.
 */
function mapInfoCards(blocks: PassType['infoCards']): InfoCard[] {
  const cards: InfoCard[] = []

  for (const block of blocks ?? []) {
    if (block.blockType === 'includes') {
      const items = (block.items ?? [])
        .map((item) => ({
          title: trimmed(item.title) ?? '',
          detail: trimmed(item.detail) ?? '',
        }))
        .filter((item) => item.title || item.detail)

      if (items.length > 0) {
        cards.push({ type: 'includes', title: trimmed(block.title) ?? '', items })
      }

      continue
    }

    if (block.blockType === 'table') {
      const rows = (block.rows ?? [])
        .map((row) => ({
          label: trimmed(row.label) ?? '',
          note: trimmed(row.note),
          value: trimmed(row.value) ?? '',
        }))
        .filter((row) => row.label || row.value)

      if (rows.length > 0) {
        cards.push({
          type: 'table',
          title: trimmed(block.title) ?? '',
          subtitle: trimmed(block.subtitle) ?? '',
          layout: block.layout === 'split' ? 'split' : 'inline',
          rows,
        })
      }
    }
  }

  return cards
}

/** The pass footnote only exists when it has something to say. */
function mapFootnote(passType: PassType): PassFootnote | undefined {
  const label = trimmed(passType.footnoteLabel)
  const text = trimmed(passType.footnoteText)

  if (!label && !text) return undefined

  return { label: label ?? '', text: text ?? '' }
}

/** Groups the plans under their pass type. Types without plans are dropped. */
function mapGroups(raw: WorkclubPassesRaw, reservaUrl: string): PassGroup[] {
  const plansByType = new Map<string, Plan[]>()

  for (const plan of raw.plans) {
    const key = relationId(plan.passType)
    const list = plansByType.get(key)
    if (list) list.push(plan)
    else plansByType.set(key, [plan])
  }

  return raw.passTypes
    .map((passType) => {
      const plans = plansByType.get(String(passType.id)) ?? []
      const ctaLabel = trimmed(passType.ctaLabelDefault) ?? 'reservar'
      const ctaVariant = (passType.ctaVariantDefault as CtaVariant | null | undefined) ?? 'outline'

      return {
        id: trimmed(passType.slug) ?? String(passType.id),
        name: passType.name,
        eyebrow: trimmed(passType.eyebrow) ?? '',
        description: trimmed(passType.description) ?? '',
        note: trimmed(passType.note) ?? '',
        noteHighlight: trimmed(passType.noteHighlight),
        bandColor: bandColorOf(passType.bandColor),
        passes: plans.map((plan) => mapPass(plan, { ctaLabel, ctaVariant, reservaUrl })),
        infoCards: mapInfoCards(passType.infoCards),
        footnote: mapFootnote(passType),
      }
    })
    .filter((group) => group.passes.length > 0)
}

export class WorkclubPassesService {
  /**
   * Returns the tabs of "nuestros paquetes" with their cards.
   *
   * Falls back to the shipped content when Payload fails or has no pass type
   * with active plans, so the section never renders empty.
   */
  static async get(): Promise<WorkclubPasses> {
    try {
      const raw = await fetchWorkclubPasses()
      const reservaUrl = trimmed(raw.settings?.reservaUrl) ?? WORKCLUB_RESERVA_URL
      const groups = mapGroups(raw, reservaUrl)

      if (groups.length === 0) {
        // Not an error, but it means the section is showing shipped copy
        // instead of the admin's content, which is worth knowing.
        console.warn(
          '[WorkclubPassesService] payload no devolvió ningún tipo de pass con planes activos; se usa el contenido de respaldo.',
        )
        return FALLBACK
      }

      return {
        groups,
        footnote: trimmed(raw.settings?.footnote) ?? FALLBACK_FOOTNOTE,
        reservaUrl,
        visitaUrl: trimmed(raw.settings?.visitaUrl) ?? WORKCLUB_VISITA_URL,
      }
    } catch (error) {
      console.error('[WorkclubPassesService] no se pudieron leer los paquetes:', error)
      return FALLBACK
    }
  }
}
