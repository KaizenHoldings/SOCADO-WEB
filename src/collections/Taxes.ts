import { CollectionConfig } from 'payload';

export const Taxes: CollectionConfig = {
  slug: 'taxes',
  admin: {
    useAsTitle: 'name',
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
      name: 'name',
      type: 'text',
      label: 'Nombre del Impuesto',
      required: true,
      admin: {
        placeholder: 'Ej: IVA (16%)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      required: false,
    },
    {
      name: 'value',
      type: 'number',
      label: 'Valor (%)',
      required: true,
      min: 0,
      admin: {
        placeholder: 'Ej: 16',
        description: 'Ingresa el porcentaje del impuesto. Ejemplo: 16 para un 16%.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
      admin: {
        description: 'Si se marca, este impuesto se aplicará en el carrito de compras.',
      },
    },
  ],
};
