import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['sku', 'name', 'status', 'price', 'category'],
    group: 'General',
    components: {
      beforeListTable: ['@/components/admin/CsvActions#CsvActions'],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Core product fields ──────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Estatus del Producto',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
        { label: 'Borrador', value: 'draft' },
      ],
    },
    {
      name: 'sku',
      type: 'text',
      label: 'Código',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre del Producto',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción del Producto',
      required: false,
      admin: {
        description: 'Breve descripción que se mostrará debajo del nombre en las tarjetas.',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Precio Base',
      required: true,
      admin: {
        placeholder: '0.00',
      },
    },

    // ─── Section heading for the two category collapsibles ───────────────────
    // `ui` fields are purely presentational: no DB column, no type impact.
    {
      type: 'ui',
      name: 'categoriesSection',
      admin: {
        components: {
          Field: '@/components/admin/CategorySectionHeader#CategorySectionHeader',
        },
      },
    },

    // ─── Collapsible 1: Individuales (catering boxes) ────────────────────────
    {
      type: 'collapsible',
      label: 'Información de producto en individuales',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'categoryCatering',
          type: 'relationship',
          relationTo: 'cat-categories',
          required: false,
          label: 'Categoría para individuales',
          admin: {
            description:
              'Sección destinada a la sección de individuales (boxes). Selecciona la categoría de catering a la que pertenece este producto para que aparezca en el constructor de boxes.',
          },
        },
      ],
    },

    // ─── Collapsible 2: Compartir (ecommerce / catálogo público) ─────────────
    {
      type: 'collapsible',
      label: 'Información de producto para compartir',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'macroCategory',
          type: 'relationship',
          relationTo: 'macrocategories',
          label: 'Macrocategoría',
          required: false,
          admin: {
            description:
              'Grupo principal al que pertenece este producto (ej. Alimentos, Bebidas). Define el primer nivel de navegación en el catálogo público.',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          label: 'Categoría',
          required: false,
          admin: {
            description:
              'Categoría dentro de la macrocategoría seleccionada. La lista se filtra automáticamente según la macrocategoría elegida.',
          },
          filterOptions: ({ data }) => {
            if (data.macroCategory) {
              return {
                macroCategory: { equals: data.macroCategory },
              }
            }
            return false
          },
        },
        {
          name: 'subCategory',
          type: 'relationship',
          relationTo: 'subcategories',
          label: 'Subcategoría',
          required: false,
          admin: {
            description:
              'Segmentación específica dentro de la categoría. Facilita el filtrado y la búsqueda del producto en el catálogo.',
          },
          filterOptions: ({ data }) => {
            if (data.category) {
              return {
                parentCategory: { equals: data.category },
              }
            }
            return false
          },
        },
      ],
    },

    // ─── Media ───────────────────────────────────────────────────────────────
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del Producto',
      required: false,
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Galería de Imágenes (Hover Slide)',
      required: false,
    },

    // ─── Variations ──────────────────────────────────────────────────────────
    {
      name: 'variations',
      type: 'array',
      label: 'Versiones / Opciones (Variaciones)',
      admin: {
        description: 'Añade diferentes versiones de este producto (ej. Mini, Grande).',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta de la Versión (Ej: Mini, Grande)',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Precio Absoluto (Reemplaza el precio base del producto)',
          admin: {
            description:
              'Si defines un precio aquí, el producto costará esto cuando se seleccione esta opción.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción de esta versión',
          admin: {
            description: 'Opcional. Reemplaza la descripción principal.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de esta versión',
          admin: {
            description: 'Opcional. Reemplaza la imagen principal.',
          },
        },
        {
          name: 'priceAdjustment',
          type: 'number',
          label: 'Ajuste de Precio',
          admin: {
            description:
              'Si esto es un extra (ej. Leche Almendras), usa este campo para sumar al total (ej. 2 para sumar $2).',
          },
        },
      ],
    },
  ],
}
