import { APIError, type CollectionConfig } from 'payload'
import { revalidateWorkclub } from '@/lib/payload/revalidateWorkclub'

/**
 * Pass types of Socado Workclub — the tabs of "nuestros paquetes".
 *
 * Each document produces one tab on /workclub: its name is the label and its
 * eyebrow, description and note make up the heading above the cards. The plans
 * of the tab live in the `plans` collection and point back here, so adding a
 * third type with plans adds a third tab without touching code.
 */
export const PassTypes: CollectionConfig = {
  slug: 'pass-types',
  labels: {
    singular: 'Tipo de Pass',
    plural: 'Tipos de Pass (Workclub)',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Workclub',
    defaultColumns: ['name', 'order', 'active'],
    description:
      'Cada tipo de pass es una pestaña en la sección "nuestros paquetes" de /workclub. Escribir los textos en minúscula.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [async () => { await revalidateWorkclub() }],
    afterDelete: [async () => { await revalidateWorkclub() }],
    /**
     * A plan cannot be left without its type: the section groups the cards by
     * pass type, and an orphan plan would never be shown.
     */
    beforeDelete: [
      async ({ req, id }) => {
        const linked = await req.payload.count({
          collection: 'plans',
          where: { passType: { equals: id } },
          req,
        })

        if (linked.totalDocs > 0) {
          throw new APIError(
            `No se puede eliminar este tipo de pass: tiene ${linked.totalDocs} plan(es) asociado(s). Reasigna o elimina esos planes primero.`,
            400,
          )
        }
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
        placeholder: 'Ej: workclub-pass',
        description: 'En minúscula, sin espacios ni acentos. No se cambia una vez publicado.',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre (etiqueta de la pestaña)',
      required: true,
      admin: {
        placeholder: 'Ej: workclub pass',
        description: 'Escribir en minúscula.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Antetítulo',
      defaultValue: 'socado',
      admin: {
        description: 'Línea pequeña sobre el título de la sección. Escribir en minúscula.',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Descripción',
      admin: {
        placeholder: 'Ej: acceso por día, por paquete de días o por hora de sala',
        description: 'Se muestra bajo el selector de pestañas. Escribir en minúscula.',
      },
    },
    {
      name: 'note',
      type: 'text',
      label: 'Nota incluida',
      admin: {
        placeholder: 'Ej: todos los pass incluyen',
        description:
          'Opcional. Línea junto al icono de check, bajo las pestañas. El diseño actual no la usa: lo que incluye el pass se escribe en la tarjeta "incluyen". Si se deja vacía, no se muestra.',
      },
    },
    {
      name: 'noteHighlight',
      type: 'text',
      label: 'Parte destacada de la nota',
      admin: {
        placeholder: 'Ej: 1 café básico de socado',
        description:
          'Opcional. Se muestra en negrita al final de la nota, y solo si la nota tiene texto.',
      },
    },
    {
      name: 'bandColor',
      type: 'select',
      label: 'Color de la franja',
      defaultValue: 'wc-verde',
      options: [
        { label: 'Verde (franja oscura)', value: 'wc-verde' },
        { label: 'Verde medio (franja oscura)', value: 'wc-verde-medio' },
        { label: 'Verde claro (franja clara)', value: 'wc-verde-claro' },
        { label: 'Marrón (franja oscura)', value: 'wc-marron' },
        { label: 'Marrón medio (franja oscura)', value: 'wc-marron-medio' },
        { label: 'Terracota (franja oscura)', value: 'wc-terracota' },
      ],
      admin: {
        description:
          'Fondo de la franja superior de la sección mientras esta pestaña está abierta. En las franjas oscuras el texto se muestra en blanco y en las claras en verde oscuro; el tono se decide solo, no hay que elegirlo. Solo se ofrecen colores que cumplen contraste AA con su tono de texto.',
      },
    },
    {
      /*
        Cards under the price row, one block each, in the order of this list.
        Zero blocks is valid: the row simply does not appear.
      */
      name: 'infoCards',
      type: 'blocks',
      label: 'Tarjetas informativas',
      labels: { singular: 'Tarjeta', plural: 'Tarjetas' },
      minRows: 0,
      admin: {
        description:
          'Se muestran debajo de las tarjetas de precio, en el orden de esta lista; se reordenan arrastrando. Escribir los textos en minúscula.',
      },
      blocks: [
        {
          slug: 'includes',
          labels: { singular: 'Tarjeta de incluidos', plural: 'Tarjetas de incluidos' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              admin: {
                placeholder: 'Ej: todos los member pass incluyen:',
                description: 'Escribir en minúscula.',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Beneficios',
              labels: { singular: 'Beneficio', plural: 'Beneficios' },
              admin: {
                description:
                  'Cada beneficio se muestra con una línea vertical a la izquierda: el título en negrita y el detalle debajo.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  required: true,
                  admin: {
                    placeholder: 'Ej: 15% de descuento',
                    description: 'Escribir en minúscula.',
                  },
                },
                {
                  name: 'detail',
                  type: 'text',
                  label: 'Detalle',
                  admin: {
                    placeholder: 'Ej: en productos socado',
                    description: 'Escribir en minúscula.',
                  },
                },
              ],
            },
          ],
        },
        {
          slug: 'table',
          labels: { singular: 'Tarjeta de tabla', plural: 'Tarjetas de tabla' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              admin: {
                placeholder: 'Ej: tarifas de salas',
                description: 'Escribir en minúscula.',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtítulo',
              admin: {
                placeholder: 'Ej: precio por hora, según la sala.',
                description: 'Escribir en minúscula.',
              },
            },
            {
              name: 'layout',
              type: 'select',
              label: 'Disposición de las filas',
              defaultValue: 'inline',
              required: true,
              options: [
                { label: 'Seguidas ("sala 1: 1 crédito por hora")', value: 'inline' },
                {
                  label: 'A los extremos (etiqueta a la izquierda, valor a la derecha)',
                  value: 'split',
                },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              label: 'Filas',
              labels: { singular: 'Fila', plural: 'Filas' },
              admin: {
                description: 'Se muestran en el orden de esta lista; se reordenan arrastrando.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Etiqueta',
                  required: true,
                  admin: { placeholder: 'Ej: sala 1', description: 'Escribir en minúscula.' },
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Valor',
                  required: true,
                  admin: {
                    placeholder: 'Ej: ref. 25/h',
                    description: 'Escribir en minúscula. Los números se componen solos.',
                  },
                },
                {
                  name: 'note',
                  type: 'text',
                  label: 'Nota',
                  admin: {
                    placeholder: 'Ej: mínimo 2 horas',
                    description:
                      'Opcional, junto a la etiqueta y en letra fina. Solo se muestra en la disposición a los extremos.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'footnoteLabel',
      type: 'text',
      label: 'Nota al pie: etiqueta',
      admin: {
        placeholder: 'Ej: cafés socado:',
        description:
          'Parte en negrita de la nota centrada bajo las tarjetas. Si la etiqueta y el texto están vacíos, no se muestra nada.',
      },
    },
    {
      name: 'footnoteText',
      type: 'text',
      label: 'Nota al pie: texto',
      admin: {
        placeholder: 'Ej: espresso, americano, cappuccino, latte, flat white o macchiato con leche animal.',
        description: 'Escribir en minúscula.',
      },
    },
    {
      name: 'ctaLabelDefault',
      type: 'text',
      label: 'Texto del botón (por defecto)',
      defaultValue: 'reservar',
      admin: {
        description:
          'Lo heredan los planes de este tipo que no definan su propio texto. Escribir en minúscula.',
      },
    },
    {
      name: 'ctaVariantDefault',
      type: 'select',
      label: 'Estilo del botón (por defecto)',
      defaultValue: 'outline',
      options: [
        { label: 'Contorno', value: 'outline' },
        { label: 'Relleno', value: 'solid' },
      ],
      admin: {
        description: 'Lo heredan los planes de este tipo que no definan su propio estilo.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de la pestaña',
      defaultValue: 1,
      admin: {
        description: 'Número menor aparece primero. La primera pestaña es la que se abre por defecto.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
      admin: {
        description:
          'Si se desmarca, la pestaña desaparece de /workclub. Un tipo sin planes activos tampoco se muestra.',
      },
    },
    {
      name: 'plans',
      type: 'join',
      label: 'Planes de este pass',
      collection: 'plans',
      on: 'passType',
      admin: {
        defaultColumns: ['name', 'price', 'order', 'active'],
        description: 'Planes que pertenecen a este tipo de pass. Se crean desde "Planes".',
      },
    },
  ],
}
