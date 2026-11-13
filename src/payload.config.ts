import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { SubCategories } from './collections/Subcategories'
import { Macrocategories } from './collections/Macrocategorias'
import { Promotions } from './collections/Promotions'
import { Quotes } from './collections/Quotes'
import { CatCombos } from './collections/Cat_combos'
import { CatCategories } from './collections/Cat_categories'
import { Stores } from './collections/Stores'
import { DiscountRules } from './collections/DiscountRules'
import { Taxes } from './collections/Taxes'
import { HomeMenuSections } from './collections/HomeMenuSections'
import { PassTypes } from './collections/PassTypes'
import { Plans } from './collections/Plans'
import { WorkclubSettings } from './globals/WorkclubSettings'
import { seedWorkclub } from './seed/workclub'
import { seedWorkclubV2 } from './seed/workclub-v2'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/payload/Logo#Logo',
        Icon: '@/components/payload/Icon#Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Socado',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          sizes: '32x32',
          url: '/icons/isotipo.svg',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/icons/isotipo.svg',
        },
      ],
    },
  },
  collections: [Users, Media, Macrocategories, Categories, SubCategories, Products, Promotions, Quotes, CatCombos, CatCategories, Stores, DiscountRules, Taxes, HomeMenuSections, PassTypes, Plans],
  globals: [WorkclubSettings],
  /**
   * Los registros por defecto de /workclub se crean al iniciar si faltan. El
   * seed es idempotente: no duplica ni pisa lo editado en el admin. Se puede
   * desactivar con SEED_WORKCLUB=false, y ejecutar a mano con
   * `pnpm seed:workclub`.
   */
  onInit: async (payload) => {
    if (process.env.SEED_WORKCLUB === 'false') return
    try {
      // Base content first: the versioned updates act on records that exist.
      await seedWorkclub(payload)
      await seedWorkclubV2(payload)
    } catch (error) {
      payload.logger.error({ err: error }, '[seed:workclub] no se pudo ejecutar el seed')
    }
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: process.env.STORAGE_MODE === 'BLOB',
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
