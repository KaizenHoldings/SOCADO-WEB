import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, createElement, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { PassDetailModal } from '@/app/(frontend)/workclub/_components/PassDetailModal'
import type { InfoCard, Pass } from '@/lib/services/workclub-passes.service'

/**
 * The headings of the "más información" dialog.
 *
 * Two lists answer the same question inside it: what the plan itself gives,
 * and what its pass type gives every plan under it. They used to be told
 * apart by their headings — "incluye" over one, "todos los member pass
 * incluyen:" over the other — until the second was shortened to "incluye:"
 * and the dialog started printing the same word twice, one list under the
 * other.
 *
 * So the second heading is dropped when it repeats the first, and the items
 * continue the list above it. These check that it is dropped when it repeats,
 * kept when it is the only one, and kept when the two headings differ — that
 * last one matters because both are editable in the admin.
 *
 * Mounted through react-dom directly rather than with Testing Library, whose
 * DOM package this project does not install. It lives in tests/int because
 * that is the suite the runner is configured for; it needs no database.
 */

let mounted: { container: HTMLElement; root: Root } | null = null

beforeEach(() => {
  // React 19 refuses to run act() without it
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})

function mount(element: ReactElement) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(element)
  })
  mounted = { container, root }
}

afterEach(() => {
  // Unmounted before the flag goes: tearing down is an act() too.
  if (mounted) {
    const { container, root } = mounted
    act(() => {
      root.unmount()
    })
    container.remove()
    mounted = null
  }

  vi.unstubAllGlobals()
})

const PASS: Pass = {
  slug: 'spot-member',
  name: 'spot member',
  description: 'puesto fijo asignado para trabajar todos los días.',
  price: '400',
  pricePrefix: 'ref.',
  period: 'por 30 días',
  chips: ['4 créditos incluidos'],
  details: ['arturito personal', 'internet de alta velocidad'],
  excludesGroupBenefits: false,
  cta: 'más información',
  ctaVariant: 'solid',
  ctaHref: 'https://workclub.socadocafe.com/',
}

const GROUP_CARDS: InfoCard[] = [
  {
    type: 'includes',
    title: 'incluye:',
    items: [{ title: '15% de descuento', detail: 'en productos socado' }],
  },
  // Not a list of benefits: the dialog never shows it, whatever its heading.
  {
    type: 'table',
    title: '¿cómo funcionan los créditos?',
    subtitle: 'se usan para reservar salas.',
    layout: 'inline',
    rows: [{ label: 'sala 1', value: '1 crédito por hora' }],
  },
]

/** Section headings of the dialog, which is rendered into `body` by a portal. */
function headings(): string[] {
  const dialog = document.querySelector('[role="dialog"]')
  expect(dialog).not.toBeNull()
  return Array.from(dialog!.querySelectorAll('h3')).map((node) =>
    (node.textContent ?? '').trim(),
  )
}

/** Every line of every list in the dialog. */
function lines(): string[] {
  const dialog = document.querySelector('[role="dialog"]')
  return Array.from(dialog!.querySelectorAll('li')).map((node) =>
    (node.textContent ?? '').replace(/\s+/g, ' ').trim(),
  )
}

describe('PassDetailModal', () => {
  it('no repite el encabezado cuando la tarjeta del tipo dice lo mismo', () => {
    mount(
      createElement(PassDetailModal, {
        pass: PASS,
        groupCards: GROUP_CARDS,
        onClose: () => {},
      }),
    )

    expect(headings()).toEqual(['incluye:'])

    // Y aun así se ven las dos listas, una tras otra bajo ese encabezado.
    expect(lines()).toEqual([
      '4 créditos incluidos',
      'arturito personal',
      'internet de alta velocidad',
      '15% de descuentoen productos socado',
    ])
  })

  it('conserva el encabezado de la tarjeta cuando el plan no tiene lista propia', () => {
    mount(
      createElement(PassDetailModal, {
        pass: { ...PASS, details: [] },
        groupCards: GROUP_CARDS,
        onClose: () => {},
      }),
    )

    expect(headings()).toEqual(['incluye:'])
    expect(lines()).toEqual(['4 créditos incluidos', '15% de descuentoen productos socado'])
  })

  it('conserva los dos encabezados cuando dicen cosas distintas', () => {
    mount(
      createElement(PassDetailModal, {
        pass: { ...PASS, detailsTitle: 'salas y tarifas' },
        groupCards: GROUP_CARDS,
        onClose: () => {},
      }),
    )

    expect(headings()).toEqual(['salas y tarifas', 'incluye:'])
  })

  it('oculta la tarjeta del tipo en el plan que es la excepción', () => {
    mount(
      createElement(PassDetailModal, {
        pass: {
          ...PASS,
          slug: 'reserva-de-sala',
          detailsTitle: 'salas y tarifas',
          details: ['sala 1: hasta 4 personas · ref. 25/h'],
          excludesGroupBenefits: true,
        },
        groupCards: GROUP_CARDS,
        onClose: () => {},
      }),
    )

    expect(headings()).toEqual(['salas y tarifas'])
    expect(lines()).not.toContain('15% de descuentoen productos socado')
  })
})
