import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'General',
    components: {
      beforeListTable: ['@/components/admin/CsvActions#CsvActions'],
    },
  },
  auth: {
    cookies: {
      secure: false,
      sameSite: 'Lax',
      domain: undefined,
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
