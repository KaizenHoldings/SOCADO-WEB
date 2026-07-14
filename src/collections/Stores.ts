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
      name: 'titleLine1',
      type: 'text',
      label: 'Título Línea 1 (Opcional)',
      admin: { description: 'Ej: Socadito' }
    },
    {
      name: 'titleLine2',
      type: 'text',
      label: 'Título Línea 2 (Opcional)',
      admin: { description: 'Ej: La Castellana' }
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
      label: 'Ubicación (Zona)',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Dirección Completa',
      required: false,
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
      name: 'amenities',
      type: 'group',
      label: 'Comodidades (Etiquetas)',
      fields: [
        { name: 'kidsCorner', type: 'checkbox', label: 'Kids Corner', defaultValue: false },
        { name: 'parking', type: 'checkbox', label: 'Estacionamiento', defaultValue: false },
        { name: 'petFriendly', type: 'checkbox', label: 'Pet Friendly', defaultValue: false },
        { name: 'freeWifi', type: 'checkbox', label: 'Wi-Fi Gratis', defaultValue: false },
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
