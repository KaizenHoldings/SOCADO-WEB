import type { CollectionConfig } from 'payload'
import { revalidateWorkclub } from '@/lib/payload/revalidateWorkclub'

/**
 * Plans of Socado Workclub — the price cards of "nuestros paquetes".
 *
 * Every plan belongs to a pass type, which decides the tab it appears under.
 * The card shows one reference price with an optional suffix, the legend under
 * it, the chips and an optional secondary line.
 *
 * `priceMode: 'rooms'` and the `rooms` array are kept for the data already
 * stored, but the card no longer renders them: per-room rates now live in a
 * `table` block of the pass type, where they can be written as copy.
 *
 * Prices are stored as numbers. The `ref.` prefix, the lowercase and the type
 * used for the digits belong to the landing, not to the data.
 */
export const Plans: CollectionConfig = {
  slug: 'plans',
  labels: {
    singular: 'Plan',
    plural: 'Planes (Workclub)',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Workclub',
    defaultColumns: ['name', 'passType', 'price', 'active', 'order'],
    description:
      'Tarjetas de precio de /workclub. Cada plan pertenece a un tipo de pass. Escribir los textos en minúscula.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        await revalidateWorkclub()
      },
    ],
    afterDelete: [
      async () => {
        await revalidateWorkclub()
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'Identificador (slug)',
      required: true,
      unique: true,
      index: true,
      admin: {
        placeholder: 'Ej: day-pass',
        description:
          'En minúscula, sin espacios ni acentos. Se envía al sistema de reservas como ?paquete=<slug>.',
      },
    },
    {
      name: 'passType',
      type: 'relationship',
      relationTo: 'pass-types',
      label: 'Tipo de pass',
      required: true,
      index: true,
      admin: {
        description: 'Pestaña bajo la que se muestra este plan.',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: {
        placeholder: 'Ej: day pass',
        description: 'Escribir en minúscula.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        placeholder: 'Ej: acceso por un día a la zona hot desk.',
        description: 'Escribir en minúscula.',
      },
    },
    {
      name: 'priceMode',
      type: 'select',
      label: 'Modo de precio',
      defaultValue: 'single',
      required: true,
      options: [
        { label: 'Precio único', value: 'single' },
        { label: 'Tarifas por sala (en desuso)', value: 'rooms' },
      ],
      admin: {
        description:
          'Dejar en "Precio único": la tarjeta siempre muestra una cifra grande. "Tarifas por sala" se conserva por los datos antiguos y la tarjeta la ignora; las tarifas se escriben en una tarjeta de tabla del tipo de pass.',
      },
    },
    {
      name: 'pricePrefix',
      type: 'text',
      label: 'Prefijo del precio',
      defaultValue: 'ref.',
      admin: {
        description: 'Texto delante de la cifra. Escribir en minúscula.',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Precio',
      min: 0,
      admin: {
        placeholder: 'Ej: 25',
        description: 'Solo la cifra, sin símbolos.',
      },
    },
    {
      name: 'priceSuffix',
      type: 'text',
      label: 'Sufijo del precio',
      admin: {
        placeholder: 'Ej: /h',
        description: 'Opcional. Se pega a la cifra, en un tamaño algo menor.',
      },
    },
    {
      name: 'priceUnit',
      type: 'text',
      label: 'Unidad del precio',
      admin: {
        placeholder: 'Ej: por día',
        description:
          'Leyenda bajo la cifra: "por día", "por 30 días", "desde · según sala". Escribir en minúscula.',
      },
    },
    {
      name: 'rooms',
      type: 'array',
      label: 'Tarifas por sala (no visibles en la tarjeta)',
      labels: { singular: 'Sala', plural: 'Salas' },
      admin: {
        condition: (data) => data?.priceMode === 'rooms',
        description:
          'Se conservan por los datos antiguos. Las tarifas que ve el visitante se escriben en una tarjeta de tabla del tipo de pass.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Sala',
          required: true,
          admin: { placeholder: 'Ej: sala 1', description: 'Escribir en minúscula.' },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Precio',
          required: true,
          min: 0,
          admin: { placeholder: 'Ej: 25' },
        },
        {
          name: 'unit',
          type: 'text',
          label: 'Unidad',
          defaultValue: '/h',
          admin: { description: 'Se pega a la cifra. Ej: /h' },
        },
      ],
    },
    {
      name: 'roomsNote',
      type: 'text',
      label: 'Nota de las salas',
      admin: {
        condition: (data) => data?.priceMode === 'rooms',
        placeholder: 'Ej: sala eventos: mínimo 2 horas',
        description: 'Letra pequeña bajo la tabla. Escribir en minúscula.',
      },
    },
    {
      name: 'chips',
      type: 'array',
      label: 'Píldoras',
      labels: { singular: 'Píldora', plural: 'Píldoras' },
      admin: {
        description:
          'Etiquetas bajo la leyenda del precio, una debajo de otra, en el orden de esta lista; se reordenan arrastrando. Escribir en minúscula.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Texto',
          required: true,
          admin: {
            placeholder: 'Ej: 2 créditos incluidos',
            description: 'Escribir en minúscula.',
          },
        },
      ],
    },
    {
      name: 'secondaryLine',
      type: 'text',
      label: 'Línea secundaria',
      admin: {
        placeholder: 'Ej: 10 páginas por período',
        description: 'Opcional, bajo las píldoras y en letra fina. Escribir en minúscula.',
      },
    },
    {
      name: 'detailsTitle',
      type: 'text',
      label: 'Título de los detalles',
      admin: {
        placeholder: 'incluye:',
        description:
          'Encabezado de la lista de detalles dentro del modal. Si se deja vacío pone "incluye:", igual que la tarjeta del tipo de pass, y entonces el modal enseña las dos listas bajo un solo encabezado. Cámbialo cuando la lista no sean beneficios (por ejemplo "salas y tarifas"). Escribir en minúscula.',
      },
    },
    {
      name: 'excludesGroupBenefits',
      type: 'checkbox',
      label: 'No incluye los beneficios del tipo de pass',
      admin: {
        description:
          'Marcar cuando este plan sea una excepción: el modal deja de mostrar la tarjeta "incluye:" de su tipo de pass. La tarjeta sigue visible bajo las tarjetas de precio, que es información del tipo, no del plan.',
      },
    },
    {
      name: 'details',
      type: 'array',
      label: 'Detalles del modal',
      labels: { singular: 'Detalle', plural: 'Detalles' },
      admin: {
        description:
          'Lista que se muestra dentro del modal de "más información", en el orden de esta lista; se reordenan arrastrando. Si se deja vacía, el modal enseña solo lo que ya tiene la tarjeta y lo que incluye el tipo de pass. Escribir en minúscula.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Texto',
          required: true,
          admin: {
            placeholder: 'Ej: internet de alta velocidad',
            description: 'Escribir en minúscula.',
          },
        },
      ],
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Línea destacada (no visible en la tarjeta)',
      admin: {
        placeholder: 'Ej: catering exclusivo socado',
        description:
          'Se conserva por los datos antiguos, pero la tarjeta no la muestra: ese texto ahora va en una píldora.',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Beneficios (no visibles en la tarjeta)',
      labels: { singular: 'Beneficio', plural: 'Beneficios' },
      admin: {
        description:
          'La tarjeta ya no muestra esta lista: lo que incluye el pass se escribe en la tarjeta "incluye:" del tipo de pass. Se conserva por los datos antiguos.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Texto',
          required: true,
          admin: {
            placeholder: 'Ej: 1 café básico socado',
            description: 'Escribir en minúscula.',
          },
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Texto del botón',
      admin: {
        description: 'Si se deja vacío, se hereda del tipo de pass. Escribir en minúscula.',
      },
    },
    {
      name: 'ctaVariant',
      type: 'select',
      label: 'Estilo del botón',
      options: [
        { label: 'Contorno', value: 'outline' },
        { label: 'Relleno', value: 'solid' },
      ],
      admin: {
        description: 'Si se deja vacío, se hereda del tipo de pass.',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Enlace del botón',
      admin: {
        description:
          'Si se deja vacío, se usa el enlace de reservas de la configuración con ?paquete=<slug>.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden dentro de la pestaña',
      defaultValue: 1,
      admin: { description: 'Número menor aparece primero.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
      admin: { description: 'Si se desmarca, la tarjeta desaparece de /workclub.' },
    },
  ],
}
