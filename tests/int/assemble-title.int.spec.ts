import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, createElement, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot, type Root } from 'react-dom/client'

/**
 * The entrance of the display heading on /workclub, which has hidden its own
 * text twice.
 *
 * First when every letter watched itself: the leading letter starts displaced
 * to the left of the gutter, so it was never on screen, never met its own
 * threshold and never faded in. Then when the trigger moved to the heading but
 * the heading was not rendered on the pass where the observer attaches —
 * useInView gives up on a null ref and its effect never runs again.
 *
 * Both failures are the same shape: nothing observed, so the text stays at
 * opacity 0. That is what the first two assert.
 *
 * The third is a different one: the space between words used to be the last
 * child inside the first word's span, where CSS drops it — white space at the
 * end of a line is removed, and the end of an inline-block is the end of a
 * line — so the heading read as one run-together word. It has to be a sibling
 * of the word spans.
 *
 * Lives in tests/int because that is the suite the runner is configured for;
 * it needs no database. Mounted through react-dom directly rather than with
 * Testing Library, whose DOM package this project does not install.
 */

const TEXT = 'preguntas frecuentes'

let observed: Element[] = []
let mounted: { container: HTMLElement; root: Root } | null = null

/** Mounts for real, so the effects that attach the observer actually run. */
function mount(element: ReactElement) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(element)
  })
  mounted = { container, root }
  return container
}

class FakeIntersectionObserver {
  constructor(_callback: unknown, _options?: unknown) {}
  observe(element: Element) {
    observed.push(element)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

beforeEach(() => {
  observed = []
  // React 19 refuses to run act() without it
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  vi.stubGlobal(
    'matchMedia',
    (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  )
})

afterEach(() => {
  if (mounted) {
    const { container, root } = mounted
    act(() => root.unmount())
    container.remove()
    mounted = null
  }
  vi.unstubAllGlobals()
})

const { AssembleTitle } = await import(
  '@/app/(frontend)/workclub/_components/AssembleTitle'
)

const heading = () => createElement(AssembleTitle, { text: TEXT, className: 'block' })

describe('AssembleTitle', () => {
  it('se sirve como texto plano, legible sin JavaScript', () => {
    const html = renderToString(heading())

    expect(html).toContain(TEXT)
    // Una sola copia: sin duplicado para lectores de pantalla todavia
    expect(html.split(TEXT).length - 1).toBe(1)
    // Y sin ocultarse de la accesibilidad mientras es el unico texto
    expect(html).not.toContain('aria-hidden')
  })

  it('vigila el encabezado entero, no cada letra', () => {
    mount(heading())

    expect(observed).toHaveLength(1)
    expect(observed[0].textContent).toBe(TEXT)
  })

  it('separa las palabras con un espacio que el css no se come', () => {
    const container = mount(heading())
    const letters = container.querySelector('[aria-hidden="true"]')!

    // Hermano de las palabras, no ultimo hijo dentro de una de ellas
    const kinds = Array.from(letters.childNodes).map((node) =>
      node.nodeType === node.TEXT_NODE ? node.textContent : 'PALABRA',
    )
    expect(kinds).toEqual(['PALABRA', ' ', 'PALABRA'])

    // Y ninguna palabra termina en texto suelto, que es donde se perdia
    for (const word of Array.from(letters.children)) {
      const last = word.childNodes[word.childNodes.length - 1]
      expect(last.nodeType).not.toBe(last.TEXT_NODE)
    }
  })

  it('expone el texto una vez cuando las letras toman el relevo', () => {
    const container = mount(heading())

    const readable = container.querySelector('.sr-only')
    expect(readable?.textContent).toBe(TEXT)

    const letters = container.querySelector('[aria-hidden="true"]')
    expect(letters?.textContent).toBe(TEXT)
  })
})
