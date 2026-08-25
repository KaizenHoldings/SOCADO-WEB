/**
 * Runs after the capture suite finishes — including when captures fail.
 *
 * Report generation lives here rather than in a final test so that a browser
 * crash, a missing dev server, or a single failed capture still leaves the
 * design team with an up-to-date `catering-image-specs.html`.
 */

import path from 'node:path'
import { generateReport } from './report-generator'

export default function globalTeardown(): void {
  const result = generateReport()

  const rel = path.relative(process.cwd(), result.path)
  const { screenshotsFound: found, screenshotsExpected: expected } = result

  console.log('\n─────────────────────────────────────────────')
  console.log(`  Reporte generado : ${rel}`)
  console.log(`  Capturas         : ${found}/${expected}`)

  if (found === 0) {
    console.log('\n  Sin capturas disponibles. El reporte conserva todas')
    console.log('  las medidas, pero sin vistas previas.')
  } else if (found < expected) {
    console.log('\n  Reporte parcial: algunos componentes no pudieron')
    console.log('  capturarse. Las medidas siguen siendo válidas.')
  }

  console.log('─────────────────────────────────────────────\n')
}
