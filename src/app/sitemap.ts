import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { absoluteUrl } from '@/utilities/site'

// Regenerated in the background at most hourly, so newly published
// Districts/Temples appear without a redeploy.
export const revalidate = 3600

const STATIC_PATHS = ['/', '/about', '/contact', '/districts', '/events']

/**
 * Public pages plus every published District and Temple. `overrideAccess:
 * false` with no `user` applies the public `publishedOrAdmin` rule, so
 * draft/review/archived records can't appear. There is no public Event
 * Detail route, so Events are covered only by `/events`; `/search` is
 * noindex and deliberately absent.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })
  const publicList = { pagination: false, limit: 0, depth: 0, overrideAccess: false } as const

  const [districts, temples] = await Promise.all([
    payload.find({
      collection: 'districts',
      select: { slug: true, updatedAt: true },
      sort: 'slug',
      ...publicList,
    }),
    payload.find({
      collection: 'temples',
      select: { slug: true, updatedAt: true },
      sort: 'slug',
      ...publicList,
    }),
  ])

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...districts.docs.map((district) => ({
      url: absoluteUrl(`/districts/${district.slug}`),
      lastModified: district.updatedAt,
    })),
    ...temples.docs.map((temple) => ({
      url: absoluteUrl(`/temples/${temple.slug}`),
      lastModified: temple.updatedAt,
    })),
  ]
}
