import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    // Esto hace que en el panel de administración la lista muestre el nombre de la página
    useAsTitle: 'title', 
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título Interno (Ej: Página de Catering)',
      required: true,
      admin: {
        description: 'Este título es solo para organizarte en el panel, no se muestra en la web.',
      }
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug de la URL',
      required: true,
      unique: true,
      admin: {
        description: 'Escribe exactamente el nombre de la ruta. Ej: para misitio.com/catering, escribe "catering".',
      }
    },
    // Aquí agrupamos todos los campos de tu sección de Next.js
    {
      name: 'seccionLlamadoCatering',
      type: 'group',
      label: 'Contenido de la Sección de Catering',
      fields: [
        {
          name: 'tituloVisible',
          type: 'text',
          required: true,
          label: 'Título Principal',
        },
        {
          name: 'textoDescriptivo',
          type: 'textarea',
          label: 'Descripción de los servicios',
        },
        {
          name: 'imagenFondo',
          type: 'upload',
          relationTo: 'media', // Se conecta con tu colección de imágenes
          label: 'Imagen de Fondo',
        },
        {
          name: 'textoBoton',
          type: 'text',
          label: 'Texto del botón (Ej: Cotizar ahora)',
        }
      ],
    },
  ],
}