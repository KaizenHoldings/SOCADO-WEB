/**
 * Price-bulk endpoint handlers for the Products collection.
 *
 * GET  /api/products/price-export  → CSV with contextual product info + price
 * POST /api/products/price-import  → multipart/form-data { file: CSV }
 *
 * CONTRACT: the export carries extra columns purely as *context* so the editor
 * knows which product a row refers to. The import reads ONLY `id` and `price`;
 * every other column is discarded before touching the database, so editing a
 * name/description/category in the spreadsheet can never overwrite the record.
 */

import type { PayloadRequest } from 'payload'
import Papa from 'papaparse'

// ─── Shared ──────────────────────────────────────────────────────────────────

/** The only two columns the import will ever read. */
const EDITABLE_COLUMNS = ['id', 'price'] as const

/** UTF-8 byte-order mark. Built from its code point to keep the source ASCII. */
const BOM = String.fromCharCode(0xfeff)

/** Human-readable labels for the `status` select, mirroring Products.ts. */
const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  draft: 'Borrador',
}

/**
 * Resolves a Payload relationship value to its display name.
 * With depth:1 the value is the populated doc; falls back to the raw id.
 */
function relationName(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    const doc = value as Record<string, unknown>
    return String(doc.name ?? doc.id ?? '')
  }
  return String(value)
}

// ─── Export ──────────────────────────────────────────────────────────────────

export async function priceExportHandler(req: PayloadRequest): Promise<Response> {
  try {
    const result = await req.payload.find({
      collection: 'products',
      limit: 10000,
      // depth:1 populates the relationship docs so we can print their names
      depth: 1,
      sort: 'name',
      overrideAccess: false,
      req,
    })

    const rows = result.docs.map((doc: any) => ({
      // ── Editable key ──
      id: doc.id,
      // ── Informational context (ignored on import) ──
      sku: doc.sku ?? '',
      name: doc.name ?? '',
      status: STATUS_LABELS[doc.status] ?? doc.status ?? '',
      macrocategoria: relationName(doc.macroCategory),
      categoria: relationName(doc.category),
      subcategoria: relationName(doc.subCategory),
      categoria_individuales: relationName(doc.categoryCatering),
      descripcion: doc.description ?? '',
      // ── The one column meant to be edited ──
      price: doc.price ?? '',
    }))

    // Prepend a BOM so Excel opens accented characters correctly
    const csv = BOM + Papa.unparse(rows, { header: true })

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="productos-precios.csv"',
      },
    })
  } catch (err: any) {
    return Response.json({ error: err?.message ?? 'Export failed' }, { status: 500 })
  }
}

// ─── Import ──────────────────────────────────────────────────────────────────

/** One failed row, with enough context for the editor to find it in the file. */
interface ImportError {
  /** Line number in the CSV as opened in Excel (line 1 is the header). */
  row: number
  /** The raw id cell, so it matches what the user sees in their file. */
  id: string
  /** Product name taken from the CSV for context. Never written to the DB. */
  name: string
  /** Spanish, actionable explanation of what went wrong. */
  reason: string
}

interface ImportResult {
  success: boolean
  total: number
  updated: number
  skipped: number
  /** Columns present in the file that were deliberately not applied. */
  ignoredColumns: string[]
  errors: ImportError[]
}

/**
 * Turns an error thrown by `payload.update` into an actionable Spanish message.
 *
 * The important case: Payload validates the ENTIRE merged document on update,
 * not just the fields we send. So a product already stored with a missing
 * required field (sku, name, status…) fails even a price-only update. When that
 * happens we surface exactly which field is at fault.
 */
function describeUpdateError(err: any, id: number): string {
  const status = err?.status ?? err?.statusCode
  const rawMessage = String(err?.message ?? '')

  // Not found → the id does not exist in the collection
  if (status === 404 || err?.name === 'NotFound' || /not found/i.test(rawMessage)) {
    return `No existe un producto con el ID ${id}. Verifica que el ID provenga del archivo descargado.`
  }

  // Payload ValidationError → extract the offending field(s).
  // Shape varies across versions: err.data may be the array, or err.data.errors.
  const data = err?.data
  const list = Array.isArray(data) ? data : Array.isArray(data?.errors) ? data.errors : null

  if (list && list.length > 0) {
    const fields = list
      .map((e: any) => {
        const field = e?.field ?? e?.path ?? ''
        const message = e?.message ?? ''
        return field ? `${field} (${message})` : message
      })
      .filter(Boolean)
      .join('; ')

    if (fields) {
      return `El producto tiene datos incompletos o inválidos y Payload no permite guardarlo: ${fields}. Abre el producto en el panel, completa ese campo y vuelve a subir el archivo.`
    }
  }

  if (status === 403 || /forbidden|not allowed/i.test(rawMessage)) {
    return `No tienes permisos para actualizar el producto con ID ${id}.`
  }

  return rawMessage || 'Error desconocido al actualizar el producto.'
}

/**
 * Parses a price cell tolerantly: strips currency symbols and thousands
 * separators, and treats whichever of `.` or `,` appears last as the decimal
 * separator (so both "1.234,56" and "1,234.56" resolve to 1234.56).
 */
function parsePrice(raw: unknown): number {
  if (typeof raw === 'number') return raw
  if (raw === null || raw === undefined) return NaN

  let s = String(raw).trim()
  if (s === '') return NaN

  // Keep only digits, separators and a leading minus
  s = s.replace(/[^0-9.,-]/g, '')

  const lastDot = s.lastIndexOf('.')
  const lastComma = s.lastIndexOf(',')

  if (lastDot !== -1 && lastComma !== -1) {
    // Both present → the rightmost is the decimal separator
    const decimalSep = lastDot > lastComma ? '.' : ','
    const thousandsSep = decimalSep === '.' ? ',' : '.'
    s = s.split(thousandsSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (lastComma !== -1) {
    // Only a comma → decimal separator in es-* locales
    s = s.replace(',', '.')
  }

  return parseFloat(s)
}

export async function priceImportHandler(req: PayloadRequest): Promise<Response> {
  try {
    // Parse multipart form-data. `formData` is optional on PayloadRequest,
    // so guard before invoking it.
    if (typeof req.formData !== 'function') {
      return Response.json({ error: 'Request must be multipart/form-data' }, { status: 400 })
    }

    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return Response.json({ error: 'Request must be multipart/form-data' }, { status: 400 })
    }

    const file = formData.get('file')
    if (!file || typeof (file as any).text !== 'function') {
      return Response.json({ error: 'No CSV file provided in field "file"' }, { status: 400 })
    }

    const text = await (file as File).text()

    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      // Trim headers and strip any BOM Excel may have written
      transformHeader: (h) => (h.startsWith(BOM) ? h.slice(1) : h).trim(),
    })

    if (parsed.errors.length > 0) {
      return Response.json(
        { error: 'CSV parse error', details: parsed.errors.slice(0, 5) },
        { status: 400 },
      )
    }

    const headers = parsed.meta.fields ?? []

    if (!headers.includes('id') || !headers.includes('price')) {
      return Response.json(
        { error: 'El CSV debe incluir las columnas "id" y "price".' },
        { status: 400 },
      )
    }

    // Everything that is not id/price is context only — report it, never apply it
    const ignoredColumns = headers.filter(
      (h) => !(EDITABLE_COLUMNS as readonly string[]).includes(h),
    )

    const result: ImportResult = {
      success: true,
      total: parsed.data.length,
      updated: 0,
      skipped: 0,
      ignoredColumns,
      errors: [],
    }

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i]

      // Explicitly pick ONLY the two editable columns. The row object is never
      // spread into `data`, so informational columns cannot reach the database.
      const rawId = row.id
      const rawPrice = row.price

      // Line number as the user sees it in Excel: +1 for zero-index, +1 for header
      const rowNumber = i + 2
      // `name` is read purely so the error message can identify the product.
      // It is never included in the update payload.
      const rowName = row.name === null || row.name === undefined ? '' : String(row.name)

      const fail = (reason: string, idLabel: string) =>
        result.errors.push({ row: rowNumber, id: idLabel, name: rowName, reason })

      // ── Validate id ──
      if (rawId === null || rawId === undefined || String(rawId).trim() === '') {
        result.skipped++
        continue
      }
      const id = typeof rawId === 'number' ? rawId : parseInt(String(rawId).trim(), 10)
      if (Number.isNaN(id)) {
        fail(`El ID "${rawId}" no es un número válido.`, String(rawId))
        continue
      }

      // ── Validate price ──
      const priceIsEmpty =
        rawPrice === null || rawPrice === undefined || String(rawPrice).trim() === ''
      if (priceIsEmpty) {
        fail('La celda de precio está vacía. Escribe un precio o elimina la fila.', String(id))
        continue
      }

      const price = parsePrice(rawPrice)
      if (Number.isNaN(price)) {
        fail(
          `El precio "${rawPrice}" no tiene un formato válido. Usa solo números, por ejemplo 12,50 o 12.50.`,
          String(id),
        )
        continue
      }
      if (price < 0) {
        fail(`El precio "${rawPrice}" es negativo. Debe ser 0 o mayor.`, String(id))
        continue
      }

      // ── Update — the payload is hard-coded to the single `price` field ──
      try {
        await req.payload.update({
          collection: 'products',
          id: id as any,
          data: { price },
          overrideAccess: false,
          req,
        })
        result.updated++
      } catch (err: any) {
        fail(describeUpdateError(err, id), String(id))
      }
    }

    return Response.json(result)
  } catch (err: any) {
    return Response.json({ error: err?.message ?? 'Import failed' }, { status: 500 })
  }
}
