// collections/CatCategories.ts
import { CollectionConfig } from 'payload'

export const CatCategories: CollectionConfig = {
  slug: 'cat-categories',
  labels: {
    singular: 'Categoría para individuales (box)',
    plural: 'Categorías para individuales (box)',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Combos individuales (box)',
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