import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PassType, Plan } from '@/payload-types'

/**
 * Rules of the packages section that do not depend on Payload: how plans are
 * grouped under their pass type, what a card inherits from that type, how the
 * info cards of a type are flattened, and what is shown when the CMS gives
 * nothing back.
 *
 * The data layer is mocked, so these run without a database.
 */

const fetchWorkclubPasses = vi.fn()

vi.mock('@/lib/data/workclub-passes.data', () => ({
  fetchWorkclubPasses: () => fetchWorkclubPasses(),
}))

const { WorkclubPassesService, WORKCLUB_PASSES_FALLBACK, DEFAULT_BAND_COLOR } =
  await import('@/lib/services/workclub-passes.service')

/** Minimal documents, shaped like Payload returns them with depth 0. */
function passType(overrides: Partial<PassType> & { id: number; slug: string }): PassType {
  return {
    name: overrides.slug,
    eyebrow: 'socado',
    description: '',
    note: '',
    ctaLabelDefault: 'reservar',
    ctaVariantDefault: 'outline',
    order: 1,
    active: true,
    updatedAt: '',
    createdAt: '',
    ...overrides,
  } as PassType
}

function plan(overrides: Partial<Plan> & { id: number; slug: string; passType: number }): Plan {
  return {
    name: overrides.slug,
    description: '',
    priceMode: 'single',
    pricePrefix: 'ref.',
    order: 1,
    active: true,
    updatedAt: '',
    createdAt: '',
    ...overrides,
  } as Plan
}

beforeEach(() => {
  fetchWorkclubPasses.mockReset()
})

describe('WorkclubPassesService', () => {
  it('agrupa los planes bajo su tipo de pass y respeta el orden recibido', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({ id: 1, slug: 'workclub-pass', name: 'workclub pass', order: 1 }),
        passType({ id: 2, slug: 'member-pass', name: 'member pass', order: 2 }),
      ],
      plans: [
        plan({ id: 10, slug: 'day-pass', passType: 1, price: 25, priceUnit: 'por día' }),
        plan({ id: 11, slug: '10-pack', passType: 1, price: 180, order: 2 }),
        plan({ id: 12, slug: 'hot-desk-member', passType: 2, price: 250 }),
      ],
      settings: null,
    })

    const { groups } = await WorkclubPassesService.get()

    expect(groups.map((group) => group.id)).toEqual(['workclub-pass', 'member-pass'])
    expect(groups[0].passes.map((pass) => pass.slug)).toEqual(['day-pass', '10-pack'])
    expect(groups[1].passes).toHaveLength(1)
    expect(groups[0].passes[0].price).toBe('25')
    expect(groups[0].passes[0].period).toBe('por día')
  })

  it('hereda el cta del tipo de pass salvo que el plan lo defina', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({
          id: 2,
          slug: 'member-pass',
          ctaLabelDefault: 'unirme',
          ctaVariantDefault: 'solid',
        }),
      ],
      plans: [
        plan({ id: 20, slug: 'spot-member', passType: 2, price: 400 }),
        plan({
          id: 21,
          slug: 'studio-member',
          passType: 2,
          price: 750,
          ctaLabel: 'consultar',
          ctaVariant: 'outline',
          ctaUrl: 'https://reservas.socado.com/studio',
          order: 2,
        }),
      ],
      settings: { id: 1, reservaUrl: 'https://reservas.socado.com', updatedAt: '', createdAt: '' },
    })

    const [heredado, propio] = (await WorkclubPassesService.get()).groups[0].passes

    expect(heredado.cta).toBe('unirme')
    expect(heredado.ctaVariant).toBe('solid')
    expect(heredado.ctaHref).toBe('https://reservas.socado.com')
    expect(heredado.ctaPaquete).toBe('spot-member')

    expect(propio.cta).toBe('consultar')
    expect(propio.ctaVariant).toBe('outline')
    expect(propio.ctaHref).toBe('https://reservas.socado.com/studio')
    // Con URL propia no se añade el paquete: el destino ya es específico.
    expect(propio.ctaPaquete).toBeUndefined()
  })

  it('muestra un precio único con sufijo aunque el plan siga en modo salas', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [passType({ id: 1, slug: 'workclub-pass' })],
      plans: [
        plan({
          id: 30,
          slug: 'reserva-de-sala',
          passType: 1,
          // Dato antiguo: la tarjeta ya no usa el modo salas ni su tabla.
          priceMode: 'rooms',
          price: 25,
          priceSuffix: '/h',
          priceUnit: 'desde · según sala',
          rooms: [{ id: 'a', name: 'sala 1', price: 25, unit: '/h' }],
          roomsNote: 'sala eventos: mínimo 2 horas',
        }),
      ],
      settings: null,
    })

    const [sala] = (await WorkclubPassesService.get()).groups[0].passes

    expect(sala.price).toBe('25')
    expect(sala.priceSuffix).toBe('/h')
    expect(sala.period).toBe('desde · según sala')
    expect(sala).not.toHaveProperty('rates')
  })

  it('pasa las píldoras y la línea secundaria, descartando las vacías', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [passType({ id: 2, slug: 'member-pass' })],
      plans: [
        plan({
          id: 40,
          slug: 'hot-desk-member',
          passType: 2,
          price: 250,
          chips: [
            { id: 'a', text: '2 créditos incluidos' },
            { id: 'b', text: '  ' },
          ],
          secondaryLine: '10 páginas por período',
        }),
      ],
      settings: null,
    })

    const [member] = (await WorkclubPassesService.get()).groups[0].passes

    expect(member.chips).toEqual(['2 créditos incluidos'])
    expect(member.secondaryLine).toBe('10 páginas por período')
  })

  it('aplana las tarjetas informativas y descarta los bloques sin contenido', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({
          id: 1,
          slug: 'workclub-pass',
          infoCards: [
            {
              id: 'a',
              blockType: 'includes',
              title: 'incluyen:',
              items: [{ id: 'a1', title: '1 café socado', detail: 'espresso, americano…' }],
            },
            // Sin filas: no se muestra una tarjeta vacía.
            { id: 'b', blockType: 'table', title: 'tarifas de salas', layout: 'split', rows: [] },
            {
              id: 'c',
              blockType: 'table',
              title: '¿cómo funcionan los créditos?',
              subtitle: 'se usan para reservar salas.',
              layout: 'inline',
              rows: [{ id: 'c1', label: 'sala 1', value: '1 crédito por hora' }],
            },
          ],
        }),
      ],
      plans: [plan({ id: 50, slug: 'day-pass', passType: 1, price: 25 })],
      settings: null,
    })

    const [group] = (await WorkclubPassesService.get()).groups

    expect(group.infoCards).toHaveLength(2)
    expect(group.infoCards[0]).toEqual({
      type: 'includes',
      title: 'incluyen:',
      items: [{ title: '1 café socado', detail: 'espresso, americano…' }],
    })
    expect(group.infoCards[1]).toMatchObject({
      type: 'table',
      layout: 'inline',
      rows: [{ label: 'sala 1', value: '1 crédito por hora' }],
    })
  })

  it('solo arma la nota al pie del pass si tiene contenido', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({
          id: 2,
          slug: 'member-pass',
          footnoteLabel: 'cafés socado:',
          footnoteText: 'espresso, americano, cappuccino…',
        }),
        passType({ id: 1, slug: 'workclub-pass', footnoteLabel: '  ', order: 2 }),
      ],
      plans: [
        plan({ id: 60, slug: 'spot-member', passType: 2, price: 400 }),
        plan({ id: 61, slug: 'day-pass', passType: 1, price: 25 }),
      ],
      settings: null,
    })

    const [conNota, sinNota] = (await WorkclubPassesService.get()).groups

    expect(conNota.footnote).toEqual({
      label: 'cafés socado:',
      text: 'espresso, americano, cappuccino…',
    })
    expect(sinNota.footnote).toBeUndefined()
  })

  it('descarta un tipo de pass sin planes activos', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({ id: 1, slug: 'workclub-pass' }),
        passType({ id: 2, slug: 'member-pass', order: 2 }),
      ],
      plans: [plan({ id: 70, slug: 'day-pass', passType: 1, price: 25 })],
      settings: null,
    })

    const { groups } = await WorkclubPassesService.get()

    expect(groups.map((group) => group.id)).toEqual(['workclub-pass'])
  })

  it('conserva el color de franja válido y descarta uno desconocido', async () => {
    fetchWorkclubPasses.mockResolvedValue({
      passTypes: [
        passType({ id: 1, slug: 'workclub-pass', bandColor: 'wc-verde-claro' }),
        // Valor fuera de la lista: dejaría la franja sin fondo.
        passType({
          id: 2,
          slug: 'member-pass',
          bandColor: 'morado' as PassType['bandColor'],
          order: 2,
        }),
        passType({ id: 3, slug: 'sin-color', order: 3 }),
      ],
      plans: [
        plan({ id: 80, slug: 'day-pass', passType: 1, price: 25 }),
        plan({ id: 81, slug: 'spot-member', passType: 2, price: 400 }),
        plan({ id: 82, slug: 'otro', passType: 3, price: 10 }),
      ],
      settings: null,
    })

    const { groups } = await WorkclubPassesService.get()

    expect(groups.map((group) => group.bandColor)).toEqual([
      'wc-verde-claro',
      DEFAULT_BAND_COLOR,
      DEFAULT_BAND_COLOR,
    ])
  })

  it('usa el contenido de respaldo si payload falla o no devuelve nada', async () => {
    fetchWorkclubPasses.mockRejectedValueOnce(new Error('sin conexión'))
    expect((await WorkclubPassesService.get()).groups).toEqual(WORKCLUB_PASSES_FALLBACK)

    fetchWorkclubPasses.mockResolvedValueOnce({ passTypes: [], plans: [], settings: null })
    expect((await WorkclubPassesService.get()).groups).toEqual(WORKCLUB_PASSES_FALLBACK)
  })
})
