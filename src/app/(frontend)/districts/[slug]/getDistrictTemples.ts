import { cache } from 'react'
import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import type { District, Event, Media, Temple } from '@/payload-types'
import { notEndedEventsWhere, upcomingEventsWhere } from '@/utilities/eventDate'
import { EVENT_SEARCH_FIELDS, TEMPLE_SEARCH_FIELDS, textSearchWhere } from '@/utilities/search'
import { hasPublicTemple, type PublicEvent } from '@/app/(frontend)/events/getEventsData'

const MAX_UPCOMING_FESTIVALS = 3
const MAX_EVENT_SEARCH_RESULTS = 6

export const TEMPLES_PER_PAGE = 8

/**
 * Public lookup by slug. `overrideAccess: false` with no `user` runs the
 * same `publishedOrAdmin` access rule the public REST API uses, so an
 * unpublished/draft/review/archived District resolves to no result here —
 * exactly like an unauthenticated request would see. Wrapped in `cache()`
 * so `generateMetadata` and the page component share one DB call per request.
 */
export const getDistrictBySlug = cache(async (slug: string): Promise<District | null> => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'districts',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })

  return result.docs[0] ?? null
})

export interface DistrictTemplesPage {
  temples: Temple[]
  page: number
  totalPages: number
  totalDocs: number
}

/** Published Temples belonging to one District, one page at a time (no
 * client-side fetching — page number comes from the `?page=` query param,
 * resolved server-side). `overrideAccess: false` applies the same public
 * `publishedOrAdmin` rule, so draft/review/archived Temples are excluded
 * automatically alongside the `district` filter. With a search `query`
 * (`?q=`), only this District's Temples matching it are listed. */
export async function getDistrictTemples(
  districtId: string,
  page: number,
  query?: string,
): Promise<DistrictTemplesPage> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const inDistrict: Where = { district: { equals: districtId } }

  const result = await payload.find({
    collection: 'temples',
    where: query ? { and: [inDistrict, textSearchWhere(TEMPLE_SEARCH_FIELDS, query)] } : inDistrict,
    sort: 'name',
    page,
    limit: TEMPLES_PER_PAGE,
    depth: 1,
    overrideAccess: false,
  })

  return {
    temples: result.docs,
    page: result.page ?? 1,
    totalPages: result.totalPages ?? 1,
    totalDocs: result.totalDocs,
  }
}

export interface DistrictTemplesMeta {
  /** Every published Temple ID in this district, independent of the
   * paginated list — used to filter Events by Event → Temple → District
   * (Events don't store a district of their own; docs/content-model.md §4.1)
   * without querying once per Temple. */
  templeIds: string[]
  image?: Media
}

/**
 * One lightweight query (`select`-narrowed to `heroImage` only, no other
 * Temple fields) gets both: all published Temple IDs in this district (for
 * Event filtering) and a representative photo for the district hero,
 * borrowed from the district's Temples the same way the Districts
 * directory page borrows one — District has no image field of its own
 * (docs/content-model.md §2). Independent of the paginated Temple list, so
 * the hero image stays the same across pages. `overrideAccess: false`
 * means only published Temples are ever included here. Wrapped in `cache()`
 * so `generateMetadata` (share image) and the page share one query.
 */
export const getDistrictTemplesMeta = cache(
  async (districtId: string): Promise<DistrictTemplesMeta> => {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const result = await payload.find({
      collection: 'temples',
      where: { district: { equals: districtId } },
      select: { heroImage: true },
      sort: 'name',
      depth: 1,
      limit: 1000,
      pagination: false,
      overrideAccess: false,
    })

    const templeIds = result.docs.map((temple) => temple.id)
    const first = result.docs[0]
    const image =
      first && typeof first.heroImage === 'object' && first.heroImage ? first.heroImage : undefined

    return { templeIds, image }
  },
)

/**
 * Upcoming festivals for one district, via Event → Temple → District
 * (Events don't store a district field — docs/content-model.md §4.1). Since
 * `templeIds` already only contains published Temples (from
 * `getDistrictTemplesMeta`, itself `overrideAccess: false`), filtering
 * Events by `temple: { in: templeIds }` cannot expose an Event whose Temple
 * isn't publicly available — that Temple's ID would never be in the list.
 * "Upcoming" comes from `upcomingEventsWhere` (`src/utilities/eventDate.ts`),
 * the query form of the same whole-IST-day definition the Event collection's
 * virtual `status` field uses for its 'upcoming' value — not a second,
 * divergent definition (virtual fields aren't queryable). `overrideAccess:
 * false` additionally excludes draft/review/archived Events, same public
 * `publishedOrAdmin` rule.
 */
export async function getUpcomingFestivals(templeIds: string[]): Promise<Event[]> {
  if (templeIds.length === 0) return []

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({
    collection: 'events',
    where: {
      temple: { in: templeIds },
      ...upcomingEventsWhere(),
    },
    sort: 'startDate',
    limit: MAX_UPCOMING_FESTIVALS,
    depth: 1,
    overrideAccess: false,
  })

  return result.docs
}

/**
 * District-scoped Event search: ongoing/upcoming Events matching `query`
 * whose Temple belongs to this District — Event → Temple → District, via
 * the same published-Temple ID list as `getUpcomingFestivals` (one query,
 * not one per Temple). Events at other Districts' Temples can't match.
 */
export async function searchDistrictEvents(
  templeIds: string[],
  query: string,
): Promise<PublicEvent[]> {
  if (templeIds.length === 0) return []

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({
    collection: 'events',
    where: {
      and: [
        { temple: { in: templeIds } },
        notEndedEventsWhere(),
        textSearchWhere(EVENT_SEARCH_FIELDS, query),
      ],
    },
    sort: 'startDate',
    limit: MAX_EVENT_SEARCH_RESULTS,
    depth: 1,
    overrideAccess: false,
  })

  return result.docs.filter(hasPublicTemple)
}
