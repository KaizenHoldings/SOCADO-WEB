import type { GlobalConfig } from 'payload'
import { revalidateWorkclub } from '@/lib/payload/revalidateWorkclub'

/**
 * Shared settings of the /workclub landing.
 *
 * The booking and visit destinations live here so they can be changed without
 * a deploy. While they are empty the landing keeps the placeholders defined in
 * `src/lib/constants/links.ts`.
 */
export const WorkclubSettings: GlobalConfig = {
  slug: 'workclub-settings',
  label: 'Configuración de Workclub',
  admin: {
    group: 'Workclub',
    description: 'Enlaces y textos compartidos por la página /workclub.',
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
  },
  fields: [
    {
      name: 'reservaUrl',
      type: 'text',
      label: 'Enlace de reservas',
      admin: {
        description:
          'Destino de los botones "reservar". Se le añade ?paquete=<slug> en cada tarjeta.',
      },
    },
    {
      name: 'visitaUrl',
      type: 'text',
      label: 'Enlace para agendar una visita',
      admin: { description: 'Destino del botón "agenda una visita".' },
    },
    {
      /*
        Version of the seed already applied to this database.

        It exists so a one-off correction — repainting a band whose colour was
        filled in by a schema default, for example — runs once and never
        touches what was chosen in the admin afterwards. Hidden: it is
        bookkeeping, not a setting.
      */
      name: 'seedVersion',
      type: 'number',
      label: 'Versión del contenido inicial',
      admin: { hidden: true },
    },
    {
      name: 'footnote',
      type: 'textarea',
      label: 'Nota al pie de los paquetes',
      admin: {
        description: 'Aclaración sobre lo que incluyen los pass. Escribir en minúscula.',
      },
    },
  ],
}
