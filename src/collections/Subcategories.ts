import { CollectionConfig } from 'payload'

export const SubCategories: CollectionConfig = {
  slug: 'subcategories',
  admin: {
    useAsTitle: 'name',
    group: 'General',

  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la Subcategoría',
      required: true,
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría a la que pertenece',
      required: true,
    },
  ],
}