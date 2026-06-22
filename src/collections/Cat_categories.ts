// collections/CatCategories.ts
import { CollectionConfig } from 'payload'

export const CatCategories: CollectionConfig = {
  slug: 'cat-categories',
  admin: {
    useAsTitle: 'name',
    group: 'Catering',
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
      required: true,
      label: 'Nombre de la Categoría (catering)',
    },
  ],
};