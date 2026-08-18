import { Block, CollectionConfig } from 'payload'

// --- 1. Definimos los "Bloques" disponibles para diseñar ---

// Bloque 1: Una imagen de fondo con un texto superpuesto
export const BannerPromoBlock: Block = {
  slug: 'bannerPromo',
  labels: { singular: 'Banner con Imagen', plural: 'Banners con Imagen' },
  fields: [
    { name: 'imagenFondo', type: 'upload', relationTo: 'media', required: true },
    { name: 'tituloGrande', type: 'text', required: true },
    { name: 'colorTexto', type: 'select', options: ['blanco', 'negro'], defaultValue: 'blanco' },
  ],
}

// Bloque 2: Un diseño de texto simple con un botón de descuento
export const OfertaTextoBlock: Block = {
  slug: 'ofertaTexto',
  labels: { singular: 'Oferta en Texto', plural: 'Ofertas en Texto' },
  fields: [
    { name: 'mensajeCentral', type: 'textarea', required: true },
    { name: 'codigoDescuento', type: 'text' },
    { name: 'textoBoton', type: 'text', required: true },
  ],
}

// --- 2. Definimos la Colección de Promociones ---

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: {
    singular: 'Promoción',
    plural: 'Promociones',
  },
  admin: {
    useAsTitle: 'internalName',
    group: 'General',
    components: {
      beforeListTable: ['@/components/admin/CsvActions#CsvActions'],
    },
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      label: 'Nombre Interno (Ej: Promo Navidad)',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: '¿Mostrar en el carrusel?',
      defaultValue: true,
    },
    {
      // AQUÍ ESTÁ LA MAGIA: El constructor tipo WordPress
      name: 'slideContent',
      type: 'blocks',
      label: 'Diseñador de la Diapositiva',
      minRows: 1,
      maxRows: 1, // Limitamos a 1 bloque por diapositiva para que no rompan el tamaño del carrusel
      blocks: [BannerPromoBlock, OfertaTextoBlock],
    },
  ],
}