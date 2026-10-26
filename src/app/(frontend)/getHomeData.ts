import { getPayload } from 'payload'

import config from '@/payload.config'
import type { District, Event, Media, Temple } from '@/payload-types'
import { notEndedEventsWhere } from '@/utilities/eventDate'

export interface DistrictCard {
  district: District
  templeCount: number
  image?: Media
}

/** Only the Temple fields the Featured Temples cards render. */
export type FeaturedTemple = Pick<
  Temple,
  'id' | 'name' | 'slug' | 'district' | 'heroImage' | 'historyNarrative'
>

export interface HomeData {
  upcomingEvents: Event[]
  districtCards: DistrictCard[]
  featuredTemples: FeaturedTemple[]
}

const MAX_UPCOMING_EVENTS = 4
const MAX_DISTRICT_CARDS = 8
const MAX_FEATURED_TEMPLES = 3

// Payload runs field hooks for every returned field, so fetching only what
// the Home Page renders keeps the Local API work proportional to the page.
const FEATURED_TEMPLE_SELECT = {
  name: true,
  slug: true,
  district: true,
  heroImage: true,
  historyNarrative: true,
} as const

/**
 * All Home Page data in three Local API calls (not one per rendered card):
 * upcoming/ongoing Events, published Districts + a per-district Temple
 * count and representative photo computed from a single Temples query, and
 * the most recently published Temples. `overrideAccess: false` with no
 * `user` applies the same public `publishedOrAdmin` rule the REST API uses.
 */
export async function getHomeData(): Promise<HomeData> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [eventsResult, districtsResult, templesResult, featuredTemplesResult] = await Promise.all([
    payload.find({
      collection: 'events',
      // Ongoing or upcoming, in whole IST calendar days
      where: notEndedEventsWhere(),
      sort: 'startDate',
      limit: MAX_UPCOMING_EVENTS,
      // depth 2 so `temple.heroImage` is populated — Events have no image
      // field of their own, so the card visual borrows the linked Temple's.
      depth: 2,
      // Only the linked Temple's heroImage is rendered, so skip populating
      // the rest of the Temple (district, gallery, SEO image, ...).
      populate: { temples: { heroImage: true } },
      overrideAccess: false,
    }),
    payload.find({
      collection: 'districts',
      sort: 'name',
      limit: 100,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'temples',
      limit: 1000,
      depth: 1,
      // Only used for per-district counts and a representative photo.
      select: { district: true, heroImage: true },
      overrideAccess: false,
    }),
    payload.find({
      collection: 'temples',
      sort: '-createdAt',
      limit: MAX_FEATURED_TEMPLES,
      depth: 1,
      select: FEATURED_TEMPLE_SELECT,
      populate: { districts: { name: true } },
      overrideAccess: false,
    }),
  ])

  const templeCountByDistrict = new Map<string, number>()
  const imageByDistrict = new Map<string, Media>()

  for (const temple of templesResult.docs) {
    // District is optional in the CMS; a Temple without one can't be counted.
    if (!temple.district) continue
    const districtId = typeof temple.district === 'object' ? temple.district.id : temple.district
    templeCountByDistrict.set(districtId, (templeCountByDistrict.get(districtId) ?? 0) + 1)

    if (!imageByDistrict.has(districtId) && typeof temple.heroImage === 'object' && temple.heroImage) {
      imageByDistrict.set(districtId, temple.heroImage)
    }
  }

  const districtCards: DistrictCard[] = districtsResult.docs
    .map((district) => ({
      district,
      templeCount: templeCountByDistrict.get(district.id) ?? 0,
      image: imageByDistrict.get(district.id),
    }))
    .slice(0, MAX_DISTRICT_CARDS)

  return {
    upcomingEvents: eventsResult.docs,
    districtCards,
    featuredTemples: featuredTemplesResult.docs,
  }
}
