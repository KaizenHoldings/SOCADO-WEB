import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {

  /**
   * Catering oculto temporalmente.
   *
   * La vista original sigue completa e intacta en `src/app/(frontend)/catering`;
   * solo se le corta el acceso desde aqui, de modo que reactivarla es borrar
   * esta redireccion. Quien entre a /catering va directo al formulario. `permanent: false` a proposito: un 308 quedaria cacheado
   * en los navegadores y seguiria redirigiendo despues de quitarla.
   *
   * `/catering/checkout` no se toca: cuelga de la vista oculta y solo es
   * alcanzable desde dentro de ese flujo.
   */
  async redirects() {
    return [
      {
        source: '/catering',
        // Mantener sincronizado con CATERING_FORM_URL en src/lib/constants/links.ts
        destination: 'https://form.jotform.com/260974966814069',
        permanent: false,
      },
    ]
  },

  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/icons/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        // Vercel Blob Storage — used when STORAGE_MODE=BLOB in production
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['72.167.42.216', 'localhost:3000'],
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
