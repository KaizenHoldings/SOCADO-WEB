import { CollectionConfig } from 'payload'

export const HomeMenuSections: CollectionConfig = {
  slug: 'home-menu-sections',
  labels: {
    singular: 'Sección del Menú',
    plural: 'Secciones del Menú',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Portada',
    description:
      'Cards de categorías mostradas en la sección "Descubre nuestros productos" de la portada.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Categoría',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción (visible al hacer hover sobre la card)',
      required: false,
      admin: {
        description: 'Texto que aparece al pasar el mouse por encima de la card en la portada.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de la Card',
      required: false,
      admin: {
        description: 'Imagen de fondo de la card. Recomendado: proporción cuadrada o 3:4.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de aparición',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Número menor aparece primero. Ej: 1, 2, 3 …',
      },
    },
  ],
}
