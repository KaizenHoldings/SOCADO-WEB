import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'General',
    components: {
      beforeListTable: ['@/components/admin/CsvActions#CsvActions'],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la Categoría',
      required: true,
    },
    {
      name: 'macroCategory',
      type: 'relationship',
      relationTo: 'macrocategories',
      label: 'Macrocategoría a la que pertenece',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de la Categoría',
      required: false,
    },
  ],
}