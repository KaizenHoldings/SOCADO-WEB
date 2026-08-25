/**
 * Visual report generator for the catering section.
 *
 * Walks the catering flow at three viewports, captures targeted screenshots of
 * each image-bearing component into `screenshots/`, then writes
 * `catering-image-specs.html` at the project root.
 *
 * Run with:  npm run report:visual
 *
 * Every capture is individually fault-tolerant: if a component cannot be
 * reached (missing data, slow build, layout change) the run records the miss
 * and continues, so the report is always produced.
 */

import { test, type Page, type Locator } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

import {
  BASE_URL,
  IDENTITY_MARKER,
  VIEWPORTS,
  screenshotName,
  type Viewport,
} from './catering-spec.data'
import { SCREENSHOT_DIR } from './report-generator'

test.describe.configure({ mode: 'serial' })

const CATERING_URL = '/catering'

test.beforeAll(async () => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })

  // Confirm the server on this port is actually Socado. Without this check a
  // dev server for an unrelated project answering on the same port would let
  // every capture time out and quietly yield a report with no previews.
  let body: string
  try {
    const res = await fetch(BASE_URL, { redirect: 'follow' })
    body = await res.text()
  } catch (err) {
    throw new Error(
      `No se pudo contactar el servidor en ${BASE_URL}.\n` +
        `Inicia el proyecto con "npm run dev" o deja que Playwright lo levante.\n` +
        `Detalle: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (!body.includes(IDENTITY_MARKER)) {
    throw new Error(
      `El servidor en ${BASE_URL} no corresponde a Socado Web.\n` +
        `Probablemente otro proyecto está ocupando ese puerto.\n` +
        `Libera el puerto o define VISUAL_PORT con uno distinto, por ejemplo:\n` +
        `  VISUAL_PORT=3200 npm run report:visual`,
    )
  }

  // Warm the route. In dev mode Next compiles a page on first request, which
  // can take well over a minute — paying that once here keeps it out of the
  // per-viewport time budget.
  console.log('\nPreparando la ruta /catering…')
  const started = Date.now()
  try {
    await fetch(`${BASE_URL}${CATERING_URL}`, { redirect: 'follow' })
    console.log(`Ruta lista en ${Math.round((Date.now() - started) / 1000)}s`)
  } catch {
    console.log('No se pudo precalentar la ruta; se continúa de todos modos.')
  }
})

/** Tracks what was captured so the final step can report coverage. */
const captured: string[] = []
const missed: { name: string; reason: string }[] = []

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Waits for the network to go quiet and every <img> to finish decoding. */
async function settle(page: Page, extraMs = 400): Promise<void> {
  await page.waitForLoadState('domcontentloaded')
  try {
    await page.waitForLoadState('networkidle', { timeout: 8_000 })
  } catch {
    // A long-polling request can keep the network busy; carry on regardless.
  }
  await page
    .evaluate(async () => {
      const images = Array.from(document.images)
      await Promise.all(
        images.map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => {
            img.addEventListener('load', r, { once: true })
            img.addEventListener('error', r, { once: true })
          }),
        ),
      )
    })
    .catch(() => undefined)
  await page.waitForTimeout(extraMs)
}

/**
 * Screenshots a locator, recording success or failure without throwing.
 * Returns true when the file was written.
 */
async function capture(
  locator: Locator,
  componentKey: string,
  viewport: Viewport,
  label: string,
): Promise<boolean> {
  const file = screenshotName(componentKey, viewport.key)
  const target = path.join(SCREENSHOT_DIR, file)

  try {
    await locator.first().waitFor({ state: 'visible', timeout: 12_000 })
    await locator.first().scrollIntoViewIfNeeded()
    await locator.first().screenshot({ path: target, timeout: 15_000 })
    captured.push(file)
    console.log(`  captured  ${file}`)
    return true
  } catch (err) {
    const reason = err instanceof Error ? err.message.split('\n')[0] : String(err)
    missed.push({ name: `${label} (${viewport.label})`, reason })
    console.log(`  skipped   ${file} — ${reason}`)
    return false
  }
}

/** Dismisses the mode selector by entering one of the two catering modes. */
async function enterMode(page: Page, mode: 'individuales' | 'compartir'): Promise<boolean> {
  const alt = mode === 'individuales' ? 'Individuales' : 'Para compartir'
  try {
    const panel = page.locator(`img[alt="${alt}"]`).first()
    await panel.waitFor({ state: 'visible', timeout: 12_000 })
    await panel.click()
    // The sticky view-mode toolbar only exists once a mode is active.
    await page.waitForTimeout(1_200)
    await settle(page, 700)
    return true
  } catch {
    return false
  }
}

// ─── Capture runs ────────────────────────────────────────────────────────────

for (const viewport of VIEWPORTS) {
  test(`capturar catering — ${viewport.label} (${viewport.width}px)`, async ({ browser }) => {
    test.setTimeout(300_000)

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      // Retina capture so the design team can inspect detail.
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()

    console.log(`\n▸ ${viewport.label} — ${viewport.width}×${viewport.height}`)

    // ── Landing: hero + mode selector ──
    await page.goto(CATERING_URL, { waitUntil: 'domcontentloaded' })
    await settle(page, 900)

    const hero = page
      .locator('section')
      .filter({ has: page.locator('img[alt="Socado Catering"]') })
    await capture(hero, 'catering-hero', viewport, 'Hero de Catering')

    const modeSelector = page
      .locator('section')
      .filter({ has: page.locator('img[alt="Individuales"]') })
    await capture(modeSelector, 'mode-selector', viewport, 'Selector de Modalidad')

    // ── "Compartir" mode: category carousel + product grid ──
    if (await enterMode(page, 'compartir')) {
      const carousel = page.locator('[class*="group/slider"]').first()
      await capture(carousel, 'category-carousel', viewport, 'Carrusel de Categorías')

      const firstCard = page.locator('[class*="grid-cols-2"] > *').first()
      await capture(firstCard, 'product-card', viewport, 'Tarjeta de Producto')
    } else {
      missed.push({
        name: `Modo compartir (${viewport.label})`,
        reason: 'No se pudo abrir la modalidad',
      })
    }

    // ── "Individuales" mode: box builder ──
    await page.goto(CATERING_URL, { waitUntil: 'domcontentloaded' })
    await settle(page, 900)

    if (await enterMode(page, 'individuales')) {
      const builder = page.locator('main').first()
      await capture(builder, 'box-builder', viewport, 'Armador de Boxes')
    } else {
      missed.push({
        name: `Modo individuales (${viewport.label})`,
        reason: 'No se pudo abrir la modalidad',
      })
    }

    await context.close()
  })
}

// ─── Summary ─────────────────────────────────────────────────────────────────
// The HTML report itself is written by the global teardown, so that it is
// produced even if the captures above fail.

test.afterAll(() => {
  console.log(`\nCapturas escritas: ${captured.length}`)
  if (missed.length > 0) {
    console.log(`Componentes omitidos (${missed.length}):`)
    for (const m of missed) console.log(`  · ${m.name} — ${m.reason}`)
  }
})
