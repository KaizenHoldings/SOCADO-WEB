import { CollectionConfig } from 'payload'

export const SubCategories: CollectionConfig = {
  slug: 'subcategories',
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
      label: 'Nombre de la Subcategoría',
      required: true,
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría a la que pertenece',
      required: false,
    },
    {
      name: 'minQuantity',
      type: 'number',
      label: 'Cantidad Mínima Requerida',
      required: false,
      defaultValue: 5,
      admin: {
        description: 'Mínimo de productos requeridos para hacer checkout si el usuario lleva algo de esta subcategoría.',
      },
    },
  ],
}