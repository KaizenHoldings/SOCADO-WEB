import React from 'react'

/**
 * Custom Payload `ui` field component rendered immediately before the
 * "Clasificación y Categorías" collapsible pair in the Products form.
 *
 * Intentionally matches the visual style of Payload's native Array field
 * header: a bold title followed by a smaller, muted description paragraph.
 * Uses `opacity` for the description instead of a hardcoded colour so that
 * the component works correctly in both light and dark admin themes.
 */
export function CategorySectionHeader() {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(128, 128, 128, 0.25)',
        marginTop: '8px',
        paddingTop: '28px',
        paddingBottom: '4px',
      }}
    >
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        Clasificación y Categorías
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '0.8rem',
          lineHeight: 1.5,
          opacity: 0.6,
        }}
      >
        Configura cómo se clasifica este producto en el catálogo público y en el sistema de catering.
      </p>
    </div>
  )
}
