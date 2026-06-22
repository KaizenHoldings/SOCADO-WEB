import { CollectionConfig } from 'payload'

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'title',
    group: 'Configs',
    components: {
      beforeListTable: ['@/components/admin/CsvActions#CsvActions'],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'storeId',
      type: 'text',
      label: 'ID de la Tienda (ej. las-mercedes)',
      required: true,
      unique: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo',
      required: true,
      defaultValue: 'UBICACIÓN',
    },
    {
      name: 'location',
      type: 'textarea',
      label: 'Ubicación',
      required: true,
    },
    {
      name: 'schedule',
      type: 'textarea',
      label: 'Horario',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      label: 'Enlace',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Imágenes de la Tienda',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
        }
      ]
    },
    {
      name: 'order',
      type: 'number',
      label: 'Posición (Orden en el carrusel)',
      required: false,
    },
  ],
}
