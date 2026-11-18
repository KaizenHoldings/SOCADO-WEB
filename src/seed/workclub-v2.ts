import type { Payload } from 'payload'
import type { PassType } from '@/payload-types'

/**
 * Design v2 of "nuestros paquetes": info cards, chips and the new copy.
 *
 * The base seed only creates what is missing, so it cannot carry a change to
 * records that already exist. This update does, under two rules:
 *
 * - `fill` writes a field only while it is still empty, so nothing an editor
 *   typed is replaced.
 * - `replace` writes a field only while it still holds the value v1 shipped.
 *   Anything else means somebody edited it in the admin: the value stays and a
 *   warning says so.
 * - `replaceText` swaps one phrase wherever it sits inside a field, which is
 *   the only way to reach the copy inside a blocks field: Payload gives every
 *   row an id, so the stored array never equals the one written here and a
 *   whole-value `replace` could not match it.
 *
 * It is seed step 6: step 2 was the band colour, step 3 the v2 content, step 4
 * the shorter pages line, step 5 a phrase inside the member info cards, and
 * step 6 the "más información" button with the detail list behind it, and
 * step 7 the monitor neither member plan turned out to have.
 * Raising the number
 * replays the whole table, which is safe — `fill` passes over a field that has
 * something in it, and `replace` passes over one already at its target.
 *
 * The step number lives in `workclub-settings.seedVersion`, so this runs once
 * per database. There is no migration file to go with it — the project runs
 * Payload with `push: true` and keeps no migration flow.
 */

export const WORKCLUB_V2_SEED_VERSION = 7

type InfoCards = NonNullable<PassType['infoCards']>

/** One field of one document, and when it may be written. */
type Op =
  /** Only while the field is empty. */
  | { kind: 'fill'; field: string; value: unknown }
  /** Only while the field still holds the value v1 shipped. */
  | { kind: 'replace'; field: string; from: unknown; to: unknown }
  /** Swaps one phrase anywhere inside the field, however deeply nested. */
  | { kind: 'replaceText'; field: string; from: string; to: string }
  /** Drops the rows of a list field whose text reads as this one. */
  | { kind: 'removeItem'; field: string; text: string }

interface RecordOps {
  slug: string
  ops: Op[]
}

const WORKCLUB_INFO_CARDS: InfoCards = [
  {
    blockType: 'includes',
    title: 'todos los workclub pass incluyen:',
    items: [
      {
        title: '1 café socado',
        detail: 'espresso, americano, cappuccino, latte, flat white o macchiato con leche animal.',
      },
    ],
  },
  {
    blockType: 'table',
    title: 'tarifas de salas',
    subtitle: 'precio por hora, según la sala.',
    layout: 'split',
    rows: [
      { label: 'sala 1', value: 'ref. 25/h' },
      { label: 'sala 2', value: 'ref. 35/h' },
      { label: 'sala eventos', note: 'mínimo 2 horas', value: 'ref. 50/h' },
    ],
  },
]

const MEMBER_INFO_CARDS: InfoCards = [
  {
    blockType: 'includes',
    title: 'todos los member pass incluyen:',
    items: [
      { title: '15% de descuento', detail: 'en productos socado' },
      { title: '5 cafés socado', detail: 'por período de membresía' },
      { title: 'acceso a café socado by socado', detail: 'precio especial' },
      { title: '20% off', detail: 'en alquiler de salas' },
    ],
  },
  {
    blockType: 'table',
    title: '¿cómo funcionan los créditos?',
    subtitle: 'se usan para reservar salas.',
    layout: 'inline',
    rows: [
      { label: 'sala 1', value: '1 crédito por hora' },
      { label: 'sala 2', value: '1.5 créditos por hora' },
      { label: 'sala eventos', value: '2.5 créditos por hora' },
    ],
  },
]

/** `wc-gris` was offered as a band colour for a while; it fails contrast. */
const RETIRED_BAND_COLOR = 'wc-gris'

const PASS_TYPES: RecordOps[] = [
  {
    slug: 'workclub-pass',
    ops: [
      { kind: 'fill', field: 'bandColor', value: 'wc-verde-claro' },
      { kind: 'replace', field: 'bandColor', from: RETIRED_BAND_COLOR, to: 'wc-verde-claro' },
      { kind: 'fill', field: 'infoCards', value: WORKCLUB_INFO_CARDS },
      // The band no longer carries the inclusion line: it is the "incluyen" card.
      { kind: 'replace', field: 'note', from: 'todos los pass incluyen', to: '' },
      { kind: 'replace', field: 'noteHighlight', from: '1 café básico de socado', to: '' },
      // The card button now opens the modal, so it no longer says "reservar".
      { kind: 'replace', field: 'ctaLabelDefault', from: 'reservar', to: 'más información' },
    ],
  },
  {
    slug: 'member-pass',
    ops: [
      { kind: 'fill', field: 'bandColor', value: 'wc-marron-medio' },
      { kind: 'replace', field: 'bandColor', from: RETIRED_BAND_COLOR, to: 'wc-marron-medio' },
      { kind: 'fill', field: 'infoCards', value: MEMBER_INFO_CARDS },
      // The cards shipped saying "a precio especial"; the copy dropped the "a".
      {
        kind: 'replaceText',
        field: 'infoCards',
        from: 'a precio especial',
        to: 'precio especial',
      },
      // Same as the other group: the button opens the modal now.
      { kind: 'replace', field: 'ctaLabelDefault', from: 'unirme', to: 'más información' },
      { kind: 'fill', field: 'footnoteLabel', value: 'cafés socado:' },
      {
        kind: 'fill',
        field: 'footnoteText',
        value: 'espresso, americano, cappuccino, latte, flat white o macchiato con leche animal.',
      },
      {
        kind: 'replace',
        field: 'note',
        from: 'todas las membresías incluyen beneficios en café socado',
        to: '',
      },
    ],
  },
]

/** `chips` as the collection stores them. */
function chips(...texts: string[]) {
  return texts.map((text) => ({ text }))
}

/** Same shape as `chips`: the admin stores a list of rows with one text each. */
function details(...texts: string[]) {
  return texts.map((text) => ({ text }))
}

/**
 * Written as it arrived from the client.
 *
 * "lunes y viernes" says two separate days, not a range; it is almost certainly
 * meant to be "lunes a viernes". An opening time is a fact, not a wording, so
 * it is not ours to correct — it is flagged for them to confirm, and changed in
 * the admin or with a `replaceText` step once they answer.
 */
const WEEK_ACCESS = 'acceso lunes y viernes de 7 am a 9 pm'
const WEEKEND_ACCESS = 'acceso fines de semana y feriado de 8 am a 8 pm'

const PLANS: RecordOps[] = [
  {
    slug: 'day-pass',
    ops: [{ kind: 'fill', field: 'chips', value: chips('1 café socado') }],
  },
  {
    slug: '10-pack',
    ops: [
      { kind: 'fill', field: 'chips', value: chips('utilizable en 60 días', '1 café socado') },
      {
        kind: 'replace',
        field: 'description',
        from: '10 días de acceso a la zona hot desk, utilizables dentro de 60 días.',
        to: '10 días de acceso a la zona hot desk.',
      },
    ],
  },
  {
    slug: 'reserva-de-sala',
    ops: [
      {
        kind: 'fill',
        field: 'chips',
        value: chips('catering exclusivo socado', '1 café socado'),
      },
      // The rates moved to the `table` block of the pass type: the card now
      // shows the cheapest room as a single price with its suffix.
      { kind: 'replace', field: 'priceMode', from: 'rooms', to: 'single' },
      { kind: 'fill', field: 'price', value: 25 },
      { kind: 'fill', field: 'priceSuffix', value: '/h' },
      { kind: 'fill', field: 'priceUnit', value: 'desde · según sala' },
      {
        kind: 'replace',
        field: 'description',
        from: 'reserva de sala por hora, según capacidad y disponibilidad.',
        to: 'reserva por hora, según capacidad y disponibilidad.',
      },
      // Now a chip, so the legacy field is cleared.
      { kind: 'replace', field: 'highlight', from: 'catering exclusivo socado', to: '' },
    ],
  },
  {
    slug: 'hot-desk-member',
    ops: [
      { kind: 'fill', field: 'chips', value: chips('2 créditos incluidos') },
      { kind: 'fill', field: 'secondaryLine', value: '10 páginas por período' },
      {
        kind: 'replace',
        field: 'secondaryLine',
        from: '10 páginas por período',
        to: '10 páginas por período',
      },
      {
        kind: 'replace',
        field: 'description',
        from: 'membresía de 30 días para trabajar desde la zona hot desk.',
        to: 'acceso flexible para trabajar desde la zona hot desk.',
      },
    ],
  },
  {
    slug: 'spot-member',
    ops: [
      { kind: 'fill', field: 'chips', value: chips('4 créditos incluidos') },
      { kind: 'fill', field: 'secondaryLine', value: '20 páginas por período' },
      {
        kind: 'fill',
        field: 'details',
        value: details(
          'arturito personal',
          'internet de alta velocidad',
          WEEK_ACCESS,
          WEEKEND_ACCESS,
        ),
      },
      // Seeded in step 6; neither member plan has one.
      { kind: 'removeItem', field: 'details', text: 'monitor' },
      {
        kind: 'replace',
        field: 'secondaryLine',
        from: '20 páginas b/n incluidas por período',
        to: '20 páginas por período',
      },
      {
        kind: 'replace',
        field: 'description',
        from: 'membresía de 30 días con puesto fijo asignado.',
        to: 'puesto fijo asignado para trabajar todos los días.',
      },
    ],
  },
  {
    slug: 'studio-member',
    ops: [
      { kind: 'fill', field: 'chips', value: chips('6 créditos incluidos') },
      { kind: 'fill', field: 'secondaryLine', value: '30 páginas por período' },
      {
        kind: 'fill',
        field: 'details',
        value: details(
          'oficina privada con acceso exclusivo',
          'internet de alta velocidad',
          WEEK_ACCESS,
          WEEKEND_ACCESS,
        ),
      },
      { kind: 'removeItem', field: 'details', text: 'tv monitor' },
      {
        kind: 'replace',
        field: 'secondaryLine',
        from: '30 páginas b/n incluidas por período',
        to: '30 páginas por período',
      },
      {
        kind: 'replace',
        field: 'description',
        from: 'membresía de 30 días con oficina privada asignada.',
        to: 'oficina privada asignada para mayor privacidad y enfoque.',
      },
    ],
  },
]

/** A field nobody filled in: null, empty text or an empty list. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

/**
 * Compares what the admin shows, not the raw value: text is trimmed and
 * lowercased, and an empty string counts as a missing one.
 *
 * The copy of this landing is written in lowercase, so a capital letter in the
 * stored value is a typo, not an editorial decision: it should still count as
 * "nobody touched this" and let the update through.
 */
function matches(current: unknown, expected: unknown): boolean {
  if (typeof expected === 'string') {
    const text =
      typeof current === 'string' ? current.trim().toLowerCase() : current == null ? '' : null
    return text === expected.trim().toLowerCase()
  }

  return current === expected
}

/**
 * A copy of `value` with every string that reads as `from` swapped for `to`.
 *
 * Walks arrays and objects, so it reaches a phrase sitting inside a blocks
 * field without needing to know its shape — and it leaves the ids and every
 * other field Payload stores exactly where they were.
 *
 * A phrase that has been rewritten in the admin no longer reads as `from`, so
 * it is passed over: the same promise the other operations make.
 */
function replaceText(value: unknown, from: string, to: string): unknown {
  if (typeof value === 'string') return matches(value, from) ? to : value

  if (Array.isArray(value)) return value.map((item) => replaceText(item, from, to))

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        replaceText(item, from, to),
      ]),
    )
  }

  return value
}

interface Stats {
  updated: number
  skipped: number
  preserved: number
}

/**
 * Applies the operations of one document and returns whether it was written.
 *
 * Collected into a single `update` so the collection hooks — and the
 * revalidation they trigger — run once per document.
 */
async function applyOps(
  payload: Payload,
  collection: 'pass-types' | 'plans',
  record: RecordOps,
  stats: Stats,
): Promise<void> {
  const found = await payload.find({
    collection,
    where: { slug: { equals: record.slug } },
    limit: 1,
    depth: 0,
  })

  // Read field by field: the operations above name them as text, which is
  // what keeps this table-driven.
  const doc = found.docs[0] as unknown as (Record<string, unknown> & { id: number }) | undefined

  if (!doc) {
    payload.logger.warn(
      `[seed:workclub-v2] ${collection}/${record.slug} no existe todavía; se omite.`,
    )
    stats.skipped += 1
    return
  }

  const patch: Record<string, unknown> = {}

  for (const op of record.ops) {
    /*
      What an earlier operation already wrote wins over what is stored: two
      operations can name the same field — a `fill` for an empty database and a
      `replace` for one that carries the previous copy — and the second has to
      see the first. Reading the document every time, the `replace` of a field
      the `fill` just set would find it empty, match neither `from` nor `to`,
      and warn about an edit that never happened.
    */
    const current = op.field in patch ? patch[op.field] : doc[op.field]

    if (op.kind === 'fill') {
      if (isEmpty(current)) patch[op.field] = op.value
      continue
    }

    if (op.kind === 'removeItem') {
      // Only a list has rows to drop; anything else is left alone.
      if (!Array.isArray(current)) continue

      const kept = current.filter((row) => {
        const text = (row as { text?: unknown } | null)?.text
        return !matches(text, op.text)
      })

      if (kept.length !== current.length) patch[op.field] = kept
      continue
    }

    if (op.kind === 'replaceText') {
      const next = replaceText(current, op.from, op.to)
      // Nothing to say when the phrase is not there: it was already changed,
      // or an editor rewrote the line and it is theirs now.
      if (JSON.stringify(next) !== JSON.stringify(current)) patch[op.field] = next
      continue
    }

    if (matches(current, op.to)) continue

    if (matches(current, op.from)) {
      patch[op.field] = op.to
      continue
    }

    payload.logger.warn(
      `[seed:workclub-v2] ${collection}/${record.slug}: "${op.field}" se editó en el admin; se deja como está.`,
    )
    stats.preserved += 1
  }

  if (Object.keys(patch).length === 0) {
    stats.skipped += 1
    return
  }

  await payload.update({
    collection,
    id: doc.id,
    // The operations are typed per field above; Payload validates on write.
    data: patch as never,
  })

  stats.updated += 1
}

/**
 * Brings the records of "nuestros paquetes" up to the v2 content.
 *
 * Runs only while `workclub-settings.seedVersion` is below this step, and
 * records it when it finishes, so it never runs twice. Call it after
 * `seedWorkclub`, which is what creates the records on a fresh database.
 */
export async function seedWorkclubV2(payload: Payload): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'workclub-settings', depth: 0 })
  const appliedVersion = settings?.seedVersion ?? 0

  if (appliedVersion >= WORKCLUB_V2_SEED_VERSION) return

  const stats: Stats = { updated: 0, skipped: 0, preserved: 0 }

  for (const record of PASS_TYPES) {
    await applyOps(payload, 'pass-types', record, stats)
  }

  for (const record of PLANS) {
    await applyOps(payload, 'plans', record, stats)
  }

  await payload.updateGlobal({
    slug: 'workclub-settings',
    data: { seedVersion: WORKCLUB_V2_SEED_VERSION },
  })

  payload.logger.info(
    `[seed:workclub-v2] ${stats.updated} registro(s) actualizado(s), ${stats.skipped} sin cambios, ${stats.preserved} campo(s) editado(s) a mano y respetado(s).`,
  )
}

export default seedWorkclubV2
