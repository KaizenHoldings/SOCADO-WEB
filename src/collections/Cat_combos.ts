// collections/CatCombos.ts
import { CollectionConfig } from 'payload';

export const CatCombos: CollectionConfig = {
  slug: 'cat-combos',
  labels: {
    singular: 'Combo Catering',
    plural: 'Combos Catering',
  },
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
      label: 'Nombre del Combo', 
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descripción Corta',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Imagen Principal',
    },
    {
      name: 'pricePerPerson',
      type: 'number',
      required: true,
      label: 'Precio por Persona',
    },
    {
      name: 'priceTenPeople',
      type: 'number',
      label: 'Precio para 10 Personas',
    },
    {
      name: 'rules',
      type: 'array',
      label: 'Reglas de Composición del Box',
      labels: {
        singular: 'Regla de Categoría',
        plural: 'Reglas de Categoría',
      },
      minRows: 1,
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'cat-categories', // Apunta al prefijo correcto
          required: true,
          label: 'Categoría Requerida',
        },
        {
          name: 'allowedQuantity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Cantidad de Elementos Permitidos',
        },
        {
          name: 'allowedProducts',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          required: false,
          label: 'Productos permitidos en este slot',
          admin: {
            description: 'Si se deja vacío, se mostrarán todos los productos de la categoría seleccionada.',
          },
        },
      ],
    },
  ],
};