import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['sku', 'name', 'status', 'price', 'category'],
    group: 'General',
  },
  access: {
    read: () => true,
  },
  fields: [
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
      name: 'price',
      type: 'number',
      label: 'Precio Base',
      required: true,
      admin: {
        placeholder: '0.00',
      },
    },
    {
      name: 'macroCategory',
      type: 'relationship',
      relationTo: 'macrocategories',
      label: 'Macrocategoría',
      required: true,
    },
    {
      name: 'categoryCatering',
      type: 'relationship',
      relationTo: 'cat-categories', // Apunta al prefijo correcto
      required: false,
      label: 'Categoría(Catering)',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría',
      required: true,
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
      required: true,
      filterOptions: ({ data }) => {
        if (data.category) {
          return {
            parentCategory: { equals: data.category },
          }
        }
        return false
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del Producto',
      required: true,
    },
  ],
}