import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Temple } from '@/payload-types'
import type { TempleLocale } from './locale'

/**
 * Public lookup by slug. `overrideAccess: false` with no `user` runs the
 * same `publishedOrAdmin` access rule the public REST API uses, so an
 * unpublished/draft/review/archived Temple resolves to no result here —
 * exactly like an unauthenticated request would see. Wrapped in `cache()`
 * so `generateMetadata` and the page component share one DB call per request.
 */
export const getTemple = cache(
  async (slug: string, locale: TempleLocale): Promise<Temple | null> => {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const result = await payload.find({
      collection: 'temples',
      where: { slug: { equals: slug } },
      locale,
      overrideAccess: false,
      limit: 1,
    })

    return result.docs[0] ?? null
  },
)
