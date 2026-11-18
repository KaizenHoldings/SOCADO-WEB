import type { Payload } from 'payload'
import type { PassType } from '@/payload-types'
import type { BandColor } from '@/lib/services/workclub-passes.service'
import { WORKCLUB_RESERVA_URL, WORKCLUB_VISITA_URL } from '@/lib/constants/links'

/**
 * Default records of the /workclub packages section.
 *
 * The seed is idempotent and never destructive: every record is looked up by
 * slug, created when it is missing and left untouched when it already exists,
 * so running it again does not undo what was edited in the admin. Pass types
 * are written first, because each plan needs the id of the one it belongs to.
 *
 * The content below is the copy the landing shipped with. From here on the
 * admin is the source of truth; this file only matters for a fresh database.
 */

type CtaVariant = 'outline' | 'solid'

interface PassTypeSeed {
  slug: string
  name: string
  eyebrow: string
  description: string
  note: string
  noteHighlight?: string
  /** Background of the band while this tab is open. */
  bandColor: BandColor
  ctaLabelDefault: string
  ctaVariantDefault: CtaVariant
  order: number
}

interface PlanSeed {
  slug: string
  /** Pass type this plan belongs to, resolved to an id before creating it. */
  passTypeSlug: string
  name: string
  description: string
  priceMode: 'single' | 'rooms'
  price?: number
  priceUnit?: string
  rooms?: { name: string; price: number; unit: string }[]
  roomsNote?: string
  highlight?: string
  features: string[]
  order: number
}

const PASS_TYPES: PassTypeSeed[] = [
  {
    slug: 'workclub-pass',
    name: 'workclub pass',
    eyebrow: '',
    description: 'acceso por día, por paquete de días o por hora de sala',
    note: 'todos los pass incluyen',
    noteHighlight: '1 café básico de socado',
    bandColor: 'wc-verde-claro',
    ctaLabelDefault: 'reservar',
    ctaVariantDefault: 'outline',
    order: 1,
  },
  {
    slug: 'member-pass',
    name: 'member pass',
    eyebrow: '',
    description: 'membresías de 30 días con beneficios socado incluidos',
    note: 'todas las membresías incluyen beneficios en café socado',
    bandColor: 'wc-marron-medio',
    ctaLabelDefault: 'unirme',
    ctaVariantDefault: 'solid',
    order: 2,
  },
]

/** Benefits shared by the two top memberships. */
const MEMBER_FEATURES = [
  '15% de descuento en productos socado',
  '5 cafés básicos por período de membresía',
  'acceso ilimitado a café socado by socado (precio especial)',
]

const PLANS: PlanSeed[] = [
  {
    slug: 'day-pass',
    passTypeSlug: 'workclub-pass',
    name: 'day pass',
    description: 'acceso por un día a la zona hot desk.',
    priceMode: 'single',
    price: 25,
    priceUnit: 'por día',
    features: ['1 café básico socado'],
    order: 1,
  },
  {
    slug: '10-pack',
    passTypeSlug: 'workclub-pass',
    name: '10-pack',
    description: '10 días de acceso a la zona hot desk, utilizables dentro de 60 días.',
    priceMode: 'single',
    price: 180,
    priceUnit: 'por paquete',
    features: ['1 café básico socado'],
    order: 2,
  },
  {
    slug: 'reserva-de-sala',
    passTypeSlug: 'workclub-pass',
    name: 'reserva de sala',
    description: 'reserva de sala por hora, según capacidad y disponibilidad.',
    priceMode: 'rooms',
    rooms: [
      { name: 'sala 1', price: 25, unit: '/h' },
      { name: 'sala 2', price: 35, unit: '/h' },
      { name: 'sala eventos', price: 50, unit: '/h' },
    ],
    roomsNote: 'sala eventos: mínimo 2 horas',
    highlight: 'catering exclusivo socado',
    features: ['1 café básico socado'],
    order: 3,
  },
  {
    slug: 'hot-desk-member',
    passTypeSlug: 'member-pass',
    name: 'hot desk member',
    description: 'membresía de 30 días para trabajar desde la zona hot desk.',
    priceMode: 'single',
    price: 250,
    priceUnit: 'por 30 días',
    features: [
      '5 cafés básicos por período de membresía',
      'acceso ilimitado a café socado by socado (precio especial)',
    ],
    order: 1,
  },
  {
    slug: 'spot-member',
    passTypeSlug: 'member-pass',
    name: 'spot member',
    description: 'membresía de 30 días con puesto fijo asignado.',
    priceMode: 'single',
    price: 400,
    priceUnit: 'por 30 días',
    features: MEMBER_FEATURES,
    order: 2,
  },
  {
    slug: 'studio-member',
    passTypeSlug: 'member-pass',
    name: 'studio member',
    description: 'membresía de 30 días con oficina privada asignada.',
    priceMode: 'single',
    price: 750,
    priceUnit: 'por 30 días',
    features: MEMBER_FEATURES,
    order: 3,
  },
]

/** The landing's link constants are still placeholders; those are not seeded. */
function realUrlOrUndefined(url: string): string | undefined {
  return url && url !== '#' ? url : undefined
}

const FOOTNOTE =
  'café básico: espresso, americano, cappuccino, latte, flat white o macchiato con leche animal de preferencia.'

/**
 * Version of this seed, recorded in `workclub-settings.seedVersion`.
 *
 * Creating records is idempotent on its own, by slug. Corrections to records
 * that already exist are not, so they are gated on this number and run once
 * per database:
 *
 * - 2: band colour of the pass types. `bandColor` was added to a schema that
 *   already had rows, and the column default left every band on the original
 *   green, so the colour picked for each type is written once here.
 */
const SEED_VERSION = 2

/**
 * Band every pass type had before the colour was configurable, and the value
 * the new column defaults to. A band still on it was never chosen.
 *
 * Declared here, not imported from the service: this file runs as a plain
 * script, and the service reaches the data layer and `next/cache` with it.
 */
const LEGACY_BAND_COLOR: BandColor = 'wc-verde'

export async function seedWorkclub(payload: Payload): Promise<void> {
  let created = 0
  let updated = 0
  let skipped = 0

  /** Ids of every pass type, whether it was created now or already existed. */
  const passTypeIds = new Map<string, PassType['id']>()

  const settings = await payload.findGlobal({ slug: 'workclub-settings', depth: 0 })
  const appliedVersion = settings?.seedVersion ?? 0

  for (const passType of PASS_TYPES) {
    const existing = await payload.find({
      collection: 'pass-types',
      where: { slug: { equals: passType.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      passTypeIds.set(passType.slug, doc.id)

      /*
        Band colour of a type that already existed.

        `bandColor` was added to a schema with rows in it, and the column
        default put every band on the original green, so an empty value and a
        green one both mean "never chosen". Writing the colour is therefore
        gated on `SEED_VERSION`: it happens once, and from then on the admin
        owns the field, green included.
      */
      const bandNeverChosen = !doc.bandColor || doc.bandColor === LEGACY_BAND_COLOR

      if (
        appliedVersion < 2 &&
        bandNeverChosen &&
        doc.bandColor !== passType.bandColor
      ) {
        await payload.update({
          collection: 'pass-types',
          id: doc.id,
          data: { bandColor: passType.bandColor },
        })
        updated += 1
      } else {
        skipped += 1
      }

      continue
    }

    const doc = await payload.create({
      collection: 'pass-types',
      data: { ...passType, active: true },
    })

    passTypeIds.set(passType.slug, doc.id)
    created += 1
  }

  for (const plan of PLANS) {
    const existing = await payload.find({
      collection: 'plans',
      where: { slug: { equals: plan.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      skipped += 1
      continue
    }

    const passTypeId = passTypeIds.get(plan.passTypeSlug)

    if (!passTypeId) {
      payload.logger.warn(
        `[seed:workclub] plan "${plan.slug}" omitido: no se encontró el tipo de pass "${plan.passTypeSlug}".`,
      )
      skipped += 1
      continue
    }

    const { passTypeSlug: _passTypeSlug, features, ...rest } = plan

    await payload.create({
      collection: 'plans',
      data: {
        ...rest,
        passType: passTypeId,
        features: features.map((text) => ({ text })),
        active: true,
      },
    })

    created += 1
  }

  // The global is only completed where it is still empty.
  const settingsPatch: Record<string, string | number> = {}
  if (!settings?.reservaUrl) {
    const url = realUrlOrUndefined(WORKCLUB_RESERVA_URL)
    if (url) settingsPatch.reservaUrl = url
  }
  if (!settings?.visitaUrl) {
    const url = realUrlOrUndefined(WORKCLUB_VISITA_URL)
    if (url) settingsPatch.visitaUrl = url
  }
  if (!settings?.footnote) settingsPatch.footnote = FOOTNOTE
  if (appliedVersion < SEED_VERSION) settingsPatch.seedVersion = SEED_VERSION

  if (Object.keys(settingsPatch).length > 0) {
    await payload.updateGlobal({ slug: 'workclub-settings', data: settingsPatch })
    created += 1
  } else {
    skipped += 1
  }

  payload.logger.info(
    `[seed:workclub] ${created} registro(s) creado(s), ${updated} completado(s), ${skipped} ya existente(s) y sin cambios.`,
  )
}

export default seedWorkclub
