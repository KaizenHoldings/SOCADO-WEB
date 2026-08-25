/**
 * Builds `catering-image-specs.html` at the project root.
 *
 * Combines the dimension figures from `catering-spec.data.ts` with the
 * screenshots captured by the Playwright run, producing a self-contained
 * document for the design team.
 */

import fs from 'node:fs'
import path from 'node:path'
import {
  COMPONENT_SPECS,
  VIEWPORTS,
  screenshotName,
  type ComponentSpec,
  type ViewportKey,
} from './catering-spec.data'

/**
 * Project root. This package is ESM ("type": "module"), so `__dirname` is not
 * available — and npm always runs scripts with the cwd set to the package root,
 * which makes `process.cwd()` the dependable choice here.
 */
export const PROJECT_ROOT = process.cwd()
export const SCREENSHOT_DIR = path.join(PROJECT_ROOT, 'screenshots')
export const REPORT_PATH = path.join(PROJECT_ROOT, 'catering-image-specs.html')

/** Escapes text for safe interpolation into HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** True when the screenshot file actually exists on disk. */
function shotExists(componentKey: string, viewport: ViewportKey): boolean {
  return fs.existsSync(path.join(SCREENSHOT_DIR, screenshotName(componentKey, viewport)))
}

function renderSpecTable(spec: ComponentSpec): string {
  return `
      <div class="table-scroll">
        <table>
          <thead>
            <tr><th>Relación de aspecto</th><th>Mobile</th><th>Tablet</th><th>Desktop</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="ratio">${esc(spec.ratio)}</td>
              <td class="res">${esc(spec.resolutions.mobile)}</td>
              <td class="res">${esc(spec.resolutions.tablet)}</td>
              <td class="res">${esc(spec.resolutions.desktop)}</td>
            </tr>
          </tbody>
        </table>
      </div>`
}

function renderGallery(spec: ComponentSpec): string {
  if (!spec.hasScreenshot) return ''

  const figures = VIEWPORTS.filter((vp) => shotExists(spec.key, vp.key)).map((vp) => {
    const file = screenshotName(spec.key, vp.key)
    return `
          <figure class="shot">
            <img src="./screenshots/${esc(file)}" alt="${esc(spec.name)} — ${esc(vp.label)}" loading="lazy">
            <figcaption>${esc(vp.label)} · ${vp.width} px</figcaption>
          </figure>`
  })

  if (figures.length === 0) {
    return `
      <p class="missing">Vista previa no disponible en esta ejecución.</p>`
  }

  return `
      <div class="gallery">${figures.join('')}
      </div>`
}

function renderSection(spec: ComponentSpec, index: number): string {
  const num = String(index + 1).padStart(2, '0')
  return `
  <h2><span class="num">${num}</span>${esc(spec.name)}</h2>
  <p class="where">${esc(spec.where)}</p>
${renderSpecTable(spec)}
${renderGallery(spec)}
`
}

function renderSummary(): string {
  const rows = COMPONENT_SPECS.map(
    (s) => `
        <tr>
          <td class="comp">${esc(s.name)}</td>
          <td class="ratio">${esc(s.ratio)}</td>
          <td class="res">${esc(s.resolutions.mobile)}</td>
          <td class="res">${esc(s.resolutions.tablet)}</td>
          <td class="res">${esc(s.resolutions.desktop)}</td>
        </tr>`,
  ).join('')

  return `
  <h2><span class="num">${String(COMPONENT_SPECS.length + 1).padStart(2, '0')}</span>Resumen General</h2>
  <p class="where">Todas las especificaciones consolidadas en una sola vista.</p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr><th>Componente</th><th>Relación</th><th>Mobile</th><th>Tablet</th><th>Desktop</th></tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
`
}

const STYLES = `
  :root {
    --azul-socado: #063547;
    --terra: #b45b38;
    --ivory: #f2eae6;
    --gris-metropolis: #6e7c7c;
    --celeste: #5c8ea0;
    --border: rgba(6, 53, 71, 0.12);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #fff; color: var(--azul-socado);
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1040px; margin: 0 auto; padding: 0 24px 96px; }
  header {
    background: var(--azul-socado); color: var(--ivory);
    padding: 56px 24px 48px; margin-bottom: 44px;
  }
  header .inner { max-width: 1040px; margin: 0 auto; }
  header .eyebrow {
    font-size: 11px; letter-spacing: .25em; text-transform: uppercase;
    color: rgba(242,234,230,.6); margin: 0 0 12px;
  }
  header h1 {
    font-family: 'Raleway', Georgia, serif; font-weight: 700;
    font-size: clamp(28px, 5vw, 44px); line-height: 1.1; margin: 0 0 16px; color: var(--ivory);
  }
  header p { margin: 0; max-width: 60ch; color: rgba(242,234,230,.85); font-size: 15px; }
  h2 {
    font-family: 'Raleway', Georgia, serif; font-weight: 700; font-size: 23px;
    color: var(--azul-socado); margin: 52px 0 6px; padding-bottom: 10px;
    border-bottom: 2px solid var(--terra);
  }
  h2 .num {
    color: var(--terra); font-size: 14px; vertical-align: super;
    margin-right: 8px; font-weight: 600;
  }
  .where { color: var(--gris-metropolis); font-size: 14.5px; margin: 0 0 18px; max-width: 68ch; }
  .table-scroll { overflow-x: auto; margin: 0 0 22px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 520px; }
  th {
    background: var(--azul-socado); color: var(--ivory);
    font-family: 'Raleway', sans-serif; font-weight: 600; font-size: 11.5px;
    letter-spacing: .07em; text-transform: uppercase; text-align: left; padding: 12px 16px;
  }
  td { padding: 14px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tbody tr:nth-child(even) { background: rgba(242,234,230,.45); }
  td.ratio { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 16px; white-space: nowrap; }
  td.res {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-weight: 600; font-size: 14.5px; color: var(--terra); white-space: nowrap;
  }
  td.comp { font-weight: 600; }
  .gallery {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 18px; margin: 0 0 26px;
  }
  .shot { margin: 0; }
  .shot img {
    display: block; width: 100%; height: auto;
    border: 1px solid var(--border); border-radius: 8px; background: var(--ivory);
  }
  .shot figcaption {
    margin-top: 8px; font-size: 12px; letter-spacing: .04em;
    text-transform: uppercase; color: var(--gris-metropolis); font-weight: 600;
  }
  .missing {
    font-size: 13.5px; color: var(--gris-metropolis); font-style: italic;
    margin: 0 0 22px;
  }
  .note {
    border-left: 3px solid var(--celeste); background: rgba(92,142,160,.07);
    padding: 16px 20px; margin: 0 0 8px; font-size: 14px; border-radius: 0 6px 6px 0;
  }
  .note strong { color: var(--azul-socado); }
  .note ul { margin: 10px 0 0; padding-left: 20px; }
  .note li { margin-bottom: 5px; }
  footer {
    margin-top: 68px; padding-top: 22px; border-top: 1px solid var(--border);
    font-size: 13px; color: var(--gris-metropolis);
  }
  @media print {
    header { padding: 32px 24px; }
    h2 { page-break-after: avoid; }
    table, .shot { page-break-inside: avoid; }
  }
`

export interface ReportResult {
  path: string
  screenshotsFound: number
  screenshotsExpected: number
}

/** Writes the report to the project root and returns a short summary. */
export function generateReport(): ReportResult {
  const generated = new Date().toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const sections = COMPONENT_SPECS.map(renderSection).join('')

  let found = 0
  let expected = 0
  for (const spec of COMPONENT_SPECS) {
    if (!spec.hasScreenshot) continue
    for (const vp of VIEWPORTS) {
      expected++
      if (shotExists(spec.key, vp.key)) found++
    }
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Socado Catering — Especificaciones de Imagen</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
<style>${STYLES}</style>
</head>
<body>

<header>
  <div class="inner">
    <p class="eyebrow">Socado Café · Guía de Diseño</p>
    <h1>Especificaciones de Imagen — Sección Catering</h1>
    <p>
      Relaciones de aspecto y resoluciones mínimas requeridas para cada imagen
      del flujo de catering, acompañadas de vistas previas reales de la interfaz.
    </p>
  </div>
</header>

<div class="wrap">

  <div class="note">
    <strong>Cómo usar esta guía.</strong> Todas las resoluciones indicadas son mínimos y ya
    contemplan pantallas de alta densidad. Entregar archivos de mayor tamaño no representa un
    problema; el sistema los reescala automáticamente.
    <ul>
      <li><strong>Mobile:</strong> hasta 767 px de ancho</li>
      <li><strong>Tablet:</strong> de 768 px a 1023 px</li>
      <li><strong>Desktop:</strong> desde 1024 px en adelante</li>
    </ul>
  </div>
${sections}${renderSummary()}
  <footer>
    Los logotipos, íconos de navegación y animaciones de carga son archivos vectoriales y no
    requieren entrega en mapa de bits.<br>
    Documento generado automáticamente el ${esc(generated)}.
  </footer>

</div>

</body>
</html>
`

  fs.writeFileSync(REPORT_PATH, html, 'utf8')

  return { path: REPORT_PATH, screenshotsFound: found, screenshotsExpected: expected }
}
