import { CollectionConfig } from 'payload';

export const DiscountRules: CollectionConfig = {
  slug: 'discount-rules',
  admin: {
    useAsTitle: 'name',
    group: 'Configs',
    description: 'Tabla de descuentos por volumen para cada subcategoría.',
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
      label: 'Nombre de la Regla de Descuento',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Activa',
      defaultValue: true,
    },
    {
      name: 'applyToAll',
      type: 'checkbox',
      label: 'Aplicar a TODAS las subcategorías',
      defaultValue: false,
      admin: {
        description: 'Si se marca, esta regla se evaluará de forma independiente para CADA subcategoría disponible en el catálogo.',
      }
    },
    {
      name: 'subcategories',
      type: 'relationship',
      relationTo: 'subcategories',
      hasMany: true,
      label: 'Subcategorías a las que aplica',
      admin: {
        condition: (data) => !data.applyToAll,
        description: 'Selecciona las subcategorías específicas para las cuales aplicará esta tabla de descuentos por volumen. Las unidades de los productos dentro de cada subcategoría se sumarán juntas.',
      }
    },
    {
      name: 'tiers',
      type: 'array',
      label: 'Niveles de Descuento',
      minRows: 1,
      fields: [
        {
          name: 'minUnits',
          type: 'number',
          label: 'Unidades Mínimas',
          required: true,
        },
        {
          name: 'maxUnits',
          type: 'number',
          label: 'Unidades Máximas',
          admin: {
            description: 'Dejar vacío para "Más de X unidades"',
          }
        },
        {
          name: 'percentage',
          type: 'number',
          label: '% de Descuento',
          required: true,
          admin: {
            description: 'Ejemplo: 5 para un 5% de descuento',
          }
        }
      ]
    }
  ],
};
