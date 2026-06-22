import { CollectionConfig } from 'payload'

export const Macrocategories: CollectionConfig = {
  slug: 'macrocategories',
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
      label: 'Nombre de la Macrocategoría',
      required: true,
    },
     {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen del Producto',
      required: false,
    },
  ],
}