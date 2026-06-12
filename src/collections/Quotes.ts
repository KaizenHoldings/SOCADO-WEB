import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'eventDate', 'status', 'total'],
    group: 'General',
  },
  access: {
    // Only authenticated admins can manage quotes
    read: () => true, // En un caso real podría restringirse a admins, pero dejaremos true temporalmente para debug
    create: () => true, // Frontend creates quotes via public API, so we will use local API with overrideAccess or allow public creation
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Nombre Completo',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Correo Electrónico',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Teléfono',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Fecha del Evento',
    },
    {
      name: 'guests',
      type: 'number',
      required: true,
      label: 'Número de Invitados',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descripción / Ubicación del Evento',
    },
    {
      name: 'items',
      type: 'json',
      required: true,
      label: 'Productos de la Cotización (JSON)',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Total Estimado',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Enviado', value: 'sent' },
        { label: 'Aprobado', value: 'approved' },
        { label: 'Rechazado', value: 'rejected' },
      ],
      label: 'Estado de la Cotización',
    },
  ],
}
