import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Districts } from './collections/Districts'
import { Temples } from './collections/Temples'
import { Events } from './collections/Events'

const r2PublicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Districts, Temples, Events],
  localization: {
    locales: ['en', 'ml'],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    // Cloudflare R2 via its S3-compatible API (this app targets a
    // Node.js-compatible managed host, not Cloudflare Workers — see
    // docs/decisions.md ADR-007).
    s3Storage({
      bucket: process.env.R2_BUCKET || '',
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }) =>
            `${r2PublicUrl}/${prefix ? `${prefix}/${filename}` : filename}`,
        },
      },
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT || '',
        forcePathStyle: true,
      },
      disableLocalStorage: true,
    }),
  ],
})
