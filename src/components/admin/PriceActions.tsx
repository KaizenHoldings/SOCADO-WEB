"use client";

import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';

/** One failed row as reported by /api/products/price-import */
type ImportError = {
  row: number;
  id: string;
  name: string;
  reason: string;
};

type ImportResult = {
  total: number;
  updated: number;
  skipped: number;
  ignoredColumns: string[];
  errors: ImportError[];
};

type Msg =
  | { type: 'error'; text: string }
  | { type: 'result'; result: ImportResult };

/**
 * Injects two price-management actions into the Products list view:
 *   • Descargar precio de productos → GET  /api/products/price-export
 *   • Subir documento de precios  → POST /api/products/price-import
 */
export function PriceActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleDownload = () => {
    window.location.href = '/api/products/price-export';
  };

  // ── Import ────────────────────────────────────────────────────────────────
  const handleUploadClick = () => {
    setMsg(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/products/price-import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMsg({ type: 'error', text: data.error ?? 'Error en la importación' });
      } else {
        const result: ImportResult = {
          total: data.total ?? 0,
          updated: data.updated ?? 0,
          skipped: data.skipped ?? 0,
          ignoredColumns: data.ignoredColumns ?? [],
          errors: data.errors ?? [],
        };
        setMsg({ type: 'result', result });

        // Only auto-reload on a clean run. When rows failed, the report has to
        // stay on screen so the user can see which lines to fix.
        if (result.errors.length === 0) {
          setTimeout(() => window.location.reload(), 1500);
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Error de red al subir el archivo.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Styles (matches existing CsvActions aesthetic) ────────────────────────
  const baseBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
    lineHeight: 1.4,
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}
    >
      {/* Vertical divider separating generic CSV actions from price-specific ones */}
      <div
        aria-hidden="true"
        style={{
          width: '1px',
          height: '28px',
          background: 'var(--theme-border-color, rgba(0,0,0,0.15))',
          margin: '0 4px',
        }}
      />

      {/* ── Descargar precios de productos ── */}
      <button
        type="button"
        onClick={handleDownload}
        title="Descarga un CSV con el precio de cada producto y sus datos de referencia"
        style={{ ...baseBtn, border: '1px solid #ccc', background: 'transparent' }}
      >
        <Download size={16} />
        Descargar precios de productos
      </button>

      {/* ── Subir documento de precios ── */}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploading}
        title="Sube el CSV editado. Solo se aplicaran las columnas id y price."
        style={{
          ...baseBtn,
          border: '1px solid #063547',
          background: '#063547',
          color: 'white',
          opacity: isUploading ? 0.7 : 1,
        }}
      >
        <Upload size={16} />
        {isUploading ? 'Subiendo…' : 'Subir documento de precios'}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Request-level failure (network, bad file, missing columns…) */}
      {msg?.type === 'error' && (
        <span role="status" style={{ fontSize: '13px', fontWeight: 500, color: '#dc2626' }}>
          {msg.text}
        </span>
      )}

      {/* Import report */}
      {msg?.type === 'result' && (
        <ImportReport result={msg.result} onDismiss={() => setMsg(null)} />
      )}
    </div>
  );
}

/**
 * Renders the outcome of an import. When rows failed it lists each one with its
 * line number, id, product name and the reason, so the editor can go straight to
 * the offending row in their spreadsheet.
 */
function ImportReport({
  result,
  onDismiss,
}: {
  result: ImportResult;
  onDismiss: () => void;
}) {
  const hasErrors = result.errors.length > 0;

  return (
    <div
      role="status"
      style={{
        flexBasis: '100%',
        marginTop: '4px',
        padding: '12px 14px',
        borderRadius: '6px',
        border: `1px solid ${hasErrors ? '#fecaca' : '#a7f3d0'}`,
        background: hasErrors ? '#fef2f2' : '#ecfdf5',
        fontSize: '13px',
        lineHeight: 1.5,
        color: '#1f2937',
      }}
    >
      {/* Summary line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <strong style={{ color: hasErrors ? '#b91c1c' : '#047857' }}>
          {result.updated} precio(s) actualizados de {result.total}
          {hasErrors ? ` — ${result.errors.length} error(es)` : ''}.
        </strong>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '12px',
            textDecoration: 'underline',
            color: '#6b7280',
          }}
        >
          Cerrar
        </button>
      </div>

      {result.skipped > 0 && (
        <div style={{ marginTop: '4px', color: '#6b7280' }}>
          {result.skipped} fila(s) sin ID fueron omitidas.
        </div>
      )}

      {/* Detailed per-row errors */}
      {hasErrors && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontWeight: 600, marginBottom: '6px', color: '#b91c1c' }}>
            Filas que no se pudieron actualizar:
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            {result.errors.map((err, i) => (
              <li key={`${err.row}-${i}`} style={{ marginBottom: '6px' }}>
                <strong>Fila {err.row}</strong> (ID {err.id}
                {err.name ? ` — ${err.name}` : ''}): {err.reason}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '8px', color: '#6b7280' }}>
            Los demás precios sí se guardaron. Corrige estas filas y vuelve a subir el archivo.
          </div>
        </div>
      )}

      {/* Preserved copy: informational columns that were deliberately ignored */}
      {result.ignoredColumns.length > 0 && (
        <div style={{ marginTop: '8px', color: '#6b7280' }}>
          Columnas informativas ignoradas: {result.ignoredColumns.join(', ')}.
        </div>
      )}
    </div>
  );
}
